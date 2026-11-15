import { NextRequest, NextResponse } from 'next/server';
import {
  saveMongoResume,
  saveMongoCoverLetter,
  upsertMongoUser,
  logMongoAuditEvent,
} from '@/lib/services/mongodb-service';
import { isMongoConfigured } from '@/lib/mongodb';
import { ResumeDocument, CoverLetterDocument } from '@/lib/resume-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { success: false, error: 'MongoDB is not configured on this server.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { userId, userProfile, resumes, coverLetters } = body as {
      userId: string;
      userProfile?: { email: string; displayName?: string; photoURL?: string; providerId?: string };
      resumes?: ResumeDocument[];
      coverLetters?: CoverLetterDocument[];
    };

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
      await upsertMongoUser({
        _id: userId,
        email: userProfile.email,
        displayName: userProfile.displayName || 'Candidate',
        photoURL: userProfile.photoURL,
        providerId: (userProfile.providerId as any) || 'password',
        lastLoginAt: new Date(),
      });
    }

    // 2. Sync Resumes
    if (Array.isArray(resumes) && resumes.length > 0) {
      for (const res of resumes) {
        if (res && res.id) {
          await saveMongoResume(res, userId);
          savedResumesCount++;
        }
      }
    }

    // 3. Sync Cover Letters
    if (Array.isArray(coverLetters) && coverLetters.length > 0) {
      for (const cl of coverLetters) {
        if (cl && cl.id) {
          await saveMongoCoverLetter(cl, userId);
          savedCoverLettersCount++;
        }
      }
    }

    // 4. Log Audit Event
    await logMongoAuditEvent({
      userId,
      action: 'data_exported',
      ipHash: req.headers.get('x-forwarded-for') || 'local',
      userAgent: req.headers.get('user-agent') || 'unknown',
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
  } catch (err) {
    console.error('MongoDB sync error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
