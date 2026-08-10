# Export Audit

## Current State
- Missing or rudimentary client-side export functionality.

## Findings
- **PDF Export:** Needs a dedicated server-side renderer (Phase 45) that accepts Resume JSON and outputs a validated PDF (checking for overflow, missing text, broken links).
- **DOCX Export:** Needs to generate structured DOCX files containing proper headings, paragraphs, and spacing (Phase 46).
- **Retryability:** If an export fails, the system must not regenerate the entire resume (Phase 36).

## Action Items
- Implement a server-side PDF rendering pipeline using a headless browser (e.g., Puppeteer/Playwright) or robust PDF library.
- Implement a structured DOCX generator.
