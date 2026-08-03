# ResumeGPT

ResumeGPT is an authenticated AI career workspace for importing career evidence, matching it to target jobs, building grounded resumes, and exporting polished applications.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/resume-gpt run dev` — run the web app
- `pnpm --filter @workspace/resume-gpt run typecheck` — check the web app
- `pnpm --filter @workspace/api-server run typecheck` — check the API server
- `PORT=21519 BASE_PATH=/ pnpm --filter @workspace/resume-gpt run build` — build the web app
- `pnpm --filter @workspace/api-server run build` — build the API server
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, Clerk-managed auth secrets, and `OPENCODEZEN_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/resume-gpt/src/App.tsx` — public landing page, auth routes, protected workspace routing
- `artifacts/resume-gpt/src/pages/` — dashboard, create flow, builder, analyzer, and local tools
- `artifacts/resume-gpt/src/store/index.tsx` — authenticated client workspace state and local preferences
- `artifacts/api-server/src/routes/workspace.ts` — protected profile, job analysis, and resume generation API
- `artifacts/api-server/src/lib/workspace.ts` — public-page extraction, grounded AI fallback chain, and persistence helpers
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — persisted workspace schema

## Architecture decisions

- Clerk is Replit-managed; browser sessions use cookies and workspace records are scoped to the Clerk user ID.
- Public profile and job imports only read accessible HTTP(S) pages and reject authorization walls.
- Resume generation uses server-side OpenCode Zen models with deterministic extraction fallbacks.
- Resume exports use browser-native PDF and image rendering to avoid provider-specific export dependencies.
- Client-only preferences and recent job analysis are namespaced per authenticated user.

## Product

- Public product landing page with workflow, feature, documentation, and about sections
- Clerk email/password and supported social sign-in flows
- Profile import or manual profile editing
- Job URL or pasted-description analysis with evidence matching
- Multi-agent grounded resume generation
- Multiple persisted resume templates and accent colors
- Resume editing, ATS/local quality analysis, cover-letter drafting, and interview preparation
- Native PDF, PNG, and JPG exports

## User preferences

- Keep the public home route accessible while protecting all workspace routes.
- Do not hardcode administrator credentials or bypass Clerk password and rate-limit protections.

## Gotchas

- Preview uses Clerk development keys and a separate development user store; production accounts are separate after publishing.
- The frontend build requires `PORT` and `BASE_PATH` from the artifact workflow.
- Workspace API routes require a Clerk session and return `401` when accessed signed out.
- Never attach bearer-token handling to the browser client; Clerk web sessions use cookies.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
