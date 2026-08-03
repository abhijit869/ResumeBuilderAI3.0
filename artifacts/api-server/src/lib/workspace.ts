import { desc, eq } from "drizzle-orm";
import { db, workspaceProfilesTable, jobAnalysesTable, resumeVersionsTable } from "@workspace/db";
import { logger } from "./logger";

const OPENCODE_ZEN_MODELS = [
  "deepseek-v4-flash-free",
  "nemotron-3-ultra-free",
  "mimo-v2.5-free",
  "ling-3.0-flash-free",
] as const;
const AI_REQUEST_TIMEOUT_MS = 30_000;

function getOpenCodeZenUrl(): string {
  const configured = process.env.OPENCODEZEN_BASE_URL?.trim() || "https://opencode.ai/zen/v1";
  const normalized = configured.replace(/\/+$/, "");
  return normalized.endsWith("/chat/completions") ? normalized : `${normalized}/chat/completions`;
}

export type ExtractedPage = {
  title: string;
  description: string;
  text: string;
  sourceUrl: string;
  fetchedAt: string;
};

export function getWorkspaceKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length >= 8 && trimmed.length <= 128 ? trimmed : null;
}

export function validatePublicUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
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
    if (!response.ok) throw new Error(`The page returned HTTP ${response.status}.`);
    const html = await response.text();
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

export function compareProfileToJob(profile: Record<string, unknown>, job: Record<string, unknown>) {
  const profileText = JSON.stringify(profile).toLowerCase();
  const required = Array.isArray(job.requiredSkills) ? job.requiredSkills.filter((value): value is string => typeof value === "string") : [];
  const matchedSkills = required.filter(skill => profileText.includes(skill.toLowerCase()));
  const missingSkills = required.filter(skill => !matchedSkills.includes(skill));
  const matchScore = required.length ? Math.round((matchedSkills.length / required.length) * 100) : 0;
  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendations: missingSkills.map(skill => `Address ${skill} with a truthful project, metric, or learning signal before applying.`),
    evidence: matchedSkills.map(skill => ({ skill, foundInProfile: true })),
  };
}

async function callOpenCodeZenOnce(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.OPENCODEZEN_API_KEY;
  if (!apiKey) throw new Error("OPENCODEZEN_API_KEY is not configured.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(getOpenCodeZenUrl(), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 5000,
      }),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } } | null;
    if (!response.ok) throw new Error(body?.error?.message || `OpenCode Zen returned HTTP ${response.status}.`);
    const content = body?.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenCode Zen returned an empty response.");
    return content;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`OpenCode Zen timed out after ${AI_REQUEST_TIMEOUT_MS / 1000} seconds.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonObject(value: string): Record<string, unknown> {
  const candidate = value.match(/\{[\s\S]*\}/)?.[0];
  if (!candidate) throw new Error("AI returned an invalid structured response.");
  const parsed: unknown = JSON.parse(candidate);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("AI returned an invalid structured response.");
  return parsed as Record<string, unknown>;
}

async function callStructuredAgent(prompt: string, preferredModels: readonly string[] = OPENCODE_ZEN_MODELS): Promise<AgentOutput> {
  const failures: string[] = [];
  for (const model of preferredModels) {
    try {
      const content = await callOpenCodeZenOnce(prompt, model);
      return { data: parseJsonObject(content), model };
    } catch (error) {
      failures.push(`${model}: ${error instanceof Error ? error.message : "request failed"}`);
      logger.warn({ model }, "ResumeGPT AI agent failed; trying fallback");
    }
  }
  throw new Error(`All configured AI agents failed. ${failures.join(" | ")}`);
}

export async function extractProfileWithAgents(page: ExtractedPage): Promise<Record<string, unknown>> {
  const deterministic = profileFromPage(page);
  try {
    const result = await callStructuredAgent(
      `You are a profile extraction agent. Extract only facts explicitly present in this public page text. Never infer or invent dates, employers, metrics, contact details, or qualifications. Return one JSON object with exactly these keys: name, title, summary, contact, experience, education, certifications, projects, languages, skills, extractedKeywords. Use arrays for experience, education, certifications, projects, languages, and skills. Use objects with sensible fields for each array item. If a field is not present, return an empty array or empty string. Public source URL: ${page.sourceUrl}. Page title: ${page.title}. Page description: ${page.description}. Page text: ${page.text.slice(0, 50000)}`,
      ["mimo-v2.5-free", "ling-3.0-flash-free", "deepseek-v4-flash-free", "nemotron-3-ultra-free"],
    );
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
    const result = await callStructuredAgent(
      `You are a job analysis agent. Extract only facts present in the supplied job source. Do not invent a company, location, salary, requirements, or seniority. Return one JSON object with exactly these keys: title, company, location, seniority, summary, requiredSkills, preferredSkills, responsibilities, qualifications, benefits, extractedKeywords. Use arrays for all list fields. Source URL: ${page?.sourceUrl || "pasted description"}. Job source: ${sourceText.slice(0, 50000)}`,
      ["ling-3.0-flash-free", "nemotron-3-ultra-free", "mimo-v2.5-free", "deepseek-v4-flash-free"],
    );
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

export async function generateResumeWithAgents(profile: Record<string, unknown>, job: Record<string, unknown>, comparison: Record<string, unknown>, templateId: string, mode: string) {
  const evidence = JSON.stringify({ profile, job, comparison });
  const planner = await callStructuredAgent(`You are Agent 1, a senior recruiter and ATS strategist. Based only on the evidence below, create a truthful resume plan. Never invent employers, dates, metrics, or skills. Return JSON with keys: positioning, sectionOrder, keywordsToEmphasize, evidenceToUse, gapsToFlag. Template: ${templateId}. Mode: ${mode}. Evidence: ${evidence}`, ["deepseek-v4-flash-free", "nemotron-3-ultra-free", "mimo-v2.5-free", "ling-3.0-flash-free"]);
  const writer = await callStructuredAgent(`You are Agent 2, an expert resume writer. Using only the profile, job, comparison, and plan below, write a job-ready resume draft. Never fabricate facts; preserve uncertain items as reviewNotes. Return JSON with keys: name, headline, summary, experience, skills, education, certifications, projects, languages, contact, reviewNotes. Each experience item must retain profile evidence. Plan: ${JSON.stringify(planner.data)} Evidence: ${evidence}`, ["nemotron-3-ultra-free", "deepseek-v4-flash-free", "mimo-v2.5-free", "ling-3.0-flash-free"]);
  const editor = await callStructuredAgent(`You are Agent 3, an ATS quality editor. Review this draft against the job evidence. Improve clarity, keyword alignment, action language, and scanability without adding unsupported facts. Return JSON with keys: name, headline, summary, experience, skills, education, certifications, projects, languages, contact, atsNotes, reviewNotes. Draft: ${JSON.stringify(writer.data)} Job: ${JSON.stringify(job)} Comparison: ${JSON.stringify(comparison)}`, ["deepseek-v4-flash-free", "nemotron-3-ultra-free", "mimo-v2.5-free", "ling-3.0-flash-free"]);
  return {
    ...normalizeProfileData(editor.data),
    agentPlan: planner.data,
    agentWorkflow: [
      { role: "planner", model: planner.model, status: "complete" },
      { role: "writer", model: writer.model, status: "complete" },
      { role: "ats-reviewer", model: editor.model, status: "complete" },
    ],
    generatedBy: editor.model,
    generatedAt: new Date().toISOString(),
  };
}

export async function getSavedProfile(workspaceKey: string) {
  const [record] = await db.select().from(workspaceProfilesTable).where(eq(workspaceProfilesTable.workspaceKey, workspaceKey)).limit(1);
  return record;
}

export async function getLatestJob(workspaceKey: string) {
  const [record] = await db
    .select()
    .from(jobAnalysesTable)
    .where(eq(jobAnalysesTable.workspaceKey, workspaceKey))
    .orderBy(desc(jobAnalysesTable.analyzedAt), desc(jobAnalysesTable.id))
    .limit(1);
  return record;
}

export async function getLatestResume(workspaceKey: string) {
  const [record] = await db
    .select()
    .from(resumeVersionsTable)
    .where(eq(resumeVersionsTable.workspaceKey, workspaceKey))
    .orderBy(desc(resumeVersionsTable.createdAt), desc(resumeVersionsTable.id))
    .limit(1);
  return record;
}

export async function saveProfile(workspaceKey: string, profileUrl: string, profile: Record<string, unknown>) {
  const [record] = await db.insert(workspaceProfilesTable).values({ workspaceKey, profileUrl, source: "public-url", profile }).onConflictDoUpdate({
    target: workspaceProfilesTable.workspaceKey,
    set: { profileUrl, profile, fetchedAt: new Date(), updatedAt: new Date() },
  }).returning();
  return record;
}

export async function saveJob(workspaceKey: string, jobUrl: string | null, source: string, job: Record<string, unknown>, comparison: Record<string, unknown>) {
  const [record] = await db.insert(jobAnalysesTable).values({ workspaceKey, jobUrl, source, job, comparison }).returning();
  return record;
}

export async function getJob(workspaceKey: string, id: number) {
  const [record] = await db.select().from(jobAnalysesTable).where(eq(jobAnalysesTable.id, id)).limit(1);
  return record?.workspaceKey === workspaceKey ? record : undefined;
}

export async function saveResume(workspaceKey: string, jobAnalysisId: number, mode: string, templateId: string, resume: Record<string, unknown>) {
  const [record] = await db.insert(resumeVersionsTable).values({ workspaceKey, jobAnalysisId, mode, templateId, resume }).returning();
  return record;
}