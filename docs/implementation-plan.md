# Implementation Plan

Based on the audit of the existing Resume Builder AI 3.0 repository, here is the prioritized implementation plan. **Do not deviate from this order.**

1. **Phase 1 & 2:** Environment & Security (Verify variables, clean secrets, set up safe logging, security headers).
2. **Phase 3:** Clerk Authentication (Strict backend validation on all protected routes).
3. **Phase 4:** User Database (Create `users` table synced via Clerk webhooks).
4. **Phase 5 & 6:** API Architecture & Contracts (Refactor frontend `fetch` to `api-client-react`, enforce Zod schemas).
5. **Phase 7 & 8 & 9:** OpenCode Zen Integration (Provider, Dynamic Model Registry, AI Router).
6. **Phase 12:** AI Prompt Registry.
7. **Phase 13 & 14:** Canonical Profile & Data Provenance schemas.
8. **Phase 23 & 24:** Document Parsers (Robust PDF/DOCX parsing, OCR fallback).
9. **Phase 15 - 22:** LinkedIn Integration (OAuth, Profile Import pipeline, Normalization, Security).
10. **Phase 26 - 28:** Job Analyzer (URL fetching with SSRF protection, JobProfile generation).
11. **Phase 29 & 30:** Skill Engine & Semantic Matching (Embeddings, pgvector).
12. **Phase 31:** ATS Engine.
13. **Phase 34 - 36:** Resume Workflow (Durable state machine).
14. **Phase 32 & 33 & 37-40:** Resume Generator (Strategy, Generation, Modes).
15. **Phase 41 - 44:** Resume Studio & Templates & Versioning.
16. **Phase 45 & 46:** Export Engine (Server-side PDF and DOCX).
17. **Phase 47:** Settings (Ensure full persistence).
18. **Phase 27, 28, 29, 30 (from prompt features):** Cover letter, Portfolio, Interview, Career engine.
19. **Phase 55:** Admin Dashboard.
20. **Phase 56 - 59:** Testing & Browser Verification.
21. **Phase 60:** Final Definition of Done check.

**Rule for each step:**
- RUN TESTS.
- START THE APPLICATION.
- BROWSER TEST.
- CHECK API LOGS.
- CHECK DATABASE.
- FIX ERRORS.
