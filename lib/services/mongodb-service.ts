/**
 * MongoDB Service Layer for ResumeBuilderAI 3.0
 *
 * Implements CRUD and audit operations across all application entities,
 * automated collection indexing, and connection status reporting.
 */

import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';
import {
  MONGO_COLLECTIONS,
  MongoUserRecord,
  MongoAuthRecord,
  MongoResumeRecord,
  MongoCoverLetterRecord,
  MongoPortfolioRecord,
  MongoAuditLog,
  MongoSystemLog,
} from '@/lib/models/mongodb-schemas';
import { ResumeDocument, CoverLetterDocument } from '@/lib/resume-engine';

let indexesInitialized = false;

/**
 * Initializes required indexes across MongoDB collections.
 * Runs once per server process.
 */
export async function initializeMongoIndexes(): Promise<boolean> {
  if (indexesInitialized || !isMongoConfigured()) return false;

  try {
    const db = await getMongoDb();

    const safeCreateIndex = async (
      collectionName: string,
      spec: any,
      options?: any
    ) => {
      try {
        await db.collection(collectionName).createIndex(spec, options);
      } catch (err: any) {
        // Ignore IndexOptionsConflict or already existing index
        if (err?.code !== 85 && err?.code !== 86) {
          console.warn(`[Index Notice] ${collectionName}:`, err?.message || err);
        }
      }
    };

    // 1. Users Indexes
    await safeCreateIndex(
      MONGO_COLLECTIONS.USERS,
      { email: 1 },
      { unique: true, name: 'idx_users_email_unique' }
    );

    // 2. Auth Records TTL & User Index
    await safeCreateIndex(
      MONGO_COLLECTIONS.AUTH_RECORDS,
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: 'idx_auth_ttl' }
    );
    await safeCreateIndex(
      MONGO_COLLECTIONS.AUTH_RECORDS,
      { userId: 1, createdAt: -1 },
      { name: 'idx_auth_user_created' }
    );

    // 3. Resumes Compound Index
    await safeCreateIndex(
      MONGO_COLLECTIONS.RESUMES,
      { userId: 1, updatedAt: -1 },
      { name: 'idx_resumes_user_updated' }
    );

    // 4. Cover Letters Compound Index
    await safeCreateIndex(
      MONGO_COLLECTIONS.COVER_LETTERS,
      { userId: 1, updatedAt: -1 },
      { name: 'idx_cover_letters_user_updated' }
    );

    // 5. Portfolios Unique Slug Index
    await safeCreateIndex(
      MONGO_COLLECTIONS.PORTFOLIOS,
      { slug: 1 },
      { unique: true, name: 'idx_portfolios_slug_unique' }
    );
    await safeCreateIndex(
      MONGO_COLLECTIONS.PORTFOLIOS,
      { userId: 1 },
      { name: 'idx_portfolios_user' }
    );

    // 6. Audit Logs Compound Index
    await safeCreateIndex(
      MONGO_COLLECTIONS.AUDIT_LOGS,
      { userId: 1, timestamp: -1 },
      { name: 'idx_audit_user_time' }
    );

    // 7. System Telemetry TTL (30 days = 2,592,000 seconds)
    await safeCreateIndex(
      MONGO_COLLECTIONS.SYSTEM_LOGS,
      { timestamp: 1 },
      { expireAfterSeconds: 2592000, name: 'idx_system_logs_ttl_30d' }
    );

    indexesInitialized = true;
    return true;
  } catch (err) {
    console.error('Failed to initialize MongoDB indexes:', err);
    return false;
  }
}

/**
 * Health Check & Latency Probe
 */
export async function checkMongoHealth(): Promise<{
  connected: boolean;
  engine: string;
  dbName: string;
  latencyMs: number;
  collections?: string[];
  error?: string;
}> {
  if (!isMongoConfigured()) {
    return {
      connected: false,
      engine: 'none',
      dbName: 'none',
      latencyMs: 0,
      error: 'MONGODB_URI is not set in environment.',
    };
  }

  const start = Date.now();
  try {
    const db = await getMongoDb();
    const ping = await db.command({ ping: 1 });
    const latencyMs = Date.now() - start;

    const collections = await db
      .listCollections({}, { nameOnly: true })
      .toArray();

    return {
      connected: Boolean(ping.ok),
      engine: 'mongodb_atlas_cloud',
      dbName: db.databaseName,
      latencyMs,
      collections: collections.map((c) => c.name),
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      engine: 'mongodb_atlas_cloud',
      dbName: process.env.MONGODB_DB_NAME || 'resumebuilderai_db',
      latencyMs,
      error: msg,
    };
  }
}

/**
 * User Operations
 */
export async function upsertMongoUser(
  user: Partial<MongoUserRecord> & { _id: string; email: string }
): Promise<MongoUserRecord | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  const now = new Date();

  const updateDoc = {
    $set: {
      ...user,
      updatedAt: now,
    },
    $setOnInsert: {
      createdAt: now,
      role: 'user' as const,
      tier: 'free_community' as const,
      settings: {
        theme: 'system' as const,
        autoSave: true,
        emailNotifications: false,
        defaultTemplateId: 'coral-modern',
      },
    },
  };

  await db
    .collection<MongoUserRecord>(MONGO_COLLECTIONS.USERS)
    .updateOne({ _id: user._id }, updateDoc, { upsert: true });

  return db
    .collection<MongoUserRecord>(MONGO_COLLECTIONS.USERS)
    .findOne({ _id: user._id });
}

export async function findMongoUserById(
  userId: string
): Promise<MongoUserRecord | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  return db
    .collection<MongoUserRecord>(MONGO_COLLECTIONS.USERS)
    .findOne({ _id: userId });
}

export async function findMongoUserByEmail(
  email: string
): Promise<MongoUserRecord | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  return db
    .collection<MongoUserRecord>(MONGO_COLLECTIONS.USERS)
    .findOne({ email: email.toLowerCase() });
}

/**
 * Resume Operations
 */
export async function saveMongoResume(
  resume: ResumeDocument,
  userId: string
): Promise<MongoResumeRecord | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  const now = new Date();

  const record: MongoResumeRecord = {
    _id: resume.id,
    userId,
    title: resume.title || 'Untitled Resume',
    templateId: resume.templateId || 'coral-modern',
    data: resume,
    targetCompany: undefined,
    targetRole: resume.targetRoleTag,
    atsScore: resume.atsScore,
    isArchived: false,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  await db
    .collection<MongoResumeRecord>(MONGO_COLLECTIONS.RESUMES)
    .updateOne(
      { _id: resume.id, userId },
      {
        $set: {
          title: record.title,
          templateId: record.templateId,
          data: record.data,
          targetCompany: record.targetCompany,
          targetRole: record.targetRole,
          atsScore: record.atsScore,
          updatedAt: now,
        },
        $inc: { version: 1 },
        $setOnInsert: {
          _id: record._id,
          userId,
          createdAt: now,
          isArchived: false,
        },
      },
      { upsert: true }
    );

  return record;
}

export async function getMongoResumesByUserId(
  userId: string
): Promise<ResumeDocument[]> {
  if (!isMongoConfigured()) return [];
  const db = await getMongoDb();

  const records = await db
    .collection<MongoResumeRecord>(MONGO_COLLECTIONS.RESUMES)
    .find({ userId, isArchived: { $ne: true } })
    .sort({ updatedAt: -1 })
    .toArray();

  return records.map((r) => r.data);
}

export async function deleteMongoResume(
  resumeId: string,
  userId: string
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getMongoDb();
  const res = await db
    .collection<MongoResumeRecord>(MONGO_COLLECTIONS.RESUMES)
    .deleteOne({ _id: resumeId, userId });
  return (res.deletedCount || 0) > 0;
}

/**
 * Cover Letter Operations
 */
export async function saveMongoCoverLetter(
  cl: CoverLetterDocument,
  userId: string
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getMongoDb();
  const now = new Date();

  await db
    .collection<MongoCoverLetterRecord>(MONGO_COLLECTIONS.COVER_LETTERS)
    .updateOne(
      { _id: cl.id, userId },
      {
        $set: {
          linkedResumeId: cl.linkedResumeId,
          title: cl.title,
          data: cl,
          updatedAt: now,
        },
        $setOnInsert: {
          _id: cl.id,
          userId,
          createdAt: now,
        },
      },
      { upsert: true }
    );

  return true;
}

export async function getMongoCoverLettersByUserId(
  userId: string
): Promise<CoverLetterDocument[]> {
  if (!isMongoConfigured()) return [];
  const db = await getMongoDb();

  const records = await db
    .collection<MongoCoverLetterRecord>(MONGO_COLLECTIONS.COVER_LETTERS)
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();

  return records.map((r) => r.data);
}

/**
 * Portfolio Operations
 */
export async function saveMongoPortfolio(
  portfolio: Partial<MongoPortfolioRecord> & { _id: string; userId: string; slug: string }
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getMongoDb();
  const now = new Date();

  await db
    .collection<MongoPortfolioRecord>(MONGO_COLLECTIONS.PORTFOLIOS)
    .updateOne(
      { _id: portfolio._id, userId: portfolio.userId },
      {
        $set: {
          ...portfolio,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

  return true;
}

export async function getMongoPortfolioBySlug(
  slug: string
): Promise<MongoPortfolioRecord | null> {
  if (!isMongoConfigured()) return null;
  const db = await getMongoDb();
  return db
    .collection<MongoPortfolioRecord>(MONGO_COLLECTIONS.PORTFOLIOS)
    .findOne({ slug, isPublished: true });
}

/**
 * Audit & Auth Logging Operations
 */
export async function logMongoAuthRecord(
  authRecord: Omit<MongoAuthRecord, '_id' | 'createdAt'>
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    const db = await getMongoDb();
    const doc: MongoAuthRecord = {
      ...authRecord,
      _id: `auth_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
    };
    await db.collection<any>(MONGO_COLLECTIONS.AUTH_RECORDS).insertOne(doc);
    return true;
  } catch (err) {
    console.error('Failed to log Mongo auth record:', err);
    return false;
  }
}

export async function logMongoAuditEvent(
  audit: Omit<MongoAuditLog, '_id' | 'timestamp'>
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    const db = await getMongoDb();
    const doc: MongoAuditLog = {
      ...audit,
      _id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
    };
    await db.collection<any>(MONGO_COLLECTIONS.AUDIT_LOGS).insertOne(doc);
    return true;
  } catch (err) {
    console.error('Failed to log Mongo audit event:', err);
    return false;
  }
}

export async function logMongoSystemTelemetry(
  log: Omit<MongoSystemLog, '_id' | 'timestamp'>
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    const db = await getMongoDb();
    const doc: MongoSystemLog = {
      ...log,
      _id: `sys_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(),
    };
    await db.collection<any>(MONGO_COLLECTIONS.SYSTEM_LOGS).insertOne(doc);
    return true;
  } catch (err) {
    console.error('Failed to log Mongo system telemetry:', err);
    return false;
  }
}
