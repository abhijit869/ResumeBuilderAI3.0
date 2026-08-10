# Parsing Audit

## Current State
- `pdf-parse` and `mammoth` are present in `api-server/package.json`.

## Findings
- **PDF Parsing:** Simple text extraction via `pdf-parse` is insufficient. Phase 23 requires layout extraction, section detection, NER, skill/date extraction, and OCR fallback for scanned PDFs.
- **DOCX Parsing:** Current implementation likely flattens DOCX to a single string. Phase 24 requires structured extraction of headings, paragraphs, and tables.
- **Quality Metrics:** Missing the `quality_score`, `confidence`, and `warnings[]` metadata for imported documents (Phase 25).

## Action Items
- Replace or enhance `pdf-parse` with a robust structured parser and OCR capability.
- Update `mammoth` usage to parse structured DOCX elements.
- Implement the Document Quality assessment pipeline.
