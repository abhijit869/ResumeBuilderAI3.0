import { authenticateRequest } from '@/lib/server-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  saveMongoResume,
  saveMongoCoverLetter,
  upsertMongoUser,
  logMongoAuditEvent,
  getMongoResumesByUserId,
  getMongoCoverLettersByUserId,
  findMongoUserById,
} from '@/lib/services/mongodb-service';
import { isMongoConfigured } from '@/lib/mongodb';
import { sanitizeUntrustedPromptInput } from '@/lib/security-utils';
import { ResumeDocument, CoverLetterDocument } from '@/lib/resume-engine';

export const dynamic = 'force-dynamic';

const MAX_BATCH_ITEMS = 50;

export async function GET(req: NextRequest) {
  const identity = await authenticateRequest(req);
  if (identity instanceof Response) return identity;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { success: false, error: 'MongoDB is not configured on this server.' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawUserId = searchParams.get('userId');
  if (rawUserId !== identity.uid) {
    return NextResponse.json({ error: 'User identity mismatch.' }, { status: 403 });
  }
  const userId = identity.uid;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'userId is required for query.' },
      { status: 400 }
    );
  }

  try {
    const [resumes, coverLetters, userProfile] = await Promise.all([
      getMongoResumesByUserId(userId),
      getMongoCoverLettersByUserId(userId),
      findMongoUserById(userId),
    ]);

    return NextResponse.json({
      success: true,
      connected: true,
      data: {
        userId,
        userProfile,
        resumes,
        coverLetters,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
    console.warn('[MongoDB Sync] Upstream database read unavailable:', msg);
    return NextResponse.json(
      {
        success: true,
        connected: false,
        data: {
          userId,
          userProfile: null,
          resumes: [],
          coverLetters: [],
        },
        notice: 'Cloud database is currently connecting or pending network access.',
      },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  const identity = await authenticateRequest(req);
  if (identity instanceof Response) return identity;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { success: false, error: 'MongoDB is not configured on this server.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { userId: rawUserId, userProfile, resumes, coverLetters } = body as {
      userId?: string;
      userProfile?: { email?: string; displayName?: string; photoURL?: string; providerId?: string };
      resumes?: ResumeDocument[];
      coverLetters?: CoverLetterDocument[];
    };

    if (rawUserId !== identity.uid) {
      return NextResponse.json({ error: 'User identity mismatch.' }, { status: 403 });
    }
    const userId = identity.uid;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required for sync.' },
        { status: 400 }
      );
    }

    let savedResumesCount = 0;
    let savedCoverLettersCount = 0;

    // 1. Sync User Profile if provided
    if (userProfile && userProfile.email) {
      const sanitizedEmail = sanitizeUntrustedPromptInput(userProfile.email, 254).toLowerCase();
      const sanitizedName = sanitizeUntrustedPromptInput(userProfile.displayName || 'Candidate', 100);
      const sanitizedPhoto = userProfile.photoURL ? sanitizeUntrustedPromptInput(userProfile.photoURL, 1024) : undefined;
      const validProviders = ['google.com', 'password', 'github.com', 'demo'];
      const providerId = validProviders.includes(userProfile.providerId || '')
        ? (userProfile.providerId as 'google.com' | 'password' | 'github.com' | 'demo')
        : 'password';

      const savedUser = await upsertMongoUser({
        _id: userId,
        email: sanitizedEmail,
        displayName: sanitizedName,
        photoURL: sanitizedPhoto,
        providerId,
        lastLoginAt: new Date(),
      });
      if (!savedUser) throw new Error('Profile write failed');
    }

    // 2. Sync Resumes (bounded batch)
    if (Array.isArray(resumes) && resumes.length > 0) {
      const boundedResumes = resumes.slice(0, MAX_BATCH_ITEMS);
      for (const res of boundedResumes) {
        if (res && res.id && typeof res.id === 'string') {
          if (!await saveMongoResume(res, userId)) throw new Error('Resume write failed');
          savedResumesCount++;
        }
      }
    }

    // 3. Sync Cover Letters (bounded batch)
    if (Array.isArray(coverLetters) && coverLetters.length > 0) {
      const boundedCoverLetters = coverLetters.slice(0, MAX_BATCH_ITEMS);
      for (const cl of boundedCoverLetters) {
        if (cl && cl.id && typeof cl.id === 'string') {
          if (!await saveMongoCoverLetter(cl, userId)) throw new Error('Cover letter write failed');
          savedCoverLettersCount++;
        }
      }
    }

    // 4. Log Audit Event
    const rawIp = req.headers.get('x-forwarded-for') || 'local';
    const ipHash = sanitizeUntrustedPromptInput(rawIp.split(',')[0].trim(), 64);
    const userAgent = sanitizeUntrustedPromptInput(req.headers.get('user-agent') || 'unknown', 256);

    await logMongoAuditEvent({
      userId,
      action: 'data_exported',
      ipHash,
      userAgent,
      metadata: {
        savedResumesCount,
        savedCoverLettersCount,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      synced: {
        resumes: savedResumesCount,
        coverLetters: savedCoverLettersCount,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
    console.warn('[MongoDB Sync] Upstream database write unavailable:', msg);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        synced: {
          resumes: 0,
          coverLetters: 0,
        },
        error: 'Cloud database cluster is currently unreachable. Changes remain cached locally.',
      },
      { status: 200 }
    );
  }
}
