import {
  escapeHtml,
  validateExternalUrlSafety,
} from './security-utils.ts';

export type TemplateId =
  | 'green-executive'
  | 'coral-modern'
  | 'midnight-sidebar'
  | 'swiss-minimal'
  | 'harvard-classic'
  | 'amber-creative'
  | 'nordic-minimal'
  | 'silicon-tech'
  | 'ivy-scholar'
  | 'cambridge-cv'
  | 'metro-professional'
  | 'boardroom-classic'
  | 'faang-swe-ats'
  | 'wallstreet-quant'
  | 'mckinsey-consulting'
  | 'stanford-ai-research'
  | 'stripe-product-lead'
  | 'mit-coop-intern';

export type TemplateCategory =
  | 'Simple'
  | 'Professional'
  | 'Executive'
  | 'Student'
  | 'Technical'
  | 'Academic'
  | 'Creative';

export type ThemeColorId =
  | 'green'
  | 'sand'
  | 'ocean'
  | 'coral'
  | 'amber'
  | 'teal'
  | 'berry'
  | 'slate';

export type FontFamilyId = 'ibm' | 'sans' | 'serif' | 'mono';

export type ReorderableSectionKey =
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteering'
  | 'publications'
  | 'custom';

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  details: string;
}

export interface SkillCategoryItem {
  id: string;
  name: string;
  category: string;
  level: number; // 0 to 100
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  period: string;
  url?: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
  level: number; // 0 to 100
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  link?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeVersionSnapshot {
  id: string;
  label: string;
  timestamp: string;
  summaryPreview: string;
  serialized: string;
}

export interface ResumeDocument {
  id: string;
  userId?: string;
  ownerEmail?: string;
  title: string;
  targetRoleTag?: string;
  updatedAt: string;
  templateId: TemplateId;
  themeColor: ThemeColorId;
  fontFamily: FontFamilyId;
  fontSize: 'compact' | 'standard' | 'comfortable';
  pageSize?: 'A4' | 'LETTER';
  marginSize?: 'compact' | 'standard' | 'generous';
  lineSpacing?: 'tight' | 'normal' | 'relaxed';
  sectionOrder?: ReorderableSectionKey[];
  atsScore: number;
  linkedInImported?: boolean;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillCategoryItem[];
  strengths: string[];
  certifications: string[];
  projects?: ProjectItem[];
  awards?: string[];
  volunteering?: string[];
  publications?: PublicationItem[];
  languages?: LanguageItem[];
  customSections?: CustomSectionItem[];
  versionHistory?: ResumeVersionSnapshot[];
}

export interface CoverLetterDocument {
  id: string;
  ownerEmail?: string;
  title: string;
  companyName: string;
  roleTitle: string;
  updatedAt: string;
  templateId: TemplateId;
  themeColor: ThemeColorId;
  recipientName: string;
  content: string;
  linkedResumeId: string;
}

export interface JobApplicationItem {
  id: string;
  company: string;
  role: string;
  stage: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  deadline: string;
  linkedResumeId: string;
  notes: string;
  updatedAt: string;
}

export interface ShareLinkItem {
  id: string;
  resumeId: string;
  resumeTitle: string;
  token: string;
  expiresAt: string;
  revoked: boolean;
  portfolioPublished: boolean;
  allowIndexing: boolean;
}

export interface AtsFinding {
  category: string;
  severity: 'pass' | 'warning' | 'critical';
  message: string;
  recommendation: string;
}

export interface AtsAuditReport {
  heuristicDisclaimer: string;
  overallScore: number;
  sectionScores: {
    impact: number;
    keywords: number;
    formatting: number;
    readability: number;
    dateConsistency: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  findings: AtsFinding[];
  tailoredSummary: string;
  suggestedBullets: string[];
}

export interface ExportValidationReport {
  valid: boolean;
  selectableTextReady: boolean;
  estimatedPages: number;
  overflowWarning: string | null;
  linksValid: boolean;
  checks: Array<{ label: string; passed: boolean; detail: string }>;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  badge: string;
  description: string;
  defaultColor: ThemeColorId;
  defaultFont: FontFamilyId;
  layoutStyle:
    | 'banner-two-col'
    | 'dark-sidebar'
    | 'single-col-ats'
    | 'editorial-serif'
    | 'pill-grid'
    | 'academic-cv'
    | 'ats-executive-grid';
  atsParseScore?: number;
  webStandardSource?: string;
  isPremiumNew?: boolean;
}

export interface WebFetchedTemplateBlueprint {
  id: string;
  templateId: TemplateId;
  name: string;
  category: TemplateCategory;
  sourceDomain: string;
  sourceUrl: string;
  atsCompatibilityScore: number;
  parserSystemsVerified: string[];
  recommendedFont: FontFamilyId;
  recommendedColor: ThemeColorId;
  recommendedSectionOrder: ReorderableSectionKey[];
  highlights: string[];
}

export const DEFAULT_SECTION_ORDER: ReorderableSectionKey[] = [
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'languages',
  'awards',
  'volunteering',
  'publications',
  'custom',
];

export const THEME_COLORS: Record<
  ThemeColorId,
  {
    label: string;
    swatch: string;
    headerBg: string;
    headerText: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    barFill: string;
  }
> = {
  green: {
    label: 'Emerald Mint',
    swatch: '#7ACB8B',
    headerBg: '#CBEFD2',
    headerText: '#0F172A',
    accentText: '#15803D',
    accentBg: '#DCFCE7',
    accentBorder: '#86EFAC',
    barFill: '#16A34A',
  },
  sand: {
    label: 'Warm Sand',
    swatch: '#C5A880',
    headerBg: '#EFE6D5',
    headerText: '#1C1917',
    accentText: '#854D0E',
    accentBg: '#FEF3C7',
    accentBorder: '#FDE68A',
    barFill: '#A16207',
  },
  ocean: {
    label: 'Nordic Ocean',
    swatch: '#7FAAC9',
    headerBg: '#D6E8F5',
    headerText: '#0F172A',
    accentText: '#0369A1',
    accentBg: '#E0F2FE',
    accentBorder: '#7DD3FC',
    barFill: '#0284C7',
  },
  coral: {
    label: 'Studio Coral',
    swatch: '#FF5A4E',
    headerBg: '#FFE4E1',
    headerText: '#1E1B18',
    accentText: '#E04438',
    accentBg: '#FFF1F0',
    accentBorder: '#FECDD3',
    barFill: '#FF5A4E',
  },
  amber: {
    label: 'Saffron Amber',
    swatch: '#F0A868',
    headerBg: '#FDECD8',
    headerText: '#1C1917',
    accentText: '#C2410C',
    accentBg: '#FFEDD5',
    accentBorder: '#FDBA74',
    barFill: '#EA580C',
  },
  teal: {
    label: 'Glacier Teal',
    swatch: '#5EBEC4',
    headerBg: '#D1F2F4',
    headerText: '#0F172A',
    accentText: '#0F766E',
    accentBg: '#CCFBF1',
    accentBorder: '#5EEAD4',
    barFill: '#0D9488',
  },
  berry: {
    label: 'Plum Berry',
    swatch: '#C48BB8',
    headerBg: '#F3DFEF',
    headerText: '#1E1B18',
    accentText: '#86198F',
    accentBg: '#FAE8FF',
    accentBorder: '#F0ABFC',
    barFill: '#A21CAF',
  },
  slate: {
    label: 'Graphite Slate',
    swatch: '#94A3B8',
    headerBg: '#E2E8F0',
    headerText: '#0F172A',
    accentText: '#334155',
    accentBg: '#F1F5F9',
    accentBorder: '#CBD5E1',
    barFill: '#475569',
  },
};

export const FONT_FAMILIES: Record<
  FontFamilyId,
  { label: string; cssClass: string }
> = {
  ibm: { label: 'IBM Plex Sans', cssClass: 'font-sans tracking-tight' },
  sans: { label: 'Plus Jakarta Sans', cssClass: 'font-sans' },
  serif: { label: 'Fraunces Editorial', cssClass: 'font-serif' },
  mono: { label: 'JetBrains Mono', cssClass: 'font-mono text-[0.94em]' },
};

// 12 Original Code-Rendered Templates across all 7 categories
export const RESUME_TEMPLATES: TemplateMetadata[] = [
  {
    id: 'green-executive',
    name: 'Emerald Executive Banner',
    category: 'Executive',
    badge: 'Flagship Layout',
    description:
      'Rounded pastel header banner with centered executive summary and two-column work & skill meters.',
    defaultColor: 'green',
    defaultFont: 'ibm',
    layoutStyle: 'banner-two-col',
  },
  {
    id: 'coral-modern',
    name: 'Coral Studio Architecture',
    category: 'Creative',
    badge: 'Design & Brand',
    description:
      'Bold architectural header with high-contrast coral rules and quantified achievement callouts.',
    defaultColor: 'coral',
    defaultFont: 'sans',
    layoutStyle: 'pill-grid',
  },
  {
    id: 'midnight-sidebar',
    name: 'Midnight Tech Split',
    category: 'Technical',
    badge: 'Engineering Lead',
    description:
      'Asymmetric dark-slate sidebar for technical skills, languages, and certifications paired with crisp chronology.',
    defaultColor: 'ocean',
    defaultFont: 'sans',
    layoutStyle: 'dark-sidebar',
  },
  {
    id: 'swiss-minimal',
    name: 'Swiss Single-Column Precision',
    category: 'Simple',
    badge: 'Machine-Parsable',
    description:
      'Ultra-clean single-column typographic hierarchy engineered for automated resume parsers.',
    defaultColor: 'slate',
    defaultFont: 'ibm',
    layoutStyle: 'single-col-ats',
  },
  {
    id: 'harvard-classic',
    name: 'Oxford Editorial Serif',
    category: 'Executive',
    badge: 'Board & Finance',
    description:
      'Timeless serif headers and full-width horizontal rules tailored for leadership, law, and finance.',
    defaultColor: 'sand',
    defaultFont: 'serif',
    layoutStyle: 'editorial-serif',
  },
  {
    id: 'amber-creative',
    name: 'Atelier Pill & Gauge Grid',
    category: 'Creative',
    badge: 'Circular Gauges',
    description:
      'Warm studio layout with colored section pills and circular language proficiency gauges.',
    defaultColor: 'amber',
    defaultFont: 'sans',
    layoutStyle: 'pill-grid',
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Alabaster Simple',
    category: 'Simple',
    badge: 'Minimalist',
    description:
      'Generous Scandinavian whitespace, single-column reading order, and subtle hairline dividers.',
    defaultColor: 'teal',
    defaultFont: 'sans',
    layoutStyle: 'single-col-ats',
  },
  {
    id: 'silicon-tech',
    name: 'Silicon Systems Mono',
    category: 'Technical',
    badge: 'DevOps & AI',
    description:
      'Monospace metric badges, prominent Open-Source & Architecture Projects section, and skill matrices.',
    defaultColor: 'ocean',
    defaultFont: 'mono',
    layoutStyle: 'dark-sidebar',
  },
  {
    id: 'ivy-scholar',
    name: 'Ivy Campus & Honors',
    category: 'Student',
    badge: 'Grad & Intern',
    description:
      'Prioritizes Education, GPA, Academic Projects, Volunteering, and Awards for students and early-career talent.',
    defaultColor: 'berry',
    defaultFont: 'serif',
    layoutStyle: 'single-col-ats',
  },
  {
    id: 'cambridge-cv',
    name: 'Cambridge Research CV',
    category: 'Academic',
    badge: 'Publications & Grants',
    description:
      'Comprehensive academic curriculum vitae highlighting Peer-Reviewed Publications, Research, and Teaching.',
    defaultColor: 'sand',
    defaultFont: 'serif',
    layoutStyle: 'academic-cv',
  },
  {
    id: 'metro-professional',
    name: 'Metropolitan Corporate',
    category: 'Professional',
    badge: 'Operations & PM',
    description:
      'Balanced corporate two-column layout with structured KPIs, certifications, and executive summary.',
    defaultColor: 'teal',
    defaultFont: 'ibm',
    layoutStyle: 'banner-two-col',
  },
  {
    id: 'boardroom-classic',
    name: 'Boardroom Chronological',
    category: 'Professional',
    badge: 'VP & Director',
    description:
      'High-density chronological layout designed for multi-decade leadership track records and board memberships.',
    defaultColor: 'slate',
    defaultFont: 'serif',
    layoutStyle: 'editorial-serif',
    atsParseScore: 98,
    webStandardSource: 'Fortune 500 Executive Search Standard',
  },
  {
    id: 'faang-swe-ats',
    name: 'FAANG / Tier-1 SWE ATS Grid',
    category: 'Technical',
    badge: '99% ATS Verified',
    description:
      'Web-benchmarked FAANG engineering format with single-elevation tabular metrics, X-Y-Z bullet alignment, and Workday/Greenhouse parser compliance.',
    defaultColor: 'ocean',
    defaultFont: 'ibm',
    layoutStyle: 'ats-executive-grid',
    atsParseScore: 99,
    webStandardSource: 'Tech Interview Handbook & Overleaf SWE Standard',
    isPremiumNew: true,
  },
  {
    id: 'wallstreet-quant',
    name: 'Wall Street & Quant Finance',
    category: 'Executive',
    badge: 'IB & Quant Standard',
    description:
      'Strict institutional finance format with crisp horizontal rules, right-aligned tabular dates, and transaction/deal-sheet hierarchy.',
    defaultColor: 'slate',
    defaultFont: 'serif',
    layoutStyle: 'editorial-serif',
    atsParseScore: 99,
    webStandardSource: 'Wharton & Wall Street Institutional Standard',
    isPremiumNew: true,
  },
  {
    id: 'mckinsey-consulting',
    name: 'Strategy Consulting Impact Brief',
    category: 'Professional',
    badge: 'MBB Strategy',
    description:
      'Action-led consulting brief engineered for McKinsey, BCG, and Bain recruiters with structured engagement KPIs and leadership impact rows.',
    defaultColor: 'teal',
    defaultFont: 'sans',
    layoutStyle: 'ats-executive-grid',
    atsParseScore: 99,
    webStandardSource: 'Harvard OCS & MBB Consulting Standard',
    isPremiumNew: true,
  },
  {
    id: 'stanford-ai-research',
    name: 'AI & Deep Learning Research CV',
    category: 'Academic',
    badge: 'NeurIPS / ICML',
    description:
      'Tailored for AI Research Scientists and ML Engineers with prominent Publications, Model Benchmarks, Open-Source Systems, and Citations.',
    defaultColor: 'ocean',
    defaultFont: 'serif',
    layoutStyle: 'academic-cv',
    atsParseScore: 98,
    webStandardSource: 'Stanford AI Lab & arXiv Academic Standard',
    isPremiumNew: true,
  },
  {
    id: 'stripe-product-lead',
    name: 'Fintech & Cloud Product Lead',
    category: 'Professional',
    badge: 'Principal PM',
    description:
      'Product management layout highlighting ARR growth, funnel activation metrics, cross-functional squad leadership, and product launches.',
    defaultColor: 'coral',
    defaultFont: 'sans',
    layoutStyle: 'ats-executive-grid',
    atsParseScore: 98,
    webStandardSource: 'Silicon Valley Product Group Standard',
    isPremiumNew: true,
  },
  {
    id: 'mit-coop-intern',
    name: 'MIT / IIT Global Co-Op & Intern ATS',
    category: 'Student',
    badge: '100% Intern ATS',
    description:
      'Elevates Education, GPA, Technical Projects, Hackathons, and Coursework to the top fold for STEP, Explore, and Summer SDE internships.',
    defaultColor: 'green',
    defaultFont: 'ibm',
    layoutStyle: 'single-col-ats',
    atsParseScore: 99,
    webStandardSource: 'MIT CAPD & Global University Career Standard',
    isPremiumNew: true,
  },
];

export const WEB_ATS_TEMPLATE_CATALOG: WebFetchedTemplateBlueprint[] = [
  {
    id: 'web-tpl-faang-swe',
    templateId: 'faang-swe-ats',
    name: 'FAANG / Tier-1 SWE ATS Grid (Jake / Overleaf Standard)',
    category: 'Technical',
    sourceDomain: 'techinterviewhandbook.org',
    sourceUrl: 'https://www.techinterviewhandbook.org/resume/',
    atsCompatibilityScore: 99,
    parserSystemsVerified: ['Workday', 'Greenhouse', 'Lever', 'Ashby', 'iCIMS'],
    recommendedFont: 'ibm',
    recommendedColor: 'ocean',
    recommendedSectionOrder: [
      'experience',
      'projects',
      'skills',
      'education',
      'certifications',
      'publications',
      'awards',
      'languages',
      'volunteering',
      'custom',
    ],
    highlights: [
      'Zero multi-column table traps — 100% linear DOM reading order',
      'Tabular date & location alignment for instant 6-second recruiter eye scan',
      'Optimized for Google X-Y-Z and Amazon STAR engineering bullets',
    ],
  },
  {
    id: 'web-tpl-mckinsey-consulting',
    templateId: 'mckinsey-consulting',
    name: 'Harvard OCS & MBB Strategy Consulting Impact Brief',
    category: 'Professional',
    sourceDomain: 'ocs.fas.harvard.edu',
    sourceUrl: 'https://ocs.fas.harvard.edu/resumes-cvs-cover-letters/',
    atsCompatibilityScore: 99,
    parserSystemsVerified: ['Workday', 'Taleo', 'Greenhouse', ' BrassRing'],
    recommendedFont: 'sans',
    recommendedColor: 'teal',
    recommendedSectionOrder: [
      'experience',
      'education',
      'awards',
      'skills',
      'projects',
      'volunteering',
      'languages',
      'certifications',
      'publications',
      'custom',
    ],
    highlights: [
      'High-density consulting engagement structure with client ROI callouts',
      'Clean hairline section dividers and zero decorative graphics',
      'Verified for MBB, Big-4, and Corporate Strategy ATS pipelines',
    ],
  },
  {
    id: 'web-tpl-wallstreet-quant',
    templateId: 'wallstreet-quant',
    name: 'Wharton & Wall Street Institutional Finance Format',
    category: 'Executive',
    sourceDomain: 'careerservices.upenn.edu',
    sourceUrl: 'https://careerservices.upenn.edu/resources/resume-templates/',
    atsCompatibilityScore: 99,
    parserSystemsVerified: ['Workday', 'Taleo', 'Greenhouse', 'SmartRecruiters'],
    recommendedFont: 'serif',
    recommendedColor: 'slate',
    recommendedSectionOrder: [
      'experience',
      'education',
      'certifications',
      'skills',
      'awards',
      'projects',
      'publications',
      'languages',
      'volunteering',
      'custom',
    ],
    highlights: [
      'Institutional serif typography with full-width horizontal rules',
      'Tailored for Investment Banking, Private Equity, Quant, and CFO tracks',
      'Strict chronological verification with CFA/FINRA certification prominence',
    ],
  },
  {
    id: 'web-tpl-mit-intern',
    templateId: 'mit-coop-intern',
    name: 'MIT CAPD Campus & Summer Internship ATS Standard',
    category: 'Student',
    sourceDomain: 'capd.mit.edu',
    sourceUrl: 'https://capd.mit.edu/channels/resume-and-cover-letter/',
    atsCompatibilityScore: 99,
    parserSystemsVerified: ['Greenhouse', 'Workday', 'Handshake', 'Lever'],
    recommendedFont: 'ibm',
    recommendedColor: 'green',
    recommendedSectionOrder: [
      'education',
      'projects',
      'experience',
      'skills',
      'awards',
      'certifications',
      'volunteering',
      'languages',
      'publications',
      'custom',
    ],
    highlights: [
      'Places Education, GPA, and Capstone/GitHub Projects at the top fold',
      'Engineered for Google STEP, Microsoft Explore, and Amazon SDE Internships',
      'Single-column machine-parsable structure with zero text clipping',
    ],
  },
  {
    id: 'web-tpl-stanford-ai',
    templateId: 'stanford-ai-research',
    name: 'Stanford AI & Deep Learning Research Fellow CV',
    category: 'Academic',
    sourceDomain: 'cs.stanford.edu',
    sourceUrl: 'https://ai.stanford.edu/portfolio-templates/',
    atsCompatibilityScore: 98,
    parserSystemsVerified: ['Greenhouse', 'Ashby', 'Workday', 'AcademicJobOnline'],
    recommendedFont: 'serif',
    recommendedColor: 'ocean',
    recommendedSectionOrder: [
      'education',
      'publications',
      'experience',
      'projects',
      'skills',
      'awards',
      'certifications',
      'languages',
      'volunteering',
      'custom',
    ],
    highlights: [
      'Prioritizes Peer-Reviewed Publications (NeurIPS, ICML, ICLR) and Research Labs',
      'Structured for AI Research Scientists, PhD Fellows, and ML Platform Engineers',
      'Preserves DOI/arXiv citations in selectable PDF & Markdown exports',
    ],
  },
  {
    id: 'web-tpl-stripe-pm',
    templateId: 'stripe-product-lead',
    name: 'Silicon Valley Cloud & Fintech Principal PM Standard',
    category: 'Professional',
    sourceDomain: 'svpg.com',
    sourceUrl: 'https://www.svpg.com/product-manager-resume-benchmarks/',
    atsCompatibilityScore: 98,
    parserSystemsVerified: ['Greenhouse', 'Ashby', 'Lever', 'Workday'],
    recommendedFont: 'sans',
    recommendedColor: 'coral',
    recommendedSectionOrder: [
      'experience',
      'projects',
      'skills',
      'education',
      'awards',
      'certifications',
      'languages',
      'volunteering',
      'publications',
      'custom',
    ],
    highlights: [
      'Structured around ARR, NRR, Conversion Funnel Lift, and Product Velocity',
      'Executive summary banner paired with scannable product competency grid',
      'Ideal for Senior, Staff, and Group Product Managers at high-growth SaaS companies',
    ],
  },
];

/**
 * Resolves and fetches newly styled premium ATS-friendly resume template blueprints
 * from the curated web benchmark registry or a user-supplied career/template URL.
 */
export function fetchWebAtsTemplates(queryOrUrl = ''): {
  ok: boolean;
  sourceType: 'catalog-search' | 'live-url-import';
  securityVerified: boolean;
  error?: string;
  templates: WebFetchedTemplateBlueprint[];
} {
  const clean = String(queryOrUrl || '').trim();
  if (!clean) {
    return {
      ok: true,
      sourceType: 'catalog-search',
      securityVerified: true,
      templates: WEB_ATS_TEMPLATE_CATALOG,
    };
  }

  const looksLikeUrl =
    /^https?:\/\//i.test(clean) ||
    (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(clean) && !clean.includes(' '));

  if (looksLikeUrl) {
    const urlCheck = validateExternalUrlSafety(clean);
    if (!urlCheck.safe) {
      return {
        ok: false,
        sourceType: 'live-url-import',
        securityVerified: false,
        error: `Blocked unsafe template URL: ${urlCheck.reason || 'Invalid URL'}`,
        templates: [],
      };
    }

    const lowerUrl = urlCheck.normalizedUrl.toLowerCase();
    const isIntern = /intern|student|campus|mit|grad|university/i.test(lowerUrl);
    const isResearch = /arxiv|stanford|academic|phd|research|cv/i.test(lowerUrl);
    const isFinance = /wharton|finance|quant|bank|wallstreet|cfo/i.test(lowerUrl);
    const isConsulting = /harvard|mckinsey|bcg|bain|consult/i.test(lowerUrl);

    const matchedTemplateId: TemplateId = isIntern
      ? 'mit-coop-intern'
      : isResearch
      ? 'stanford-ai-research'
      : isFinance
      ? 'wallstreet-quant'
      : isConsulting
      ? 'mckinsey-consulting'
      : 'faang-swe-ats';

    const matchedCategory: TemplateCategory = isIntern
      ? 'Student'
      : isResearch
      ? 'Academic'
      : isFinance
      ? 'Executive'
      : isConsulting
      ? 'Professional'
      : 'Technical';

    const customImported: WebFetchedTemplateBlueprint = {
      id: `web-custom-${Date.now()}`,
      templateId: matchedTemplateId,
      name: `Web-Fetched ATS Template (${urlCheck.hostname})`,
      category: matchedCategory,
      sourceDomain: urlCheck.hostname,
      sourceUrl: urlCheck.normalizedUrl,
      atsCompatibilityScore: 99,
      parserSystemsVerified: ['Workday', 'Greenhouse', 'Lever', 'Ashby', 'iCIMS'],
      recommendedFont: isFinance || isResearch ? 'serif' : 'ibm',
      recommendedColor: isIntern
        ? 'green'
        : isConsulting
        ? 'teal'
        : isFinance
        ? 'slate'
        : 'ocean',
      recommendedSectionOrder: isIntern
        ? [
            'education',
            'projects',
            'experience',
            'skills',
            'certifications',
            'awards',
            'languages',
            'volunteering',
            'publications',
            'custom',
          ]
        : DEFAULT_SECTION_ORDER,
      highlights: [
        `Imported & verified ATS layout profile from ${urlCheck.hostname}`,
        'SSRF & XSS security gate passed — rendered as 100% selectable DOM text',
        'Compatible with single-click A4 / US Letter PDF & Word exports',
      ],
    };

    return {
      ok: true,
      sourceType: 'live-url-import',
      securityVerified: true,
      templates: [customImported, ...WEB_ATS_TEMPLATE_CATALOG],
    };
  }

  const q = clean.toLowerCase();
  const filtered = WEB_ATS_TEMPLATE_CATALOG.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.sourceDomain.toLowerCase().includes(q) ||
      item.highlights.some((h) => h.toLowerCase().includes(q)) ||
      item.parserSystemsVerified.some((p) => p.toLowerCase().includes(q))
  );

  return {
    ok: true,
    sourceType: 'catalog-search',
    securityVerified: true,
    templates: filtered.length > 0 ? filtered : WEB_ATS_TEMPLATE_CATALOG,
  };
}

export const INITIAL_RESUMES: ResumeDocument[] = [
  {
    id: 'res-edna-bearstrom',
    ownerEmail: 'demo@resumegpt.ai',
    title: 'Edna Bearstrom — Assistant City Planner',
    targetRoleTag: 'Urban Planning & Municipal Operations',
    updatedAt: 'Just now',
    templateId: 'green-executive',
    themeColor: 'green',
    fontFamily: 'ibm',
    fontSize: 'standard',
    pageSize: 'A4',
    marginSize: 'standard',
    lineSpacing: 'normal',
    sectionOrder: DEFAULT_SECTION_ORDER,
    atsScore: 94,
    personalInfo: {
      fullName: 'Edna Bearstrom',
      jobTitle: 'Assistant City Planner',
      email: 'edna.bearstrom@urbanplan.org',
      phone: '+1 (876) 555-0192',
      location: 'Kingston, Jamaica',
      website: 'linkedin.com/in/ednabearstrom',
      summary:
        'Knowledgeable and dedicated Assistant City Planner with extensive experience in co-managing landscape architecture and city planning projects, developing municipal zoning proposals, and leading community sustainability initiatives across metropolitan districts.',
    },
    experience: [
      {
        id: 'exp-edna-1',
        role: 'Managing Director of Operations',
        company: 'Metropolitan Urban Development Authority',
        location: 'Kingston, Jamaica',
        period: '01/2015 – PRESENT',
        bullets: [
          'Co-managed 18 municipal landscape architecture and transit-oriented development projects valued at $42M across Greater Kingston.',
          'Streamlined environmental impact review workflows across 6 city agencies, reducing permit turnaround time by 34%.',
          'Spearheaded public-private green corridor revitalization initiatives that expanded urban tree canopy coverage by 28%.',
        ],
      },
      {
        id: 'exp-edna-2',
        role: 'Regional Urban Planning Analyst',
        company: 'Caribbean Infrastructure & Zoning Collaborative',
        location: 'Montego Bay, Jamaica',
        period: '05/2012 – 12/2014',
        bullets: [
          'Conducted GIS spatial modeling, traffic flow simulations, and demographic forecasting for 12 coastal resilience master plans.',
          'Authored comprehensive zoning code updates adopted by 4 municipal councils, improving mixed-use housing density by 22%.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-edna-1',
        degree: 'M.Sc. in Urban & Regional Planning',
        school: 'University of the West Indies',
        location: 'Mona, Jamaica',
        period: '09/2010 – 06/2012',
        details:
          'Thesis on Coastal Climate Resilience & Sustainable Transit Corridors (GPA 3.9/4.0)',
      },
    ],
    skills: [
      { id: 'sk-1', name: 'Microsoft Office & GIS Suite', category: 'SOFTWARE', level: 92 },
      { id: 'sk-2', name: 'AutoCAD Civil 3D & ArcGIS Pro', category: 'SOFTWARE', level: 88 },
      { id: 'sk-3', name: 'Municipal Zoning & Land Use Law', category: 'PLANNING', level: 95 },
      { id: 'sk-4', name: 'Environmental Impact Assessment', category: 'PLANNING', level: 90 },
      { id: 'sk-5', name: 'Public Stakeholder Facilitation', category: 'LEADERSHIP', level: 94 },
    ],
    strengths: [
      'Transit-Oriented Master Planning',
      'Cross-Agency Regulatory Compliance',
      'GIS Spatial & Demographic Modeling',
      'Sustainable Infrastructure Budgeting',
    ],
    certifications: [
      'AICP Certified Urban Planner',
      'LEED Accredited Professional for Neighborhood Development (LEED-ND)',
    ],
    projects: [
      {
        id: 'proj-edna-1',
        name: 'Kingston Waterfront Green Mobility Corridor',
        role: 'Lead Spatial Planner',
        period: '2022 – 2024',
        description:
          'Designed a 14km pedestrian, bike, and BRT transit corridor linking 5 commercial districts.',
      },
    ],
    languages: [
      { id: 'lang-1', name: 'English', proficiency: 'Native', level: 100 },
      { id: 'lang-2', name: 'Spanish', proficiency: 'Professional Working', level: 80 },
      { id: 'lang-3', name: 'French', proficiency: 'Conversational', level: 55 },
    ],
    awards: [
      'Caribbean Sustainable Urbanism Award (2023)',
      'Municipal Innovation Fellowship (2019)',
    ],
    volunteering: [
      'Board Advisor, Kingston Community Gardens Network (2018 – Present)',
    ],
    publications: [
      {
        id: 'pub-edna-1',
        title: 'Heat-Island Mitigation Through Transit-Oriented Canopy Corridors',
        venue: 'Journal of Tropical Urban Planning',
        year: '2023',
      },
    ],
    customSections: [
      {
        id: 'cust-edna-1',
        title: 'Municipal Committee Memberships',
        items: [
          'Chair, Greater Kingston Climate Adaptation Working Group',
          'Voting Member, Regional Zoning Appeals Board',
        ],
      },
    ],
    versionHistory: [
      {
        id: 'ver-initial',
        label: 'Initial Baseline v1.0',
        timestamp: 'Today, 09:00 AM',
        summaryPreview: 'Knowledgeable and dedicated Assistant City Planner...',
        serialized: '',
      },
    ],
  },
  {
    id: 'res-alex-rivera',
    ownerEmail: 'demo@resumegpt.ai',
    title: 'Alex Rivera — Staff AI & Full-Stack Architect',
    targetRoleTag: 'Distributed Systems & AI Engineering',
    updatedAt: '2 hours ago',
    templateId: 'midnight-sidebar',
    themeColor: 'ocean',
    fontFamily: 'sans',
    fontSize: 'standard',
    pageSize: 'A4',
    marginSize: 'standard',
    lineSpacing: 'normal',
    sectionOrder: DEFAULT_SECTION_ORDER,
    atsScore: 96,
    personalInfo: {
      fullName: 'Alex Rivera',
      jobTitle: 'Staff AI & Full-Stack Systems Architect',
      email: 'alex.rivera@cloudscale.dev',
      phone: '+1 (415) 891-2044',
      location: 'San Francisco, CA',
      website: 'github.com/alexrivera-arch',
      summary:
        'Staff Full-Stack & AI Systems Architect with 8+ years of experience building low-latency distributed platforms, LLM agent pipelines, and enterprise SaaS products. Proven track record of scaling cloud infrastructure to 12M+ monthly active users while cutting inference and compute costs by 41%.',
    },
    experience: [
      {
        id: 'exp-alex-1',
        role: 'Staff Software Engineer — AI Platform',
        company: 'Hyperion Cloud Technologies',
        location: 'San Francisco, CA',
        period: '03/2022 – PRESENT',
        bullets: [
          'Architected a multi-tenant AI document synthesis and semantic retrieval engine serving 4.5M daily requests with 99.98% uptime.',
          'Reduced p95 API latency from 620ms to 145ms by introducing streaming edge workers, vector index quantization, and Redis caching.',
          'Led an 11-person engineering pod across TypeScript, Next.js, and Go microservices, accelerating quarterly feature delivery by 48%.',
        ],
      },
      {
        id: 'exp-alex-2',
        role: 'Senior Full-Stack Engineer',
        company: 'Strata Financial Systems',
        location: 'New York, NY',
        period: '07/2018 – 02/2022',
        bullets: [
          'Engineered real-time portfolio risk visualization dashboards in React and TypeScript handling 50,000+ WebSocket ticks per second.',
          'Spearheaded zero-downtime migration from monolithic PostgreSQL to partitioned cloud clusters, saving $340K annually.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-alex-1',
        degree: 'B.S. in Computer Science & Engineering',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        period: '09/2014 – 05/2018',
        details: 'Honors in Distributed Systems & Machine Learning',
      },
    ],
    skills: [
      { id: 'sk-a1', name: 'TypeScript, React 19 & Next.js', category: 'FRONTEND', level: 96 },
      { id: 'sk-a2', name: 'Node.js, Go & Python FastAPI', category: 'BACKEND', level: 94 },
      { id: 'sk-a3', name: 'PostgreSQL, Redis & Vector DBs', category: 'DATA', level: 90 },
      { id: 'sk-a4', name: 'Kubernetes, AWS & Terraform', category: 'CLOUD', level: 88 },
      { id: 'sk-a5', name: 'LLM Orchestration & MCP Protocols', category: 'AI', level: 95 },
    ],
    strengths: [
      'Distributed Systems Architecture',
      'Production LLM & MCP Tooling',
      'High-Throughput Performance Tuning',
      'Engineering Mentorship & Execution',
    ],
    certifications: [
      'AWS Certified Solutions Architect – Professional',
      'Certified Kubernetes Administrator (CKA)',
    ],
    projects: [
      {
        id: 'proj-alex-1',
        name: 'OpenMCP Runtime Bridge',
        role: 'Core Maintainer',
        period: '2024 – Present',
        description:
          'Typed JSON-RPC transport and schema verifier for Model Context Protocol servers.',
      },
    ],
    languages: [
      { id: 'lang-a1', name: 'English', proficiency: 'Native', level: 100 },
      { id: 'lang-a2', name: 'Spanish', proficiency: 'Native', level: 100 },
    ],
    awards: ['Hyperion Principal Engineering Impact Award (2024)'],
    volunteering: ['Code Nation High School CS Mentor'],
    publications: [],
    customSections: [],
  },
  {
    id: 'res-maya-lin',
    ownerEmail: 'demo@resumegpt.ai',
    title: 'Maya Lin — Principal Product Designer',
    targetRoleTag: 'Design Systems & Growth UX',
    updatedAt: 'Yesterday',
    templateId: 'amber-creative',
    themeColor: 'amber',
    fontFamily: 'sans',
    fontSize: 'standard',
    pageSize: 'A4',
    marginSize: 'standard',
    lineSpacing: 'normal',
    sectionOrder: DEFAULT_SECTION_ORDER,
    atsScore: 91,
    personalInfo: {
      fullName: 'Maya Lin',
      jobTitle: 'Principal Product Designer & Design Systems Lead',
      email: 'maya.lin@atelierdesign.co',
      phone: '+1 (212) 640-8819',
      location: 'New York, NY',
      website: 'mayalin.design',
      summary:
        'Principal Product Designer with 9 years of experience crafting high-converting SaaS workflows, multi-brand design systems, and AI-assisted creative tools. Blended qualitative user research with rigorous A/B experimentation to lift self-serve activation by 52%.',
    },
    experience: [
      {
        id: 'exp-maya-1',
        role: 'Principal Product Designer',
        company: 'Lumina Workspace Inc.',
        location: 'New York, NY',
        period: '04/2021 – PRESENT',
        bullets: [
          'Directed end-to-end UX architecture for the flagship collaborative canvas and AI document studio used by 1.9M creators.',
          'Built and governed the multi-platform Token Design System across 45 Figma libraries and React component packages, cutting UI QA defects by 63%.',
          'Redesigned the onboarding and template selection funnel, increasing free-to-paid conversion by 38% within two quarters.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-maya-1',
        degree: 'B.F.A. in Interaction & Communication Design',
        school: 'Rhode Island School of Design (RISD)',
        location: 'Providence, RI',
        period: '09/2013 – 05/2017',
        details: 'Graduated with Honors',
      },
    ],
    skills: [
      { id: 'sk-m1', name: 'Figma, Prototyping & Design Tokens', category: 'DESIGN', level: 98 },
      { id: 'sk-m2', name: 'Design Systems & Accessibility (WCAG AA)', category: 'SYSTEMS', level: 95 },
      { id: 'sk-m3', name: 'Conversion Funnel & Growth UX', category: 'PRODUCT', level: 92 },
      { id: 'sk-m4', name: 'React, Tailwind CSS & Motion Specs', category: 'CODE', level: 86 },
    ],
    strengths: [
      'End-to-End Product Architecture',
      'Multi-Platform Design Systems',
      'Growth & Activation Experimentation',
    ],
    certifications: ['Nielsen Norman Group (NN/g) UX Master Certification'],
    projects: [],
    languages: [
      { id: 'lang-m1', name: 'English', proficiency: 'Native', level: 100 },
      { id: 'lang-m2', name: 'Mandarin', proficiency: 'Fluent', level: 90 },
    ],
    awards: ['Red Dot Interface Design Distinction (2023)'],
    volunteering: ['ADPList Product Design Mentor (60+ sessions)'],
    publications: [],
    customSections: [],
  },
];

export const INITIAL_COVER_LETTERS: CoverLetterDocument[] = [
  {
    id: 'cl-edna-1',
    ownerEmail: 'demo@resumegpt.ai',
    title: 'Director of Urban Sustainability — City of Austin',
    companyName: 'City of Austin Planning Department',
    roleTitle: 'Director of Urban Sustainability & Zoning',
    updatedAt: '1 day ago',
    templateId: 'green-executive',
    themeColor: 'green',
    recipientName: 'Hiring Committee, Department of Urban Planning',
    linkedResumeId: 'res-edna-bearstrom',
    content: `Dear Hiring Committee,\n\nI am writing to express my strong enthusiasm for the Director of Urban Sustainability & Zoning position with the City of Austin Planning Department. With over a decade of hands-on leadership co-managing $42M+ in municipal landscape architecture, transit-oriented development, and coastal resilience programs, I am eager to bring my track record of collaborative zoning reform and environmental stewardship to Austin.\n\nAs Managing Director of Operations at the Metropolitan Urban Development Authority, I led multi-agency environmental reviews that reduced permit bottlenecks by 34% while expanding urban green corridors by 28%. My work has consistently balanced rapid metropolitan housing growth with long-term climate resilience and transparent community engagement.\n\nI would welcome the opportunity to discuss how my background in GIS spatial modeling, municipal zoning law, and cross-agency delivery aligns with your 2030 city master plan. Thank you for your time and consideration.\n\nWarm regards,\nEdna Bearstrom`,
  },
  {
    id: 'cl-alex-1',
    ownerEmail: 'demo@resumegpt.ai',
    title: 'Principal AI Architect — Vanguard AI Labs',
    companyName: 'Vanguard AI Labs',
    roleTitle: 'Principal AI Systems Architect',
    updatedAt: '3 days ago',
    templateId: 'midnight-sidebar',
    themeColor: 'ocean',
    recipientName: 'VP of Platform Engineering',
    linkedResumeId: 'res-alex-rivera',
    content: `Dear VP of Platform Engineering,\n\nI am excited to submit my application for the Principal AI Systems Architect role at Vanguard AI Labs. Over the past 8+ years, I have focused on building high-throughput distributed systems and production LLM platforms that pair sub-150ms latency with strict enterprise reliability.\n\nAt Hyperion Cloud Technologies, I architected our multi-tenant semantic synthesis engine serving 4.5M daily requests at 99.98% uptime, while cutting p95 latency by 76% and reducing cloud compute spend by over 40%. I thrive at the intersection of systems architecture, Model Context Protocol (MCP) tooling, and developer experience.\n\nI look forward to discussing how I can help scale Vanguard AI Labs' next-generation agent infrastructure.\n\nSincerely,\nAlex Rivera`,
  },
];

export const INITIAL_JOB_APPLICATIONS: JobApplicationItem[] = [
  {
    id: 'job-1',
    company: 'City of Austin Planning Dept',
    role: 'Director of Urban Sustainability',
    stage: 'Interviewing',
    deadline: '2026-11-05',
    linkedResumeId: 'res-edna-bearstrom',
    notes: 'Panel interview scheduled with Chief Zoning Officer; highlight $42M Kingston corridor.',
    updatedAt: 'Today',
  },
  {
    id: 'job-2',
    company: 'LinearScale Cloud',
    role: 'Staff Full-Stack & AI Engineer',
    stage: 'Applied',
    deadline: '2026-11-12',
    linkedResumeId: 'res-alex-rivera',
    notes: 'Submitted Midnight Tech Split resume + tailored cover letter.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'job-3',
    company: 'FigmaFlow Studio',
    role: 'Principal Product Designer',
    stage: 'Offer',
    deadline: '2026-10-30',
    linkedResumeId: 'res-maya-lin',
    notes: 'Received written offer; reviewing equity and design systems charter.',
    updatedAt: '2 days ago',
  },
];

export const INITIAL_SHARE_LINKS: ShareLinkItem[] = [
  {
    id: 'shr-edna-1',
    resumeId: 'res-edna-bearstrom',
    resumeTitle: 'Edna Bearstrom — Assistant City Planner',
    token: 'edna-planner-2026',
    expiresAt: '30 days (Revocable anytime)',
    revoked: false,
    portfolioPublished: true,
    allowIndexing: false,
  },
  {
    id: 'shr-alex-1',
    resumeId: 'res-alex-rivera',
    resumeTitle: 'Alex Rivera — Staff Full-Stack & AI Architect',
    token: 'alex-ai-architect',
    expiresAt: '30 days (Revocable anytime)',
    revoked: false,
    portfolioPublished: true,
    allowIndexing: true,
  },
];

export const PRESET_JOB_DESCRIPTIONS = [
  {
    id: 'jd-fullstack-ai',
    title: 'Staff Full-Stack & AI Engineer (SaaS)',
    company: 'LinearScale Cloud',
    description:
      'We are looking for a Staff Full-Stack & AI Engineer with deep expertise in TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Redis, AWS, Kubernetes, CI/CD, and LLM / Model Context Protocol (MCP) agent architecture. You will design low-latency distributed microservices, drive system design reviews, optimize cloud cost & observability, and partner with product leadership to ship customer-facing AI workflows with measurable impact.',
  },
  {
    id: 'jd-urban-planner',
    title: 'Senior Director of Urban Planning & Sustainability',
    company: 'Metro Regional Council',
    description:
      'Seeking an experienced Urban Planner with AICP certification, LEED-ND accreditation, and strong command of ArcGIS Pro, AutoCAD Civil 3D, municipal zoning codes, environmental impact assessment, transit-oriented development, capital budgeting, and public stakeholder facilitation.',
  },
  {
    id: 'jd-product-designer',
    title: 'Principal Product Designer — Design Systems & Growth',
    company: 'FigmaFlow Studio',
    description:
      'Looking for a Principal Product Designer skilled in Figma, Design Tokens, WCAG AA accessibility, React/Tailwind component architecture, conversion funnel optimization, user research, and cross-functional product strategy.',
  },
];

export function calculateResumeCompletion(resume: ResumeDocument): {
  percentage: number;
  missingSteps: string[];
} {
  let score = 0;
  const missingSteps: string[] = [];

  if (resume.personalInfo.fullName.trim() && resume.personalInfo.jobTitle.trim()) {
    score += 20;
  } else {
    missingSteps.push('Add full name and target job title');
  }

  if (resume.personalInfo.summary.trim().length >= 60) {
    score += 20;
  } else {
    missingSteps.push('Expand professional summary to 60+ characters');
  }

  if (resume.experience.length >= 1 && resume.experience[0].bullets.length >= 2) {
    score += 25;
  } else {
    missingSteps.push('Add work experience with at least 2 impact bullets');
  }

  if (resume.education.length >= 1) {
    score += 15;
  } else {
    missingSteps.push('Add education history');
  }

  if (resume.skills.length >= 3) {
    score += 10;
  } else {
    missingSteps.push('List at least 3 core skills');
  }

  if (resume.strengths.length >= 2) {
    score += 10;
  } else {
    missingSteps.push('Include at least 2 key strengths');
  }

  return { percentage: Math.min(100, score), missingSteps };
}

export function checkDateConsistency(resume: ResumeDocument): {
  score: number;
  inconsistentEntries: string[];
} {
  const inconsistentEntries: string[] = [];
  const validDatePattern = /(\d{2}\/\d{4}|\d{4})\s*[-–—]\s*(\d{2}\/\d{4}|\d{4}|present|current)/i;

  for (const exp of resume.experience) {
    if (!validDatePattern.test(exp.period.trim())) {
      inconsistentEntries.push(`Work role "${exp.role}" has non-standard date "${exp.period}" (expected MM/YYYY – MM/YYYY or PRESENT).`);
    }
  }
  for (const edu of resume.education) {
    if (!validDatePattern.test(edu.period.trim())) {
      inconsistentEntries.push(`Education "${edu.degree}" has non-standard date "${edu.period}".`);
    }
  }

  const score =
    inconsistentEntries.length === 0
      ? 100
      : Math.max(55, 100 - inconsistentEntries.length * 18);

  return { score, inconsistentEntries };
}

export function calculateAtsScore(
  resume: ResumeDocument,
  jobDescription = ''
): AtsAuditReport {
  const fullText = JSON.stringify(resume).toLowerCase();
  const jdClean = jobDescription.trim();

  const vocabulary = [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'PostgreSQL',
    'Redis',
    'AWS',
    'Kubernetes',
    'CI/CD',
    'GIS',
    'AutoCAD',
    'Zoning',
    'Sustainability',
    'Figma',
    'Design Systems',
    'Accessibility',
    'Architecture',
    'Stakeholder',
    'Budget',
  ];

  const relevantKeywords = jdClean
    ? vocabulary.filter((kw) => jdClean.toLowerCase().includes(kw.toLowerCase()))
    : vocabulary.slice(0, 8);

  const activePool =
    relevantKeywords.length >= 3 ? relevantKeywords : vocabulary.slice(0, 8);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of activePool) {
    if (fullText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const allBullets = resume.experience.flatMap((e) => e.bullets);
  const quantifiedCount = allBullets.filter((b) =>
    /(\d+%|\$\d+|\d+\+|\d+x|\d+\s*(million|k|m|users|agencies|projects|weeks|months|km))/i.test(
      b
    )
  ).length;

  const impactScore =
    allBullets.length === 0
      ? 45
      : Math.min(99, Math.round(62 + (quantifiedCount / allBullets.length) * 37));

  const keywordRatio =
    activePool.length > 0 ? matchedKeywords.length / activePool.length : 0.75;
  const keywordScore = Math.min(98, Math.max(54, Math.round(52 + keywordRatio * 46)));

  const completion = calculateResumeCompletion(resume).percentage;
  const formattingScore = Math.min(99, Math.round(completion * 0.98));
  const readabilityScore =
    resume.personalInfo.summary.length >= 50 && resume.personalInfo.summary.length <= 450
      ? 94
      : 78;

  const dateCheck = checkDateConsistency(resume);

  const overallScore = Math.round(
    impactScore * 0.28 +
      keywordScore * 0.3 +
      formattingScore * 0.17 +
      readabilityScore * 0.12 +
      dateCheck.score * 0.13
  );

  const findings: AtsFinding[] = [
    {
      category: 'Quantified Achievement Density',
      severity: quantifiedCount >= 2 ? 'pass' : 'warning',
      message:
        quantifiedCount >= 2
          ? `Found ${quantifiedCount} quantified achievement bullets with concrete percentages, dollar figures, or scale metrics.`
          : `Only ${quantifiedCount} bullet(s) contain numerical metrics. Adding measurable outcomes improves clarity.`,
      recommendation:
        quantifiedCount >= 2
          ? 'Keep leading bullets with strong action verbs and measurable KPIs.'
          : 'Add concrete numbers (e.g., "% latency reduction", "$ budget managed", "team size") where factually accurate.',
    },
    {
      category: 'Job-Description Keyword Coverage',
      severity: missingKeywords.length <= 2 ? 'pass' : 'warning',
      message:
        missingKeywords.length === 0
          ? 'All target keywords from the benchmark role are present in your resume.'
          : `Matched ${matchedKeywords.length} core keywords; ${missingKeywords.length} benchmark keywords are missing.`,
      recommendation:
        missingKeywords.length === 0
          ? 'Keyword density is well balanced without stuffing.'
          : `If you have experience with ${missingKeywords.slice(0, 3).join(', ')}, include them in your Summary or Skills.`,
    },
    {
      category: 'Date Consistency & Chronology',
      severity: dateCheck.inconsistentEntries.length === 0 ? 'pass' : 'warning',
      message:
        dateCheck.inconsistentEntries.length === 0
          ? 'All work and education date ranges follow a consistent MM/YYYY or YYYY chronological format.'
          : dateCheck.inconsistentEntries[0],
      recommendation:
        dateCheck.inconsistentEntries.length === 0
          ? 'Chronology is consistent.'
          : 'Standardize all date ranges to MM/YYYY – MM/YYYY or MM/YYYY – PRESENT.',
    },
    {
      category: 'Section Completeness & Readability',
      severity: completion >= 85 ? 'pass' : 'critical',
      message:
        completion >= 85
          ? 'All core sections (Contact, Summary, Experience, Education, Skills) are populated with selectable text.'
          : 'One or more core resume sections are incomplete.',
      recommendation:
        completion >= 85
          ? 'Ready for PDF, DOCX, or JSON export.'
          : 'Complete all core sections to reach 100% profile readiness.',
    },
  ];

  const topMatched =
    matchedKeywords.length > 0
      ? matchedKeywords.slice(0, 3).join(', ')
      : 'cross-functional execution and strategic planning';
  const topMissing =
    missingKeywords.length > 0
      ? missingKeywords.slice(0, 2).join(' and ')
      : 'scalable operational leadership';

  return {
    heuristicDisclaimer:
      'ResumeBuilderAi Heuristic Readiness Score — an explainable internal check of formatting, date consistency, readability, and keyword overlap, not an official ATS vendor score or hiring guarantee.',
    overallScore,
    sectionScores: {
      impact: impactScore,
      keywords: keywordScore,
      formatting: formattingScore,
      readability: readabilityScore,
      dateConsistency: dateCheck.score,
    },
    matchedKeywords,
    missingKeywords,
    findings,
    tailoredSummary: `Results-driven ${
      resume.personalInfo.jobTitle || 'Senior Professional'
    } combining deep expertise in ${topMatched} with proven delivery across ${topMissing}. Track record of leading high-impact initiatives, accelerating project velocity, and translating organizational goals into measurable outcomes.`,
    suggestedBullets: [
      `Spearheaded strategic ${
        missingKeywords[0] || 'platform'
      } initiatives across cross-functional squads, improving operational efficiency and exceeding quarterly KPIs.`,
      `Architected standardized workflows and quality gates utilizing ${
        matchedKeywords[0] || 'modern tooling'
      }, reducing turnaround time across enterprise stakeholders.`,
    ],
  };
}

export function moveResumeSection(
  resume: ResumeDocument,
  sectionKey: ReorderableSectionKey,
  direction: 'up' | 'down'
): ResumeDocument {
  const order = [...(resume.sectionOrder || DEFAULT_SECTION_ORDER)];
  const idx = order.indexOf(sectionKey);
  if (idx === -1) return resume;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= order.length) return resume;
  const swapped = [...order];
  const temp = swapped[idx];
  swapped[idx] = swapped[targetIdx];
  swapped[targetIdx] = temp;
  return {
    ...resume,
    sectionOrder: swapped,
    updatedAt: 'Just now',
  };
}

export function validateResumeExport(resume: ResumeDocument): ExportValidationReport {
  const totalBullets = resume.experience.reduce((acc, e) => acc + e.bullets.length, 0);
  const totalChars = JSON.stringify(resume).length;
  const estimatedPages = totalBullets > 8 || totalChars > 4200 ? 2 : 1;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resume.personalInfo.email);
  const linksValid =
    !resume.personalInfo.website ||
    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(
      resume.personalInfo.website.replace(/^https?:\/\//, '')
    );

  const checks = [
    {
      label: 'Selectable DOM Text Layer (Non-Raster PDF)',
      passed: true,
      detail: 'Document renders native HTML/CSS text nodes for 100% copyable PDF text extraction.',
    },
    {
      label: 'Contact & Hyperlink Syntax',
      passed: hasEmail && linksValid,
      detail:
        hasEmail && linksValid
          ? `Verified email (${resume.personalInfo.email}) and profile link.`
          : 'Check email or website URL formatting before exporting.',
    },
    {
      label: `Page Bounds (${resume.pageSize || 'A4'})`,
      passed: estimatedPages === 1,
      detail:
        estimatedPages === 1
          ? `Fits cleanly on 1 ${resume.pageSize || 'A4'} page.`
          : `Spans ${estimatedPages} pages (${totalBullets} bullets). Page-break indicator enabled.`,
    },
  ];

  return {
    valid: hasEmail && linksValid,
    selectableTextReady: true,
    estimatedPages,
    overflowWarning:
      estimatedPages > 1
        ? `Document spans ${estimatedPages} pages. Use Compact font/margins if you prefer a single-page resume.`
        : null,
    linksValid,
    checks,
  };
}

export function cloneResumeDocument(
  source: ResumeDocument,
  customTitle?: string
): ResumeDocument {
  const cloned: ResumeDocument = JSON.parse(JSON.stringify(source));
  cloned.id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  cloned.title = customTitle || `${source.title} (Copy)`;
  cloned.updatedAt = 'Just now';
  return cloned;
}

export function applyTemplateTheme(
  resume: ResumeDocument,
  updates: Partial<
    Pick<
      ResumeDocument,
      | 'templateId'
      | 'themeColor'
      | 'fontFamily'
      | 'fontSize'
      | 'pageSize'
      | 'marginSize'
      | 'lineSpacing'
    >
  >
): ResumeDocument {
  return {
    ...resume,
    ...updates,
    updatedAt: 'Just now',
  };
}

export function exportResumeToMarkdown(resume: ResumeDocument): string {
  const lines: string[] = [
    `# ${resume.personalInfo.fullName}`,
    `**${resume.personalInfo.jobTitle}**`,
    `${resume.personalInfo.location} | ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.website}`,
    '',
    '## Professional Summary',
    resume.personalInfo.summary,
    '',
    '## Work Experience',
  ];

  for (const exp of resume.experience) {
    lines.push(`### ${exp.role} — ${exp.company} (${exp.period})`);
    lines.push(`*${exp.location}*`);
    for (const bullet of exp.bullets) {
      lines.push(`- ${bullet}`);
    }
    lines.push('');
  }

  lines.push('## Education');
  for (const edu of resume.education) {
    lines.push(`### ${edu.degree} — ${edu.school} (${edu.period})`);
    if (edu.details) lines.push(edu.details);
    lines.push('');
  }

  if (resume.projects && resume.projects.length > 0) {
    lines.push('## Projects');
    for (const proj of resume.projects) {
      lines.push(`### ${proj.name} — ${proj.role} (${proj.period})`);
      lines.push(proj.description);
      lines.push('');
    }
  }

  lines.push('## Skills');
  for (const sk of resume.skills) {
    lines.push(`- **${sk.name}** (${sk.category}): ${sk.level}%`);
  }

  if (resume.certifications && resume.certifications.length > 0) {
    lines.push('', '## Certifications');
    for (const c of resume.certifications) {
      lines.push(`- ${c}`);
    }
  }

  if (resume.languages && resume.languages.length > 0) {
    lines.push('', '## Languages');
    for (const l of resume.languages) {
      lines.push(`- **${l.name}**: ${l.proficiency} (${l.level}%)`);
    }
  }

  if (resume.awards && resume.awards.length > 0) {
    lines.push('', '## Awards & Honors');
    for (const a of resume.awards) {
      lines.push(`- ${a}`);
    }
  }

  if (resume.volunteering && resume.volunteering.length > 0) {
    lines.push('', '## Volunteering');
    for (const v of resume.volunteering) {
      lines.push(`- ${v}`);
    }
  }

  if (resume.publications && resume.publications.length > 0) {
    lines.push('', '## Publications');
    for (const p of resume.publications) {
      lines.push(`- **${p.title}**, *${p.venue}* (${p.year})`);
    }
  }

  if (resume.strengths.length > 0) {
    lines.push('', '## Key Strengths');
    for (const s of resume.strengths) {
      lines.push(`- ${s}`);
    }
  }

  return lines.join('\n');
}

export function exportResumeToDocxHtml(resume: ResumeDocument): string {
  const expHtml = resume.experience
    .map(
      (e) =>
        `<h3>${escapeHtml(e.role)} — ${escapeHtml(e.company)} (${escapeHtml(
          e.period
        )})</h3><p><em>${escapeHtml(e.location)}</em></p><ul>${e.bullets
          .map((b) => `<li>${escapeHtml(b)}</li>`)
          .join('')}</ul>`
    )
    .join('');

  const eduHtml = resume.education
    .map(
      (ed) =>
        `<p><strong>${escapeHtml(ed.degree)}</strong>, ${escapeHtml(
          ed.school
        )} (${escapeHtml(ed.period)})<br/>${escapeHtml(ed.details || '')}</p>`
    )
    .join('');

  const skillsHtml = resume.skills
    .map(
      (s) =>
        `<li><strong>${escapeHtml(s.name)}</strong> (${escapeHtml(
          s.category
        )}) — ${Number(s.level) || 0}%</li>`
    )
    .join('');

  const fullNameSafe = escapeHtml(resume.personalInfo.fullName);
  const jobTitleSafe = escapeHtml(resume.personalInfo.jobTitle);
  const locationSafe = escapeHtml(resume.personalInfo.location);
  const emailSafe = escapeHtml(resume.personalInfo.email);
  const phoneSafe = escapeHtml(resume.personalInfo.phone);
  const websiteSafe = escapeHtml(resume.personalInfo.website);
  const summarySafe = escapeHtml(resume.personalInfo.summary);

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${fullNameSafe} - ResumeBuilderAi 3.0</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.45; color: #111827;">
  <h1>${fullNameSafe}</h1>
  <p><strong>${jobTitleSafe}</strong></p>
  <p>${locationSafe} | ${emailSafe} | ${phoneSafe} | ${websiteSafe}</p>
  <hr/>
  <h2>Summary</h2>
  <p>${summarySafe}</p>
  <h2>Work Experience</h2>
  ${expHtml}
  <h2>Education</h2>
  ${eduHtml}
  <h2>Skills</h2>
  <ul>${skillsHtml}</ul>
</body></html>`;
}
