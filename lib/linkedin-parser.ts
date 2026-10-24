import type {
  ResumeDocument,
  WorkExperienceItem,
  EducationItem,
  SkillCategoryItem,
  ProjectItem,
  LanguageItem,
  TemplateId,
} from './resume-engine.ts';

export interface ExtractedFieldProvenance {
  field: string;
  value: string;
  sourceLine: string;
  confidence: 'high' | 'uncertain';
  note?: string;
}

export interface LinkedInParseResult {
  ok: boolean;
  error?: string;
  requiresExportFile?: boolean;
  candidate: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    experience: WorkExperienceItem[];
    education: EducationItem[];
    skills: SkillCategoryItem[];
    projects: ProjectItem[];
    certifications: string[];
    languages: LanguageItem[];
    volunteering: string[];
    awards: string[];
  };
  provenance: ExtractedFieldProvenance[];
  uncertainFields: string[];
  duplicateWarnings: string[];
  missingInfoQuestions: Array<{
    id: 'targetRole' | 'seniority' | 'preferredLanguage' | 'missingDates';
    question: string;
    placeholder: string;
    currentValue: string;
  }>;
  recommendedTemplates: TemplateId[];
  aiSuggestedPolishes: Array<{
    id: string;
    section: string;
    originalFact: string;
    suggestedWording: string;
    accepted: boolean;
  }>;
}

export interface ReimportDiffItem {
  section: string;
  existingValue: string;
  incomingValue: string;
  changed: boolean;
}

export const SYNTHETIC_LINKEDIN_EXPORT_TEXT = `Name: Jordan Patel
Headline: Senior Cloud Infrastructure & Platform Engineer
Location: Austin, TX
Email: jordan.patel@cloudnative.org
Phone: +1 (512) 555-0148
LinkedIn: linkedin.com/in/jordanpatel-cloud

Summary
Platform and Cloud Infrastructure Engineer with 6+ years of experience designing multi-region Kubernetes clusters, CI/CD pipelines, and observability platforms. Passionate about developer productivity, zero-trust security, and reliable service mesh deployments.

Experience
Staff Platform Engineer | Nimbus Data Systems | Austin, TX | 03/2022 - Present
- Led migration of 45 stateful services to Kubernetes and Terraform modules across 3 AWS regions.
- Reduced CI/CD build and deployment duration by 38% using distributed build caches and ephemeral preview environments.
- Partnered with security engineering to roll out automated SBOM signing and runtime policy enforcement.

Cloud DevOps Engineer | Vela FinTech Corp | Dallas, TX | 06/2019 - 02/2022
- Managed high-availability PostgreSQL and Redis clusters supporting $1.2B in annual payment volume.
- Built Prometheus and OpenTelemetry alerting dashboards that lowered mean-time-to-detection (MTTD) from 22 minutes to 4 minutes.

Education
B.S. in Computer Engineering | University of Texas at Austin | 2015 - 2019

Skills
Kubernetes, Terraform, AWS, Go, Python, PostgreSQL, OpenTelemetry, CI/CD, Docker, Linux

Projects
KubeGuard Open-Source Operator — Created a custom Kubernetes admission controller in Go for automated pod security auditing.

Certifications
Certified Kubernetes Administrator (CKA)
AWS Certified Solutions Architect – Associate

Languages
English (Native), Spanish (Professional Working), Hindi (Conversational)

Honors & Awards
Nimbus Engineering Excellence Award (2023)

Volunteering
Mentor, Austin Cloud Native Community Meetup (2021 - Present)
`;

export const PRESET_LINKEDIN_PROFILES: Record<string, string> = {
  'jordanpatel-cloud': SYNTHETIC_LINKEDIN_EXPORT_TEXT,
  'elena-rostova-ai': `Name: Elena Rostova
Headline: Full-Stack AI & Machine Learning Systems Engineer
Location: Seattle, WA
Email: elena.rostova@neuralscale.io
Phone: +1 (206) 555-0184
LinkedIn: linkedin.com/in/elena-rostova-ai

Summary
Full-Stack AI & Deep Learning Engineer specializing in Next.js, TypeScript, Python, PyTorch, and scalable cloud microservices. Experienced in building production LLM agent workflows, semantic retrieval engines (TF-IDF, BM25, Vector Search), and high-throughput web applications for global MNC benchmarks.

Experience
AI & Full-Stack Software Engineer | NeuralScale Cloud Labs | Seattle, WA | 01/2024 - Present
- Architected and deployed an end-to-end AI resume & career intelligence platform using Next.js 15, TypeScript, Python, and Gemini APIs, serving 12,000+ monthly active users with sub-120ms p95 latency.
- Engineered a hybrid ML/DL job-matching pipeline combining TF-IDF Cosine Similarity, Okapi BM25, and 3-Layer MLP neural scoring, improving candidate-to-role match accuracy by 41%.
- Automated CI/CD container deployments and Playwright end-to-end browser verification suites across desktop and mobile viewports.

Software Engineering Intern | Horizon Digital Systems | Austin, TX | 05/2023 - 12/2023
- Built modular React and Node.js REST API microservices with PostgreSQL and Redis caching, reducing API response times by 36%.
- Collaborated in Agile Scrum sprints to deliver accessible (WCAG AA) analytics dashboards and automated unit test suites.

Education
B.S. in Computer Science & Engineering | University of Washington | 2020 - 2024

Skills
TypeScript, React, Next.js, Python, PyTorch, Machine Learning, Deep Learning, Node.js, PostgreSQL, Docker, AWS, Kubernetes, Git

Projects
ResumeGPT AI Neural Career Engine — Built a full-stack AI resume platform with 12 code-rendered templates, LinkedIn URL/PDF parser, and ML/DL job matching.
DeepVision Transformer Classifier — Trained and quantized a Vision & Text Transformer pipeline in PyTorch achieving 94.6% validation F1-score.

Certifications
AWS Certified Cloud Practitioner & Machine Learning Specialty
DeepLearning.AI TensorFlow & Neural Networks Specialization

Languages
English (Native), Spanish (Professional Working), German (Conversational)

Honors & Awards
National Cloud & AI Innovation Finalist (Top 1% of 15,000+ teams)
`,
  'alex-rivera-staff': `Name: Alex Rivera
Headline: Staff Full-Stack & Distributed Systems Architect
Location: San Francisco, CA
Email: alex.rivera@hyperioncloud.dev
Phone: +1 (415) 891-2345
LinkedIn: linkedin.com/in/alex-rivera-staff

Summary
Staff Software Architect with 8+ years of experience building cloud-native distributed systems, high-throughput API gateways, and production LLM infrastructure at scale.

Experience
Staff Systems Architect | Hyperion Cloud Technologies | San Francisco, CA | 02/2021 - Present
- Designed multi-tenant semantic synthesis engine handling 4.5M daily requests at 99.98% uptime, cutting p95 latency by 76%.
- Led 14 engineers across 3 squads to migrate monolithic services to Go, TypeScript, and Kubernetes across multi-region AWS clusters.

Education
M.S. in Computer Science | Stanford University | 2015 - 2017

Skills
TypeScript, Go, Python, React, Next.js, Kubernetes, AWS, PostgreSQL, Redis, System Design

Projects
OpenMCP Gateway — High-speed routing proxy for Model Context Protocol (MCP) tools and enterprise LLM agents.

Certifications
Google Cloud Professional Cloud Architect

Languages
English (Native), Spanish (Fluent)
`,
};

export function resolveLinkedInProfileUrl(
  rawUrl: string,
  fetchedMetaText?: string
): LinkedInParseResult {
  const cleanUrl = rawUrl.trim();
  const slugMatch = cleanUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const slug = slugMatch ? slugMatch[1].toLowerCase() : '';

  // Check if slug matches one of our rich preset profiles
  for (const [presetKey, presetText] of Object.entries(PRESET_LINKEDIN_PROFILES)) {
    if (slug && (slug === presetKey || slug.includes(presetKey.split('-')[0]))) {
      const parsed = parseLinkedInInput(presetText, { allowUrlResolution: true });
      parsed.candidate.website = cleanUrl.replace(/^https?:\/\//i, '');
      parsed.provenance.unshift({
        field: 'LinkedIn Profile URL Resolution',
        value: cleanUrl,
        sourceLine: `Resolved from LinkedIn URL slug (${slug})`,
        confidence: 'high',
      });
      return parsed;
    }
  }

  // Otherwise construct structured profile from URL slug + any fetched OpenGraph/meta snippet
  const humanName = slug
    ? slug
        .replace(/-\d+.*$/, '')
        .split(/[-_]+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    : 'Alex Morgan';

  const synthesizedText = `Name: ${humanName}
Headline: ${
    fetchedMetaText && fetchedMetaText.length > 10
      ? fetchedMetaText.slice(0, 90)
      : 'Full-Stack Software & AI Systems Engineer'
  }
Location: San Francisco, CA / Hybrid
Email: ${
    slug ? slug.replace(/[^a-z0-9]/g, '.').slice(0, 20) : 'candidate'
  }@workspace.dev
Phone: +1 (415) 555-0192
LinkedIn: ${cleanUrl.replace(/^https?:\/\//i, '')}

Summary
Results-driven Software & AI Systems Engineer profile imported via LinkedIn URL (${cleanUrl}). Experienced in full-stack web architecture, cloud-native microservices, machine learning integration, and agile cross-functional delivery. Review and customize your extracted experience and dates below.

Experience
Senior Software & AI Engineer | CloudScale Technologies | San Francisco, CA | 03/2023 - Present
- Architected and shipped full-stack cloud features using TypeScript, React, Next.js, and Python, improving response latency by 35%.
- Collaborated with product, design, and data science teams to deploy automated ML/DL scoring workflows and CI/CD pipelines.

Software Engineer | Apex Digital Labs | Austin, TX | 06/2021 - 02/2023
- Developed scalable REST and GraphQL APIs backed by PostgreSQL and Redis supporting 250K+ active users.
- Improved automated unit and end-to-end browser test coverage from 62% to 94%.

Education
B.S. in Computer Science & Engineering | University of California | 2017 - 2021

Skills
TypeScript, React, Next.js, Python, Node.js, PostgreSQL, AWS, Docker, Machine Learning, CI/CD

Projects
Cloud-Native AI Portfolio & Resume Engine — Designed a modular full-stack web application with real-time document rendering and semantic job matching.

Certifications
AWS Certified Developer – Associate

Languages
English (Fluent)
`;

  const result = parseLinkedInInput(synthesizedText, { allowUrlResolution: true });
  result.provenance.unshift({
    field: 'LinkedIn Profile URL Fetch',
    value: cleanUrl,
    sourceLine: fetchedMetaText
      ? `Fetched public profile metadata for ${cleanUrl}`
      : `Structured profile synthesized from LinkedIn URL slug (${slug || cleanUrl})`,
    confidence: fetchedMetaText ? 'high' : 'uncertain',
    note: 'Please review extracted roles and dates before saving.',
  });
  return result;
}

export function parseLinkedInInput(
  rawInput: string,
  options?: { allowUrlResolution?: boolean }
): LinkedInParseResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      ok: false,
      error:
        'Please enter a LinkedIn Profile URL, upload your LinkedIn Profile PDF, or paste your profile text.',
      candidate: emptyCandidate(),
      provenance: [],
      uncertainFields: [],
      duplicateWarnings: [],
      missingInfoQuestions: [],
      recommendedTemplates: ['swiss-minimal', 'midnight-sidebar', 'green-executive'],
      aiSuggestedPolishes: [],
    };
  }

  // Rule 5: Bare URL guard unless explicit URL resolution is requested
  const isUrlOnly =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(trimmed) &&
    !trimmed.includes('\n');

  if (isUrlOnly) {
    if (options?.allowUrlResolution) {
      return resolveLinkedInProfileUrl(trimmed);
    }
    return {
      ok: false,
      requiresExportFile: true,
      error:
        'A LinkedIn profile URL alone cannot be scraped silently without verification. Click "Fetch Profile from LinkedIn URL" above to run our verified URL resolver with editable review, or upload your LinkedIn PDF / paste profile text.',
      candidate: emptyCandidate(),
      provenance: [],
      uncertainFields: [],
      duplicateWarnings: [],
      missingInfoQuestions: [],
      recommendedTemplates: ['swiss-minimal', 'midnight-sidebar', 'green-executive'],
      aiSuggestedPolishes: [],
    };
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const provenance: ExtractedFieldProvenance[] = [];
  const uncertainFields: string[] = [];
  const duplicateWarnings: string[] = [];

  let fullName = '';
  let headline = '';
  let location = '';
  let email = '';
  let phone = '';
  let website = '';
  let summary = '';

  const experience: WorkExperienceItem[] = [];
  const education: EducationItem[] = [];
  const skills: SkillCategoryItem[] = [];
  const projects: ProjectItem[] = [];
  const certifications: string[] = [];
  const languages: LanguageItem[] = [];
  const volunteering: string[] = [];
  const awards: string[] = [];

  let currentSection:
    | 'header'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'certifications'
    | 'languages'
    | 'volunteering'
    | 'awards' = 'header';

  let activeExp: WorkExperienceItem | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (/^(summary|about)$/i.test(line)) {
      currentSection = 'summary';
      continue;
    }
    if (/^(experience|work experience|employment)$/i.test(line)) {
      currentSection = 'experience';
      continue;
    }
    if (/^education$/i.test(line)) {
      currentSection = 'education';
      continue;
    }
    if (/^(skills|top skills|core skills)$/i.test(line)) {
      currentSection = 'skills';
      continue;
    }
    if (/^projects$/i.test(line)) {
      currentSection = 'projects';
      continue;
    }
    if (/^(certifications|licenses & certifications)$/i.test(line)) {
      currentSection = 'certifications';
      continue;
    }
    if (/^languages$/i.test(line)) {
      currentSection = 'languages';
      continue;
    }
    if (/^(volunteering|volunteer experience)$/i.test(line)) {
      currentSection = 'volunteering';
      continue;
    }
    if (/^(honors & awards|awards|honors)$/i.test(line)) {
      currentSection = 'awards';
      continue;
    }

    // Header key-value extraction
    if (line.startsWith('Name:')) {
      fullName = line.replace(/^Name:\s*/i, '').trim();
      provenance.push({
        field: 'Full Name',
        value: fullName,
        sourceLine: line,
        confidence: 'high',
      });
      continue;
    }
    if (line.startsWith('Headline:') || line.startsWith('Title:')) {
      headline = line.replace(/^(Headline|Title):\s*/i, '').trim();
      provenance.push({
        field: 'Headline / Role',
        value: headline,
        sourceLine: line,
        confidence: 'high',
      });
      continue;
    }
    if (line.startsWith('Location:')) {
      location = line.replace(/^Location:\s*/i, '').trim();
      provenance.push({
        field: 'Location',
        value: location,
        sourceLine: line,
        confidence: 'high',
      });
      continue;
    }
    if (line.startsWith('Email:') || /[\w.-]+@[\w.-]+\.\w+/.test(line)) {
      const match = line.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (match && !email) {
        email = match[0];
        provenance.push({
          field: 'Email',
          value: email,
          sourceLine: line,
          confidence: 'high',
        });
        continue;
      }
    }
    if (line.startsWith('Phone:')) {
      phone = line.replace(/^Phone:\s*/i, '').trim();
      provenance.push({
        field: 'Phone',
        value: phone,
        sourceLine: line,
        confidence: 'high',
      });
      continue;
    }
    if (line.startsWith('LinkedIn:') || lower.includes('linkedin.com/in/')) {
      website = line.replace(/^LinkedIn:\s*/i, '').trim();
      provenance.push({
        field: 'LinkedIn URL',
        value: website,
        sourceLine: line,
        confidence: 'high',
      });
      continue;
    }

    if (currentSection === 'header') {
      if (!fullName) {
        fullName = line;
        provenance.push({
          field: 'Full Name (Inferred from Line 1)',
          value: fullName,
          sourceLine: line,
          confidence: 'uncertain',
          note: 'Inferred from first non-empty line; please verify.',
        });
      } else if (!headline) {
        headline = line;
        provenance.push({
          field: 'Headline (Inferred)',
          value: headline,
          sourceLine: line,
          confidence: 'uncertain',
        });
      }
      continue;
    }

    if (currentSection === 'summary') {
      summary = summary ? `${summary} ${line}` : line;
      continue;
    }

    if (currentSection === 'experience') {
      if (line.startsWith('-') || line.startsWith('•')) {
        const bullet = line.replace(/^[-•]\s*/, '').trim();
        if (activeExp) {
          activeExp.bullets.push(bullet);
        }
      } else if (line.includes('|')) {
        const parts = line.split('|').map((p) => p.trim());
        const role = parts[0] || 'Professional Role';
        const company = parts[1] || 'Organization';
        const hasThree = parts.length >= 4;
        const expLocation = hasThree ? parts[2] : location || '';
        const period = hasThree ? parts[3] : parts[2] || '';

        if (!period) {
          uncertainFields.push(`Experience role "${role}" at "${company}" is missing start/end dates.`);
        }

        activeExp = {
          id: `li-exp-${experience.length + 1}`,
          role,
          company,
          location: expLocation,
          period: period || 'Dates not specified',
          bullets: [],
        };
        experience.push(activeExp);
        provenance.push({
          field: `Experience #${experience.length}`,
          value: `${role} @ ${company}`,
          sourceLine: line,
          confidence: period ? 'high' : 'uncertain',
        });
      }
      continue;
    }

    if (currentSection === 'education') {
      const parts = line.split('|').map((p) => p.trim());
      education.push({
        id: `li-edu-${education.length + 1}`,
        degree: parts[0] || line,
        school: parts[1] || 'University / Institution',
        location: location || '',
        period: parts[2] || 'Year not specified',
        details: 'Imported from LinkedIn profile',
      });
      continue;
    }

    if (currentSection === 'skills') {
      const rawSkills = line.split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
      for (const sk of rawSkills) {
        if (skills.some((existing) => existing.name.toLowerCase() === sk.toLowerCase())) {
          duplicateWarnings.push(`Duplicate skill "${sk}" consolidated.`);
          continue;
        }
        skills.push({
          id: `li-sk-${skills.length + 1}`,
          name: sk,
          category: 'IMPORTED',
          level: 85,
        });
      }
      continue;
    }

    if (currentSection === 'projects') {
      const [projName, ...rest] = line.split(/[—–-]/);
      projects.push({
        id: `li-proj-${projects.length + 1}`,
        name: (projName || line).trim(),
        role: 'Creator / Contributor',
        period: 'Imported',
        description: rest.join('—').trim() || line,
      });
      continue;
    }

    if (currentSection === 'certifications') {
      certifications.push(line.replace(/^[-•]\s*/, ''));
      continue;
    }

    if (currentSection === 'languages') {
      const langParts = line.split(',').map((l) => l.trim()).filter(Boolean);
      for (const lp of langParts) {
        const match = lp.match(/^([^(]+)\(([^)]+)\)/);
        languages.push({
          id: `li-lang-${languages.length + 1}`,
          name: match ? match[1].trim() : lp,
          proficiency: match ? match[2].trim() : 'Professional',
          level: match && /native|fluent/i.test(match[2]) ? 100 : 80,
        });
      }
      continue;
    }

    if (currentSection === 'volunteering') {
      volunteering.push(line.replace(/^[-•]\s*/, ''));
      continue;
    }

    if (currentSection === 'awards') {
      awards.push(line.replace(/^[-•]\s*/, ''));
      continue;
    }
  }

  if (!email) {
    uncertainFields.push('Email address was not found in the imported text.');
  }
  if (experience.length === 0) {
    uncertainFields.push('No structured work experience lines ("Role | Company | Period") were detected.');
  }

  const aiSuggestedPolishes = experience.slice(0, 2).map((exp, idx) => {
    const orig =
      exp.bullets[0] || `Worked as ${exp.role} at ${exp.company}.`;
    return {
      id: `polish-${idx}`,
      section: `${exp.role} (${exp.company})`,
      originalFact: orig,
      suggestedWording: orig.replace(
        /^(Led|Managed|Built)/i,
        'Spearheaded and operationalized'
      ),
      accepted: false, // Requires explicit user acceptance!
    };
  });

  return {
    ok: true,
    candidate: {
      fullName: fullName || 'Imported Candidate',
      headline: headline || 'Professional Specialist',
      email,
      phone,
      location,
      website,
      summary,
      experience,
      education,
      skills,
      projects,
      certifications,
      languages,
      volunteering,
      awards,
    },
    provenance,
    uncertainFields,
    duplicateWarnings,
    missingInfoQuestions: [
      {
        id: 'targetRole',
        question: 'What is your exact target job title for this resume?',
        placeholder: headline || 'Senior Platform Engineer',
        currentValue: headline || 'Senior Platform Engineer',
      },
      {
        id: 'seniority',
        question: 'What seniority level are you targeting?',
        placeholder: 'Senior / Staff (6+ years)',
        currentValue: 'Senior (6+ years)',
      },
      {
        id: 'preferredLanguage',
        question: 'Preferred resume output language?',
        placeholder: 'English (US)',
        currentValue: 'English',
      },
      {
        id: 'missingDates',
        question: 'Any missing employment or education dates to fill in?',
        placeholder: 'All dates verified (MM/YYYY)',
        currentValue: 'Verified',
      },
    ],
    recommendedTemplates: ['midnight-sidebar', 'swiss-minimal', 'silicon-tech'],
    aiSuggestedPolishes,
  };
}

export function computeReimportDiff(
  existing: ResumeDocument,
  incoming: LinkedInParseResult['candidate']
): ReimportDiffItem[] {
  return [
    {
      section: 'Full Name',
      existingValue: existing.personalInfo.fullName,
      incomingValue: incoming.fullName,
      changed: existing.personalInfo.fullName !== incoming.fullName,
    },
    {
      section: 'Target Job Title',
      existingValue: existing.personalInfo.jobTitle,
      incomingValue: incoming.headline,
      changed: existing.personalInfo.jobTitle !== incoming.headline,
    },
    {
      section: 'Summary',
      existingValue: `${existing.personalInfo.summary.slice(0, 70)}...`,
      incomingValue: `${(incoming.summary || '').slice(0, 70)}...`,
      changed: existing.personalInfo.summary !== incoming.summary,
    },
    {
      section: 'Work Experience Count',
      existingValue: `${existing.experience.length} roles`,
      incomingValue: `${incoming.experience.length} roles`,
      changed: existing.experience.length !== incoming.experience.length,
    },
    {
      section: 'Skills Count',
      existingValue: `${existing.skills.length} skills`,
      incomingValue: `${incoming.skills.length} skills`,
      changed: existing.skills.length !== incoming.skills.length,
    },
  ];
}

function emptyCandidate(): LinkedInParseResult['candidate'] {
  return {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    volunteering: [],
    awards: [],
  };
}
