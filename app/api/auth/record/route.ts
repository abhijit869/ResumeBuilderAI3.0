import { NextRequest, NextResponse } from 'next/server';
import { logMongoAuthRecord, logMongoAuditEvent } from '@/lib/services/mongodb-service';
import { isMongoConfigured } from '@/lib/mongodb';
import { sanitizeUntrustedPromptInput } from '@/lib/security-utils';

export const dynamic = 'force-dynamic';

type AuthAction = 'login' | 'logout' | 'token_refresh' | 'failed_attempt' | 'password_reset';
type AuthStatus = 'success' | 'failure';

const ALLOWED_ACTIONS: Record<string, AuthAction> = {
  login: 'login',
  logout: 'logout',
  signup: 'login',
  token_refresh: 'token_refresh',
  failed_attempt: 'failed_attempt',
  password_reset: 'password_reset',
};

export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ recorded: false, reason: 'MongoDB not configured' }, { status: 200 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ recorded: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const rawUserId = String(body.userId || '').trim();
    const rawAction = String(body.action || '').trim().toLowerCase();

    if (!rawUserId || !rawAction) {
      return NextResponse.json({ recorded: false, error: 'Missing userId or action' }, { status: 400 });
    }

    // Input sanitization and bounds checking
    const userId = sanitizeUntrustedPromptInput(rawUserId, 128);
    const action: AuthAction = ALLOWED_ACTIONS[rawAction] || 'login';
    const status: AuthStatus = body.status === 'failure' || body.status === 'failed' ? 'failure' : 'success';
    const sessionId = sanitizeUntrustedPromptInput(String(body.sessionId || `sess_${Date.now()}`), 128);
    const provider = sanitizeUntrustedPromptInput(String(body.provider || 'email'), 64);
    const failureReason = body.failureReason ? sanitizeUntrustedPromptInput(String(body.failureReason), 256) : undefined;

    const rawIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipAddress = sanitizeUntrustedPromptInput(rawIp.split(',')[0].trim(), 64);
    const rawUserAgent = req.headers.get('user-agent') || 'unknown';
    const userAgent = sanitizeUntrustedPromptInput(rawUserAgent, 256);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7-day session TTL

    // Record session tracking
    await logMongoAuthRecord({
      userId,
      sessionId,
      ipAddress,
      userAgent,
      provider,
      action,
      status,
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
    return NextResponse.json({ recorded: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
