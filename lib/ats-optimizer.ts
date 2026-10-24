import { ResumeDocument } from './resume-engine';

export interface AtsScoreBreakdown {
  overallScore: number;
  matchTier: 'Strong Match' | 'Good Match' | 'Needs Optimization' | 'Low Match';
  matchTierColor: string;
  subScores: {
    keywordMatch: number;
    skillsCoverage: number;
    quantifiedImpact: number;
    formattingReadability: number;
    titleSummaryRelevance: number;
  };
  matchedKeywords: Array<{
    term: string;
    frequencyInJd: number;
    frequencyInResume: number;
  }>;
  missingKeywords: Array<{
    term: string;
    importance: 'Critical' | 'High' | 'Recommended';
    frequencyInJd: number;
  }>;
  actionableTips: AtsOptimizationTip[];
  tailoredHeadline: string;
  tailoredSummary: string;
  suggestedBullets: string[];
  totalJdWordCount: number;
  totalResumeWordCount: number;
}

export interface AtsOptimizationTip {
  id: string;
  category: 'Critical Skill' | 'Impact & Metrics' | 'Title & Summary' | 'ATS Formatting' | 'Action Verbs';
  severity: 'high' | 'medium' | 'low';
  title: string;
  problem: string;
  recommendation: string;
  exampleSnippet?: string;
  autoApplyData?: {
    type: 'add_skill' | 'update_summary' | 'update_title' | 'replace_bullet';
    value: string;
    section?: string;
  };
}

// Common industry stop words to ignore
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
  'will', 'shall', 'must', 'well', 'etc', 'e.g', 'i.e', 'also', 'including', 'experience', 'responsible',
  'requirements', 'qualifications', 'duties', 'looking', 'role', 'team', 'work', 'working', 'ability'
]);

// Master dictionary of recognized domain skills and technologies
const KNOWN_INDUSTRY_TERMS = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
  'Go', 'Golang', 'Rust', 'C++', 'C#', '.NET', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'PostgreSQL',
  'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'GraphQL', 'REST API', 'gRPC', 'Microservices',
  'Docker', 'Kubernetes', 'Helm', 'Terraform', 'Ansible', 'AWS', 'Google Cloud', 'GCP', 'Azure',
  'CI/CD', 'GitHub Actions', 'GitLab', 'Jenkins', 'Linux', 'Kafka', 'RabbitMQ', 'Elasticsearch',
  'Prometheus', 'Grafana', 'Datadog', 'System Design', 'Distributed Systems', 'High Availability',
  'Scalability', 'Security', 'OAuth', 'JWT', 'Unit Testing', 'Jest', 'Cypress', 'Playwright',
  'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'LLM', 'Gemini', 'Generative AI',
  'NLP', 'Computer Vision', 'Data Pipelines', 'ETL', 'Spark', 'Airflow', 'BigQuery', 'Snowflake',
  'Agile', 'Scrum', 'Kanban', 'Product Management', 'Roadmap', 'Sprint Planning', 'Stakeholder Management',
  'Cross-Functional Leadership', 'Code Review', 'Mentorship', 'Budget Management', 'Vendor Management',
  'Figma', 'UI/UX', 'Design Systems', 'Accessibility', 'WCAG', 'Responsive Web Design', 'SEO',
  'A/B Testing', 'Product Analytics', 'Mixpanel', 'Google Analytics', 'KPI', 'OKR', 'User Research',
  'Municipal Zoning', 'Urban Planning', 'GIS', 'ArcGIS', 'AutoCAD', 'Environmental Impact',
  'LEED', 'Sustainability', 'Public Policy', 'Civil Engineering', 'Transportation Planning'
];

/**
 * Extracts and scores keywords from an input job description against a resume document
 */
export function generateAtsAnalysis(
  resume: ResumeDocument,
  jobDescriptionText: string
): AtsScoreBreakdown {
  const jdText = jobDescriptionText.trim();
  const jdLower = jdText.toLowerCase();

  // Combine full resume text
  const resumeBullets = resume.experience?.flatMap((e) => e.bullets) || [];
  const resumeSkills = resume.skills?.map((s) => s.name) || [];
  const resumeStrengths = resume.strengths || [];
  const resumeProjects = resume.projects?.map((p) => `${p.name} ${p.role} ${p.description}`) || [];
  const resumeEdu = resume.education?.map((ed) => `${ed.degree} ${ed.school} ${ed.details}`) || [];

  const fullResumeCorpus = [
    resume.personalInfo.fullName,
    resume.personalInfo.jobTitle,
    resume.personalInfo.summary,
    ...resumeSkills,
    ...resumeStrengths,
    ...resumeBullets,
    ...resumeProjects,
    ...resumeEdu,
  ].join(' ');

  const resumeLower = fullResumeCorpus.toLowerCase();

  // 1. Identify Target Keywords from Job Description
  const detectedJdTerms: Array<{ term: string; count: number }> = [];

  for (const term of KNOWN_INDUSTRY_TERMS) {
    const termLower = term.toLowerCase();
    // Match word boundaries
    const regex = new RegExp(`\\b${escapeRegExp(termLower)}\\b`, 'g');
    const matches = jdLower.match(regex);
    if (matches && matches.length > 0) {
      detectedJdTerms.push({
        term,
        count: matches.length,
      });
    }
  }

  // Also extract dynamic significant capitalized or technical words from JD
  const jdTokens = jdText.match(/\b[A-Za-z0-9#+.-]{3,}\b/g) || [];
  const wordFreq = new Map<string, number>();

  for (const token of jdTokens) {
    const clean = token.toLowerCase();
    if (!STOP_WORDS.has(clean) && clean.length >= 3 && !/^\d+$/.test(clean)) {
      wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
    }
  }

  // Sort by frequency in JD
  detectedJdTerms.sort((a, b) => b.count - a.count);

  // If JD is short or generic, fallback to top standard role keywords
  const activeKeywordPool =
    detectedJdTerms.length >= 4
      ? detectedJdTerms.map((t) => t.term)
      : Array.from(new Set([...detectedJdTerms.map((t) => t.term), ...KNOWN_INDUSTRY_TERMS.slice(0, 12)]));

  // 2. Classify Matched vs Missing Keywords
  const matchedKeywords: Array<{
    term: string;
    frequencyInJd: number;
    frequencyInResume: number;
  }> = [];

  const missingKeywords: Array<{
    term: string;
    importance: 'Critical' | 'High' | 'Recommended';
    frequencyInJd: number;
  }> = [];

  for (const term of activeKeywordPool) {
    const termLower = term.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegExp(termLower)}\\b`, 'g');
    const resumeMatches = resumeLower.match(regex);
    const resumeCount = resumeMatches ? resumeMatches.length : 0;
    const jdMatches = jdLower.match(regex);
    const jdCount = jdMatches ? jdMatches.length : 1;

    if (resumeCount > 0) {
      matchedKeywords.push({
        term,
        frequencyInJd: jdCount,
        frequencyInResume: resumeCount,
      });
    } else {
      const importance: 'Critical' | 'High' | 'Recommended' =
        jdCount >= 3 ? 'Critical' : jdCount === 2 ? 'High' : 'Recommended';
      missingKeywords.push({
        term,
        importance,
        frequencyInJd: jdCount,
      });
    }
  }

  // Sort missing keywords by importance then JD frequency
  missingKeywords.sort((a, b) => {
    const impWeight = { Critical: 3, High: 2, Recommended: 1 };
    return impWeight[b.importance] - impWeight[a.importance] || b.frequencyInJd - a.frequencyInJd;
  });

  // 3. Compute Sub-Scores
  // Sub-score A: Keyword Match (0-100)
  const totalKeywords = activeKeywordPool.length;
  const keywordRatio = totalKeywords > 0 ? matchedKeywords.length / totalKeywords : 0.7;
  const keywordMatchScore = Math.min(100, Math.max(35, Math.round(keywordRatio * 100)));

  // Sub-score B: Skills Coverage in Explicit Skills List
  const resumeSkillNamesLower = resumeSkills.map((s) => s.toLowerCase());
  const skillsCoveredCount = activeKeywordPool.filter((kw) =>
    resumeSkillNamesLower.some((s) => s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s))
  ).length;
  const skillsCoverageScore = Math.min(
    100,
    Math.max(40, Math.round((skillsCoveredCount / Math.max(1, Math.min(12, totalKeywords))) * 100))
  );

  // Sub-score C: Quantified Impact & Metrics in Bullets
  const totalBullets = resumeBullets.length;
  const quantifiedBullets = resumeBullets.filter((b) =>
    /(\d+%\b|\$\d+|\b\d+\+\b|\b\d+x\b|\b\d+\s*(million|billion|thousand|k|m|users|engineers|clients|projects|ms|sec|hours|days|weeks|months|km)\b)/i.test(
      b
    )
  ).length;
  const quantifiedImpactScore =
    totalBullets === 0
      ? 50
      : Math.min(100, Math.max(45, Math.round(55 + (quantifiedBullets / totalBullets) * 45)));

  // Sub-score D: Formatting & ATS Readability
  let formatScore = 96;
  if (!resume.personalInfo.email || !resume.personalInfo.fullName) formatScore -= 20;
  if (!resume.personalInfo.phone) formatScore -= 8;
  if (!resume.personalInfo.location) formatScore -= 6;
  if (resumeBullets.length < 3) formatScore -= 15;
  if (!resume.education || resume.education.length === 0) formatScore -= 10;
  const formattingReadabilityScore = Math.min(100, Math.max(50, formatScore));

  // Sub-score E: Target Title & Summary Relevance
  const titleLower = (resume.personalInfo.jobTitle || '').toLowerCase();
  const summaryLower = (resume.personalInfo.summary || '').toLowerCase();
  let titleRelevanceScore = 65;

  // Check if job description contains target title words
  const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 3);
  const matchedTitleWords = titleWords.filter((w) => jdLower.includes(w));
  if (matchedTitleWords.length >= 2) titleRelevanceScore += 25;
  else if (matchedTitleWords.length === 1) titleRelevanceScore += 15;

  const topMatchedInSummary = matchedKeywords.filter((m) => summaryLower.includes(m.term.toLowerCase())).length;
  titleRelevanceScore += Math.min(10, topMatchedInSummary * 3);
  const titleSummaryRelevanceScore = Math.min(100, Math.max(50, titleRelevanceScore));

  // 4. Overall Weighted Percentage Score
  const overallScore = Math.round(
    keywordMatchScore * 0.32 +
    skillsCoverageScore * 0.22 +
    quantifiedImpactScore * 0.22 +
    formattingReadabilityScore * 0.12 +
    titleSummaryRelevanceScore * 0.12
  );

  // Match Tier Classification
  let matchTier: 'Strong Match' | 'Good Match' | 'Needs Optimization' | 'Low Match';
  let matchTierColor: string;
  if (overallScore >= 85) {
    matchTier = 'Strong Match';
    matchTierColor = '#10B981'; // Emerald Green
  } else if (overallScore >= 70) {
    matchTier = 'Good Match';
    matchTierColor = '#3B82F6'; // Blue
  } else if (overallScore >= 55) {
    matchTier = 'Needs Optimization';
    matchTierColor = '#F59E0B'; // Amber
  } else {
    matchTier = 'Low Match';
    matchTierColor = '#EF4444'; // Red
  }

  // 5. Generate Actionable Optimization Tips
  const actionableTips: AtsOptimizationTip[] = [];

  // Tip 1: Missing Critical Keywords
  const criticalMissing = missingKeywords.filter((m) => m.importance === 'Critical' || m.importance === 'High');
  if (criticalMissing.length > 0) {
    const missingNames = criticalMissing.slice(0, 3).map((m) => m.term);
    actionableTips.push({
      id: 'tip-missing-keywords',
      category: 'Critical Skill',
      severity: 'high',
      title: `Add ${criticalMissing.length} Target Skills Mentioned in Job Description`,
      problem: `The job description heavily emphasizes ${missingNames.join(', ')}, but these keywords do not appear anywhere in your resume. Automated ATS screeners will filter out resumes lacking these exact matches.`,
      recommendation: `If you have hands-on experience with these tools, add them to your Skills section or reference them within relevant project bullets.`,
      exampleSnippet: `Skills: ${missingNames.join(', ')}`,
      autoApplyData: {
        type: 'add_skill',
        value: missingNames[0],
      },
    });
  }

  // Tip 2: Quantified Metrics & KPI Density
  if (quantifiedBullets < Math.max(3, Math.ceil(totalBullets * 0.5))) {
    actionableTips.push({
      id: 'tip-quantify-bullets',
      category: 'Impact & Metrics',
      severity: quantifiedBullets === 0 ? 'high' : 'medium',
      title: 'Upgrade Experience Bullets to Google X-Y-Z Quantified Formula',
      problem: `Only ${quantifiedBullets} of ${totalBullets} experience bullets contain measurable metrics (%, $, scale). Tier-1 recruiters and semantic ATS engines rank candidates 40% higher when achievements include concrete outcomes.`,
      recommendation: 'Rewrite bullet points using: "Accomplished [X], as measured by [Y], by doing [Z]". Include percentage increases, latency cuts, cost savings, or team sizes.',
      exampleSnippet: 'Reduced API response latency by 38% and server compute costs by $42K/year by migrating to Redis caching and Next.js ISR.',
    });
  }

  // Tip 3: Target Role Title Alignment
  const topDetectedRole = extractLikelyRoleTitle(jdText) || 'Senior Specialist';
  if (!titleLower.includes(topDetectedRole.toLowerCase().split(' ')[0])) {
    actionableTips.push({
      id: 'tip-title-alignment',
      category: 'Title & Summary',
      severity: 'medium',
      title: `Align Resume Header Title with Target Role ("${topDetectedRole}")`,
      problem: `Your current resume headline is "${resume.personalInfo.jobTitle || 'Not Specified'}", whereas the target opening seeks a "${topDetectedRole}". Exact or near-exact title match is one of the highest weighted fields in ATS keyword parsers.`,
      recommendation: `Update your primary headline title to "${topDetectedRole}" or include it prominently at the top of your professional summary.`,
      exampleSnippet: `${topDetectedRole} | Distributed Systems & High-Scale Web Architecture`,
      autoApplyData: {
        type: 'update_title',
        value: topDetectedRole,
      },
    });
  }

  // Tip 4: Summary Tailoring with Matched Keywords
  const topKeywordsList = matchedKeywords.slice(0, 3).map((m) => m.term).join(', ');
  const tailoredSummary = `Results-oriented ${topDetectedRole} with proven expertise in ${
    topKeywordsList || 'full-lifecycle engineering'
  }. Demonstrated track record of scaling reliable systems, partnering with cross-functional stakeholders, and driving measurable KPI outcomes.`;

  actionableTips.push({
    id: 'tip-summary-keywords',
    category: 'Title & Summary',
    severity: 'medium',
    title: 'Tailor Professional Summary to Highlight Target Domain Competencies',
    problem: 'Your summary does not mention the top keywords required by this job description, missing an easy opportunity for keyword density above the fold.',
    recommendation: 'Incorporate target skills directly into the first two sentences of your summary so hiring managers see instant alignment.',
    exampleSnippet: tailoredSummary,
    autoApplyData: {
      type: 'update_summary',
      value: tailoredSummary,
    },
  });

  // Tip 5: Action Verb Strength
  const weakVerbsFound = resumeBullets.filter((b) => /^(helped|worked on|assisted with|responsible for|handled)\b/i.test(b.trim()));
  if (weakVerbsFound.length > 0) {
    actionableTips.push({
      id: 'tip-action-verbs',
      category: 'Action Verbs',
      severity: 'low',
      title: 'Replace Passive Responsibilities with Strong Leadership Action Verbs',
      problem: `Found ${weakVerbsFound.length} bullet point(s) starting with passive phrases like "Responsible for" or "Worked on". ATS parsers and hiring managers look for active ownership verbs.`,
      recommendation: 'Replace weak openers with authoritative verbs: Architected, Orchestrated, Engineered, Spearheaded, Accelerated, Formulated, Streamlined.',
      exampleSnippet: 'Orchestrated zero-downtime deployment pipeline reducing release cycle from 4 days to 45 minutes.',
    });
  }

  // Tip 6: ATS Formatting Check
  actionableTips.push({
    id: 'tip-ats-formatting',
    category: 'ATS Formatting',
    severity: 'low',
    title: 'ATS Parseability & Clean Typography Verification',
    problem: 'Complex multi-column tables, text frames, or non-standard fonts can cause ATS parsers to jumble work chronology and discard contact information.',
    recommendation: 'ResumeBuilderAi 3.0 renders semantic HTML/CSS with standard headings, selectable text, and verified MM/YYYY date ranges, ensuring 100% parseability by Workday, Taleo, Greenhouse, and Lever.',
    exampleSnippet: 'Format: Standardized section order with clean bullet hierarchy and consistent MM/YYYY date ranges.',
  });

  return {
    overallScore,
    matchTier,
    matchTierColor,
    subScores: {
      keywordMatch: keywordMatchScore,
      skillsCoverage: skillsCoverageScore,
      quantifiedImpact: quantifiedImpactScore,
      formattingReadability: formattingReadabilityScore,
      titleSummaryRelevance: titleSummaryRelevanceScore,
    },
    matchedKeywords,
    missingKeywords,
    actionableTips,
    tailoredHeadline: `${topDetectedRole} | ${matchedKeywords.slice(0, 3).map((m) => m.term).join(' · ')}`,
    tailoredSummary,
    suggestedBullets: [
      `Spearheaded core engineering and architecture initiatives leveraging ${matchedKeywords[0]?.term || 'modern technologies'}, improving system throughput by 34%.`,
      `Collaborated cross-functionally across engineering, product, and design teams to deliver high-priority roadmap deliverables on time and within budget.`,
    ],
    totalJdWordCount: jdTokens.length,
    totalResumeWordCount: fullResumeCorpus.split(/\s+/).length,
  };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractLikelyRoleTitle(text: string): string | null {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 6)) {
    if (
      /(engineer|developer|architect|manager|lead|director|specialist|analyst|designer|planner|consultant)/i.test(line) &&
      line.length < 60
    ) {
      return line.replace(/^(job title|role|position|about the role):\s*/i, '');
    }
  }
  return null;
}
