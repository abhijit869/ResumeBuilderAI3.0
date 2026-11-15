/**
 * MongoDB Data Models & Schema Contracts for ResumeBuilderAI 3.0
 */

import { ResumeDocument, CoverLetterDocument } from '@/lib/resume-engine';

export const MONGO_COLLECTIONS = {
  USERS: 'users',
  AUTH_RECORDS: 'auth_records',
  RESUMES: 'resumes',
  COVER_LETTERS: 'cover_letters',
  PORTFOLIOS: 'portfolios',
  AUDIT_LOGS: 'audit_logs',
  SYSTEM_LOGS: 'system_logs',
} as const;

export type MongoCollectionName =
  (typeof MONGO_COLLECTIONS)[keyof typeof MONGO_COLLECTIONS];

/**
 * 1. User Account Document Schema
 */
export interface MongoUserRecord {
  _id: string; // User UID (UUID or Firebase UID)
  email: string;
  displayName: string;
  photoURL?: string;
  providerId: 'password' | 'google.com' | 'github.com' | 'demo';
  role: 'user' | 'admin';
  tier: 'free_community'; // Strictly 100% Free
  passwordHash?: string;
  salt?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  settings: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    emailNotifications: boolean;
    defaultTemplateId: string;
  };
}

/**
 * 2. Authentication & Session Log Schema
 */
export interface MongoAuthRecord {
  _id: string;
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  provider: string;
  action: 'login' | 'logout' | 'token_refresh' | 'failed_attempt' | 'password_reset';
  status: 'success' | 'failure';
  failureReason?: string;
  createdAt: Date;
  expiresAt: Date; // TTL index
}

/**
 * 3. Resume Document MongoDB Entity
 */
export interface MongoResumeRecord {
  _id: string; // Resume ID (UUID)
  userId: string;
  title: string;
  slug?: string;
  templateId: string;
  data: ResumeDocument;
  targetCompany?: string;
  targetRole?: string;
  atsScore?: number;
  isArchived: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 4. Cover Letter MongoDB Entity
 */
export interface MongoCoverLetterRecord {
  _id: string; // Cover Letter ID
  userId: string;
  linkedResumeId?: string;
  title: string;
  data: CoverLetterDocument;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 5. Personal Website / Portfolio MongoDB Entity
 */
export interface MongoPortfolioRecord {
  _id: string; // Portfolio ID
  userId: string;
  slug: string; // Unique URL slug: /p/[slug]
  title: string;
  style:
    | 'minimal'
    | 'executive'
    | 'creative'
    | 'technical'
    | 'student'
    | 'academic'
    | 'designer'
    | 'freelance';
  accentColor: string;
  isPublished: boolean;
  videoIntroUrl?: string;
  customDomain?: string;
  sections: Array<{
    id: string;
    type: string;
    title: string;
    visible: boolean;
    data: unknown;
  }>;
  publishedAt?: Date;
  updatedAt: Date;
}

/**
 * 6. Compliance & Security Audit Log Entity
 */
export interface MongoAuditLog {
  _id: string;
  userId: string;
  action:
    | 'account_created'
    | 'account_login'
    | 'password_changed'
    | 'data_exported'
    | 'account_deleted'
    | 'resume_deleted'
    | 'resume_created';
  ipHash: string; // Hashed for privacy preservation
  userAgent: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * 7. System Telemetry & AI Latency Log
 */
export interface MongoSystemLog {
  _id: string;
  userId?: string;
  type: 'ai_generation' | 'ats_audit' | 'error' | 'sync';
  feature:
    | 'bullet_rewriter'
    | 'tailor_resume'
    | 'cover_letter'
    | 'ml_dl_diagnostic'
    | 'cloud_sync';
  latencyMs: number;
  tokensEstimated?: number;
  status: 'success' | 'error';
  errorMessage?: string;
  timestamp: Date; // TTL index
}
