import { Document, Paragraph, TextRun, Packer, AlignmentType, HeadingLevel } from 'docx';
import puppeteer from 'puppeteer';

export async function generateDocx(data: any): Promise<Buffer> {
  const children = [];

  // Helper for paragraphs
  const p = (text: string, opts: { bold?: boolean, size?: number, color?: string, alignment?: any, heading?: any } = {}) => {
    return new Paragraph({
      alignment: opts.alignment,
      heading: opts.heading,
      children: [
        new TextRun({
          text,
          bold: opts.bold,
          size: opts.size ? opts.size * 2 : 22,
          color: opts.color,
        })
      ],
      spacing: { after: 120 },
    });
  };

  const section = (title: string) => {
    children.push(p(title.toUpperCase(), { bold: true, size: 14, color: "0F766E", heading: HeadingLevel.HEADING_1 }));
  };

  children.push(p(data.name || 'Your Name', { bold: true, size: 24, color: "0F766E", alignment: AlignmentType.CENTER }));
  children.push(p(data.title || 'Professional Title', { size: 13, alignment: AlignmentType.CENTER }));
  
  const contact = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join('  •  ');
  if (contact) children.push(p(contact, { size: 10, alignment: AlignmentType.CENTER }));
  
  children.push(new Paragraph({ spacing: { after: 200 } }));

  if (data.summary) {
    section('Profile');
    children.push(p(data.summary, { size: 11 }));
  }

  if (data.experience && data.experience.length > 0) {
    section('Experience');
    for (const exp of data.experience) {
      children.push(p(`${exp.role || 'Role'}${exp.company ? `  ·  ${exp.company}` : ''}`, { bold: true, size: 12 }));
      if (exp.dates) children.push(p(exp.dates, { size: 10, color: "666666" }));
      for (const bullet of exp.bullets || []) {
        if (!bullet) continue;
        children.push(new Paragraph({
          children: [new TextRun({ text: bullet, size: 22 })],
          bullet: { level: 0 },
        }));
      }
      children.push(new Paragraph({ spacing: { after: 120 } }));
    }
  }

  if (data.education && data.education.length > 0) {
    section('Education');
    for (const edu of data.education) {
      children.push(p(`${edu.degree || 'Degree'}${edu.school ? `  ·  ${edu.school}` : ''}`, { bold: true, size: 11 }));
      if (edu.dates) children.push(p(edu.dates, { size: 10, color: "666666" }));
      if (edu.details) children.push(p(edu.details, { size: 10 }));
    }
  }

  if (data.skills && data.skills.length > 0) {
    section('Skills');
    children.push(p(data.skills.join('  •  '), { size: 11 }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  return await Packer.toBuffer(doc);
}

export async function generatePdf(data: any, htmlTemplate: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: 'load' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return Buffer.from(pdfBuffer);
}
