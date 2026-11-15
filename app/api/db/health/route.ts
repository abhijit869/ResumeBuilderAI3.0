import { NextResponse } from 'next/server';
import { checkMongoHealth, initializeMongoIndexes } from '@/lib/services/mongodb-service';
import { isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isMongoConfigured();

  if (!configured) {
    return NextResponse.json(
      {
        status: 'unconfigured',
        connected: false,
        message: 'MONGODB_URI is not set in environment.',
      },
      { status: 200 }
    );
  }

  const health = await checkMongoHealth();

  if (health.connected) {
    // Attempt lazy index initialization
    await initializeMongoIndexes();

    return NextResponse.json(
      {
        status: 'healthy',
        connected: true,
        database: health.dbName,
        latencyMs: health.latencyMs,
        collections: health.collections || [],
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } else {
    const isSslAlert80 =
      health.error?.includes('SSL alert number 80') ||
      health.error?.includes('tlsv1 alert internal error');

    return NextResponse.json(
      {
        status: 'degraded',
        connected: false,
        database: health.dbName,
        latencyMs: health.latencyMs,
        error: health.error,
        atlasNetworkAccessGuide: isSslAlert80
          ? 'MongoDB Atlas requires whitelisting the application IP (or 0.0.0.0/0) under Atlas Dashboard -> Security -> Network Access.'
          : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
