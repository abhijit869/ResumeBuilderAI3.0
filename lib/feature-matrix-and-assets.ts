export interface FeatureMatrixItem {
  id: string;
  category:
    | 'Onboarding & Import'
    | 'Resume Studio & Templates'
    | 'Grounded AI Assistance'
    | 'Career & Analysis Tools'
    | 'Auth, Privacy & Exports';
  feature: string;
  referenceStatus: 'Observed Publicly' | 'Proposed Addition' | 'Auth-Gated on Reference';
  implementationStatus: 'Implemented & Verified' | 'Requires External Credentials';
  verificationNotes: string;
}

export interface AssetManifestEntry {
  assetName: string;
  type: 'Font' | 'Icon Library' | 'Programmatic Template' | 'Synthetic Fixture';
  sourceUrl: string;
  license: string;
  attributionRequired: boolean;
  usageNotes: string;
}

export const FEATURE_MATRIX: FeatureMatrixItem[] = [
  {
    id: 'fm-1',
    category: 'Onboarding & Import',
    feature: 'Authorized LinkedIn-to-Resume Import (PDF/Export/Text + Consent + Review + Diff)',
    referenceStatus: 'Proposed Addition',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Rejects bare profile URLs without data; parses uploaded PDF/text exports into structured sections with source references, uncertain-field warnings, and re-import diffing.',
  },
  {
    id: 'fm-2',
    category: 'Resume Studio & Templates',
    feature: '12 Original Code-Rendered Templates Across 7 Categories + Matching Cover Letters',
    referenceStatus: 'Observed Publicly',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Covers Simple, Professional, Executive, Student, Technical, Academic, and Creative styles with searchable gallery and live miniature code previews.',
  },
  {
    id: 'fm-3',
    category: 'Resume Studio & Templates',
    feature: '12-Section Schema, Keyboard Section Reordering, Undo/Redo & Version History',
    referenceStatus: 'Observed Publicly',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Supports Contact, Summary, Experience, Education, Skills, Projects, Certifications, Awards, Volunteering, Publications, Languages, and Custom Sections.',
  },
  {
    id: 'fm-4',
    category: 'Resume Studio & Templates',
    feature: 'A4 & US Letter Pagination, Zoom, Margin/Spacing Controls & Page-Break Indicators',
    referenceStatus: 'Proposed Addition',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Separates document paper styling from application Light/Dark UI theme and warns when content overflows page 1.',
  },
  {
    id: 'fm-5',
    category: 'Grounded AI Assistance',
    feature: 'Server-Side Gemini AI with Explicit Before/After Review, Cancellation & Missing-Info Prompts',
    referenceStatus: 'Proposed Addition',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Supports Summary, Bullets, Tone/Grammar, JD Tailoring, Bio, LinkedIn About, Resignation Letter, Translation, and Career-Gap framing without inventing facts.',
  },
  {
    id: 'fm-6',
    category: 'Career & Analysis Tools',
    feature: 'Explainable Heuristic Resume Check, Job Application Tracker & Revocable Portfolio Links',
    referenceStatus: 'Observed Publicly',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Clearly labeled as ResumeBuilderAi Heuristic Score (not an official ATS guarantee); includes Kanban-style Job Tracker and expiring share links.',
  },
  {
    id: 'fm-7',
    category: 'Auth, Privacy & Exports',
    feature: 'Per-User Account Isolation, Password Reset, Data Export, Account Deletion & PDF/DOCX/JSON Export',
    referenceStatus: 'Proposed Addition',
    implementationStatus: 'Implemented & Verified',
    verificationNotes:
      'Includes Export Pre-Flight Validator checking selectable text, link formatting, and page bounds.',
  },
  {
    id: 'fm-8',
    category: 'Onboarding & Import',
    feature: 'Live Direct LinkedIn Partner API Full Profile Sync',
    referenceStatus: 'Auth-Gated on Reference',
    implementationStatus: 'Requires External Credentials',
    verificationNotes:
      'Requires LinkedIn Talent/Partner API approval; gracefully degrades to authorized LinkedIn PDF/Archive upload and pasted profile text.',
  },
];

export const ASSET_LICENSE_MANIFEST: AssetManifestEntry[] = [
  {
    assetName: 'Plus Jakarta Sans, Fraunces & JetBrains Mono',
    type: 'Font',
    sourceUrl: 'https://fonts.google.com/',
    license: 'SIL Open Font License 1.1 (OFL-1.1)',
    attributionRequired: false,
    usageNotes: 'Loaded via next/font/google for UI, editorial display headings, and monospace metrics.',
  },
  {
    assetName: 'Lucide React Icons',
    type: 'Icon Library',
    sourceUrl: 'https://lucide.dev/license',
    license: 'ISC License (MIT-compatible)',
    attributionRequired: false,
    usageNotes: 'Used for accessible UI controls, section markers, and status indicators.',
  },
  {
    assetName: 'ResumeBuilderAi 3.0 12 Original Resume & Cover Letter Templates',
    type: 'Programmatic Template',
    sourceUrl: 'local://components/ResumeCanvasPreview.tsx',
    license: 'Original First-Party Code (MIT)',
    attributionRequired: false,
    usageNotes:
      'All 12 resume templates and thumbnails are rendered directly from React/Tailwind DOM nodes—zero third-party template screenshots used.',
  },
  {
    assetName: 'Synthetic Candidate & LinkedIn Export Fixtures',
    type: 'Synthetic Fixture',
    sourceUrl: 'local://lib/linkedin-parser.ts',
    license: 'CC0 1.0 Public Domain Dedication (Synthetic Test Data)',
    attributionRequired: false,
    usageNotes:
      'Synthetic candidate profiles (Edna Bearstrom, Alex Rivera, Maya Lin, Jordan Patel) created for deterministic testing and demo seeding.',
  },
];
