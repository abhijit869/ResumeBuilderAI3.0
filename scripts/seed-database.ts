/**
 * ResumeBuilderAI 3.0 — Database Seeder Script
 *
 * Initializes MongoDB indexes and seeds starter collections:
 * - Users
 * - Resumes
 * - Cover Letters
 * - Portfolios
 * - Audit Logs
 * - System Logs
 *
 * Usage:
 *   npx tsx scripts/seed-database.ts
 */

import { getMongoDb } from '../lib/mongodb';
import { initializeMongoIndexes } from '../lib/services/mongodb-service';
import {
  MONGO_COLLECTIONS,
  MongoUserRecord,
  MongoResumeRecord,
  MongoCoverLetterRecord,
} from '../lib/models/mongodb-schemas';
import { INITIAL_RESUMES } from '../lib/resume-engine';

async function seed() {
  console.log('🚀 [Cloud DB Seed] Connecting to MongoDB Atlas Cloud...');
  const db = await getMongoDb();
  console.log(`✅ [Cloud DB Seed] Connected to MongoDB Atlas (Database: ${db.databaseName})`);

  console.log('🔨 [DB Seed] Initializing indexes across all collections...');
  await initializeMongoIndexes();

  // 1. Seed Demo User
  console.log('👤 [DB Seed] Upserting default demo user...');
  const demoUserId = 'usr_community_demo_01';
  await db.collection<MongoUserRecord>(MONGO_COLLECTIONS.USERS).updateOne(
    { _id: demoUserId },
    {
      $set: {
        _id: demoUserId,
        email: 'demo@resumebuilderai.internal',
        displayName: 'Alex Morgan',
        photoURL: '/assets/aistudio/image_663e4373.png',
        role: 'user',
        tier: 'free_community',
        updatedAt: new Date(),
        settings: {
          theme: 'system',
          autoSave: true,
          emailNotifications: false,
          defaultTemplateId: 'coral-modern',
        },
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 2. Seed Starter Resumes
  console.log('📄 [DB Seed] Seeding starter ATS resumes...');
  for (const starterResume of INITIAL_RESUMES) {
    await db.collection<MongoResumeRecord>(MONGO_COLLECTIONS.RESUMES).updateOne(
      { _id: starterResume.id },
      {
        $set: {
          _id: starterResume.id,
          userId: demoUserId,
          title: starterResume.title,
          templateId: starterResume.templateId,
          data: starterResume,
          targetRole: starterResume.targetRoleTag,
          atsScore: starterResume.atsScore,
          version: 1,
          isArchived: false,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  // 3. Seed Starter Cover Letter
  console.log('✉️ [DB Seed] Seeding starter cover letter...');
  const starterCoverLetterId = 'cl_sample_01';
  await db.collection<MongoCoverLetterRecord>(MONGO_COLLECTIONS.COVER_LETTERS).updateOne(
    { _id: starterCoverLetterId },
    {
      $set: {
        _id: starterCoverLetterId,
        userId: demoUserId,
        title: 'Executive Software Engineer Cover Letter',
        templateId: 'coral-modern',
        data: {
          id: starterCoverLetterId,
          title: 'Executive Software Engineer Cover Letter',
          recipientName: 'Engineering Hiring Manager',
          companyName: 'NextGen Cloud Systems',
          roleTitle: 'Staff Distributed Systems Architect',
          templateId: 'coral-modern',
          themeColor: 'coral',
          linkedResumeId: INITIAL_RESUMES[0].id,
          updatedAt: new Date().toISOString(),
          content:
            'Dear Engineering Hiring Manager,\n\nI am writing to express my enthusiastic interest in the Staff Distributed Systems Architect role at NextGen Cloud Systems.\n\nOver the past eight years leading distributed infrastructure squads, I have specialized in architecting high-throughput microservices capable of sustaining 250,000+ RPS with sub-50ms p99 SLAs. At my previous organization, I steered a cloud re-architecture that reduced annualized infrastructure spend by 34% while elevating platform availability from 99.9% to 99.99%.\n\nI look forward to discussing how my experience in resilient cloud systems can accelerate your product roadmap.\n\nSincerely,\nAlex Morgan',
        },
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // 4. Seed Initial Audit Log
  console.log('📋 [DB Seed] Recording database initialization audit log...');
  await db.collection(MONGO_COLLECTIONS.AUDIT_LOGS).insertOne({
    userId: demoUserId,
    action: 'DATABASE_INITIALIZATION',
    resourceType: 'system',
    resourceId: 'resumebuilderai_db',
    details: {
      engine: 'mongodb_atlas_cloud',
      seededCollections: [
        MONGO_COLLECTIONS.USERS,
        MONGO_COLLECTIONS.RESUMES,
        MONGO_COLLECTIONS.COVER_LETTERS,
      ],
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date(),
  });

  // 5. Verification Report
  console.log('\n📊 [DB Seed Summary] Collection Counts:');
  for (const colName of Object.values(MONGO_COLLECTIONS)) {
    const count = await db.collection(colName).countDocuments();
    console.log(`   - ${colName.padEnd(16)}: ${count} documents`);
  }

  console.log('\n🎉 [DB Seed] Database setup and seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ [DB Seed Error]:', err);
  process.exit(1);
});
