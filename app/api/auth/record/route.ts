import { NextRequest, NextResponse } from 'next/server';
import { logMongoAuthRecord, logMongoAuditEvent } from '@/lib/services/mongodb-service';
import { isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ recorded: false, reason: 'MongoDB not configured' }, { status: 200 });
  }

  try {
    const body = await req.json();
    const { userId, sessionId, action, provider, status, failureReason } = body;

    if (!userId || !action) {
      return NextResponse.json({ recorded: false, error: 'Missing userId or action' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7-day session TTL

    // Record session tracking
    await logMongoAuthRecord({
      userId,
      sessionId: sessionId || `sess_${Date.now()}`,
      ipAddress,
      userAgent,
      provider: provider || 'email',
      action: action || 'login',
      status: status || 'success',
      failureReason,
      expiresAt,
    });

    // Record high-level audit trail
    if (action === 'login' || action === 'logout' || action === 'password_reset') {
      await logMongoAuditEvent({
        userId,
        action: action === 'login' ? 'account_login' : 'password_changed',
        ipHash: ipAddress.slice(0, 10),
        userAgent,
        metadata: { provider, status },
      });
    }

    return NextResponse.json({ recorded: true });
  } catch (err) {
    console.error('Failed to record auth event in MongoDB:', err);
    return NextResponse.json({ recorded: false, error: String(err) }, { status: 500 });
  }
}
