# API Audit

## Current State
- Express routes exist, but contracts are not strictly enforced across the stack.

## Findings
- **Contract System:** Endpoints lack strict `Request schema`, `Response schema`, and `Error schema` definitions using Zod (Phase 6).
- **Frontend Sync:** Direct `fetch()` calls in the frontend bypass the shared `api-client-react` (Phase 5).
- **Error Handling:** Missing a unified `ApiError` format with actionable metadata (Why it happened, Retry, Fallback).

## Action Items
- Remove all raw `fetch()` calls from `artifacts/resume-gpt/src` components.
- Define strict Zod schemas in `lib/api-zod` and use them in Express validators.
