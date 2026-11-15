# Deployment verification

## Verified locally

- 38 unit tests passed (resume scoring, parsing, exports, rewriting, fallback
  authentication, security utilities, and server authentication regression tests).
- ESLint passed; production build passed, including TypeScript checking.
- Render standalone bundle started on `0.0.0.0` using an injected port.
- All 11 page/metadata route smoke checks passed.
- All 5 API checks passed, including rejection of unauthenticated database access.
  Direct handler checks with a mocked verified identity also confirmed cross-user
  GET and POST requests return 403 before accessing the database.
- All 17 static assets referenced by the landing page returned successful responses.
- `npm audit --omit=dev` reported zero advisories. Full installation reported
  19 moderate development dependency advisories, not resolved in this change.
- Blueprint YAML parsed locally; Render-side validation happens during import.

## Integration findings and remaining checks

- **Firebase:** the existing auth test received `auth/operation-not-allowed`
  for email registration/sign-in and passed through local fallback. Enable real
  providers and authorize the Render hostname before testing authenticated cloud
  workflows. The fallback test does not prove real OAuth works.
- **Atlas:** the configured database returned degraded status, `connected: false`,
  after approximately five seconds. The error category was TLS connection rejected.
  Check Atlas network access, database credentials, and service connectivity. The
  application does not disable TLS verification to bypass this failure.
- **Gemini:** a direct live request succeeded in approximately 3.3 seconds, while
  the application fell back under its old 2.5-second deadline. Generation now has
  a 15-second budget, including an SDK request timeout. The updated route returned
  a live Gemini summary (not the local fallback) in approximately 9.5 seconds.
- **Browser:** interactive editing, real sign-in, cross-device persistence, download
  interaction, responsive layouts, and public portfolio publishing still require
  browser acceptance testing. HTTP page rendering is not a substitute for this.
- **Render:** configuration is prepared; no service was created or deployed.

## Changes

Added a Render Blueprint, standalone asset packaging, Node version pin, liveness
endpoint, reproducible test commands, and deployment instructions. Fixed MongoDB
pool reuse in production, verified Firebase sessions before database requests,
attached ID tokens from the client, rejected mismatched user IDs, and stopped
reporting successful sync counts when database writes fail. Cloud operations now
require real Firebase sessions; browser-only fallback identities remain local.

Follow [the deployment guide](render-deployment.md) for configuration and final
acceptance checks. These results do not establish that every app feature works.
