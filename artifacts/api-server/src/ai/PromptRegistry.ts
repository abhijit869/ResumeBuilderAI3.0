export class PromptRegistry {
  static getProfileExtractionPrompt(pageTitle: string, pageDescription: string, pageText: string, sourceUrl: string): string {
    return `You are a profile extraction agent. Extract only facts explicitly present in this public page text. Never infer or invent dates, employers, metrics, contact details, or qualifications. Return one JSON object with exactly these keys: name, title, summary, contact, experience, education, certifications, projects, languages, skills, extractedKeywords. Use arrays for experience, education, certifications, projects, languages, and skills. Use objects with sensible fields for each array item. If a field is not present, return an empty array or empty string. Public source URL: ${sourceUrl}. Page title: ${pageTitle}. Page description: ${pageDescription}. Page text: ${pageText.slice(0, 50000)}`;
  }

  static getJobAnalysisPrompt(sourceText: string, sourceUrl: string): string {
    return `You are a job analysis agent. Extract only facts present in the supplied job source. Do not invent a company, location, salary, requirements, or seniority. Return one JSON object with exactly these keys: title, company, location, seniority, summary, requiredSkills, preferredSkills, responsibilities, qualifications, benefits, extractedKeywords. Use arrays for all list fields. Source URL: ${sourceUrl}. Job source: ${sourceText.slice(0, 50000)}`;
  }

  static getResumePlannerPrompt(templateId: string, mode: string, evidence: string): string {
    return `You are Agent 1, a senior recruiter and ATS strategist. Based only on the evidence below, create a truthful resume plan. Never invent employers, dates, metrics, or skills. Return JSON with keys: positioning, sectionOrder, keywordsToEmphasize, evidenceToUse, gapsToFlag. Template: ${templateId}. Mode: ${mode}. Evidence: ${evidence}`;
  }

  static getResumeWriterPrompt(evidence: string, plan: string): string {
    return `You are Agent 2, an expert resume writer. Using only the profile, job, comparison, and plan below, write a job-ready resume draft. Never fabricate facts; preserve uncertain items as reviewNotes. Return JSON with keys: name, headline, summary, experience, skills, education, certifications, projects, languages, contact, reviewNotes. Each experience item must retain profile evidence. Plan: ${plan} Evidence: ${evidence}`;
  }

  static getResumeEditorPrompt(draft: string, job: string, comparison: string): string {
    return `You are Agent 3, an ATS quality editor. Review this draft against the job evidence. Improve clarity, keyword alignment, action language, and scanability without adding unsupported facts. Return JSON with keys: name, headline, summary, experience, skills, education, certifications, projects, languages, contact, atsNotes, reviewNotes. Draft: ${draft} Job: ${job} Comparison: ${comparison}`;
  }
  
  static getCoverLetterPrompt(evidence: string): string {
    return `You are Agent 7, an expert cover letter writer. Using the profile and job evidence below, write a highly personalized, compelling cover letter. Return JSON with keys: content (a single string with newlines), strengthsHighlighted, tone. Evidence: ${evidence}`;
  }
  
  static getInterviewKitPrompt(evidence: string): string {
    return `You are Agent 9, a technical and behavioral interview coach. Based on the profile and target job below, generate a personalized interview prep kit. Return JSON with keys: questions (array of specific questions they are likely to be asked), talkingPoints (array of specific evidence points they should mention), checklist (array of preparation steps). Evidence: ${evidence}`;
  }
  
  static getAuditPrompt(evidence: string): string {
    return `You are Agent 2, a Senior ATS Expert. Audit the provided resume against the target job. Return JSON with keys: score (0-100 number), completeness (0-100 number), keywordAlignment (0-100 number), evidenceStrength (0-100 number), strengths (array of strings), improvements (array of actionable feedback strings), keywords (array of keywords found). Evidence: ${evidence}`;
  }

  static getPortfolioPrompt(evidence: string): string {
    return `You are an expert web developer and designer. Using the profile information provided below, generate a complete, responsive HTML portfolio page using standard Tailwind CSS classes. Do not use external CSS files, only Tailwind utility classes. Use inline SVG for icons. Return JSON with key: htmlTemplate. Evidence: ${evidence}`;
  }
}
