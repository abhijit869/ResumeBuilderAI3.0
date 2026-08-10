import { jsonb, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const workflowRunsTable = pgTable("workflow_runs", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  jobAnalysisId: integer("job_analysis_id"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, failed
  type: text("type").notNull().default("resume_generation"), // resume_generation
  result: jsonb("result"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const workflowStepsTable = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowRunId: integer("workflow_run_id").notNull().references(() => workflowRunsTable.id),
  stepName: text("step_name").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed
  output: jsonb("output"),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type WorkflowRun = typeof workflowRunsTable.$inferSelect;
export type WorkflowStep = typeof workflowStepsTable.$inferSelect;
