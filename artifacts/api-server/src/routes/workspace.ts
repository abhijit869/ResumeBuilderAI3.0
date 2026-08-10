import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import busboy from "busboy";
import {
  AnalyzeWorkspaceJobBody,
  GenerateWorkspaceResumeBody,
  GetWorkspaceProfileResponse,
  ImportWorkspaceProfileBody,
  ImportWorkspaceProfileResponse,
  SaveWorkspaceProfileBody,
  SaveWorkspaceProfileResponse,
  AnalyzeWorkspaceJobResponse,
  GenerateWorkspaceResumeResponse,
  GetWorkspaceStateResponse,
} from "@workspace/api-zod";
import {
  compareProfileToJob,
  fetchPublicPage,
  generateResumeWithAgents,
  getJob,
  getSavedProfile,
  getLatestJob,
  getLatestResume,
  extractProfileWithAgents,
  analyzeJobWithAgents,
  saveJob,
  saveProfile,
  saveResume,
  normalizePublicUrl,
  validatePublicUrl,
  generateCoverLetterWithAgents,
  generateInterviewKitWithAgents,
  generateAuditWithAgents,
  generatePortfolioWithAgents
} from "../lib/workspace";
import { assertResumeFileSize, parseResumeFile } from "../lib/resumeFile";

const router: IRouter = Router();

import { requireAuth, getUserId } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";

export function getClerkUserIdFromRequest(req: any): string | null {
  try {
    return getUserId(req);
  } catch (err) {
    return null;
  }
}

router.get("/workspace/profile", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const record = await getSavedProfile(clerkUserId);
  if (!record) {
    res.json(null);
    return;
  }
  res.json(GetWorkspaceProfileResponse.parse(record));
});

router.get("/workspace/state", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const [profile, job, resume] = await Promise.all([
    getSavedProfile(clerkUserId),
    getLatestJob(clerkUserId),
    getLatestResume(clerkUserId),
  ]);
  res.json(GetWorkspaceStateResponse.parse({ profile: profile ?? null, job: job ?? null, resume: resume ?? null }));
});

router.post("/workspace/profile", requireAuth, validateBody(ImportWorkspaceProfileBody), async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const profileUrl = normalizePublicUrl(req.body.profileUrl);
  if (!validatePublicUrl(profileUrl)) {
    res.status(400).json({ error: "Enter a valid public http(s) profile URL." });
    return;
  }
  try {
    const page = await fetchPublicPage(profileUrl);
    if (/linkedin\.com/i.test(page.sourceUrl) && /authwall|sign in|join now|checkpoint/i.test(page.text)) {
      // User explicitly wants to skip OAuth; let the AI do its best with whatever public metadata was fetched.
    }
    const record = await saveProfile(clerkUserId, page.sourceUrl, await extractProfileWithAgents(page, req.body.model), "public-url");
    res.json(ImportWorkspaceProfileResponse.parse(record));
  } catch (error) {
    res.status(422).json({ error: error instanceof Error ? error.message : "Unable to import this profile URL." });
  }
});

router.put("/workspace/profile", requireAuth, validateBody(SaveWorkspaceProfileBody), async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!req.body.profile || typeof req.body.profile !== "object") {
    res.status(400).json({ error: "A profile object is required." });
    return;
  }
  const record = await saveProfile(
    clerkUserId,
    req.body.profileUrl || "manual://workspace",
    req.body.profile as Record<string, unknown>,
    "manual",
  );
  res.json(SaveWorkspaceProfileResponse.parse(record));
});

// The API contract (openapi.yaml) exposes "save manually edited profile" as
// PUT /workspace/state; the generated client calls that path. Keep both
// aliases working so old and new clients both succeed.
router.put("/workspace/state", requireAuth, validateBody(SaveWorkspaceProfileBody), async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!req.body.profile || typeof req.body.profile !== "object") {
    res.status(400).json({ error: "A profile object is required." });
    return;
  }
  const record = await saveProfile(
    clerkUserId,
    req.body.profileUrl || "manual://workspace",
    req.body.profile as Record<string, unknown>,
    "manual",
  );
  res.json(SaveWorkspaceProfileResponse.parse(record));
});

router.post("/workspace/resume-file", requireAuth, (req, res): void => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const chunks: Buffer[] = [];
  let filename = "";
  let contentType = "";
  let finished = false;

  const fail = (status: number, message: string) => {
    if (finished) return;
    finished = true;
    res.status(status).json({ error: message });
  };

  const bb = busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024, files: 1 } });
  
  let model: string | undefined;

  bb.on("field", (name, val) => {
    if (name === "model") model = val;
  });

  bb.on("file", (_fieldname, file, info) => {
    filename = info.filename || "";
    contentType = info.mimeType || "";
    file.on("data", (data: Buffer) => {
      if (finished) return;
      chunks.push(data);
      const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      if (total > 10 * 1024 * 1024) {
        fail(413, "The uploaded file is larger than 10 MB.");
        file.resume();
      }
    });
    file.on("error", () => fail(400, "The file upload was interrupted."));
  });

  bb.on("filesLimit", () => fail(400, "Only one file can be uploaded at a time."));

  bb.on("error", () => fail(400, "The file upload could not be read."));

  bb.on("close", () => {
    void (async () => {
      try {
        if (finished) return;
        const buffer = Buffer.concat(chunks);
        assertResumeFileSize(buffer.length);
        if (!filename) {
          fail(400, "Choose a resume file to upload.");
          return;
        }
        const { text } = await parseResumeFile(buffer, filename, contentType);
        const page = {
          title: filename.replace(/\.[^.]+$/, ""),
          description: text.slice(0, 300),
          text,
          sourceUrl: `file://${filename}`,
          fetchedAt: new Date().toISOString(),
        };
        const profile = await extractProfileWithAgents(page, model);
        const record = await saveProfile(clerkUserId, `file://${filename}`, profile, "resume-file");
        finished = true;
        res.json({ record, textPreview: text.slice(0, 600) });
      } catch (error) {
        fail(422, error instanceof Error ? error.message : "Unable to read this resume file.");
      }
    })();
  });

  req.pipe(bb);
});

router.post("/workspace/jobs/analyze", requireAuth, validateBody(AnalyzeWorkspaceJobBody), async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!req.body.jobUrl && !req.body.jobDescription?.trim()) {
    res.status(400).json({ error: "Provide a job URL or a job description." });
    return;
  }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  try {
    const page = req.body.jobUrl ? await fetchPublicPage(req.body.jobUrl) : null;
    const job = await analyzeJobWithAgents(page, req.body.jobDescription ?? undefined);
    const comparison = await compareProfileToJob(profile.profile as Record<string, unknown>, job);
    const record = await saveJob(clerkUserId, req.body.jobUrl ?? null, req.body.jobUrl ? "url" : "description", job, comparison);
    res.json(AnalyzeWorkspaceJobResponse.parse(record));
  } catch (error) {
    res.status(422).json({ error: error instanceof Error ? error.message : "Unable to analyze this job." });
  }
});

router.post("/workspace/resumes/generate", requireAuth, validateBody(GenerateWorkspaceResumeBody), async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  const job = await getJob(clerkUserId, req.body.jobAnalysisId);
  if (!job) {
    res.status(404).json({ error: "Job analysis not found." });
    return;
  }
  try {
    const resume = await generateResumeWithAgents(profile.profile as Record<string, unknown>, job.job as Record<string, unknown>, job.comparison as Record<string, unknown>, req.body.templateId, req.body.mode, req.body.model, clerkUserId, job.id);
    const record = await saveResume(clerkUserId, job.id, req.body.mode, req.body.templateId, resume);
    res.json(GenerateWorkspaceResumeResponse.parse(record));
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI resume generation is temporarily unavailable." });
  }
});

router.post("/workspace/resumes/portfolio", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  try {
    const data = await generatePortfolioWithAgents(profile.profile as Record<string, unknown>, req.body?.model);
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI generation is temporarily unavailable." });
  }
});

router.post("/workspace/resumes/cover-letter", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  const job = await getLatestJob(clerkUserId);
  try {
    const data = await generateCoverLetterWithAgents(profile.profile as Record<string, unknown>, job?.job as Record<string, unknown> || {}, req.body?.model);
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI generation is temporarily unavailable." });
  }
});

router.post("/workspace/resumes/interview-prep", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  const job = await getLatestJob(clerkUserId);
  try {
    const data = await generateInterviewKitWithAgents(profile.profile as Record<string, unknown>, job?.job as Record<string, unknown> || {}, req.body?.model);
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI generation is temporarily unavailable." });
  }
});

router.post("/workspace/resumes/audit", requireAuth, async (req, res): Promise<void> => {
  const clerkUserId = getClerkUserIdFromRequest(req);
  if (!clerkUserId) { res.status(401).json({ error: "Unauthorized" }); return; }
  let profile = await getSavedProfile(clerkUserId);
  if (!profile) {
    profile = await saveProfile(
      clerkUserId,
      "manual://workspace",
      { name: "", title: "", summary: "", experience: [], education: [], projects: [], certifications: [], languages: [], skills: [], contact: { email: "", phone: "", location: "", linkedin: "" } },
      "manual"
    );
  }
  const job = await getLatestJob(clerkUserId);
  try {
    const data = await generateAuditWithAgents(profile.profile as Record<string, unknown>, job?.job as Record<string, unknown> || {}, req.body?.model);
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI generation is temporarily unavailable." });
  }
});

export default router;