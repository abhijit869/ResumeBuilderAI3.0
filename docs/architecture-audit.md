# Architecture Audit

## Current State
The project is a pnpm monorepo containing:
- Frontend: `artifacts/resume-gpt`, `artifacts/mockup-sandbox`
- Backend: `artifacts/api-server`
- Libs: `lib/db`, `lib/api-spec`, `lib/api-zod`, `lib/api-client-react`

## Findings
- **API Mismatches:** Frontend components contain direct `fetch()` calls (e.g., in `CreateResume.tsx`, `WorkspaceModule.tsx`) instead of exclusively using `api-client-react`.
- **Database:** Uses a rudimentary `workspaceKey` instead of a robust `users` table linked to Clerk.
- **AI Integration:** Lacks a centralized model registry, router, and prompt registry. AI logic is likely scattered or minimally implemented.
- **State Management:** Workflow states are not durable or persisted in the database.

## Action Items
- Enforce strict usage of `api-client-react` and Zod schemas across all API communications.
- Overhaul database schema to support the complete Resume Builder AI 3.0 platform (users, workflows, versioning, provenance).
