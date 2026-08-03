import { Router, type IRouter } from "express";
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
} from "@workspace/api-zod";
import {
  compareProfileToJob,
  fetchPublicPage,
  generateResumeWithAgents,
  getJob,
  getSavedProfile,
  getWorkspaceKey,
  extractProfileWithAgents,
  analyzeJobWithAgents,
  saveJob,
  saveProfile,
  saveResume,
  validatePublicUrl,
} from "../lib/workspace";

const router: IRouter = Router();

function workspaceKeyFromRequest(req: { headers: Record<string, string | string[] | undefined> }, res: { status: (code: number) => { json: (value: unknown) => void } }): string | null {
  const value = req.headers["x-workspace-key"];
  const key = getWorkspaceKey(Array.isArray(value) ? value[0] : value);
  if (!key) {
    res.status(400).json({ error: "A valid x-workspace-key header is required." });
    return null;
  }
  return key;
}

router.get("/workspace/profile", async (req, res): Promise<void> => {
  const workspaceKey = workspaceKeyFromRequest(req, res);
  if (!workspaceKey) return;
  const record = await getSavedProfile(workspaceKey);
  if (!record) {
    res.json(null);
    return;
  }
  res.json(GetWorkspaceProfileResponse.parse(record));
});

router.post("/workspace/profile", async (req, res): Promise<void> => {
  const workspaceKey = workspaceKeyFromRequest(req, res);
  if (!workspaceKey) return;
  const parsed = ImportWorkspaceProfileBody.safeParse(req.body);
  if (!parsed.success || !validatePublicUrl(parsed.data.profileUrl)) {
    res.status(400).json({ error: "Enter a valid public http(s) profile URL." });
    return;
  }
  try {
    const page = await fetchPublicPage(parsed.data.profileUrl);
    if (/linkedin\.com/i.test(page.sourceUrl) && /authwall|sign in|join now|checkpoint/i.test(page.text)) {
      res.status(422).json({ error: "LinkedIn requires authorization for this profile. Use an authorized export or a public profile page that is readable without sign-in." });
      return;
    }
    const record = await saveProfile(workspaceKey, page.sourceUrl, await extractProfileWithAgents(page));
    res.json(ImportWorkspaceProfileResponse.parse(record));
  } catch (error) {
    res.status(422).json({ error: error instanceof Error ? error.message : "Unable to import this profile URL." });
  }
});

router.put("/workspace/profile", async (req, res): Promise<void> => {
  const workspaceKey = workspaceKeyFromRequest(req, res);
  if (!workspaceKey) return;
  const parsed = SaveWorkspaceProfileBody.safeParse(req.body);
  if (!parsed.success || !parsed.data.profile || typeof parsed.data.profile !== "object") {
    res.status(400).json({ error: "A profile object is required." });
    return;
  }
  const record = await saveProfile(
    workspaceKey,
    parsed.data.profileUrl || "manual://workspace",
    parsed.data.profile as Record<string, unknown>,
  );
  res.json(SaveWorkspaceProfileResponse.parse(record));
});

router.post("/workspace/jobs/analyze", async (req, res): Promise<void> => {
  const workspaceKey = workspaceKeyFromRequest(req, res);
  if (!workspaceKey) return;
  const parsed = AnalyzeWorkspaceJobBody.safeParse(req.body);
  if (!parsed.success || (!parsed.data.jobUrl && !parsed.data.jobDescription?.trim())) {
    res.status(400).json({ error: "Provide a job URL or a job description." });
    return;
  }
  const profile = await getSavedProfile(workspaceKey);
  if (!profile) {
    res.status(404).json({ error: "Import and save your profile before analyzing a job." });
    return;
  }
  try {
    const page = parsed.data.jobUrl ? await fetchPublicPage(parsed.data.jobUrl) : null;
    const job = await analyzeJobWithAgents(page, parsed.data.jobDescription ?? undefined);
    const comparison = compareProfileToJob(profile.profile as Record<string, unknown>, job);
    const record = await saveJob(workspaceKey, parsed.data.jobUrl ?? null, parsed.data.jobUrl ? "url" : "description", job, comparison);
    res.json(AnalyzeWorkspaceJobResponse.parse(record));
  } catch (error) {
    res.status(422).json({ error: error instanceof Error ? error.message : "Unable to analyze this job." });
  }
});

router.post("/workspace/resumes/generate", async (req, res): Promise<void> => {
  const workspaceKey = workspaceKeyFromRequest(req, res);
  if (!workspaceKey) return;
  const parsed = GenerateWorkspaceResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const profile = await getSavedProfile(workspaceKey);
  const job = await getJob(workspaceKey, parsed.data.jobAnalysisId);
  if (!profile || !job) {
    res.status(404).json({ error: "Saved profile or job analysis not found." });
    return;
  }
  try {
    const resume = await generateResumeWithAgents(profile.profile as Record<string, unknown>, job.job as Record<string, unknown>, job.comparison as Record<string, unknown>, parsed.data.templateId, parsed.data.mode);
    const record = await saveResume(workspaceKey, job.id, parsed.data.mode, parsed.data.templateId, resume);
    res.json(GenerateWorkspaceResumeResponse.parse(record));
  } catch (error) {
    res.status(503).json({ error: error instanceof Error ? error.message : "AI resume generation is temporarily unavailable." });
  }
});

export default router;