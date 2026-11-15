# ResumeBuilderAI 3.0 — Security & Privacy Checklist

## 1. Zero Stored & Reflected XSS
- [x] All user strings in HTML exports (`exportResumeToDocxHtml`) escaped via `escapeHtml()`.
- [x] No `dangerouslySetInnerHTML` on untrusted inputs.
- [x] Selectable PDF generator sanitizes parentheses, backslashes, and control characters in PDF text streams.

## 2. Server-Side Request Forgery (SSRF) Guard
- [x] Strict IP & protocol check: blocks `127.0.0.1`, `localhost`, `169.254.169.254` (cloud metadata), `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
- [x] Blocks non-HTTP/HTTPS schemes (`javascript:`, `file:`, `data:`).

## 3. LLM Prompt Injection & Delimiter Neutralization
- [x] User-supplied job descriptions, resumes, and bullets are wrapped in `<untrusted_data>` delimiters.
- [x] Delimiter breakout sequences (e.g. `</untrusted_data>`) are neutralized prior to prompt interpolation.

## 4. Credential & Identity Protection
- [x] Passwords hashed using PBKDF2 with SHA-256 and per-user salt.
- [x] Raw passwords are never persisted in plaintext.
- [x] API keys (`GEMINI_API_KEY`) strictly server-only; never prefixed with `NEXT_PUBLIC_`.

## 5. Cloud Firestore Isolation
- [x] Firestore security rules enforce `request.auth.uid == resource.data.userId`.
- [x] Document updates prohibit altering `id` or `userId`.
- [x] Document IDs are limited to 128 characters and validated against path-traversal regular expressions (`^[a-zA-Z0-9_-]+$`).
