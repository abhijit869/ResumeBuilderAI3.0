# LinkedIn Audit

## Current State
- `artifacts/api-server/src/lib/linkedin.ts` exists but requires extensive verification against requirements.

## Findings
- **OAuth Separation:** Needs to clearly separate LinkedIn Authentication (Identity) from LinkedIn Profile Import (Data).
- **Security:** Ensure `LINKEDIN_CLIENT_SECRET` is never leaked to the frontend. Tokens must be stored server-side and encrypted at rest.
- **Profile URL Normalization:** Need to handle URL pasting and prevent direct scraping.
- **Import Pipeline:** Missing the pipeline to fetch, normalize to `CandidateProfile`, and diff/review before saving.

## Action Items
- Audit `linkedin.ts` for OAuth 2.0 PKCE and state/nonce validation.
- Implement the Review diff UI/API for accepting/rejecting LinkedIn data imports.
