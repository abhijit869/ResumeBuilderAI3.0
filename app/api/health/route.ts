export const dynamic = 'force-dynamic';

// Liveness only: a temporary upstream outage must not restart the app.
export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
