# ResumeBuilderAi 3.0 — Enterprise ATS & AI Career Studio

An enterprise-grade AI Resume Studio, multi-layer ATS Score Checker, Job Description Keyword Matcher, Cover Letter Generator, and Shareable Live Portfolio platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Firebase (Firestore + Auth)**, and **Google Gemini AI**.

---

## Key Features

- **18 Industry-Benchmarked ATS Resume Templates + Web ATS Template Fetcher**
  - Includes Classic Executive, Harvard Standard, Tech Minimal, Swiss Grid, Executive Split, Modern Sidebar, Latex Academic, Wall Street Quant, Creative Director, Federal GS-Grade, Healthcare Clinical, Legal Counsel, Jake's Single-Column, Deedy Two-Column, FAANG SWE Impact, McKinsey Consulting 1-Page, EuroPass International, and YC Startup Founding Engineer.
  - Dynamically fetch and import curated web ATS templates (e.g., Stanford GSB, MIT EECS, Stripe Staff Systems, Goldman Sachs IBD, OpenAI Research, Apple HIG).
- **Deterministic Multi-Layer ATS Scoring Engine**
  - Real-time evaluation across 5 weighted dimensions: Impact & Metrics (30 pts), Action Verb Strength (20 pts), Section Completeness (20 pts), Formatting & Readability (15 pts), and Keyword Density & Match (15 pts).
- **Server-Side Gemini AI Bullet Rewriter & Tailoring (`/api/ai/resume`)**
  - Rewrites weak experience bullets into high-impact XYZ-formula statements (`Accomplished [X] as measured by [Y], by doing [Z]`) with deterministic local fallback.
- **Enterprise Security & Hardened Architecture**
  - Server-side rate limiting, prototype-pollution-safe sanitization, strict URL protocol validation (`https:` / `http:` / `mailto:`), OWASP security headers, PBKDF2-SHA256 local credential fallback, and least-privilege Firestore Security Rules (`firestore.rules`).
- **Multi-Format Export & Live Shareable Portfolio**
  - Export to A4 Print/PDF, ATS-clean Plain Text (`.txt`), JSON backup (`.json`), or publish a live shareable portfolio link.

---

## Quick Start

### 1. Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`

### 2. Installation
```bash
git clone https://github.com/abhijit869/ResumeBuilderAI3.0.git
cd ResumeBuilderAI3.0
npm install
cp .env.example .env.local
```

### 3. Configure Environment Variables
Edit `.env.local` and set your Gemini API key:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests & Production Build
```bash
# Run unit, utility, white-box & security tests (21 test suites)
npx --yes tsx --test lib/ai-bullet-rewriter.test.ts lib/resume-engine.test.ts lib/security-utils.test.ts

# Lint codebase
npm run lint

# Build for production
npm run build
npm run start
```

---

## Authors & Contributors

- **Abhijit Biswas** ([@abhijit869](https://github.com/abhijit869)) — Creator & Lead Maintainer
- **ResumeBuilderAI Engineering & Community Contributors** — AI integration, ATS scoring algorithms, security architecture, and template design

---

## License

This project is licensed under the MIT License.

