import { desc, eq } from "drizzle-orm";
import { db, workspaceProfilesTable, jobAnalysesTable, resumeVersionsTable, workflowRunsTable, workflowStepsTable } from "@workspace/db";
import { logger } from "./logger";
import { computeEmbeddings, cosineSimilarity } from "./semantic";

import { ModelRouter } from "../ai/ModelRouter";
import { PromptRegistry } from "../ai/PromptRegistry";

export type ExtractedPage = {
  title: string;
  description: string;
  text: string;
  sourceUrl: string;
  fetchedAt: string;
};

export function getClerkUserId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length >= 8 && trimmed.length <= 128 ? trimmed : null;
}

export function normalizePublicUrl(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function validatePublicUrl(value: string): URL | null {
  try {
    const url = new URL(normalizePublicUrl(value));
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    
    // Basic SSRF protection
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      /^127\.\d+\.\d+\.\d+$/.test(hostname) ||
      /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
      /^192\.168\.\d+\.\d+$/.test(hostname) ||
      /^169\.254\.\d+\.\d+$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname) ||
      hostname.includes("::") ||
      hostname.startsWith("fd") ||
      hostname.startsWith("fc") ||
      hostname.startsWith("fe80")
    ) {
      return null;
    }
    
    return url;
  } catch {
    return null;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ).slice(0, 60000);
}

function firstMatch(html: string, pattern: RegExp): string {
  return decodeEntities(html.match(pattern)?.[1]?.trim() ?? "");
}

function isLinkedInUrl(url: URL): boolean {
  return /(^|\.)linkedin\.com$/i.test(url.hostname);
}

function isLinkedInAuthorizationWall(value: string): boolean {
  return /authwall|checkpoint|login|sign[ -]?in|join now|member login/i.test(value);
}

export async function fetchPublicPage(sourceUrl: string): Promise<ExtractedPage> {
  const url = validatePublicUrl(sourceUrl);
  if (!url) throw new Error("Enter a valid public http(s) URL.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ResumeGPT/1.0 (public page reader)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await response.text();
    if (!response.ok) {
      if (isLinkedInUrl(url) && (response.status === 999 || isLinkedInAuthorizationWall(html))) {
        throw new Error("LinkedIn requires authorization for this profile. Sign in with LinkedIn or upload an authorized profile export.");
      }
      throw new Error(`The page returned HTTP ${response.status}.`);
    }
    if (html.length < 80) throw new Error("The page returned no readable content.");

    const text = cleanText(html);
    const title =
      firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) ||
      firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
      firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const description =
      firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) ||
      firstMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i);

    return {
      title: title.slice(0, 300),
      description: description.slice(0, 1200),
      text,
      sourceUrl: url.toString(),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read the page.";
    logger.warn({ sourceUrl, message }, "Public page fetch failed");
    if (message.includes("aborted")) throw new Error("The page took too long to respond.");
    if (/^LinkedIn requires authorization/i.test(message)) throw error;
    throw new Error(`Unable to read this public page: ${message}`);
  } finally {
    clearTimeout(timeout);
  }
}

function tokenWords(text: string): string[] {
  return Array.from(new Set(
    text
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{2,}/g)
      ?.filter(word => word.length > 2 && !/^(with|from|that|this|your|role|team|work|will|have|into|they|their|about|years|more|what|our|you|for|and|the)$/.test(word)) ?? [],
  ));
}

export function profileFromPage(page: ExtractedPage) {
  const text = `${page.title} ${page.description} ${page.text}`;
  const lower = text.toLowerCase();
  const skills = ["typescript", "javascript", "react", "python", "java", "figma", "design systems", "product strategy", "user research", "data analysis", "sql", "aws", "machine learning", "project management", "a/b testing", "figma variables", "node.js", "next.js", "docker", "kubernetes", "graphql", "excel", "tableau", "salesforce"]
    .filter(skill => lower.includes(skill));
  return {
    name: page.title.split("|")[0].trim().slice(0, 120),
    title: page.description.split(".")[0].slice(0, 160),
    summary: page.description || page.text.slice(0, 800),
    skills,
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
    contact: { email: "", phone: "", location: "", linkedin: page.sourceUrl },
    sourceUrl: page.sourceUrl,
    fetchedAt: page.fetchedAt,
    extractedKeywords: tokenWords(text).slice(0, 60),
    rawTextPreview: page.text.slice(0, 4000),
    extraction: { mode: "deterministic", source: "public-page", limitations: ["Only content exposed by the page was available."] },
  };
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function normalizeProfileData(value: Record<string, unknown>): Record<string, unknown> {
  const experience = Array.isArray(value.experience) ? value.experience.map((item, index) => {
    const entry = objectValue(item);
    const bullets = Array.isArray(entry.bullets)
      ? entry.bullets.map(textValue).filter(Boolean)
      : [textValue(entry.description) || textValue(entry.impact)].filter(Boolean);
    return {
      id: textValue(entry.id) || `imported-experience-${index + 1}`,
      role: textValue(entry.role) || textValue(entry.title),
      company: textValue(entry.company) || textValue(entry.organization),
      dates: textValue(entry.dates) || textValue(entry.period),
      bullets,
    };
  }) : [];
  const education = Array.isArray(value.education) ? value.education.map(item => {
    const entry = objectValue(item);
    return {
      school: textValue(entry.school) || textValue(entry.institution) || textValue(entry.organization),
      degree: textValue(entry.degree) || textValue(entry.program) || textValue(entry.title),
      dates: textValue(entry.dates) || textValue(entry.period),
      details: textValue(entry.details) || textValue(entry.description),
    };
  }) : [];
  const projects = Array.isArray(value.projects) ? value.projects.map(item => {
    const entry = objectValue(item);
    return {
      name: textValue(entry.name) || textValue(entry.title),
      description: textValue(entry.description) || textValue(entry.summary),
      technologies: Array.isArray(entry.technologies) ? entry.technologies.map(textValue).filter(Boolean) : [],
      link: textValue(entry.link) || textValue(entry.url),
    };
  }) : [];
  const certifications = Array.isArray(value.certifications) ? value.certifications.map(item => {
    const entry = objectValue(item);
    return {
      name: textValue(entry.name) || textValue(entry.title),
      issuer: textValue(entry.issuer) || textValue(entry.organization),
      date: textValue(entry.date) || textValue(entry.dates),
    };
  }) : [];
  const languages = Array.isArray(value.languages) ? value.languages.map(item => {
    if (typeof item === "string") return { name: item, proficiency: "" };
    const entry = objectValue(item);
    return { name: textValue(entry.name) || textValue(entry.language), proficiency: textValue(entry.proficiency) || textValue(entry.level) };
  }).filter(item => item.name) : [];
  const skills = Array.isArray(value.skills) ? value.skills.map(textValue).filter(Boolean) : [];
  return { ...value, experience, education, projects, certifications, languages, skills };
}

type AgentOutput = {
  data: Record<string, unknown>;
  model: string;
};

export function jobFromPage(page: ExtractedPage) {
  const text = `${page.title} ${page.description} ${page.text}`;
  const lower = text.toLowerCase();
  const knownSkills = ["typescript", "javascript", "react", "python", "java", "figma", "design systems", "product strategy", "user research", "data analysis", "sql", "aws", "machine learning", "project management", "a/b testing", "figma variables", "cross-functional collaboration", "roadmapping", "analytics"];
  const skills = knownSkills.filter(skill => lower.includes(skill));
  const company = page.sourceUrl ? new URL(page.sourceUrl).hostname.replace(/^www\./, "").split(".")[0] : "Target company";
  return {
    title: page.title || "Target role",
    company: company.charAt(0).toUpperCase() + company.slice(1),
    location: /remote/i.test(text) ? "Remote / hybrid" : "See job listing",
    seniority: /staff/i.test(text) ? "Staff" : /lead/i.test(text) ? "Lead" : /senior/i.test(text) ? "Senior" : "Not specified",
    summary: page.description || page.text.slice(0, 1200),
    requiredSkills: skills,
    extractedKeywords: tokenWords(text).slice(0, 80),
    rawTextPreview: page.text.slice(0, 6000),
    sourceUrl: page.sourceUrl,
    fetchedAt: page.fetchedAt,
  };
}

export function jobFromDescription(description: string) {
  const page: ExtractedPage = {
    title: "Pasted target role",
    description: description.slice(0, 1200),
    text: description,
    sourceUrl: "",
    fetchedAt: new Date().toISOString(),
  };
  return {
    ...jobFromPage(page),
    company: "Target company",
    sourceUrl: null,
  };
}

export async function compareProfileToJob(profile: Record<string, unknown>, job: Record<string, unknown>) {
  const required = Array.isArray(job.requiredSkills) ? job.requiredSkills.filter((value): value is string => typeof value === "string") : [];
  if (required.length === 0) {
    return { matchScore: 0, matchedSkills: [], missingSkills: [], recommendations: [], evidence: [] };
  }

  // Flatten profile into semantic chunks
  const profileChunks: string[] = [];
  if (Array.isArray(profile.skills)) profileChunks.push(...profile.skills.filter((s): s is string => typeof s === "string"));
  if (Array.isArray(profile.experience)) {
    profile.experience.forEach((exp: any) => {
      if (exp.role) profileChunks.push(exp.role);
      if (Array.isArray(exp.bullets)) profileChunks.push(...exp.bullets.filter((b: any) => typeof b === "string"));
    });
  }
  if (profileChunks.length === 0) profileChunks.push(JSON.stringify(profile));

  // Compute embeddings
  const requiredEmbeddings = await computeEmbeddings(required);
  const profileEmbeddings = await computeEmbeddings(profileChunks);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Match if exact OR semantic similarity > 0.65
  const profileText = JSON.stringify(profile).toLowerCase();
  
  for (let i = 0; i < required.length; i++) {
    const reqText = required[i].toLowerCase();
    let matched = profileText.includes(reqText);
    
    if (!matched && profileEmbeddings.length > 0) {
      const reqVec = requiredEmbeddings[i];
      for (const profVec of profileEmbeddings) {
        const score = cosineSimilarity(reqVec, profVec);
        if (score > 0.65) {
          matched = true;
          break;
        }
      }
    }

    if (matched) matchedSkills.push(required[i]);
    else missingSkills.push(required[i]);
  }

  const matchScore = Math.round((matchedSkills.length / required.length) * 100);
  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendations: missingSkills.map(skill => `Address ${skill} with a truthful project, metric, or learning signal before applying.`),
    evidence: matchedSkills.map(skill => ({ skill, foundInProfile: true })),
  };
}



export async function extractProfileWithAgents(page: ExtractedPage, model?: string): Promise<Record<string, unknown>> {
  const deterministic = profileFromPage(page);
  try {
    const prompt = PromptRegistry.getProfileExtractionPrompt(page.title, page.description, page.text, page.sourceUrl);
    const result = await ModelRouter.routeStructured(prompt, model);
    return normalizeProfileData({
      ...deterministic,
      ...result.data,
      contact: typeof result.data.contact === "object" && result.data.contact ? result.data.contact : deterministic.contact,
      sourceUrl: page.sourceUrl,
      fetchedAt: page.fetchedAt,
      extraction: { mode: "agent", model: result.model, source: "public-page", limitations: ["Only content exposed by the page was available."] },
    });
  } catch (error) {
    logger.warn({ sourceUrl: page.sourceUrl }, "Profile AI extraction unavailable; using deterministic extraction");
    return normalizeProfileData({
      ...deterministic,
      extraction: { mode: "deterministic", source: "public-page", limitations: ["AI extraction was unavailable.", "Only content exposed by the page was available."] },
    });
  }
}

export async function analyzeJobWithAgents(page: ExtractedPage | null, description?: string): Promise<Record<string, unknown>> {
  const deterministic = page ? jobFromPage(page) : jobFromDescription(description ?? "");
  const sourceText = page?.text ?? description ?? "";
  try {
    const prompt = PromptRegistry.getJobAnalysisPrompt(sourceText, page?.sourceUrl || "pasted description");
    const result = await ModelRouter.routeStructured(prompt);
    return {
      ...deterministic,
      ...result.data,
      requiredSkills: Array.isArray(result.data.requiredSkills) ? result.data.requiredSkills : deterministic.requiredSkills,
      sourceUrl: page?.sourceUrl || null,
      fetchedAt: page?.fetchedAt ?? deterministic.fetchedAt,
      extraction: { mode: "agent", model: result.model, source: page ? "public-page" : "description" },
    };
  } catch (error) {
    logger.warn({ sourceUrl: page?.sourceUrl || "description" }, "Job AI extraction unavailable; using deterministic extraction");
    return {
      ...deterministic,
      extraction: { mode: "deterministic", source: page ? "public-page" : "description", limitations: ["AI extraction was unavailable."] },
    };
  }
}

export async function generateResumeWithAgents(profile: Record<string, unknown>, job: Record<string, unknown>, comparison: Record<string, unknown>, templateId: string, mode: string, model?: string, clerkUserId?: string, jobAnalysisId?: number) {
  const evidence = JSON.stringify({ profile, job, comparison });
  let runId: number | null = null;
  let plannerData: any = null;
  let writerData: any = null;
  let editorData: any = null;
  let plannerModel = "", writerModel = "", editorModel = "";

  if (clerkUserId && jobAnalysisId) {
    try {
      const [run] = await db.insert(workflowRunsTable).values({ clerkUserId, jobAnalysisId, status: "in_progress", type: "resume_generation" }).returning();
      runId = run.id;
    } catch (e) {
      logger.error({ err: e }, "Failed to create workflow run");
    }
  }

  try {
    // Planner Step
    if (runId) await db.insert(workflowStepsTable).values({ workflowRunId: runId, stepName: "planner", status: "in_progress", startedAt: new Date() });
    const plannerPrompt = PromptRegistry.getResumePlannerPrompt(templateId, mode, evidence);
    const planner = await ModelRouter.routeStructured(plannerPrompt, model);
    plannerData = planner.data;
    plannerModel = planner.model;
    if (runId) await db.update(workflowStepsTable).set({ status: "completed", output: plannerData, completedAt: new Date() }).where(eq(workflowStepsTable.workflowRunId, runId));

    // Writer Step
    if (runId) await db.insert(workflowStepsTable).values({ workflowRunId: runId, stepName: "writer", status: "in_progress", startedAt: new Date() });
    const writerPrompt = PromptRegistry.getResumeWriterPrompt(evidence, JSON.stringify(plannerData));
    const writer = await ModelRouter.routeStructured(writerPrompt, model);
    writerData = writer.data;
    writerModel = writer.model;
    if (runId) await db.update(workflowStepsTable).set({ status: "completed", output: writerData, completedAt: new Date() }).where(eq(workflowStepsTable.workflowRunId, runId));

    // Editor Step
    if (runId) await db.insert(workflowStepsTable).values({ workflowRunId: runId, stepName: "editor", status: "in_progress", startedAt: new Date() });
    const editorPrompt = PromptRegistry.getResumeEditorPrompt(JSON.stringify(writerData), JSON.stringify(job), JSON.stringify(comparison));
    const editor = await ModelRouter.routeStructured(editorPrompt, model);
    editorData = editor.data;
    editorModel = editor.model;
    if (runId) await db.update(workflowStepsTable).set({ status: "completed", output: editorData, completedAt: new Date() }).where(eq(workflowStepsTable.workflowRunId, runId));
    if (runId) await db.update(workflowRunsTable).set({ status: "completed", result: editorData }).where(eq(workflowRunsTable.id, runId));
  } catch (error) {
    if (runId) await db.update(workflowRunsTable).set({ status: "failed" }).where(eq(workflowRunsTable.id, runId));
    throw error;
  }

  return {
    ...normalizeProfileData(editorData),
    agentPlan: plannerData,
    agentWorkflow: [
      { role: "planner", model: plannerModel, status: "complete" },
      { role: "writer", model: writerModel, status: "complete" },
      { role: "ats-reviewer", model: editorModel, status: "complete" },
    ],
    generatedBy: editorModel,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateCoverLetterWithAgents(profile: Record<string, unknown>, job: Record<string, unknown>, model?: string) {
  const evidence = JSON.stringify({ profile, job });
  const prompt = PromptRegistry.getCoverLetterPrompt(evidence);
  const writer = await ModelRouter.routeStructured(prompt, model);
  return {
    content: typeof writer.data.content === 'string' ? writer.data.content : "Dear Hiring Manager,\n\nPlease find my resume attached.",
    metadata: {
      strengthsHighlighted: Array.isArray(writer.data.strengthsHighlighted) ? writer.data.strengthsHighlighted : [],
      tone: typeof writer.data.tone === 'string' ? writer.data.tone : "professional",
      model: writer.model,
    }
  };
}

export async function generateInterviewKitWithAgents(profile: Record<string, unknown>, job: Record<string, unknown>, model?: string) {
  const evidence = JSON.stringify({ profile, job });
  const prompt = PromptRegistry.getInterviewKitPrompt(evidence);
  const coach = await ModelRouter.routeStructured(prompt, model);
  return {
    questions: Array.isArray(coach.data.questions) ? coach.data.questions : [],
    talkingPoints: Array.isArray(coach.data.talkingPoints) ? coach.data.talkingPoints : [],
    checklist: Array.isArray(coach.data.checklist) ? coach.data.checklist : [],
    model: coach.model,
  };
}

export async function generateAuditWithAgents(profile: Record<string, unknown>, job: Record<string, unknown>, model?: string) {
  const evidence = JSON.stringify({ profile, job });
  const prompt = PromptRegistry.getAuditPrompt(evidence);
  const auditor = await ModelRouter.routeStructured(prompt, model);
  return {
    score: typeof auditor.data.score === 'number' ? auditor.data.score : 0,
    completeness: typeof auditor.data.completeness === 'number' ? auditor.data.completeness : 0,
    keywordAlignment: typeof auditor.data.keywordAlignment === 'number' ? auditor.data.keywordAlignment : 0,
    evidenceStrength: typeof auditor.data.evidenceStrength === 'number' ? auditor.data.evidenceStrength : 0,
    strengths: Array.isArray(auditor.data.strengths) ? auditor.data.strengths : [],
    improvements: Array.isArray(auditor.data.improvements) ? auditor.data.improvements : [],
    keywords: Array.isArray(auditor.data.keywords) ? auditor.data.keywords : [],
    model: auditor.model,
  };
}

export async function generatePortfolioWithAgents(profile: Record<string, unknown>, model?: string) {
  const evidence = JSON.stringify({ profile });
  const prompt = PromptRegistry.getPortfolioPrompt(evidence);
  const designer = await ModelRouter.routeStructured(prompt, model);
  return {
    htmlTemplate: typeof designer.data.htmlTemplate === 'string' ? designer.data.htmlTemplate : "<div>Portfolio generation failed.</div>",
    model: designer.model,
  };
}

// In-memory fallback cache for offline development without live Postgres
const memoryProfiles = new Map<string, any>();
const memoryJobs = new Map<string, any[]>();
const memoryResumes = new Map<string, any[]>();

export async function getSavedProfile(clerkUserId: string) {
  try {
    const [record] = await db.select().from(workspaceProfilesTable).where(eq(workspaceProfilesTable.clerkUserId, clerkUserId)).limit(1);
    if (record) return record;
  } catch {
    // Database connection offline fallback
  }
  return memoryProfiles.get(clerkUserId) || null;
}

export async function getLatestJob(clerkUserId: string) {
  try {
    const [record] = await db
      .select()
      .from(jobAnalysesTable)
      .where(eq(jobAnalysesTable.clerkUserId, clerkUserId))
      .orderBy(desc(jobAnalysesTable.analyzedAt), desc(jobAnalysesTable.id))
      .limit(1);
    if (record) return record;
  } catch {
    // Database connection offline fallback
  }
  const jobs = memoryJobs.get(clerkUserId) || [];
  return jobs[jobs.length - 1] || null;
}

export async function getLatestResume(clerkUserId: string) {
  try {
    const [record] = await db
      .select()
      .from(resumeVersionsTable)
      .where(eq(resumeVersionsTable.clerkUserId, clerkUserId))
      .orderBy(desc(resumeVersionsTable.createdAt), desc(resumeVersionsTable.id))
      .limit(1);
    if (record) return record;
  } catch {
    // Database connection offline fallback
  }
  const resumes = memoryResumes.get(clerkUserId) || [];
  return resumes[resumes.length - 1] || null;
}

export async function saveProfile(clerkUserId: string, profileUrl: string, profile: Record<string, unknown>, source = "public-url") {
  const record = {
    id: Date.now(),
    clerkUserId,
    profileUrl,
    source,
    profile,
    fetchedAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const [dbRecord] = await db.insert(workspaceProfilesTable).values({ clerkUserId, profileUrl, source, profile }).onConflictDoUpdate({
      target: workspaceProfilesTable.clerkUserId,
      set: { profileUrl, source, profile, fetchedAt: new Date(), updatedAt: new Date() },
    }).returning();
    if (dbRecord) {
      memoryProfiles.set(clerkUserId, dbRecord);
      return dbRecord;
    }
  } catch {
    // Database connection offline fallback
  }
  memoryProfiles.set(clerkUserId, record);
  return record;
}

export async function saveJob(clerkUserId: string, jobUrl: string | null, source: string, job: Record<string, unknown>, comparison: Record<string, unknown>) {
  const record = {
    id: Date.now(),
    clerkUserId,
    jobUrl,
    source,
    job,
    comparison,
    analyzedAt: new Date(),
  };
  try {
    const [dbRecord] = await db.insert(jobAnalysesTable).values({ clerkUserId, jobUrl, source, job, comparison }).returning();
    if (dbRecord) {
      const existing = memoryJobs.get(clerkUserId) || [];
      existing.push(dbRecord);
      memoryJobs.set(clerkUserId, existing);
      return dbRecord;
    }
  } catch {
    // Database connection offline fallback
  }
  const existing = memoryJobs.get(clerkUserId) || [];
  existing.push(record);
  memoryJobs.set(clerkUserId, existing);
  return record;
}

export async function getJob(clerkUserId: string, id: number) {
  try {
    const [record] = await db.select().from(jobAnalysesTable).where(eq(jobAnalysesTable.id, id)).limit(1);
    if (record?.clerkUserId === clerkUserId) return record;
  } catch {
    // Database connection offline fallback
  }
  const jobs = memoryJobs.get(clerkUserId) || [];
  return jobs.find((j) => j.id === id || j.id === Number(id));
}

export async function saveResume(clerkUserId: string, jobAnalysisId: number, mode: string, templateId: string, resume: Record<string, unknown>) {
  const record = {
    id: Date.now(),
    clerkUserId,
    jobAnalysisId,
    mode,
    templateId,
    resume,
    createdAt: new Date(),
  };
  try {
    const [dbRecord] = await db.insert(resumeVersionsTable).values({ clerkUserId, jobAnalysisId, mode, templateId, resume }).returning();
    if (dbRecord) {
      const existing = memoryResumes.get(clerkUserId) || [];
      existing.push(dbRecord);
      memoryResumes.set(clerkUserId, existing);
      return dbRecord;
    }
  } catch {
    // Database connection offline fallback
  }
  const existing = memoryResumes.get(clerkUserId) || [];
  existing.push(record);
  memoryResumes.set(clerkUserId, existing);
  return record;
}