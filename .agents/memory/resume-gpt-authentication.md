---
name: ResumeGPT authentication
description: Durable decisions for the ResumeGPT authentication boundary and workspace ownership.
---

ResumeGPT uses Replit-managed Clerk for browser authentication. The browser relies on Clerk's cookie-backed session flow; do not add bearer-token plumbing to the web client.

The public landing page remains accessible to signed-out visitors. Sign-in and sign-up are branded Clerk routes, while resume workspace routes and workspace API endpoints require an authenticated Clerk session.

Persisted workspace records are keyed by a namespaced authenticated Clerk user identifier rather than a client-generated workspace key.

**Why:** Clerk provides the managed email/password, verification, reset, and configured social-provider flows without creating a custom password or JWT system. Server-side ownership checks prevent a client from selecting another user's workspace key.

**How to apply:** Keep auth enforcement in both the UI route guard and API middleware. Add roles/admin controls as a separate layer; never hardcode a default administrator in frontend code.