import type { ResumeData } from '@/store';

export type ResumeExportFormat = 'pdf' | 'png' | 'jpg';

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

export async function downloadResumeFile(data: ResumeData, format: ResumeExportFormat, accent = DEFAULT_ACCENT) {
  const filename = `${(data.name || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format}`;
  if (format === 'pdf') {
    downloadBlob(buildPdf(data, accent), filename);
    return;
  }
  const blob = await svgToImageBlob(buildResumeSvg(data, accent), format);
  downloadBlob(blob, filename);
}