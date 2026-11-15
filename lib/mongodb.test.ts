import test from 'node:test';
import assert from 'node:assert/strict';
import { isMongoConfigured, getMongoClientPromise } from './mongodb';
import { MONGO_COLLECTIONS } from './models/mongodb-schemas';

test('Mongo configuration handles absent and configured environments', async () => {
  const original = process.env.MONGODB_URI;
  try {
    delete process.env.MONGODB_URI;
    assert.equal(isMongoConfigured(), false);
    await assert.rejects(getMongoClientPromise(), /not configured/);
    process.env.MONGODB_URI = 'mongodb+srv://example.invalid/test';
    assert.equal(isMongoConfigured(), true);
  } finally {
    if (original === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = original;
  }
});

test('Mongo collections include core application records', () => {
  assert.equal(MONGO_COLLECTIONS.USERS, 'users');
  assert.equal(MONGO_COLLECTIONS.RESUMES, 'resumes');
  assert.equal(MONGO_COLLECTIONS.COVER_LETTERS, 'cover_letters');
  assert.equal(MONGO_COLLECTIONS.AUTH_RECORDS, 'auth_records');
});
