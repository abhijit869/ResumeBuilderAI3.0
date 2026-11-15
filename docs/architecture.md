# ResumeBuilderAI 3.0 — System Architecture

## Overview
ResumeBuilderAI 3.0 is a complete, production-grade AI Career Studio designed to provide end-to-end career tooling from resume creation and AI-guided content enhancement, to cover letter drafting, ATS matching, multi-format exports, job tracking, and career planning.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Client Layer (Next.js 15)                        │
│                                                                        │
│  ┌──────────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │   Landing View   │  │   Career Dashboard  │  │   Document Studio │  │
│  │ (16 SaaS Sections│  │ (12 Workspace Tabs, │  │ (3-Panel Editor,  │  │
│  │  SEO, Showcase)  │  │  Doc Management)    │  │  Live Preview)    │  │
│  └────────┬─────────┘  └──────────┬──────────┘  └─────────┬─────────┘  │
└───────────┼───────────────────────┼───────────────────────┼────────────┘
            │                       │                       │
┌───────────▼───────────────────────▼───────────────────────▼────────────┐
│                    Application State & Core Engines                    │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │  Resume Engine (v3)  │  │ Cover Letter Engine  │  │ PDF / DOCX   │  │
│  │ (18 ATS Templates,   │  │ (Family Pairings,    │  │ Print Engine │  │
│  │  12 Section Schema)  │  │  Letter Typography)  │  │ (Selectable) │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ ML/DL Diagnostic &   │  │ LinkedIn / Document  │  │ Auth & Store │  │
│  │ Heuristic ATS Engine │  │ Ingestion Pipeline   │  │ Service (FB) │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   Server Layer (Next.js App Router)                    │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ /api/ai/resume — Google Gemini API (Grounding, Rewrite, Cover)   │  │
│  │ /api/rea-insights — Security Audit & Engineering Metrics         │  │
│  │ /api/document/import — PDF, DOCX, LinkedIn Text Extraction       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  External Services & Persistent Data                   │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ Firebase Auth        │  │ Cloud Firestore      │  │ Google Cloud │  │
│  │ (Identity Authority) │  │ (Document Storage)   │  │ Gemini Flash │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

## Key Architectural Principles
1. **Preservation of Identity**: Product name remains strictly `ResumeBuilderAi 3.0` and retains official logo assets (`/assets/aistudio/image_663e4373.png`).
2. **Grounding & Factuality**: AI operations never invent employment history, metrics, or credentials. Clarifying prompts are requested when metrics are omitted.
3. **Data Isolation & Security**: User records and documents are partitioned by `userId`. Inputs are sanitized against SSRF, stored XSS, and delimiter injection.
4. **Selectable Document Generation**: Exported PDFs use standard vectors and selectable fonts compliant with modern ATS parsers.
