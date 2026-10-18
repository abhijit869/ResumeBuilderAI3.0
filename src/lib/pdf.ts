"use client";

import { ResumeData } from "@/types/resume";

function pdfFileName(name: string) {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "document"}.pdf`;
}

/** Create a paginated A4 PDF from an editor preview entirely in the browser. */
export async function downloadElementAsPdf(element: HTMLElement, documentName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;

  element.style.transform = "none";
  element.style.transition = "none";

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      logging: false,
      scale: 2,
      useCORS: true,
      windowHeight: element.scrollHeight,
      windowWidth: element.scrollWidth,
    });

    const pdf = new jsPDF({
      compress: true,
      format: "a4",
      orientation: "portrait",
      unit: "pt",
    });
    const margin = 28;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;
    const pixelsPerPage = Math.max(1, Math.floor((contentHeight / contentWidth) * canvas.width));

    for (let offset = 0; offset < canvas.height; offset += pixelsPerPage) {
      const sourceHeight = Math.min(pixelsPerPage, canvas.height - offset);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;

      const context = pageCanvas.getContext("2d");
      if (!context) throw new Error("Unable to prepare the PDF page.");

      context.drawImage(
        canvas,
        0,
        offset,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      if (offset > 0) pdf.addPage();

      const renderedHeight = (sourceHeight / canvas.width) * contentWidth;
      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, renderedHeight, undefined, "FAST");
    }

    pdf.save(pdfFileName(documentName));
  } finally {
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
  }
}

/** Export a ResumeData object directly into a clean A4 PDF file */
export async function exportResumeToPdf(resume: ResumeData) {
  if (typeof window === "undefined") return;

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    format: "a4",
    unit: "pt",
  });

  const title = `${resume.personalInfo.firstName || "Resume"} ${resume.personalInfo.lastName || ""}`.trim() || resume.title;
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 40, 50);

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  const subtitle = [resume.personalInfo.title, resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
    .filter(Boolean)
    .join(" • ");
  doc.text(subtitle, 40, 70);

  let y = 100;
  if (resume.personalInfo.summary) {
    doc.setFontSize(13);
    doc.setTextColor(255, 94, 89);
    doc.text("Professional Summary", 40, y);
    y += 16;
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(resume.personalInfo.summary, 515);
    doc.text(splitSummary, 40, y);
    y += splitSummary.length * 13 + 15;
  }

  if (resume.workExperience && resume.workExperience.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(255, 94, 89);
    doc.text("Work Experience", 40, y);
    y += 18;
    for (const exp of resume.workExperience) {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`${exp.position} - ${exp.company}`, 40, y);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${exp.startDate} - ${exp.endDate || "Present"} | ${exp.location || ""}`, 400, y);
      y += 14;
      if (exp.description) {
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const splitDesc = doc.splitTextToSize(exp.description, 515);
        doc.text(splitDesc, 40, y);
        y += splitDesc.length * 12 + 6;
      }
      if (exp.highlights && exp.highlights.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        for (const hl of exp.highlights) {
          const splitHl = doc.splitTextToSize(`• ${hl}`, 500);
          doc.text(splitHl, 50, y);
          y += splitHl.length * 11 + 2;
        }
      }
      y += 10;
    }
  }

  if (resume.education && resume.education.length > 0) {
    if (y > 720) {
      doc.addPage();
      y = 50;
    }
    doc.setFontSize(13);
    doc.setTextColor(255, 94, 89);
    doc.text("Education", 40, y);
    y += 18;
    for (const edu of resume.education) {
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`${edu.degree} in ${edu.field || ""}`, 40, y);
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`, 40, y + 13);
      y += 28;
    }
  }

  if (resume.skills && resume.skills.length > 0) {
    if (y > 740) {
      doc.addPage();
      y = 50;
    }
    doc.setFontSize(13);
    doc.setTextColor(255, 94, 89);
    doc.text("Skills & Competencies", 40, y);
    y += 18;
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const skillList = resume.skills.map((s) => s.name).join(" • ");
    const splitSkills = doc.splitTextToSize(skillList, 515);
    doc.text(splitSkills, 40, y);
  }

  doc.save(pdfFileName(resume.title || "resume"));
}
