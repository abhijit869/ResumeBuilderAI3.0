# Authentication Audit

## Current State
- Clerk middleware is set up in `api-server/src/app.ts`.
- Frontend wraps the app in `<ClerkProvider>`.

## Findings
- **Backend Validation:** Need to ensure that *every* protected Express route independently validates the Clerk session and identity.
- **Identity Sync:** There is no synchronization between Clerk and a local database `users` table.
- **Frontend Security:** Relying on Clerk's frontend components is insufficient; backend must reject unauthorized requests.

## Action Items
- Implement Phase 4 (User Database) and a webhook/sync mechanism to populate the local `users` table from Clerk.
- Enforce strict authentication middleware on all protected API routes.
