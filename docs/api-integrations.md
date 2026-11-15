# ResumeBuilderAI 3.0 — API Integrations & Server Routes

## 1. Google Gemini Generative AI (`/api/ai/resume`)
- **Model**: `gemini-3-flash-preview` with grounded fallback
- **Authentication**: Server-side `GEMINI_API_KEY` (never exposed to client bundle)
- **Rate Limiting & Timeout**: 2500ms client timeout with graceful deterministic synthesis fallback
- **Security Boundary**: Candidate inputs enclosed inside `<untrusted_data>` delimiters with system prompt isolation.

## 2. REA Insights & Security Audit (`/api/rea-insights`)
- **Purpose**: System health check, binary decompilation bridge status, feature matrix, and automated vulnerability validation.
- **Output**: JSON payload reporting 8/8 passed checks across XSS, SSRF, prompt injection, and credential salting.

## 3. Document Ingestion API (`/api/document/import`)
- **PDF Extraction**: Server/Client extraction of selectable textual streams from uploaded `.pdf` documents.
- **DOCX Extraction**: XML-based extraction of paragraphs and runs from uploaded `.docx` archives.
- **LinkedIn Archives**: Client-side & server-side parser for official LinkedIn `.zip`, `.json`, `.csv`, and export text with provenance tags.

## 4. Firebase Authentication & Firestore
- **Authentication**: Firebase Client SDK with Google OAuth, GitHub OAuth, LinkedIn OIDC, and Email/Password with PBKDF2-SHA256 local salted hash fallback.
- **Firestore**: User-isolated documents stored at `/users/{uid}/...` with default-deny rules.
