# Backend Audit

## Current State
- Express server using Node.js.
- Integrated with Drizzle ORM and Clerk.

## Findings
- **AI Infrastructure:** Missing structured `ai/providers`, `ModelRegistry`, `ModelRouter`, and `PromptRegistry`.
- **API Contracts:** Need to ensure every endpoint strictly validates requests and responses using Zod.
- **Missing Endpoints:** Comprehensive endpoints for LinkedIn import, Job URL analysis, PDF/DOCX parsing, and workflow tracking are missing or stubbed.
- **Error Handling:** Needs centralized and structured error handling (returning standard `ApiError` schema).

## Action Items
- Implement Phase 6 (API Contract System) for all routes.
- Scaffold the OpenCode Zen integration architecture (Phase 7).
- Implement the structured workflow engine and state machine endpoints.
