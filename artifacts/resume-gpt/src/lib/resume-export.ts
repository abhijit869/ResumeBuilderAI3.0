import type { ResumeData } from '@/store';
import { customFetch } from '@workspace/api-client-react';

export type ResumeExportFormat = 'pdf' | 'png' | 'jpg' | 'docx';

type LayoutLine = {
  text: string;
  size: number;
  weight?: number;
  color?: string;
  x?: number;
  gapAfter?: number;
};

const PAGE_WIDTH = 1200;
const DEFAULT_ACCENT = '#0f766e';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapePdf(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(value: string, maxChars: number) {
  const words = value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [''];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildLayout(data: ResumeData, accent = DEFAULT_ACCENT): { lines: LayoutLine[]; height: number } {
  const lines: LayoutLine[] = [];
  let y = 100;
  const add = (text: string, size: number, options: Omit<LayoutLine, 'text' | 'size'> = {}) => {
    lines.push({ text, size, ...options });
    y += options.gapAfter ?? size * 1.45;
  };
  const addWrapped = (text: string, size: number, maxChars: number, options: Omit<LayoutLine, 'text' | 'size'> = {}) => {
    for (const line of wrapText(text, maxChars)) add(line, size, options);
  };
  const section = (title: string) => {
    y += 28;
    add(title.toUpperCase(), 18, { weight: 700, color: accent, gapAfter: 29 });
  };

  add(data.name || 'Your Name', 44, { weight: 800, color: accent, gapAfter: 12 });
  add(data.title || 'Professional Title', 23, { weight: 600, color: '#334155', gapAfter: 18 });
  const contact = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join('  •  ');
  if (contact) addWrapped(contact, 15, 100, { color: '#64748b', gapAfter: 24 });
  lines.push({ text: '', size: 1, color: accent, gapAfter: 1 });
  y += 1;

  if (data.summary) {
    section('Profile');
    addWrapped(data.summary, 17, 94, { color: '#334155', gapAfter: 8 });
  }

  if (data.experience.length) {
    section('Experience');
    for (const experience of data.experience) {
      add(`${experience.role || 'Role'}${experience.company ? `  ·  ${experience.company}` : ''}`, 19, { weight: 700, color: '#0f172a', gapAfter: 8 });
      if (experience.dates) add(experience.dates, 14, { color: '#64748b', gapAfter: 8 });
      for (const bullet of experience.bullets.filter(Boolean)) addWrapped(`• ${bullet}`, 16, 92, { color: '#334155', gapAfter: 4 });
      y += 15;
    }
  }

  if (data.education.length) {
    section('Education');
    for (const education of data.education) {
      add(`${education.degree || 'Degree'}${education.school ? `  ·  ${education.school}` : ''}`, 17, { weight: 700, color: '#0f172a', gapAfter: 7 });
      if (education.dates) add(education.dates, 14, { color: '#64748b', gapAfter: 7 });
      if (education.details) addWrapped(education.details, 15, 94, { color: '#475569', gapAfter: 8 });
    }
  }

  if (data.skills.length) {
    section('Skills');
    addWrapped(data.skills.join('  •  '), 16, 88, { color: '#334155', gapAfter: 8 });
  }

  const extras = [
    ...data.projects.map(project => `${project.name}${project.description ? ` — ${project.description}` : ''}`),
    ...data.certifications.map(certification => `${certification.name}${certification.issuer ? ` · ${certification.issuer}` : ''}`),
    ...data.languages.map(language => `${language.name}${language.proficiency ? ` · ${language.proficiency}` : ''}`),
  ];
  if (extras.length) {
    section('Additional Information');
    for (const extra of extras) addWrapped(extra, 15, 94, { color: '#475569', gapAfter: 7 });
  }

  return { lines, height: Math.max(1500, y + 90) };
}

function buildResumeSvg(data: ResumeData, accent = DEFAULT_ACCENT) {
  const layout = buildLayout(data, accent);
  let y = 76;
  const text = layout.lines.map(line => {
    const result = line.text
      ? `<text x="${line.x ?? 90}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${line.size}" font-weight="${line.weight ?? 400}" fill="${line.color ?? '#334155'}">${escapeXml(line.text)}</text>`
      : `<rect x="90" y="${y - 4}" width="${PAGE_WIDTH - 180}" height="2" rx="1" fill="${accent}" opacity="0.3" />`;
    y += line.gapAfter ?? line.size * 1.45;
    return result;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_WIDTH}" height="${layout.height}" viewBox="0 0 ${PAGE_WIDTH} ${layout.height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${text}
  </svg>`;
}

function resumeLinesForPdf(data: ResumeData) {
  const result: Array<{ text: string; size: number; bold?: boolean; accent?: boolean }> = [];
  const add = (text: string, size = 10, options: { bold?: boolean; accent?: boolean } = {}) => result.push({ text, size, ...options });
  add(data.name || 'Your Name', 22, { bold: true, accent: true });
  add(data.title || 'Professional Title', 13, { bold: true });
  const contact = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join('  •  ');
  if (contact) add(contact, 9);
  add('');
  const section = (title: string) => { add(title.toUpperCase(), 11, { bold: true, accent: true }); };
  if (data.summary) {
    section('Profile');
    wrapText(data.summary, 92).forEach(line => add(line));
    add('');
  }
  if (data.experience.length) {
    section('Experience');
    for (const item of data.experience) {
      add(`${item.role || 'Role'}${item.company ? `  ·  ${item.company}` : ''}`, 11, { bold: true });
      if (item.dates) add(item.dates, 9);
      item.bullets.filter(Boolean).forEach(bullet => wrapText(`• ${bullet}`, 88).forEach(line => add(line)));
      add('');
    }
  }
  if (data.education.length) {
    section('Education');
    data.education.forEach(item => {
      add(`${item.degree || 'Degree'}${item.school ? `  ·  ${item.school}` : ''}`, 10, { bold: true });
      if (item.dates) add(item.dates, 9);
      if (item.details) wrapText(item.details, 92).forEach(line => add(line));
    });
    add('');
  }
  if (data.skills.length) {
    section('Skills');
    wrapText(data.skills.join('  •  '), 92).forEach(line => add(line));
  }
  return result;
}

function buildPdf(data: ResumeData, accent = DEFAULT_ACCENT) {
  const rgb = (hex: string) => {
    const value = hex.replace('#', '');
    const number = Number.parseInt(value.length === 3 ? value.split('').map(char => char + char).join('') : value, 16);
    return `${((number >> 16) & 255) / 255} ${((number >> 8) & 255) / 255} ${(number & 255) / 255}`;
  };
  const lines = resumeLinesForPdf(data);
  const pageLines: typeof lines[] = [];
  let page: typeof lines = [];
  let used = 0;
  for (const line of lines) {
    const height = line.size + 6;
    if (used + height > 740 && page.length) {
      pageLines.push(page);
      page = [];
      used = 0;
    }
    page.push(line);
    used += height;
  }
  if (page.length) pageLines.push(page);

  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  const pageRefs: string[] = [];
  pageLines.forEach((pageLinesForPage, index) => {
    const contentNumber = 5 + index * 2;
    const pageNumber = contentNumber + 1;
    pageRefs.push(`${pageNumber} 0 R`);
    let y = 790;
    const commands = ['q', '1 1 1 rg', '0 0 595 842 re f', 'Q'];
    for (const line of pageLinesForPage) {
      const color = line.accent ? rgb(accent) : '0.12 0.16 0.22';
      const font = line.bold ? 'Helvetica-Bold' : 'Helvetica';
      const fontRef = line.bold ? 'F2' : 'F1';
      commands.push(`BT /${fontRef} ${line.size} Tf ${color} rg 48 ${y} Td (${escapePdf(line.text)}) Tj ET`);
      y -= line.size + 6;
    }
    const stream = commands.join('\n');
    objects[contentNumber] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageNumber] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`;
  });
  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let index = 1; index < objects.length; index++) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < objects.length; index++) pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// DOCX export — dependency-free.
// A .docx file is a ZIP container holding WordprocessingML XML parts. We build
// the XML parts and pack them into a minimal ZIP with stored (uncompressed)
// entries, which Word, Google Docs, and LibreOffice all accept.
// ---------------------------------------------------------------------------

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildZip(entries: Array<{ name: string; data: Uint8Array }>): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const checksum = crc32(entry.data);

    const localHeader = new DataView(new ArrayBuffer(30));
    localHeader.setUint32(0, 0x04034b50, true); // local file header signature
    localHeader.setUint16(4, 20, true); // version needed
    localHeader.setUint16(6, 0x0800, true); // flags: UTF-8 names
    localHeader.setUint16(8, 0, true); // method: stored
    localHeader.setUint16(10, 0, true); // mod time
    localHeader.setUint16(12, 0x21, true); // mod date (1980-01-01)
    localHeader.setUint32(14, checksum, true);
    localHeader.setUint32(18, entry.data.byteLength, true); // compressed size
    localHeader.setUint32(22, entry.data.byteLength, true); // uncompressed size
    localHeader.setUint16(26, nameBytes.byteLength, true);
    localHeader.setUint16(28, 0, true); // extra field length

    chunks.push(new Uint8Array(localHeader.buffer), nameBytes, entry.data);

    const centralHeader = new DataView(new ArrayBuffer(46));
    centralHeader.setUint32(0, 0x02014b50, true); // central directory signature
    centralHeader.setUint16(4, 20, true); // version made by
    centralHeader.setUint16(6, 20, true); // version needed
    centralHeader.setUint16(8, 0x0800, true); // flags: UTF-8 names
    centralHeader.setUint16(10, 0, true); // method: stored
    centralHeader.setUint16(12, 0, true); // mod time
    centralHeader.setUint16(14, 0x21, true); // mod date
    centralHeader.setUint32(16, checksum, true);
    centralHeader.setUint32(20, entry.data.byteLength, true);
    centralHeader.setUint32(24, entry.data.byteLength, true);
    centralHeader.setUint16(28, nameBytes.byteLength, true);
    centralHeader.setUint16(30, 0, true); // extra length
    centralHeader.setUint16(32, 0, true); // comment length
    centralHeader.setUint16(34, 0, true); // disk number
    centralHeader.setUint16(36, 0, true); // internal attrs
    centralHeader.setUint32(38, 0, true); // external attrs
    centralHeader.setUint32(42, offset, true); // local header offset

    centralDirectory.push(new Uint8Array(centralHeader.buffer), nameBytes);
    offset += 30 + nameBytes.byteLength + entry.data.byteLength;
  }

  const centralSize = centralDirectory.reduce((sum, part) => sum + part.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // end of central directory signature
  end.setUint16(4, 0, true); // disk number
  end.setUint16(6, 0, true); // disk with central directory
  end.setUint16(8, entries.length, true); // entries on this disk
  end.setUint16(10, entries.length, true); // total entries
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true); // central directory offset
  end.setUint16(20, 0, true); // comment length

  const totalSize = chunks.reduce((sum, part) => sum + part.byteLength, 0)
    + centralSize + 22;
  const output = new Uint8Array(totalSize);
  let position = 0;
  for (const part of [...chunks, ...centralDirectory, new Uint8Array(end.buffer)]) {
    output.set(part, position);
    position += part.byteLength;
  }
  return new Blob([output], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

function buildDocx(data: ResumeData, accent = DEFAULT_ACCENT): Blob {
  const encoder = new TextEncoder();

  // Simple WordprocessingML writer: paragraphs with runs.
  const paragraphs: string[] = [];
  const para = (text: string, options: { bold?: boolean; size?: number; color?: string; align?: 'center' | 'left'; spacing?: number } = {}) => {
    const size = options.size ?? 22; // half-points, default 11pt
    const properties = [
      options.align === 'center' ? '<w:jc w:val="center"/>' : '',
      options.spacing !== undefined ? `<w:spacing w:before="${options.spacing}" w:after="${Math.max(options.spacing - 40, 0)}"/>` : '',
    ].join('');
    const runProperties = [
      options.bold ? '<w:b/>' : '',
      options.color ? `<w:color w:val="${options.color.replace('#', '')}"/>` : '',
      `<w:sz w:val="${size}"/>`,
    ].join('');
    paragraphs.push(`<w:p><w:pPr>${properties}</w:pPr><w:r><w:rPr>${runProperties}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`);
  };
  const section = (title: string) => para(title.toUpperCase(), { bold: true, size: 24, color: accent, spacing: 240 });
  const bullet = (text: string) => para(`•  ${text}`, { size: 22, spacing: 40 });

  para(data.name || 'Your Name', { bold: true, size: 48, color: accent, align: 'center' });
  para(data.title || 'Professional Title', { size: 26, align: 'center' });
  const contact = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join('  •  ');
  if (contact) para(contact, { size: 20, align: 'center' });
  paragraphs.push('<w:p/>');

  if (data.summary) {
    section('Profile');
    para(data.summary, { size: 22 });
    paragraphs.push('<w:p/>');
  }

  if (data.experience.length) {
    section('Experience');
    for (const item of data.experience) {
      para(`${item.role || 'Role'}${item.company ? `  ·  ${item.company}` : ''}`, { bold: true, size: 24, spacing: 160 });
      if (item.dates) para(item.dates, { size: 20 });
      for (const bulletText of item.bullets.filter(Boolean)) bullet(bulletText);
      paragraphs.push('<w:p/>');
    }
  }

  if (data.education.length) {
    section('Education');
    for (const item of data.education) {
      para(`${item.degree || 'Degree'}${item.school ? `  ·  ${item.school}` : ''}`, { bold: true, size: 22, spacing: 160 });
      if (item.dates) para(item.dates, { size: 20 });
      if (item.details) para(item.details, { size: 20 });
    }
    paragraphs.push('<w:p/>');
  }

  if (data.skills.length) {
    section('Skills');
    para(data.skills.join('  •  '), { size: 22 });
    paragraphs.push('<w:p/>');
  }

  const extras = [
    ...data.projects.map(project => `${project.name}${project.description ? ` — ${project.description}` : ''}`),
    ...data.certifications.map(certification => `${certification.name}${certification.issuer ? ` · ${certification.issuer}` : ''}`),
    ...data.languages.map(language => `${language.name}${language.proficiency ? ` · ${language.proficiency}` : ''}`),
  ];
  if (extras.length) {
    section('Additional Information');
    for (const extra of extras) para(extra, { size: 20 });
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${paragraphs.join('')}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr>
</w:body>
</w:document>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
</w:styles>`;

  return buildZip([
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rels) },
    { name: 'word/document.xml', data: encoder.encode(documentXml) },
    { name: 'word/_rels/document.xml.rels', data: encoder.encode(documentRels) },
    { name: 'word/styles.xml', data: encoder.encode(styles) },
  ]);
}

async function svgToImageBlob(svg: string, format: 'png' | 'jpg') {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.src = svgUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The resume image could not be rendered.'));
    });
    const canvas = document.createElement('canvas');
    const width = PAGE_WIDTH;
    const height = Math.ceil(image.height || 1500);
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas export is unavailable in this browser.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('The resume image could not be downloaded.')), format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function downloadResumeFile(data: ResumeData, format: 'pdf' | 'png' | 'jpg' | 'docx', accent = DEFAULT_ACCENT) {
  const filename = `${(data.name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format}`;
  
  if (format === 'pdf' || format === 'docx') {
    let htmlTemplate = undefined;
    if (format === 'pdf') {
      const svg = buildResumeSvg(data, accent);
      htmlTemplate = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:0;}body{margin:0;padding:0;}</style></head><body>${svg}</body></html>`;
    }

    const response = await customFetch('/api/workspace/resumes/export', {
      method: 'POST',
      body: JSON.stringify({
        format,
        resumeData: data,
        htmlTemplate
      }),
      responseType: 'blob'
    });
    
    downloadBlob(response as Blob, filename);
    return;
  }

  const blob = await svgToImageBlob(buildResumeSvg(data, accent), format);
  downloadBlob(blob, filename);
}