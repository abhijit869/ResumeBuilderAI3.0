import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Pre-load .env.local for standalone test runner if not already loaded by Next.js
if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // Ignore error
  }
}

import { isMongoConfigured } from './mongodb';
import { MONGO_COLLECTIONS } from './models/mongodb-schemas';
import { checkMongoHealth } from './services/mongodb-service';

test('isMongoConfigured returns true when MONGODB_URI is provided', () => {
  assert.equal(isMongoConfigured(), true);
});

test('MONGO_COLLECTIONS registers all essential data collections', () => {
  assert.equal(MONGO_COLLECTIONS.USERS, 'users');
  assert.equal(MONGO_COLLECTIONS.AUTH_RECORDS, 'auth_records');
  assert.equal(MONGO_COLLECTIONS.RESUMES, 'resumes');
  assert.equal(MONGO_COLLECTIONS.COVER_LETTERS, 'cover_letters');
  assert.equal(MONGO_COLLECTIONS.PORTFOLIOS, 'portfolios');
  assert.equal(MONGO_COLLECTIONS.AUDIT_LOGS, 'audit_logs');
  assert.equal(MONGO_COLLECTIONS.SYSTEM_LOGS, 'system_logs');
});

test('checkMongoHealth returns structured diagnostic reporting without crashing', async () => {
  const health = await checkMongoHealth();
  assert.equal(typeof health.connected, 'boolean');
  assert.equal(typeof health.latencyMs, 'number');
  assert.equal(typeof health.dbName, 'string');

  if (!health.connected) {
    // If not connected, it must provide a descriptive error message
    assert.ok(health.error);
  } else {
    assert.ok(Array.isArray(health.collections));
  }
});
