# Database Audit

## Current State
- Uses Neon PostgreSQL + Drizzle ORM.
- Current tables: `workspace_profiles`, `job_analyses`, `resume_versions`.

## Findings
- **Missing Users Table:** No `users` table syncing with `clerk_user_id` (Phase 4). Currently relying on `workspaceKey`.
- **Missing Workflow State:** No `workflow_runs` or `workflow_steps` tables to track durable resume generation workflows (Phase 35).
- **Missing Canonical Profile:** Needs tables to store `CandidateProfile` with data provenance, sources, and verification status.
- **Missing Job Profile:** Needs tables to store structured `JobProfile` data and semantic matches.

## Action Items
- Create Drizzle migrations to add `users`, `workflow_runs`, `workflow_steps`, `candidate_profiles`, `job_profiles`, etc.
- Implement `clerk_user_id` as the primary identity mapping across all tables.
