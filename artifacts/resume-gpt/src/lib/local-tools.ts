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

export type CoverLetterTone = 'executive' | 'tech' | 'startup' | 'direct';

export function createCoverLetter(profile: ResumeData, job: JobAnalysis | null, tone: CoverLetterTone = 'executive') {
  const role = job?.role || 'the open position';
  const company = job?.company || 'your organization';
  const evidence = profile.experience[0];
  const skills = profile.skills.slice(0, 5).join(', ');
  const name = profile.name || 'Your Name';
  const title = profile.title || 'Professional';

  if (tone === 'tech') {
    const mainBullet = evidence?.bullets[0] ? `Specifically, ${evidence.bullets[0].toLowerCase()}` : 'I focus on building resilient systems and clean architecture.';
    return `Dear ${company} Technical Hiring Team,

I am writing to express my strong interest in the ${role} position at ${company}. With a background as a ${title} skilled in ${skills || 'modern software engineering and product delivery'}, I excel at solving complex engineering challenges and driving measurable outcomes.

${evidence ? `In my recent role as ${evidence.role} at ${evidence.company}, I spearheaded initiatives that delivered high technical standards and scalability. ${mainBullet}` : 'Throughout my career, I have prioritized system efficiency, testable code, and high team velocity.'}

${job?.matchedSkills?.length ? `My expertise aligns directly with your stack in ${job.matchedSkills.slice(0, 4).join(', ')}.` : ''} I look forward to bringing my technical rigor and collaborative mindset to ${company}.

Best regards,

${name}`;
  }

  if (tone === 'startup') {
    return `Hi ${company} Team,

I saw that you're hiring a ${role}, and I couldn't be more excited about what ${company} is building. As a ${title} with a hands-on, bias-for-action mindset, I thrive in fast-paced environments where ownership and adaptability matter most.

Key capabilities I bring to the table:
• Proven track record in ${skills || 'rapid iteration and execution'}
• ${evidence ? `Proven impact at ${evidence.company} as ${evidence.role}` : 'Experience shipping customer-facing features rapidly'}
• Strong alignment with your core mission and technical trajectory

I'd love the opportunity to chat about how I can jump in and contribute to ${company}'s growth right away.

Cheers,

${name}`;
  }

  if (tone === 'direct') {
    return `Dear Hiring Manager,

Re: ${role} — ${company}

I am submitting my application for ${role} at ${company}. My background as a ${title} aligns directly with the requirements outlined for this role.

Highlights of my qualifications:
- Core competencies: ${skills || 'strategic execution, domain expertise'}
${evidence ? `- Recent experience: ${evidence.role} at ${evidence.company} (${evidence.bullets[0] || 'delivered key business outcomes'})` : ''}
${job?.matchedSkills?.length ? `- Matched job requirements: ${job.matchedSkills.slice(0, 4).join(', ')}` : ''}

I welcome the opportunity for a brief conversation to discuss how my background matches your team's objectives.

Sincerely,

${name}`;
  }

  // Executive default
  const evidenceLine = evidence
    ? `In my work as ${evidence.role || 'a professional'} at ${evidence.company || 'my recent organization'}, I focused on ${evidence.bullets[0] || 'delivering dependable outcomes for the team'}.`
    : 'My background gives me a practical foundation for contributing quickly and thoughtfully.';

  return `Dear Hiring Team,

I am excited to apply for ${role} at ${company}. As a ${title} with experience across ${skills || 'relevant cross-functional work'}, I am drawn to this opportunity because it connects my strengths with the needs of the role.

${evidenceLine}

I would bring a clear, evidence-led approach to the position, with particular strength in ${skills || 'problem solving, collaboration, and execution'}. I would welcome the opportunity to discuss how my experience can support ${company}'s goals and the priorities outlined in the role.

Thank you for your consideration.

Sincerely,

${name}`;
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

export function evaluateInterviewAnswerLocally(question: string, answer: string, profile: ResumeData, job: JobAnalysis | null) {
  const trimmed = clean(answer);
  if (!trimmed || trimmed.length < 15) {
    return {
      score: 35,
      starCheck: { situation: false, task: false, action: false, result: false },
      feedback: ['Answer is too brief. Provide a complete STAR (Situation, Task, Action, Result) narrative with specific metrics.'],
      improvedAnswer: `In my role as ${profile.experience[0]?.role || 'a team lead'}, we faced a high-stakes challenge regarding ${job?.role || 'project delivery'}. I led the technical strategy, coordinated cross-functional work, and successfully achieved our targets ahead of schedule.`,
    };
  }

  const hasSituation = /(when|during|at |facing|in my role|while working)/i.test(trimmed);
  const hasTask = /(needed to|tasked with|goal was|objective|responsibility|challenge)/i.test(trimmed);
  const hasAction = /(i led|i created|i built|i analyzed|i implemented|i designed|i organized|i spearheaded)/i.test(trimmed);
  const hasResult = /(resulting in|increased|reduced|achieved|improved|delivered|saved|grew|metrics|by \d+%)/i.test(trimmed);

  const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const score = Math.min(98, 45 + starCount * 12 + (trimmed.length > 120 ? 8 : 0));

  const feedback: string[] = [];
  if (hasSituation) feedback.push('Great context setting in your opening.');
  else feedback.push('Add clear context: Where and when did this scenario happen?');

  if (hasAction) feedback.push('Strong emphasis on personal action and initiative.');
  else feedback.push('Use active first-person verbs (e.g., "I spearheaded", "I designed") to show leadership.');

  if (hasResult) feedback.push('Excellent quantitative or qualitative result mentioned.');
  else feedback.push('Include a measurable outcome (e.g., "reduced load time by 30%", "boosted conversion").');

  const mainRole = profile.experience[0]?.role || profile.title || 'Professional';
  const mainCompany = profile.experience[0]?.company || 'my recent role';
  const sampleBullet = profile.experience[0]?.bullets[0] || 'delivering high-impact solutions for the business';

  const improvedAnswer = `During my time as ${mainRole} at ${mainCompany}, ${trimmed}. Specifically, ${sampleBullet.toLowerCase()} This directly contributed to team velocity and aligned with core principles required for ${job?.role || 'the target role'}.`;

  return {
    score,
    starCheck: { situation: hasSituation, task: hasTask, action: hasAction, result: hasResult },
    feedback,
    improvedAnswer,
  };
}

export function generateSummaryVariants(profile: ResumeData, job: JobAnalysis | null) {
  const title = profile.title || 'Results-Driven Professional';
  const skills = profile.skills.slice(0, 4).join(', ') || 'strategic execution, problem-solving, and cross-functional leadership';
  const exp = profile.experience[0];
  const targetRole = job?.role || 'target opportunities';

  return [
    {
      title: 'Impact & Results Focused',
      badge: 'High Impact',
      summary: `High-performing ${title} with a track record of driving scalable growth and operational excellence. Expert in ${skills}, with proven success ${exp ? `as ${exp.role} at ${exp.company}` : 'leading high-stakes initiatives'}. Passionate about leveraging data-backed evidence to deliver immediate impact for ${targetRole}.`,
    },
    {
      title: 'ATS & Keyword Optimized',
      badge: 'ATS 95%+',
      summary: `${title} possessing deep domain expertise across ${skills}. Mapped to requirements for ${targetRole}, bringing specialized capability in evidence-grounded execution, team collaboration, and metric-driven optimization.`,
    },
    {
      title: 'Executive Brief',
      badge: 'Executive',
      summary: `Strategic ${title} specializing in ${skills}. Recognized for transforming ambiguous challenges into structured, high-yield outcomes. Seeking to drive product innovation and technical excellence at scale.`,
    },
  ];
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
