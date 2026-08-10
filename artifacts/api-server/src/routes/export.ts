import { Router } from "express";
import { requireAuth, getUserId } from "../middlewares/auth.js";
import { generateDocx, generatePdf } from "../lib/exportEngine.js";
import { z } from "zod";

const router = Router();

const ExportResumeBody = z.object({
  format: z.enum(["pdf", "docx"]),
  resumeData: z.any(), // Since ResumeDataSchema is not strictly exported, we'll validate later
  htmlTemplate: z.string().optional()
});

router.post("/workspace/resumes/export", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getUserId(req);
  if (!clerkUserId) return;

  const parsed = ExportResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  try {
    const { format, resumeData, htmlTemplate } = parsed.data;
    
    if (format === "docx") {
      const buffer = await generateDocx(resumeData);
      res.setHeader('Content-Disposition', 'attachment; filename="resume.docx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.send(buffer);
    } else if (format === "pdf") {
      if (!htmlTemplate) {
         res.status(400).json({ error: "htmlTemplate is required for PDF export." });
         return;
      }
      const buffer = await generatePdf(resumeData, htmlTemplate);
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to export resume." });
  }
});

export { router as exportRouter };
