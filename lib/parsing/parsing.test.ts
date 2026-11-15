import test from 'node:test';
import assert from 'node:assert/strict';
import { extractTextFromPdfBytes, parsePdfResume } from './pdf-parser';
import { extractTextFromDocxXml, parseDocxResume } from './docx-parser';

test('pdf-parser extracts selectable text from BT ... ET blocks and TJ arrays', async () => {
  // Construct a minimal valid PDF-like byte buffer with BT/ET stream
  const samplePdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R >> endobj
stream
BT
/F1 12 Tf
(Jordan Patel) Tj
(Staff Platform Engineer) Tj
[(Kubernetes) -10 (Terraform) -10 (AWS)] TJ
ET
endstream
xref
trailer << /Root 1 0 R >>
%%EOF`;

  const bytes = new TextEncoder().encode(samplePdfContent);
  const result = extractTextFromPdfBytes(bytes);

  assert.ok(result.text.includes('Jordan Patel'));
  assert.ok(result.text.includes('Staff Platform Engineer'));
  assert.ok(result.text.includes('Kubernetes'));
  assert.equal(result.pageCount, 1);
});

test('docx-parser extracts structured text from XML paragraphs and text runs', async () => {
  const sampleWordXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Alex Rivera</w:t></w:r></w:p>
    <w:p><w:r><w:t>Staff Software Architect</w:t></w:r></w:p>
    <w:p><w:r><w:t>Led high-throughput distributed systems scaling.</w:t></w:r></w:p>
  </w:body>
</w:document>`;

  const text = extractTextFromDocxXml(sampleWordXml);
  assert.ok(text.includes('Alex Rivera'));
  assert.ok(text.includes('Staff Software Architect'));
  assert.ok(text.includes('Led high-throughput distributed systems scaling'));
});
