import {
  type ResumeDocument,
  THEME_COLORS,
  RESUME_TEMPLATES,
  DEFAULT_SECTION_ORDER,
} from './resume-engine.ts';

export interface PrintStyleDescriptor {
  pageSizeCss: 'A4' | 'letter';
  pageDimensionsLabel: string;
  documentTitle: string;
  filename: string;
  styleSheetCss: string;
  preservesBackgroundGraphics: boolean;
  preservesMultiColumnGrid: boolean;
}

/**
 * Generates a clean, filesystem-safe PDF filename for a resume document.
 */
export function getResumePdfFilename(resume: ResumeDocument): string {
  const rawName = resume.personalInfo.fullName || resume.title || 'resume';
  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'resume'}-${resume.templateId || 'cv'}.pdf`;
}

/**
 * Builds the print stylesheet configuration (@page + @media print rules)
 * to preserve template colors, typography, and multi-column grids during PDF export.
 */
export function buildPrintStyleDescriptor(
  resume: ResumeDocument
): PrintStyleDescriptor {
  const isLetter = resume.pageSize === 'LETTER';
  const pageSizeCss = isLetter ? 'letter' : 'A4';
  const pageDimensionsLabel = isLetter
    ? 'US Letter (8.5 × 11 in)'
    : 'ISO A4 (210 × 297 mm)';
  const tplMeta =
    RESUME_TEMPLATES.find((t) => t.id === resume.templateId) ||
    RESUME_TEMPLATES[0];
  const palette = THEME_COLORS[resume.themeColor] || THEME_COLORS.green;
  const filename = getResumePdfFilename(resume);
  const documentTitle = `${resume.personalInfo.fullName} — ${tplMeta.name} Resume`;

  const styleSheetCss = `
@media print {
  @page {
    size: ${pageSizeCss} portrait;
    margin: 0mm;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .no-print {
    display: none !important;
  }
  #dashboard-print-mount {
    display: block !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  #resume-print-canvas {
    width: 100% !important;
    max-width: none !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    --resume-accent-swatch: ${palette.swatch};
    --resume-header-bg: ${palette.headerBg};
  }
  .print-avoid-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}`.trim();

  return {
    pageSizeCss,
    pageDimensionsLabel,
    documentTitle,
    filename,
    styleSheetCss,
    preservesBackgroundGraphics: true,
    preservesMultiColumnGrid: true,
  };
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return [0.1, 0.2, 0.3];
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [
    Number(r.toFixed(3)),
    Number(g.toFixed(3)),
    Number(b.toFixed(3)),
  ];
}

function escapePdfText(input: string): string {
  return input
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch === '—' || ch === '–') return '-';
      if (ch === '·' || ch === '•') return '|';
      if (ch === '’' || ch === '‘') return "'";
      if (ch === '“' || ch === '”') return '"';
      return ' ';
    })
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapTextLines(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if ((current + ' ' + word).length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates a valid, selectable PDF 1.4 binary document mirroring the resume's
 * template layout family, theme colors, page dimensions (A4 / US Letter), and typography.
 */
export function generateSelectablePdfBytes(resume: ResumeDocument): Uint8Array {
  const isLetter = resume.pageSize === 'LETTER';
  const pageWidth = isLetter ? 612 : 595.28;
  const pageHeight = isLetter ? 792 : 841.89;
  const palette = THEME_COLORS[resume.themeColor] || THEME_COLORS.green;
  const tplMeta =
    RESUME_TEMPLATES.find((t) => t.id === resume.templateId) ||
    RESUME_TEMPLATES[0];

  const [hr, hg, hb] = hexToRgbNormalized(palette.headerBg);
  const [ar, ag, ab] = hexToRgbNormalized(palette.accentText);
  const [sr, sg, sb] = hexToRgbNormalized(palette.swatch);

  const ops: string[] = [];

  // Background header banner or sidebar styling to preserve visual identity
  if (tplMeta.layoutStyle === 'dark-sidebar') {
    ops.push(`0.06 0.09 0.16 rg 0 ${pageHeight - 135} ${pageWidth} 135 re f`);
    ops.push(`${sr} ${sg} ${sb} rg 0 ${pageHeight - 138} ${pageWidth} 3 re f`);
  } else if (
    tplMeta.layoutStyle === 'banner-two-col' ||
    tplMeta.layoutStyle === 'pill-grid'
  ) {
    ops.push(`${hr} ${hg} ${hb} rg 32 ${pageHeight - 142} ${pageWidth - 64} 112 re f`);
    ops.push(`${sr} ${sg} ${sb} rg 32 ${pageHeight - 144} ${pageWidth - 64} 2.5 re f`);
  } else {
    ops.push(`${sr} ${sg} ${sb} rg 40 ${pageHeight - 120} ${pageWidth - 80} 2 re f`);
  }

  let cursorY = pageHeight - 58;
  const leftMargin = 44;

  const isDarkHeader = tplMeta.layoutStyle === 'dark-sidebar';
  const titleColor = isDarkHeader ? '1 1 1 rg' : '0.06 0.09 0.16 rg';
  const subTitleColor = isDarkHeader
    ? `${sr} ${sg} ${sb} rg`
    : `${ar} ${ag} ${ab} rg`;
  const contactColor = isDarkHeader ? '0.82 0.86 0.92 rg' : '0.32 0.38 0.46 rg';

  // Candidate Full Name
  ops.push(
    `BT /F2 20 Tf ${titleColor} ${leftMargin} ${cursorY.toFixed(1)} Td (${escapePdfText(
      resume.personalInfo.fullName
    )}) Tj ET`
  );
  cursorY -= 18;

  // Candidate Job Title
  ops.push(
    `BT /F2 10.5 Tf ${subTitleColor} ${leftMargin} ${cursorY.toFixed(
      1
    )} Td (${escapePdfText(resume.personalInfo.jobTitle.toUpperCase())}) Tj ET`
  );
  cursorY -= 15;

  // Contact line
  const contactParts = [
    resume.personalInfo.location,
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.website,
  ].filter(Boolean);
  if (contactParts.length > 0) {
    ops.push(
      `BT /F1 8.5 Tf ${contactColor} ${leftMargin} ${cursorY.toFixed(
        1
      )} Td (${escapePdfText(contactParts.join('  |  '))}) Tj ET`
    );
    cursorY -= 26;
  }

  // Helper to add section heading
  const drawSectionHeading = (label: string) => {
    if (cursorY < 70) return;
    ops.push(
      `${sr} ${sg} ${sb} rg ${leftMargin} ${(cursorY - 3).toFixed(1)} ${
        pageWidth - leftMargin * 2
      } 1 re f`
    );
    ops.push(
      `BT /F2 9.5 Tf ${ar} ${ag} ${ab} rg ${leftMargin} ${(cursorY + 2).toFixed(
        1
      )} Td (${escapePdfText(label.toUpperCase())}) Tj ET`
    );
    cursorY -= 16;
  };

  // Helper to add body line
  const drawTextLine = (
    text: string,
    font: '/F1' | '/F2' = '/F1',
    size = 9,
    rgb = '0.15 0.20 0.28',
    indent = 0
  ) => {
    if (cursorY < 48) return;
    ops.push(
      `BT ${font} ${size} Tf ${rgb} rg ${leftMargin + indent} ${cursorY.toFixed(
        1
      )} Td (${escapePdfText(text)}) Tj ET`
    );
    cursorY -= size + 4;
  };

  // Executive Summary
  if (resume.personalInfo.summary) {
    drawSectionHeading('Executive Summary');
    const summaryLines = wrapTextLines(resume.personalInfo.summary, 92);
    for (const line of summaryLines) {
      drawTextLine(line, '/F1', 9, '0.18 0.23 0.31');
    }
    cursorY -= 6;
  }

  const orderedSections =
    resume.sectionOrder && resume.sectionOrder.length > 0
      ? resume.sectionOrder
      : DEFAULT_SECTION_ORDER;

  for (const secKey of orderedSections) {
    if (cursorY < 65) break;

    if (secKey === 'experience' && resume.experience.length > 0) {
      drawSectionHeading('Work Experience');
      for (const exp of resume.experience) {
        if (cursorY < 60) break;
        drawTextLine(
          `${exp.role}  —  ${exp.company} (${exp.period} | ${exp.location})`,
          '/F2',
          9.5,
          '0.06 0.09 0.16'
        );
        for (const bullet of exp.bullets) {
          const wrapped = wrapTextLines(`- ${bullet}`, 88);
          for (const bLine of wrapped) {
            drawTextLine(bLine, '/F1', 8.8, '0.20 0.25 0.33', 8);
          }
        }
        cursorY -= 4;
      }
    }

    if (secKey === 'education' && resume.education.length > 0) {
      drawSectionHeading('Education');
      for (const edu of resume.education) {
        if (cursorY < 55) break;
        drawTextLine(
          `${edu.degree}  —  ${edu.school} (${edu.period})`,
          '/F2',
          9.2,
          '0.06 0.09 0.16'
        );
        if (edu.details) {
          for (const dLine of wrapTextLines(edu.details, 90)) {
            drawTextLine(dLine, '/F1', 8.5, '0.28 0.33 0.41', 6);
          }
        }
        cursorY -= 3;
      }
    }

    if (secKey === 'skills' && resume.skills.length > 0) {
      drawSectionHeading('Core Technical & Professional Skills');
      const skillsSummary = resume.skills
        .map((s) => `${s.name} (${s.level}%)`)
        .join('  |  ');
      for (const sLine of wrapTextLines(skillsSummary, 90)) {
        drawTextLine(sLine, '/F1', 8.8, '0.15 0.20 0.28');
      }
      cursorY -= 4;
    }

    if (secKey === 'projects' && resume.projects && resume.projects.length > 0) {
      drawSectionHeading('Key Projects');
      for (const proj of resume.projects) {
        if (cursorY < 55) break;
        drawTextLine(
          `${proj.name} (${proj.role} | ${proj.period})`,
          '/F2',
          9,
          '0.06 0.09 0.16'
        );
        for (const pLine of wrapTextLines(proj.description, 90)) {
          drawTextLine(pLine, '/F1', 8.5, '0.22 0.27 0.35', 6);
        }
        cursorY -= 3;
      }
    }

    if (
      secKey === 'certifications' &&
      resume.certifications &&
      resume.certifications.length > 0
    ) {
      drawSectionHeading('Certifications');
      for (const cert of resume.certifications) {
        drawTextLine(`- ${cert}`, '/F1', 8.6, '0.18 0.23 0.31', 4);
      }
      cursorY -= 3;
    }
  }

  const contentStream = ops.join('\n');
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(contentStream);

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n`,
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(encoder.encode(pdf).length);
    pdf += obj;
  }

  const xrefStart = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return encoder.encode(pdf);
}
