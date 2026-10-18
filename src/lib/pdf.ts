"use client";

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
