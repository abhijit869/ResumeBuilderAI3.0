import { logger } from "./logger";

// ---------------------------------------------------------------------------
// Resume file parsing: extracts plain text from an uploaded PDF or DOCX so the
// AI extraction agents can build a structured profile from it.
// ---------------------------------------------------------------------------

export type ResumeFileParseResult = {
  text: string;
  format: "pdf" | "docx" | "text";
};

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_TEXT_CHARS = 200_000;

export function assertResumeFileSize(size: number): void {
  if (size <= 0) throw new Error("The uploaded file is empty.");
  if (size > MAX_FILE_BYTES) throw new Error("The uploaded file is larger than 10 MB.");
}

// pdf.js (bundled by pdf-parse) references DOMMatrix when running in Node,
// where it is not a global. Provide a minimal 2D affine implementation
// covering the operations pdf.js uses during text extraction.
function installDomMatrixPolyfill(): void {
  if (typeof (globalThis as { DOMMatrix?: unknown }).DOMMatrix === "function") return;

  class DomMatrix2D {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    is2D = true;
    isIdentity = true;

    constructor(init?: string | number[] | DomMatrix2D) {
      if (typeof init === "string") {
        const match = init.match(/matrix\(([^)]+)\)/);
        if (match) {
          const values = match[1].split(/[\s,]+/).map(Number);
          if (values.length >= 6) {
            this.a = values[0]; this.b = values[1]; this.c = values[2];
            this.d = values[3]; this.e = values[4]; this.f = values[5];
          }
        }
      } else if (Array.isArray(init) && init.length >= 6) {
        this.a = init[0]; this.b = init[1]; this.c = init[2];
        this.d = init[3]; this.e = init[4]; this.f = init[5];
      } else if (init instanceof DomMatrix2D) {
        this.a = init.a; this.b = init.b; this.c = init.c;
        this.d = init.d; this.e = init.e; this.f = init.f;
      }
      this.isIdentity = this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
    }

    get m11() { return this.a; } get m12() { return this.b; }
    get m21() { return this.c; } get m22() { return this.d; }
    get m41() { return this.e; } get m42() { return this.f; }

    multiply(other: DomMatrix2D): DomMatrix2D {
      return new DomMatrix2D([
        this.a * other.a + this.c * other.b,
        this.b * other.a + this.d * other.b,
        this.a * other.c + this.c * other.d,
        this.b * other.c + this.d * other.d,
        this.a * other.e + this.c * other.f + this.e,
        this.b * other.e + this.d * other.f + this.f,
      ]);
    }

    translate(tx: number, ty = 0): DomMatrix2D {
      return new DomMatrix2D([this.a, this.b, this.c, this.d, this.e + tx, this.f + ty]);
    }

    scale(sx: number, sy = sx): DomMatrix2D {
      return new DomMatrix2D([this.a * sx, this.b * sx, this.c * sy, this.d * sy, this.e, this.f]);
    }

    rotate(angle: number): DomMatrix2D {
      const radians = (angle * Math.PI) / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      return new DomMatrix2D([
        this.a * cos + this.c * sin,
        this.b * cos + this.d * sin,
        this.c * cos - this.a * sin,
        this.d * cos - this.b * sin,
        this.e,
        this.f,
      ]);
    }

    inverse(): DomMatrix2D {
      const det = this.a * this.d - this.b * this.c;
      if (det === 0) return new DomMatrix2D();
      return new DomMatrix2D([
        this.d / det,
        -this.b / det,
        -this.c / det,
        this.a / det,
        (this.c * this.f - this.d * this.e) / det,
        (this.b * this.e - this.a * this.f) / det,
      ]);
    }

    transformPoint(point: { x: number; y: number }): { x: number; y: number } {
      return {
        x: this.a * point.x + this.c * point.y + this.e,
        y: this.b * point.x + this.d * point.y + this.f,
      };
    }

    static fromMatrix(other: DomMatrix2D): DomMatrix2D {
      return new DomMatrix2D([other.a, other.b, other.c, other.d, other.e, other.f]);
    }
  }

  (globalThis as Record<string, unknown>).DOMMatrix = DomMatrix2D;
}

function normalizeExtension(filename: string): string {
  const lower = filename.toLowerCase().trim();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".doc")) return "docx";
  if (lower.endsWith(".txt")) return "text";
  if (lower.endsWith(".md")) return "text";
  return "";
}

// Locate the pdf.js worker file shipped inside the pdf-parse package. Uses
// import.meta.resolve (Node 20.6+) so it works regardless of install layout.
async function resolvePdfWorkerPath(): Promise<string | null> {
  try {
    const resolved = await import.meta.resolve("pdf-parse");
    const url = new URL(resolved);
    if (url.protocol !== "file:") return null;
    const packageDir = url.pathname.replace(/\/dist\/.*$/, "");
    const candidates = [
      `${packageDir}/dist/pdf-parse/esm/pdf.worker.mjs`,
      `${packageDir}/dist/pdf-parse/web/pdf.worker.mjs`,
      `${packageDir}/dist/pdf-parse/cjs/pdf.worker.mjs`,
    ];
    for (const candidate of candidates) {
      try {
        const { statSync } = await import("node:fs");
        if (statSync(candidate).isFile()) return candidate;
      } catch {
        // try next candidate
      }
    }
  } catch {
    // fall through
  }
  return null;
}

async function parsePdf(buffer: Buffer): Promise<string> {
  // pdf.js (bundled inside pdf-parse) needs DOMMatrix in Node.
  installDomMatrixPolyfill();

  // Prefer the CJS entry: it resolves its own pdf.worker internally, so text
  // extraction works without configuring a worker path (which the ESM build
  // requires). Falls back to the ESM build with an explicit worker path.
  try {
    const { createRequire } = await import("node:module");
    const requireFromApiServer = createRequire(
      `${process.cwd()}/package.json`,
    );
    const pdfParseCjs = requireFromApiServer("pdf-parse") as {
      PDFParse?: new (options: { data: Buffer }) => {
        getText: () => Promise<{ text: string }>;
        destroy: () => void;
      };
    };
    if (pdfParseCjs?.PDFParse) {
      const parser = new pdfParseCjs.PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        return result.text ?? "";
      } finally {
        parser.destroy?.();
      }
    }
  } catch {
    // fall through to ESM path below
  }

  const pdfParseModule = (await import("pdf-parse")) as unknown as {
    PDFParse: new (options: { data: Buffer }) => {
      getText: () => Promise<{ text: string }>;
      destroy: () => void;
    } & {
      // Static side (accessed via the class object below).
    };
    setWorker?: (path: string) => void;
    default?: (data: Buffer) => Promise<{ text: string }>;
  };
  if (pdfParseModule.PDFParse) {
    // Point pdf.js at the worker bundled inside the installed package so it
    // does not try to resolve a relative "./pdf.worker.mjs" from the bundle.
    const PDFParseClass = pdfParseModule.PDFParse as typeof pdfParseModule.PDFParse & {
      setWorker?: (path: string) => void;
    };
    if (typeof PDFParseClass.setWorker === "function") {
      const workerPath = await resolvePdfWorkerPath();
      if (workerPath) PDFParseClass.setWorker(workerPath);
    }
    const parser = new PDFParseClass({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text ?? "";
    } finally {
      parser.destroy?.();
    }
  }
  const legacy = (
    typeof pdfParseModule === "function"
      ? pdfParseModule
      : pdfParseModule.default
  ) as ((data: Buffer) => Promise<{ text: string }>) | undefined;
  if (legacy) {
    const result = await legacy(buffer);
    return result.text ?? "";
  }
  throw new Error("The PDF reader is unavailable on this server.");
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  // Use convertToHtml instead of extractRawText to preserve structural
  // elements like paragraphs and headings, then strip the tags while
  // maintaining line breaks.
  const result = await mammoth.convertToHtml({ buffer });
  const html = result.value ?? "";
  
  // Basic HTML to text converter that preserves newlines for blocks
  const text = html
    .replace(/<\/p>|<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>|<\/th>/gi, " | ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
    
  return text;
}

export async function parseResumeFile(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<ResumeFileParseResult> {
  const extension = normalizeExtension(filename);
  const mime = contentType.toLowerCase();

  if (extension === "pdf" || mime === "application/pdf") {
    let text = await parsePdf(buffer);
    if (!text.trim() || text.trim().length < 50) {
      logger.info({ filename }, "PDF has no readable text. Falling back to OCR.");
      try {
        const tesseract = await import("tesseract.js");
        const pdfImgConvert = (await import("pdf-img-convert")).default || await import("pdf-img-convert");
        
        // Use any to bypass TS error if pdfImgConvert export is weird
        const convertFn = typeof pdfImgConvert.convert === "function" 
          ? pdfImgConvert.convert 
          : (pdfImgConvert as any);

        const images = await convertFn(buffer, { scale: 2.0 });
        let ocrText = "";
        for (const imageBuf of images) {
          const { data } = await tesseract.recognize(imageBuf as Buffer, "eng", { logger: () => {} });
          ocrText += data.text + "\n\n";
        }
        text = ocrText;
      } catch (err) {
        logger.error({ err, filename }, "OCR fallback failed");
        throw new Error("No readable text was found in this PDF, and OCR fallback failed. It may be a scanned image.");
      }
    }
    if (!text.trim()) throw new Error("No readable text was found in this PDF even after OCR.");
    return { text: text.slice(0, MAX_TEXT_CHARS), format: "pdf" };
  }

  if (extension === "docx" || mime.includes("wordprocessingml") || mime === "application/msword") {
    const text = await parseDocx(buffer);
    if (!text.trim()) throw new Error("No readable text was found in this document.");
    return { text: text.slice(0, MAX_TEXT_CHARS), format: "docx" };
  }

  if (extension === "text" || mime.startsWith("text/")) {
    return { text: buffer.toString("utf8").slice(0, MAX_TEXT_CHARS), format: "text" };
  }

  logger.warn({ filename, contentType }, "Unsupported resume file type");
  throw new Error("Unsupported file type. Upload a PDF (.pdf), Word document (.docx), or text file.");
}
