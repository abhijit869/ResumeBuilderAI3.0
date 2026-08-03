import type { JobAnalysis, ResumeData } from '@/store';

const stopWords = new Set([
  'about', 'above', 'after', 'again', 'being', 'between', 'could', 'their', 'there',
  'these', 'those', 'through', 'using', 'where', 'which', 'while', 'with', 'your',
  'role', 'team', 'work', 'years', 'will', 'have', 'from', 'that', 'this', 'into',
]);

function clean(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export type LocalAtsAudit = {
  score: number;
  completeness: number;
  keywordAlignment: number;
  evidenceStrength: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
};

export function auditResumeLocally(profile: ResumeData, job: JobAnalysis | null): LocalAtsAudit {
  const required = job?.matchedSkills.concat(job.missingSkills) ?? [];
  const matched = job?.matchedSkills ?? [];
  const hasContact = Boolean(profile.contact.email || profile.contact.phone || profile.contact.location);
  const completenessChecks = [
    Boolean(profile.name),
    Boolean(profile.title),
    profile.summary.length >= 80,
    profile.experience.length > 0,
    profile.skills.length >= 5,
    hasContact,
    profile.education.length > 0 || profile.projects.length > 0,
  ];
  const completeness = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);
  const keywordAlignment = required.length ? Math.round((matched.length / required.length) * 100) : profile.skills.length ? 55 : 0;
  const bulletCount = profile.experience.reduce((total, item) => total + item.bullets.filter(Boolean).length, 0);
  const evidenceStrength = Math.min(100, Math.round((Math.min(profile.experience.length, 3) / 3) * 55 + (Math.min(bulletCount, 8) / 8) * 45));
  const score = Math.round(completeness * 0.4 + keywordAlignment * 0.35 + evidenceStrength * 0.25);

  const strengths: string[] = [];
  const improvements: string[] = [];
  if (profile.summary.length >= 80) strengths.push('Professional summary has enough context for recruiter scanning.');
  else improvements.push('Expand the summary to 2–4 focused sentences tied to the target role.');
  if (profile.experience.length) strengths.push(`${profile.experience.length} role${profile.experience.length === 1 ? '' : 's'} provide evidence for tailoring.`);
  else improvements.push('Add at least one role, project, or measurable work sample.');
  if (profile.skills.length >= 5) strengths.push('Skills inventory is broad enough for keyword matching.');
  else improvements.push('Add 5–12 truthful skills that appear in the target role.');
  if (job?.missingSkills.length) improvements.push(`Address these gaps honestly: ${job.missingSkills.slice(0, 5).join(', ')}.`);
  if (hasContact) strengths.push('Contact details are present.');
  else improvements.push('Add at least an email, location, or professional profile link.');

  const keywords = Array.from(new Set(
    `${profile.title} ${profile.summary} ${profile.skills.join(' ')} ${job?.role ?? ''} ${job?.summary ?? ''}`
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{3,}/g)
      ?.filter(word => !stopWords.has(word))
      .slice(0, 24) ?? [],
  ));

  return { score, completeness, keywordAlignment, evidenceStrength, strengths, improvements, keywords };
}

export function createCoverLetter(profile: ResumeData, job: JobAnalysis | null) {
  const role = job?.role || 'the open position';
  const company = job?.company || 'your organization';
  const evidence = profile.experience[0];
  const skills = profile.skills.slice(0, 4).join(', ');
  const evidenceLine = evidence
    ? `In my work as ${evidence.role || 'a professional'} at ${evidence.company || 'my recent organization'}, I focused on ${evidence.bullets[0] || 'delivering dependable outcomes for the team'}.`
    : 'My background gives me a practical foundation for contributing quickly and thoughtfully.';

  return `Dear Hiring Team,

I am excited to apply for ${role} at ${company}. As a ${profile.title || 'professional'} with experience across ${skills || 'relevant cross-functional work'}, I am drawn to this opportunity because it connects my strengths with the needs of the role.

${evidenceLine}

I would bring a clear, evidence-led approach to the position, with particular strength in ${skills || 'problem solving, collaboration, and execution'}. I would welcome the opportunity to discuss how my experience can support ${company}'s goals and the priorities outlined in the role.

Thank you for your consideration.

Sincerely,
${profile.name || 'Your Name'}`;
}

export type InterviewKit = {
  questions: string[];
  talkingPoints: string[];
  checklist: string[];
};

export function createInterviewKit(profile: ResumeData, job: JobAnalysis | null): InterviewKit {
  const role = job?.role || 'this role';
  const matched = job?.matchedSkills ?? profile.skills.slice(0, 4);
  const missing = job?.missingSkills ?? [];
  const experience = profile.experience.slice(0, 3);
  const questions = [
    `Walk me through the experience that best prepares you for ${role}.`,
    `Tell me about a result you delivered using ${matched[0] || 'one of your core skills'}.`,
    'Describe a difficult constraint or trade-off you handled and what you learned.',
    'How do you prioritize when several stakeholders need progress at the same time?',
    ...(missing[0] ? [`How are you building experience with ${missing[0]}?`] : []),
    'What would you aim to understand in your first 30 days?',
  ];
  const talkingPoints = experience.flatMap(item => [
    item.role && item.company ? `${item.role} at ${item.company}` : 'Recent experience',
    ...item.bullets.slice(0, 2).map(bullet => `Evidence: ${bullet}`),
  ]).slice(0, 8);
  const checklist = [
    'Prepare one Situation–Task–Action–Result story for each core requirement.',
    `Review the target role language: ${matched.slice(0, 5).join(', ') || 'add the extracted requirements after analysis'}.`,
    'Bring one thoughtful question about success measures and team collaboration.',
    'Keep every metric and claim consistent with the saved profile evidence.',
  ];
  return { questions, talkingPoints, checklist };
}

export function improveBulletLocally(bullet: string, targetSkill = '') {
  const trimmed = clean(bullet);
  if (!trimmed) return '';
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/[.!?]*$/, '.');
  const withVerb = /^(built|created|led|managed|improved|reduced|increased|launched|designed|delivered|analyzed|owned|developed|implemented|partnered|coordinated|mentored)\b/i.test(normalized)
    ? normalized
    : `Delivered ${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`;
  return targetSkill && !withVerb.toLowerCase().includes(targetSkill.toLowerCase())
    ? `${withVerb} Applied ${targetSkill} where relevant.`
    : withVerb;
}
