# ResumeBuilderAI 3.0

<div align="center">

**A Next.js career-document workspace for resume editing, ATS-oriented analysis, cover-letter drafting, job tracking, and interview preparation.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=1f2937)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Implemented Features](#implemented-features)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [Routes](#routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Persistence and Integrations](#persistence-and-integrations)
- [Security Notes](#security-notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Maintainer](#maintainer)
- [License](#license)

---

## Overview

ResumeBuilderAI 3.0 is a browser-based Next.js application for creating and managing career documents. The repository includes a live resume editor, template previews, ATS-oriented checks, cover-letter tools, job tracking, interview-preparation views, portfolio UI, authentication flows, and optional Firebase, MongoDB, and Gemini integrations.

The project uses a mix of browser-side state, local fallback behavior, and external services. Not every feature is cloud-backed or enabled in a fresh local setup.

> ATS and AI results are guidance only. They do not guarantee that a resume will pass every ATS or improve hiring outcomes.

---

## Implemented Features

### Resume workspace

- Three-panel resume editing and live canvas preview
- A4 and US Letter page-size controls
- Template registry with 18 template IDs
- Theme, font, size, spacing, and margin controls
- Reorderable resume sections
- Undo and redo controls
- Resume JSON download
- Resume text export
- Browser print/PDF workflow
- Resume version snapshots in the document model
- Structured experience, education, skills, projects, certifications, languages, awards, volunteering, publications, and custom sections

### ATS-oriented analysis

- Keyword comparison against a pasted job description
- Matched and missing keyword lists
- Skills, quantified-impact, readability, and title/summary checks
- Actionable optimization recommendations
- Heuristic score calculation in `lib/ats-optimizer.ts`

The score is based on repository-defined rules and should not be presented as a verified hiring-system result.

### AI-assisted writing

- Server-side Gemini requests in `/api/ai/resume`
- Resume summary, bullet, tailored-resume, and cover-letter operations
- Local fallback responses when Gemini is not configured or a request fails
- Prompt sanitization and `<untrusted_data>` delimiters for candidate and job text

Availability and result quality depend on a valid `GEMINI_API_KEY` and provider connectivity.

### Import and parsing

- LinkedIn-export text parsing
- LinkedIn profile URL resolver for supported examples
- PDF and DOCX parsing utilities
- Review/diff-oriented import UI

LinkedIn URL resolution does not use an official LinkedIn profile API. A bare URL may be rejected or resolved using repository-defined behavior rather than representing a live account fetch.

### Career tools

- Cover-letter editor
- Job-application tracker
- Interview-preparation workspace
- Career-map UI
- Career-intelligence panel
- Media-library UI
- JSON data export
- Portfolio and cover-page UI

Some dashboard modules are implemented as local UI/state experiences. Availability of persistent data depends on authentication and service configuration.

### Public portfolio route

The repository includes `/p/[slug]`. The current route derives display content from the slug and the initial demo resume; it does not currently read a user-specific portfolio record in the public route.

---

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| AI provider | Google Gemini via `@google/genai` |
| Authentication | Firebase Authentication |
| Cloud documents | Cloud Firestore |
| Optional database | MongoDB Atlas via `mongodb` |
| Testing | Node.js test runner with `tsx --test` |
| Deployment | Standalone Next.js build prepared for Render |

---

## Application Structure

```text
ResumeBuilderAI3.0/
├── app/
│   ├── api/
│   │   ├── ai/resume/
│   │   ├── auth/record/
│   │   ├── db/health/
│   │   ├── db/sync/
│   │   ├── health/
│   │   └── rea-insights/
│   ├── ats-checker/
│   ├── career-map/
│   ├── cover-letter/
│   ├── dashboard/
│   ├── interview-prep/
│   ├── p/[slug]/
│   └── templates/
├── components/
│   ├── dashboard/
│   └── marketing/
├── lib/
│   ├── ats-optimizer.ts
│   ├── ai-bullet-rewriter.ts
│   ├── auth-service.ts
│   ├── firebase.ts
│   ├── firestore-service.ts
│   ├── linkedin-parser.ts
│   ├── mongodb.ts
│   ├── pdf-print-engine.ts
│   ├── resume-engine.ts
│   ├── security-utils.ts
│   └── self-healing-engine.ts
├── docs/
├── scripts/
├── firestore.rules
├── render.yaml
├── package.json
└── .env.example
```

---

## Routes

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Career workspace |
| `/ats-checker` | Resume/job-description analysis interface |
| `/career-map` | Career-map interface |
| `/cover-letter` | Cover-letter interface |
| `/interview-prep` | Interview-preparation interface |
| `/p/[slug]` | Slug-based portfolio page |
| `/templates` | Template showcase |

### API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Basic process liveness response |
| `GET` | `/api/db/health` | MongoDB configuration and connection status |
| `GET`/`POST` | `/api/db/sync` | Authenticated MongoDB read/write operations |
| `POST` | `/api/ai/resume` | Gemini-backed AI operations with local fallback |
| `POST` | `/api/auth/record` | Optional MongoDB authentication-event recording |
| `GET` | `/api/rea-insights` | Security audit and repository feature payload |

API behavior may return `503`, `200` degraded responses, or fallback results depending on environment configuration.

---

## Getting Started

### Prerequisites

- Node.js `24.x`
- npm `10` or newer
- A modern browser

The Node.js version is declared in `.node-version` and `package.json`.

### Install and run locally

```bash
git clone https://github.com/abhijit869/ResumeBuilderAI3.0.git
cd ResumeBuilderAI3.0
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

External credentials are not required to inspect the local UI or run its local fallback behavior. Configuring Firebase, MongoDB, or Gemini changes which features and persistence paths are available.

---

## Environment Variables

Create `.env.local` from `.env.example`.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Enables Gemini AI requests |
| `APP_URL` | Sets a canonical application URL |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | MongoDB database name |
| `NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED` | Enables the Firebase email/password authentication path |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project override |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app override |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key override |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain override |
| `NEXT_PUBLIC_FIREBASE_DATABASE_ID` | Firestore database ID override |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket override |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender override |
| `NEXT_PUBLIC_FIREBASE_OAUTH_CLIENT_ID` | Firebase OAuth client override |
| `FIREBASE_AUTH_API_KEY` | Optional server-side Identity Toolkit API key |
| `DISABLE_HMR` | Disables Next.js HMR when set to `true` |

Never commit `.env.local` or place secrets in variables prefixed with `NEXT_PUBLIC_`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run unit and utility tests |
| `npm run test:routes` | Check routes against a running server |
| `npm run test:api` | Run API verification scripts |
| `npm run db:seed` | Run the MongoDB seed script |
| `npm run db:health` | Call the local MongoDB health route |
| `npm run build:render` | Build and prepare standalone Render output |
| `npm run clean` | Remove `.next` |

---

## Persistence and Integrations

### Firebase

The repository initializes Firebase Authentication and Firestore. `firestore.rules` contains default-deny rules and UID ownership checks for user, resume, cover-letter, and job documents.

Firebase project credentials, authorized domains, provider configuration, and deployed rules are required for the corresponding cloud features.

### MongoDB

`lib/mongodb.ts` provides a cached MongoDB client and `lib/services/mongodb-service.ts` contains database operations. The sync route supports authenticated user, resume, and cover-letter synchronization.

MongoDB is optional. `/api/db/sync` and `/api/db/health` return not-configured or unavailable responses when the integration is absent or inaccessible.

### Local fallback

The authentication service contains a local browser-account fallback and PBKDF2-style password digest implementation. Local fallback accounts do not create Firebase cloud sessions or guarantee cloud persistence.

---

## Security Notes

The repository includes several security-oriented implementations:

- Default-deny Firestore rules
- UID ownership checks
- Firestore field and identifier validation
- HTML escaping utilities
- External URL validation
- Prompt delimiter sanitation
- Server-side Gemini environment access
- Local fallback credential hashing

These measures do not establish a guarantee of complete production security. Before deploying sensitive information, review Firebase rules and provider settings, MongoDB network access and database permissions, server environment-variable handling, logs, OAuth domains, and third-party provider requirements.

The repository also contains UI copy such as account deletion and permanent purge controls. Confirm the implementation and provider behavior before representing those controls as complete GDPR/CCPA or cross-provider deletion features.

---

## Testing

Run the standard local checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The test suite includes TypeScript test files under `lib/`, including resume, ATS, parsing, authentication, MongoDB, and security utility tests.

Route checks require a running server:

```bash
BASE_URL=http://localhost:3000 npm run test:routes
BASE_URL=http://localhost:3000 npm run test:api
```

---

## Deployment

`render.yaml` defines a Node.js Render web service with:

- `npm ci --include=dev`
- `npm run build:render`
- `node .next/standalone/server.js`
- `/api/health` health check
- Environment placeholders for Gemini and MongoDB

Deployment prerequisites:

1. Set `GEMINI_API_KEY` if Gemini is required.
2. Set `MONGODB_URI` and `MONGODB_DB_NAME` if MongoDB is required.
3. Configure Firebase credentials and authorized domains if Firebase is used.
4. Deploy `firestore.rules` to the Firebase project.
5. Set `APP_URL` to the deployed canonical URL if needed.
6. Verify `/api/health`, authentication, persistence, and every integration that is enabled.

See `docs/render-deployment.md` and `docs/render-verification.md`.

---

## Known Limitations

- ATS results are heuristic and not a guarantee.
- Gemini features require external credentials and are time-bounded in the API route.
- LinkedIn profile import depends on provided text/PDF data or repository-defined resolver behavior, not full official profile synchronization.
- Public portfolio pages are currently route/demo-based rather than backed by verified per-user publishing.
- MongoDB and Firestore integrations have different implementation coverage.
- Browser print/PDF output can vary between browsers.
- Import accuracy depends on source-document structure.
- AI output must be reviewed for factual accuracy and original wording.
- Test coverage and production verification are limited to the repository's implemented checks.

---

## Contributing

```bash
git checkout -b feature/your-feature
npm run typecheck
npm run lint
npm test
npm run build
git commit -m "Add: concise feature description"
git push origin feature/your-feature
```

Contributions should preserve existing behavior, avoid unrelated changes, and include focused tests for new behavior.

Never commit API keys, database credentials, `.env.local`, or private data.

---

## Documentation

| Document | Description |
| --- | --- |
| `docs/architecture.md` | Architecture notes |
| `docs/feature-matrix.md` | Repository feature matrix |
| `docs/api-integrations.md` | External integration notes |
| `docs/database-schema.md` | Database model notes |
| `docs/security-checklist.md` | Security checklist |
| `docs/qa-report.md` | QA documentation |
| `docs/render-deployment.md` | Render deployment guide |
| `docs/render-verification.md` | Render verification guide |
| `docs/final-release-audit.md` | Release-audit notes |

The repository documentation may contain design goals or audit claims that require independent verification. The implementation and tests in the repository should take precedence.

---

## Maintainer

**Abhijit Biswas**

- GitHub: [@abhijit869](https://github.com/abhijit869)
- Repository: [ResumeBuilderAI3.0](https://github.com/abhijit869/ResumeBuilderAI3.0)

---

## License

No license file is currently included in the repository. A license should be added before redistributing the project under a specific open-source or proprietary license.
