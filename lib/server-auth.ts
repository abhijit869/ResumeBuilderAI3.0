import baseConfig from '../firebase-applet-config.json';

// Firebase validates the token against this project's API key. Never trust a
// client-supplied UID or decode a JWT without verifying it.
export async function authenticateRequest(request: Request): Promise<{ uid: string } | Response> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ') || authorization.length > 8192) {
    return Response.json({ error: 'Authentication required.' }, { status: 401 });
  }
  const apiKey = process.env.FIREBASE_AUTH_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || baseConfig.apiKey;
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: authorization.slice(7) }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return Response.json({ error: 'Invalid or expired session.' }, { status: 401 });
    const result = await response.json();
    const user = result.users?.[0];
    if (!user || typeof user.localId !== 'string' || user.disabled) {
      return Response.json({ error: 'Invalid session.' }, { status: 401 });
    }
    return { uid: user.localId };
  } catch {
    return Response.json({ error: 'Authentication service unavailable.' }, { status: 503 });
  }
}
