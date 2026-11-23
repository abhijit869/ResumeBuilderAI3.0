# ResumeBuilderAI 3.0

> **The AI-powered career studio for building stronger resumes, sharper applications, and a more visible professional brand.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/) [![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

ResumeBuilderAI 3.0 is a production-oriented AI career workspace for the complete application journey: create an ATS-friendly resume, improve content with grounded AI, tailor documents to a job description, generate cover letters, track applications, practice interviews, and publish a personal portfolio.

## Contents

- [Product vision](#product-vision)
- [Features](#features)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Commands](#commands)
- [API surface](#api-surface)
- [Data and persistence](#data-and-persistence)
- [Security and privacy](#security-and-privacy)
- [Deployment](#deployment)
- [Quality](#quality)
- [Documentation](#documentation)
- [Contribution](#contribution)
- [About](#about)

## Product vision

Most career tools solve only one part of the job search. ResumeBuilderAI 3.0 brings the whole workflow into one focused workspace:

1. **Capture** experience from scratch or from existing professional data.
2. **Create** a resume or cover letter with a structured, editable document model.
3. **Improve** wording with AI while preserving factual accuracy and user ownership.
4. **Validate** the result with ATS scoring, keyword analysis, readability checks, and job matching.
5. **Publish** a portfolio and manage the application pipeline from one dashboard.

It is designed for job seekers, students, professionals, career coaches, and teams building modern career services.

## Features

### Resume studio

- Responsive three-panel editor with section navigation, forms, and live paper preview.
- 18 ATS-oriented templates spanning executive, academic, technical, consulting, healthcare, legal, federal, international, and startup styles.
- Section reordering, undo/redo, pagination preview, and structured resume data.
- Selectable A4/Letter PDF, ATS-friendly plain text, and JSON backup exports.
- LinkedIn and document ingestion with provenance-aware parsing.

### AI career studio

- Rewrite weak experience bullets using an accomplishment-oriented XYZ structure.
- Improve summaries, tailor content to job descriptions, and adjust tone.
- Server-side AI boundary with prompt isolation, input delimiters, timeouts, rate limiting, and deterministic local fallback behavior.
- Designed to improve clarity and impact without inventing employment history, credentials, or unsupported metrics.

### ATS intelligence

Deterministic scoring covers five weighted dimensions:

| Dimension | Weight |
| --- | ---: |
| Impact and metrics | 30 |
| Action verb strength | 20 |
| Section completeness | 20 |
| Formatting and readability | 15 |
| Keyword density and match | 15 |

### Career operations

- Cover letter studio with matching typography and design families.
- Application tracker with Wishlist, Applied, Interviewing, Offer, and Rejected stages.
- Career Map and career intelligence views.
- Interview preparation with behavioral and technical prompts, STAR guidance, architecture scenarios, reverse questions, and practice notes.
- Public portfolio builder with customizable profile, skills, experience, media, and `/p/[slug]` shareable routes.
- Media library for avatars, project screenshots, portfolio covers, and video elevator-pitch links.

## Architecture

```mermaid
flowchart TB
    visitor[Candidate / Visitor]
    subgraph client[Client experience - Next.js App Router]
        landing[Marketing landing page]
        dashboard[Career dashboard]
        editor[Resume and cover letter studio]
        portfolio[Public portfolio route]
    end
    subgraph core[Application engines]
        resume[Resume engine<br/>18 templates + structured schema]
        ats[ATS scoring and keyword matching]
        ai[AI bullet rewriter and tailoring]
        ingest[LinkedIn and document parsing]
        export[Selectable PDF, text, and JSON export]
        career[Job tracker, career map, interview prep]
    end
    subgraph server[Server boundary - Next.js API routes]
        aiRoute[/api/ai/resume]
        authRoute[/api/auth/record]
        dbRoute[/api/db/health + /api/db/sync]
        healthRoute[/api/health]
        insightsRoute[/api/rea-insights]
    end
    subgraph services[External services and persistence]
        gemini[Google Gemini API]
        firebaseAuth[Firebase Authentication]
        firestore[Cloud Firestore]
        mongo[MongoDB Atlas]
    end
    visitor --> landing
    visitor --> portfolio
    landing --> dashboard
    dashboard --> editor
    dashboard --> career
    editor --> resume
    editor --> ats
    editor --> ai
    editor --> ingest
    editor --> export
    ai --> aiRoute
    aiRoute --> gemini
    dashboard --> authRoute
    authRoute --> firebaseAuth
    dashboard --> dbRoute
    dbRoute --> mongo
    resume --> firestore
    dashboard --> insightsRoute
    insightsRoute --> server
    healthRoute --> server
```

### Design principles

- **Structured documents:** resumes, cover letters, jobs, and portfolios are editable data, not one-off rendered pages.
- **Server-side secrets:** Gemini credentials and database operations stay behind server routes.
- **Grounded AI:** user-provided content is treated as untrusted input and isolated from system instructions.
- **Selectable exports:** generated documents remain readable to people and modern ATS parsers.
- **Least privilege:** authenticated data is partitioned by user identity and protected by validation rules.
- **Deployment flexibility:** local development and Render Node web-service deployment are supported.

## Project structure

```text
ResumeBuilderAI3.0/
├── app/
│   ├── api/
│   │   ├── ai/resume/          # Server-side Gemini resume operations
│   │   ├── auth/record/        # Auth record integration
│   │   ├── db/health/          # Database health diagnostics
│   │   ├── db/sync/            # Server-side data synchronization
│   │   ├── health/             # Process liveness endpoint
│   │   └── rea-insights/       # Security and engineering insights
│   ├── ats-checker/            # ATS checker experience
│   ├── career-map/             # Career planning experience
│   ├── cover-letter/           # Cover letter experience
│   ├── dashboard/              # Main authenticated workspace
│   ├── interview-prep/         # Interview preparation experience
│   ├── p/[slug]/               # Public shareable portfolio route
│   └── templates/              # Template browsing experience
├── components/
│   ├── dashboard/              # Dashboard tabs and workspace modules
│   ├── marketing/              # Landing page showcase sections
│   ├── DashboardView.tsx       # Dashboard composition
│   ├── LandingView.tsx         # Marketing composition
│   ├── ResumeBuilderApp.tsx    # Resume editor application shell
│   └── ResumeCanvasPreview.tsx # Live resume paper preview
├── lib/
│   ├── models/                 # Shared application models
│   ├── parsing/                # PDF, DOCX, and text parsing helpers
│   ├── services/               # Reusable service integrations
│   ├── resume-engine.ts        # Resume schema and document operations
│   ├── ats-optimizer.ts        # ATS scoring and optimization logic
│   ├── ai-bullet-rewriter.ts   # Grounded AI bullet transformation
│   ├── auth-service.ts         # Authentication and local fallback logic
│   ├── firestore-service.ts    # Firestore persistence helpers
│   ├── mongodb.ts              # MongoDB connection utilities
│   ├── pdf-print-engine.ts     # Printable document generation
│   └── security-utils.ts       # Sanitization and security helpers
├── docs/                       # Architecture, QA, deployment, and security docs
├── public/assets/              # Product branding and static assets
├── scripts/                    # Database, route, API, and deployment checks
├── firestore.rules             # Default-deny Firestore security rules
├── render.yaml                 # Render Blueprint deployment definition
├── next.config.ts              # Next.js production configuration
├── .env.example                # Environment variable reference
├── package.json                # Scripts and dependency manifest
└── tsconfig.json               # TypeScript compiler configuration
```

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 15 App Router | Routing, server rendering, API routes, and standalone deployment |
| UI | React 19 + TypeScript | Typed component-based application experience |
| Styling | Tailwind CSS v4 + PostCSS | Responsive design system and utility styling |
| Motion and icons | Motion + Lucide React | Interaction polish and accessible iconography |
| AI | Google Gemini via `@google/genai` | Server-side rewriting, tailoring, and career assistance |
| Identity | Firebase Authentication | Social and email authentication paths |
| Document store | Cloud Firestore | User-isolated career document persistence |
| Database integration | MongoDB Atlas | Server-side database and health/sync workflows |
| Quality | TypeScript, ESLint, Node test runner | Static checks, tests, and verification scripts |
| Hosting | Render or Node-compatible platform | Production web service for standalone output |

## Getting started

### Prerequisites

- Node.js **24.x** — see `.node-version`.
- npm **10.x or newer**.
- Gemini API key for AI features.
- Firebase configuration for cloud authentication and persistence.
- MongoDB Atlas credentials for database synchronization and health checks.

### Installation

```bash
git clone https://github.com/abhijit869/ResumeBuilderAI3.0.git
cd ResumeBuilderAI3.0
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For AI features | Server-side Google Gemini credential |
| `APP_URL` | Recommended | Canonical URL for links, callbacks, robots, and sitemap |
| `MONGODB_URI` | For MongoDB workflows | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Recommended | Database name; deployment defaults to `resumebuilderai_db` |
| `NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED` | Optional | Enables Firebase email/password authentication when `true` |
| `NEXT_PUBLIC_FIREBASE_*` | Optional | Firebase project overrides for alternate environments |
| `FIREBASE_AUTH_API_KEY` | Optional | Server-compatible Identity Toolkit key for restricted browser keys |
| `DISABLE_HMR` | Optional | Disables file watching in constrained preview environments |

Never commit `.env.local` or expose server-only credentials with a `NEXT_PUBLIC_` prefix.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run unit, parsing, resume, database, and security tests |
| `npm run test:routes` | Check live route health using `BASE_URL` |
| `npm run test:api` | Run API security and behavior checks |
| `npm run db:seed` | Seed supported database data |
| `npm run db:health` | Query the local database health endpoint |
| `npm run build:render` | Build and prepare standalone Render output |
| `npm run clean` | Remove the local `.next` build directory |

## API surface

| Endpoint | Responsibility |
| --- | --- |
| `GET /api/health` | Process liveness and hosting health check |
| `GET /api/db/health` | Database connectivity and diagnostics |
| `POST /api/db/sync` | Server-side data synchronization workflow |
| `POST /api/ai/resume` | Grounded Gemini resume operations and deterministic fallback |
| `POST /api/auth/record` | Authentication record integration |
| `GET /api/rea-insights` | Security audit and engineering insight payload |

## Data and persistence

- **Firebase Authentication** establishes identity for cloud-backed sessions.
- **Cloud Firestore** stores user-scoped records such as profiles, resumes, cover letters, and job applications under `/users/{uid}/...`.
- **MongoDB Atlas** supports server database integration, synchronization, and diagnostics configured through `MONGODB_URI`.
- **Local fallback authentication** uses PBKDF2-SHA256 with a per-user salt for local/browser-limited fallback behavior.

Firestore rules are default-deny and validate document IDs, ownership, field types, field lengths, and immutable identity fields during updates.

## Security and privacy

- Default-deny Firestore rules with owner-only access to user documents.
- Ownership validation requiring authenticated identity to match the document user ID.
- Immutable IDs and ownership fields to prevent ownership-changing updates.
- Input size and type validation for profiles, resumes, cover letters, and jobs.
- XSS defenses through escaped export content and safe rendering practices.
- SSRF defenses that reject private-network targets, cloud metadata addresses, and unsafe URL schemes.
- Prompt-injection defenses using untrusted-data delimiters and delimiter neutralization.
- Server-only AI credentials so `GEMINI_API_KEY` is not shipped to the browser.
- PBKDF2-SHA256 password hashing with per-user salts for the local fallback path.
- Selectable PDF sanitization for special characters and control characters.
- Rate limiting and timeouts around server-side AI operations with deterministic fallback.

See [`docs/security-checklist.md`](docs/security-checklist.md).

> AI suggestions should be reviewed by the user. The product should not be used to fabricate experience, credentials, or achievements.

## Deployment

The repository includes [`render.yaml`](render.yaml) for a Node web service using Next.js standalone output.

```bash
npm ci --include=dev
npm run build:render
node .next/standalone/server.js
```

Set `HOSTNAME=0.0.0.0` and let the platform provide `PORT`. Verify deployments with:

```bash
BASE_URL=https://YOUR-SERVICE.onrender.com npm run test:routes
BASE_URL=https://YOUR-SERVICE.onrender.com npm run test:api
```

See [`docs/render-deployment.md`](docs/render-deployment.md) for provider-specific details.

## Quality

The project includes focused tests for resume transformations, AI rewriting and fallback behavior, parsing, MongoDB helpers, server authentication, security APIs, and resilience behavior.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — system boundaries and principles.
- [`docs/feature-matrix.md`](docs/feature-matrix.md) — feature-level implementation status.
- [`docs/api-integrations.md`](docs/api-integrations.md) — Gemini, Firebase, and server integrations.
- [`docs/database-schema.md`](docs/database-schema.md) — persistence model.
- [`docs/security-checklist.md`](docs/security-checklist.md) — security verification checklist.
- [`docs/qa-report.md`](docs/qa-report.md) — quality assurance coverage.
- [`docs/render-deployment.md`](docs/render-deployment.md) — production deployment instructions.
- [`docs/render-verification.md`](docs/render-verification.md) — post-deployment checks.
- [`docs/implementation-roadmap.md`](docs/implementation-roadmap.md) — delivery roadmap.
- [`public/assets/`](public/assets/) — branding and static product assets.
- `scripts/` — seed, route health, API security, and build utilities.

## Contribution

Keep contributions focused on useful career outcomes, factual AI behavior, accessible interfaces, secure data handling, and maintainable TypeScript. Before opening a pull request, update related tests and documentation, run `npm run typecheck`, `npm run lint`, and `npm test`, and check that secrets and personal data are not included.

## About

**ResumeBuilderAI 3.0** is created and maintained by **[Abhijit Biswas](https://github.com/abhijit869)**.

- Repository: [github.com/abhijit869/ResumeBuilderAI3.0](https://github.com/abhijit869/ResumeBuilderAI3.0)
- Category: AI career platform, resume engineering, and application workflow
- Audience: job seekers, students, professionals, coaches, and career-focused teams

## License

This project is licensed under the [MIT License](LICENSE).
