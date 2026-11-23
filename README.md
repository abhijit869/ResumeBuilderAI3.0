<div align="center">
📄 ResumeBuilderAI 3.0
Build resumes, cover letters, portfolios, and interview prep — all in one AI-assisted career workspace.
<p> <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"></a> <a href="https://react.dev/"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"></a> <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a> <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"></a> </p> <p> <a href="https://nodejs.org/"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=nodedotjs&logoColor=white"></a> <a href="https://firebase.google.com/"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black"></a> <a href="https://www.mongodb.com/atlas"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white"></a> <a href="https://ai.google.dev/"><img alt="Gemini" src="https://img.shields.io/badge/Google-Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white"></a> <a href="https://render.com/"><img alt="Render" src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=black"></a> </p> <p> <a href="#-getting-started">🚀 Getting Started</a> • <a href="#-features">✨ Features</a> • <a href="#-architecture">🏗️ Architecture</a> • <a href="#-api-reference">🔌 API</a> • <a href="#-deployment">☁️ Deployment</a> • <a href="#-documentation">📚 Docs</a> </p> </div>
📑 Table of Contents
📖 Overview
✨ Features
🖼️ Screenshots
🏗️ Architecture
🧰 Technology Stack
🗂️ Project Structure
🚀 Getting Started
🔐 Environment Configuration
📜 Scripts
🔌 API Reference
💾 Persistence
🛡️ Security
☁️ Deployment
🧪 Testing
🗺️ Roadmap
🤝 Contributing
📚 Documentation
👤 About the Author
📖 Overview

ResumeBuilderAI 3.0 is a browser-based career workspace built with Next.js 15. It brings every step of the job search into one place: designing resumes, writing cover letters, checking ATS readiness, tracking applications, planning a career path, preparing for interviews, and publishing a public portfolio.

💡 At a glance The app combines a template-driven resume editor, heuristic ATS analysis, server-side Gemini AI assistance, Firebase authentication and Firestore persistence, and optional MongoDB integration.

🎯 Goal	🔧 How the project delivers it
Create polished resumes fast	Live-preview editor with 18 template entries and structured sections
Improve screening readiness	Heuristic ATS scoring and job-description matching
Reduce writing effort	Server-side Gemini AI with a local fallback engine
Stay organized	Job tracker, career map, interview prep, and media management
Share your work	Public portfolio at /p/[slug]

⚠️ Note: The repository contains the implemented application code and supporting architecture, security, deployment, and QA documents. External Firebase, Gemini, and MongoDB services require your own configuration and credentials.

✨ Features
📝 Resume Builder

Design, edit, and export professional resumes with a real-time preview.

🖊️ Resume editor with live preview
🧩 Structured resume sections and template selection
🎨 Template registry with 18 template entries
↩️ Undo / redo support
🔀 Drag-style section reordering
📃 Pagination preview
🖨️ PDF printing, plain-text export, and JSON export
📥 LinkedIn and document import handling
🎯 ATS Analysis

Understand how your resume may read to applicant tracking systems.

🔍 Heuristic resume analysis and job-description matching
📊 Feedback on formatting, completeness, keywords, action verbs, metrics, and readability
💬 Actionable recommendations

ℹ️ ATS scoring and recommendations are heuristic guidance, not a guarantee of screening outcomes.

🤖 AI Assistance

Get help with resume and cover-letter writing, without exposing your keys.

⚙️ Server-side Gemini integration for resume and cover-letter operations
🔁 Local fallback behavior when GEMINI_API_KEY is not configured
🛡️ AI input delimiters and prompt sanitization intended to reduce prompt-injection risk
🧭 Career Tools
Tool	Description
✉️ Cover Letters	Create and export tailored cover letters
📌 Job Tracker	Track job applications through each stage
🗺️ Career Map	Visualize career direction and progression
🧠 Career Intelligence	Insight-oriented career views
🎤 Interview Prep	Dedicated interview preparation workspace
🌐 Portfolio	Public portfolio route at /p/[slug]
🖼️ Media & Assets	Manage uploaded media and assets
🎛️ User Interface
📱 Responsive Next.js App Router pages
🧭 Dashboard navigation for all workspace modules
🏷️ Marketing and template showcase sections
🌗 Browser theme and layout state handling
🖼️ Screenshots

📸 Add your own screenshots to public/assets/ or docs/images/ and update the paths below.

Dashboard	Resume Editor	ATS Checker
Dashboard	Resume Editor	ATS Checker
Workspace overview	Live preview editing	Heuristic scoring
🏗️ Architecture

High-level view of how the browser, route handlers, and external services connect.

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

Key design points

🔒 Server-side operations run in Next.js route handlers.
🔑 Private AI credentials are not intended for browser bundles.
🔌 Firebase and MongoDB are optional integrations that require environment-specific setup.
🧰 Technology Stack
Area	Technology
🧱 Framework	Next.js 15 App Router
⚛️ UI	React 19
🔷 Language	TypeScript 5.9
🎨 Styling	Tailwind CSS 4
🎞️ Animation	Motion
🔣 Icons	Lucide React
🤖 AI	Google Gemini via @google/genai
🔐 Authentication	Firebase Authentication
☁️ Cloud documents	Cloud Firestore
🍃 Database integration	MongoDB Atlas via mongodb
✅ Validation & linting	ESLint and TypeScript
🧪 Testing	Node test runner via tsx --test
🚢 Deployment	Render-compatible Next.js standalone output
🗂️ Project Structure
text
.
├── app/
│   ├── api/
│   │   ├── ai/resume/          # 🤖 Gemini resume operations
│   │   ├── auth/record/        # 🔐 Authentication record handler
│   │   ├── db/health/          # 🍃 MongoDB health endpoint
│   │   ├── db/sync/            # 🔄 Database synchronization endpoint
│   │   ├── health/             # ❤️ Process liveness endpoint
│   │   └── rea-insights/       # 🛡️ Engineering and security insight endpoint
│   ├── ats-checker/            # 🎯 ATS analysis page
│   ├── career-map/             # 🗺️ Career map page
│   ├── cover-letter/           # ✉️ Cover letter page
│   ├── dashboard/              # 🧭 Main workspace
│   ├── interview-prep/         # 🎤 Interview preparation
│   ├── p/[slug]/               # 🌐 Public portfolio route
│   └── templates/              # 🎨 Template showcase
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
├── docs/                       # 📚 Architecture and operational documentation
├── public/assets/              # 🖼️ Static assets
├── scripts/                    # 🛠️ Verification and deployment scripts
├── firestore.rules             # 🔥 Firestore authorization rules
├── render.yaml                 # ☁️ Render Blueprint
└── package.json
🚀 Getting Started
✅ Prerequisites
Requirement	Version
🟢 Node.js	24.x
📦 npm	10 or newer

📌 The required Node.js version is recorded in .node-version and package.json.

⚡ Quick Start
bash
# 1. Clone the repository
git clone https://github.com/abhijit869/ResumeBuilderAI3.0.git
cd ResumeBuilderAI3.0

# 2. Install dependencies
npm ci

# 3. Create your local environment file
cp .env.example .env.local

# 4. Start the development server
npm run dev

🌐 Open http://localhost:3000 in your browser.

💡 The app runs without any keys configured. AI features use the local fallback, and cloud features stay inactive until you add credentials.

🔐 Environment Configuration

Copy .env.example to .env.local and configure only the integrations you need.

Variable	Purpose
GEMINI_API_KEY	🤖 Enables server-side Gemini AI operations
APP_URL	🌍 Canonical application URL
MONGODB_URI	🍃 MongoDB Atlas connection string
MONGODB_DB_NAME	🗄️ MongoDB database name
NEXT_PUBLIC_FIREBASE_EMAIL_AUTH_ENABLED	📧 Enables the Firebase email/password authentication path
NEXT_PUBLIC_FIREBASE_*	🔥 Optional Firebase project overrides
FIREBASE_AUTH_API_KEY	🔑 Optional server-compatible Firebase Identity Toolkit key
DISABLE_HMR	⏸️ Disables HMR in constrained preview environments

🚨 Important

Keep API keys and database credentials outside source control.
Never put server-only secrets in variables prefixed with NEXT_PUBLIC_.
📜 Scripts
Command	Description
npm run dev	▶️ Start the Next.js development server
npm run build	🏗️ Build the application
npm run start	🚀 Start the production server
npm run lint	🧹 Run ESLint
npm run typecheck	🔷 Run TypeScript type checking
npm test	🧪 Run the configured unit and parsing tests
npm run test:routes	🧭 Check configured application routes
npm run test:api	🔌 Run API verification checks
npm run db:seed	🌱 Run the database seed script
npm run db:health	❤️ Check the local database health endpoint
npm run build:render	☁️ Build Next.js standalone output for Render
npm run clean	🗑️ Remove .next
🔌 API Reference
Method	Route	Purpose
Show Image	/api/health	❤️ Process liveness check
Show Image	/api/db/health	🍃 MongoDB health diagnostic
Show Image	/api/db/sync	🔄 Database synchronization endpoint
Show Image	/api/ai/resume	🤖 Server-side AI resume operations
Show Image	/api/auth/record	🔐 Authentication record handling
Show Image	/api/rea-insights	🛡️ Security and engineering insight payload

⚠️ Verify route behavior in the deployed environment. A successful health check does not by itself confirm that Firebase, Gemini, or MongoDB credentials are valid.

💾 Persistence

The repository includes both Firebase and MongoDB integrations.

Layer	Role
🔐 Firebase Authentication	Browser identity flows
🔥 Cloud Firestore	User-scoped application documents, governed by firestore.rules
🍃 MongoDB	Implemented via lib/mongodb.ts and the database API routes
💻 Local fallback accounts	Do not create cloud sessions or cloud-persisted documents

ℹ️ Firebase and MongoDB configuration is deployment-specific and may require credentials that are not present in a fresh clone.

🛡️ Security

The codebase includes several defensive measures:

🔥 Default-deny Firestore rules with user ownership checks
✅ Document ID and field validation in Firestore rules
🧼 HTML escaping in export-related code
🔗 URL and protocol validation for external links
🧱 Prompt delimiter neutralization and untrusted-data boundaries
🔑 Server-side Gemini credential handling
🔒 Local credential fallback using PBKDF2-SHA256 with a per-user salt

⚠️ Disclaimer: Security behavior depends on correct environment configuration and deployment settings. Have the implementation independently reviewed before handling sensitive production data.

📋 See docs/security-checklist.md for the repository-maintained checklist.

☁️ Deployment

The repository includes a Render Blueprint in render.yaml. It defines:

🟢 A Node web service
🏗️ A standalone Next.js build command
🚀 A production start command
❤️ A /api/health health-check route
📋 Pre-deployment Checklist
[ ] Configure GEMINI_API_KEY and MONGODB_URI in the hosting environment (if used)
[ ] Configure Firebase Authentication providers and authorized domains (if using Firebase)
[ ] Configure MongoDB Atlas network access for the hosting service
[ ] Set APP_URL to the public HTTPS URL (for a custom domain or fixed canonical URL)
[ ] Deploy the repository's Firestore rules to your Firebase project

📘 See docs/render-deployment.md for full details.

🧪 Testing

Run the repository checks after local setup:

bash
npm run typecheck   # 🔷 Types
npm run lint        # 🧹 Lint
npm test            # 🧪 Unit & parsing tests
npm run build       # 🏗️ Production build

Route and API verification scripts can be run against a running instance:

bash
BASE_URL=http://localhost:3000 npm run test:routes
BASE_URL=http://localhost:3000 npm run test:api
🗺️ Roadmap

Suggested directions. Edit this list to match your actual plans.

[ ] 📸 Add product screenshots and a short demo GIF
[ ] 🧪 Expand automated test coverage
[ ] 🌍 Additional resume templates and localization
[ ] 📤 More export formats
[ ] 📈 Deeper analytics in the job tracker
🤝 Contributing

Contributions, issues, and feature requests are welcome.

🍴 Fork the repository
🌿 Create a feature branch: git checkout -b feature/my-feature
✅ Run npm run typecheck, npm run lint, and npm test
💾 Commit your changes: git commit -m "Add my feature"
📤 Push the branch: git push origin feature/my-feature
🔁 Open a Pull Request

🔐 Please never commit secrets, API keys, or .env.local files.

📚 Documentation
Document	Description
🏗️ docs/architecture.md	System architecture
🧩 docs/feature-matrix.md	Feature overview
🔌 docs/api-integrations.md	External API integrations
🗄️ docs/database-schema.md	Database schema
🛡️ docs/security-checklist.md	Security checklist
✅ docs/qa-report.md	QA report
☁️ docs/render-deployment.md	Render deployment guide
🔎 docs/render-verification.md	Render verification steps
👤 About the Author

ResumeBuilderAI 3.0 is created and maintained by Abhijit Biswas.

<p> <a href="https://github.com/abhijit869"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-abhijit869-181717?style=for-the-badge&logo=github&logoColor=white"></a> <a href="https://github.com/abhijit869/ResumeBuilderAI3.0"><img alt="Repository" src="https://img.shields.io/badge/Repo-ResumeBuilderAI3.0-0969DA?style=for-the-badge&logo=github&logoColor=white"></a> </p>
<div align="center">

⭐ If this project helps you, consider giving it a star on GitHub! ⭐

Made with ❤️ by Abhijit Biswas

</div>
