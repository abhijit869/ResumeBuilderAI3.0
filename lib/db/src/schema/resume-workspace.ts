import { jsonb, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const workspaceProfilesTable = pgTable("workspace_profiles", {
  id: serial("id").primaryKey(),
  workspaceKey: text("workspace_key").notNull().unique(),
  profileUrl: text("profile_url").notNull(),
  source: text("source").notNull().default("public-url"),
  profile: jsonb("profile").notNull(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const jobAnalysesTable = pgTable("job_analyses", {
  id: serial("id").primaryKey(),
  workspaceKey: text("workspace_key").notNull(),
  jobUrl: text("job_url"),
  source: text("source").notNull(),
  job: jsonb("job").notNull(),
  comparison: jsonb("comparison").notNull(),
  analyzedAt: timestamp("analyzed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const resumeVersionsTable = pgTable("resume_versions", {
  id: serial("id").primaryKey(),
  workspaceKey: text("workspace_key").notNull(),
  jobAnalysisId: integer("job_analysis_id").notNull(),
  mode: text("mode").notNull(),
  templateId: text("template_id").notNull(),
  resume: jsonb("resume").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WorkspaceProfile = typeof workspaceProfilesTable.$inferSelect;
export type JobAnalysis = typeof jobAnalysesTable.$inferSelect;
export type ResumeVersion = typeof resumeVersionsTable.$inferSelect;