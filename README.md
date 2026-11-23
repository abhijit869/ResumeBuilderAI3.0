# ResumeBuilderAI 3.0

ResumeBuilderAI 3.0 is a Next.js application for creating and managing resumes, cover letters, portfolios, job applications, and interview preparation. It includes resume templates, ATS-oriented analysis, Gemini-based AI assistance, Firebase authentication and Firestore persistence, and optional MongoDB integration.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Scripts](#scripts)
- [API routes](#api-routes)
- [Persistence](#persistence)
- [Security](#security)
- [Deployment](#deployment)
- [Testing](#testing)
- [Documentation](#documentation)
- [About](#about)

## Overview

The project provides a browser-based career workspace with separate views for resumes, cover letters, ATS analysis, job tracking, career planning, interview preparation, portfolios, media, and application settings.

The repository contains the implemented application code and supporting architecture, security, deployment, and QA documents. External Firebase, Gemini, and MongoDB services require configuration and credentials.

## Features

### Resume builder

- Resume editor with live preview.
- Structured resume sections and template selection.
- Resume template registry with 18 template entries.
- Undo/redo, section reordering, pagination preview, PDF printing, plain-text export, and JSON export.
- LinkedIn and document import handling.

### ATS analysis

- Heuristic resume analysis and job-description matching.
- ATS-oriented feedback for formatting, completeness, keywords, action verbs, metrics, and readability.
- ATS scoring and recommendations are heuristic guidance, not a guarantee of screening outcomes.

### AI assistance

- Server-side Gemini integration for resume and cover-letter operations.
- Local fallback behavior when `GEMINI_API_KEY` is not configured.
- AI input delimiters and prompt sanitization intended to reduce prompt injection risk.

### Career tools

- Cover letter creation and export.
- Job application tracker.
- Career map and career intelligence views.
- Interview preparation workspace.
- Public portfolio route at `/p/[slug]`.
- Media and asset management views.

### User interface

- Responsive Next.js App Router pages.
- Dashboard navigation for the available workspace modules.
- Marketing and template showcase sections.
- Browser theme and layout state handling.

## Architecture

```mermaid
flowchart LR
    User[User Browser] --> UI[Next.js 15 App Router UI]
    UI --> Engines[Resume, ATS, Parsing, and Career Engines]
    UI --> AIRoute[/api/ai/resume]
    UI --> AuthRoute[/api/auth/record]
    UI --> DBRoute[/api/db/sync and /api/db/health]

    AIRoute --> Gemini[Google Gemini API]
    AuthRoute --> FirebaseAuth[Firebase Authentication]
    DBRoute --> MongoDB[MongoDB Atlas]
    UI --> Firestore[Cloud Firestore]

    AIRoute -. local fallback .-> Engines
```

The application uses Next.js route handlers for server-side operations. Private AI credentials are not intended for browser bundles. Firebase and MongoDB are optional external integrations and require environment-specific setup.

## Technology stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| AI | Google Gemini through `@google/genai` |
| Authentication | Firebase Authentication |
| Cloud documents | Cloud Firestore |
| Database integration | MongoDB Atlas through `mongodb` |
| Validation and linting | ESLint and TypeScript |
| Testing | Node test runner through `tsx --test` |
| Deployment | Render-compatible Next.js standalone output |

## Project structure

```text
.
├── app/
│   ├── api/
│   │   ├── ai/resume/          # Gemini resume operations
│   │   ├── auth/record/        # Authentication record handler
│   │   ├── db/health/          # MongoDB health endpoint
│   │   ├── db/sync/            # Database synchronization endpoint
│   │   ├── health/             # Process liveness endpoint
│   │   └── rea-insights/       # Engineering and security insight endpoint
│   ├── ats-checker/
│   ├── career-map/
│   ├── cover-letter/
│   ├── dashboard/
│   ├── interview-prep/
│   ├── p/[slug]/               # Public portfolio route
│   └── templates/
├── components/
│   ├── dashboard/              # Dashboard modules
│   └── marketing/              # Landing-page sections
├── lib/
│   ├── parsing/                # Resume and document parsing utilities
│   ├── models/                 # Application models
│   ├── services/               # Service integrations
│   ├── ats-optimizer.ts
│   ├── ai-bullet-rewriter.ts
│   ├── auth-service.ts
│   ├── firestore-service.ts
│   ├── mongodb.ts
│   ├── pdf-print-engine.ts
│   └── security-utils.ts
├── docs/                       # Architecture and operational documentation
├── public/assets/              # Static assets
├── scripts/                    # Verification and deployment scripts
├── firestore.rules             # Firestore authorization rules
├── render.yaml                 # Render Blueprint
└── package.json
```

## Getting started

### Prerequisites

- Node.js 24.x
- npm 10 or newer

The required Node.js version is recorded in `.node-version` and `package.json`.

### Install

```bash
git clone https://github.com/abhijit869/ResumeBuilderAI3.0.git
cd ResumeBuilderAI3.0
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment configuration

Copy `.env.example` to `.env.local` and configure only the integrations you need.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Enables server-side Gemini AI operations |
| `APP_URL` | Canonical application URL |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | MongoDB database name |
| `NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED` | Enables the Firebase email/password authentication path |
| `NEXT_PUBLIC_FIREBASE_*` | Optional Firebase project overrides |
| `FIREBASE_AUTH_API_KEY` | Optional server-compatible Firebase Identity Toolkit key |
| `DISABLE_HMR` | Disables HMR in constrained preview environments |

Keep API keys and database credentials outside source control. Do not add server-only secrets to variables prefixed with `NEXT_PUBLIC_`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run the configured unit and parsing tests |
| `npm run test:routes` | Check configured application routes |
| `npm run test:api` | Run API verification checks |
| `npm run db:seed` | Run the database seed script |
| `npm run db:health` | Check the local database health endpoint |
| `npm run build:render` | Build Next.js standalone output for Render |
| `npm run clean` | Remove `.next` |

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Process liveness check |
| `GET /api/db/health` | MongoDB health diagnostic |
| `POST /api/db/sync` | Database synchronization endpoint |
| `POST /api/ai/resume` | Server-side AI resume operations |
| `POST /api/auth/record` | Authentication record handling |
| `GET /api/rea-insights` | Security and engineering insight payload |

Route behavior should be verified in the deployed environment; health-route success does not by itself confirm that Firebase, Gemini, or MongoDB credentials are valid.

## Persistence

The repository includes both Firebase and MongoDB integrations.

- Firebase Authentication provides browser identity flows.
- Cloud Firestore stores user-scoped application documents according to `firestore.rules`.
- MongoDB support is implemented through `lib/mongodb.ts` and the database API routes.
- Local fallback accounts do not create cloud sessions or cloud-persisted documents.

Firebase and MongoDB configuration is deployment-specific and may require credentials that are not present in a fresh clone.

## Security

The codebase includes several defensive measures, including:

- Default-deny Firestore rules with user ownership checks.
- Document ID and field validation in Firestore rules.
- HTML escaping in export-related code.
- URL and protocol validation for external links.
- Prompt delimiter neutralization and untrusted-data boundaries.
- Server-side Gemini credential handling.
- Local credential fallback using PBKDF2-SHA256 with a per-user salt.

Security behavior depends on correct environment configuration and deployment settings. The implementation should be independently reviewed before handling sensitive production data.

See [`docs/security-checklist.md`](docs/security-checklist.md) for the repository-maintained checklist.

## Deployment

The repository includes a Render Blueprint in [`render.yaml`](render.yaml). It defines a Node web service, standalone Next.js build command, production start command, and `/api/health` health-check route.

Before deployment:

1. Configure `GEMINI_API_KEY` and `MONGODB_URI` in the hosting environment if those integrations are used.
2. Configure Firebase Authentication providers and authorized domains when using Firebase.
3. Configure MongoDB Atlas network access for the hosting service.
4. Set `APP_URL` to the public HTTPS URL if a custom domain or fixed canonical URL is used.
5. Deploy the repository's Firestore rules to the configured Firebase project.

See [`docs/render-deployment.md`](docs/render-deployment.md) for deployment details.

## Testing

Run the repository checks after local setup:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Route and API verification scripts can be run against a running instance:

```bash
BASE_URL=http://localhost:3000 npm run test:routes
BASE_URL=http://localhost:3000 npm run test:api
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/feature-matrix.md`](docs/feature-matrix.md)
- [`docs/api-integrations.md`](docs/api-integrations.md)
- [`docs/database-schema.md`](docs/database-schema.md)
- [`docs/security-checklist.md`](docs/security-checklist.md)
- [`docs/qa-report.md`](docs/qa-report.md)
- [`docs/render-deployment.md`](docs/render-deployment.md)
- [`docs/render-verification.md`](docs/render-verification.md)

## About

ResumeBuilderAI 3.0 is created and maintained by [Abhijit Biswas](https://github.com/abhijit869).

Repository: [abhijit869/ResumeBuilderAI3.0](https://github.com/abhijit869/ResumeBuilderAI3.0)
