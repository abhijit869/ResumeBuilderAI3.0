'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Mail,
  ShieldCheck,
  Compass,
  LayoutGrid,
  Cpu,
  Plus,
  Sparkles,
  Copy,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Wand2,
  Briefcase,
  GraduationCap,
  FlaskConical,
  User,
  Check,
  RefreshCw,
  FileUp,
  Undo2,
  Redo2,
  History,
  Layers,
  Globe,
  Link2,
  Sun,
  Moon,
  LogOut,
  X,
} from 'lucide-react';
import {
  ResumeDocument,
  CoverLetterDocument,
  JobApplicationItem,
  ShareLinkItem,
  TemplateId,
  TemplateCategory,
  ThemeColorId,
  FontFamilyId,
  ReorderableSectionKey,
  THEME_COLORS,
  FONT_FAMILIES,
  RESUME_TEMPLATES,
  DEFAULT_SECTION_ORDER,
  PRESET_JOB_DESCRIPTIONS,
  AtsAuditReport,
  calculateResumeCompletion,
  calculateAtsScore,
  cloneResumeDocument,
  exportResumeToMarkdown,
  exportResumeToDocxHtml,
  moveResumeSection,
  validateResumeExport,
  WEB_ATS_TEMPLATE_CATALOG,
  fetchWebAtsTemplates,
  WebFetchedTemplateBlueprint,
} from '@/lib/resume-engine';
import {
  runSecurityAuditReport,
  SecurityAuditSummary,
} from '@/lib/security-utils';
import {
  FEATURE_MATRIX,
  ASSET_LICENSE_MANIFEST,
} from '@/lib/feature-matrix-and-assets';
import {
  TOP_MNC_BENCHMARKS,
  MncId,
  ExtractedJobPosting,
  MlDlDiagnosticReport,
  AutoOptimizeResult,
  extractJobFromUrl,
  runMlDlDiagnosticPipeline,
  autoOptimizeResumeForJobOrMnc,
} from '@/lib/ml-dl-engine';
import { ResumeCanvasPreview } from './ResumeCanvasPreview';
import {
  buildPrintStyleDescriptor,
  generateSelectablePdfBytes,
} from '@/lib/pdf-print-engine';
import {
  type BulletRewriteTone,
  type BulletSuggestionItem,
} from '@/lib/ai-bullet-rewriter';

export type DashboardTab =
  | 'overview'
  | 'resumes'
  | 'editor'
  | 'cover-letters'
  | 'ats-checker'
  | 'career-map'
  | 'templates'
  | 'rea-blueprint';

interface DashboardViewProps {
  user: { name: string; email: string; plan: string };
  uiTheme: 'light' | 'dark';
  onToggleUiTheme: () => void;
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
  resumes: ResumeDocument[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onUpdateResume: (updated: ResumeDocument) => void;
  onCreateResume: (resume: ResumeDocument) => void;
  onDeleteResume: (id: string) => void;
  coverLetters: CoverLetterDocument[];
  onCreateCoverLetter: (cl: CoverLetterDocument) => void;
  onDeleteCoverLetter: (id: string) => void;
  jobApplications: JobApplicationItem[];
  onUpdateJobApplications: (apps: JobApplicationItem[]) => void;
  shareLinks: ShareLinkItem[];
  onUpdateShareLinks: (links: ShareLinkItem[]) => void;
  onOpenLinkedInImport: () => void;
  onOpenAtsScoreGenerator?: (customJd?: string) => void;
  onDeleteAllUserData: () => void;
  onSignOut: () => void;
  onBackToLanding: () => void;
}

interface PendingAiSuggestion {
  type: 'summary' | 'bullets';
  expIndex?: number;
  tone?: BulletRewriteTone;
  originalText: string;
  suggestedText: string;
  suggestedBullets?: string[];
  bulletComparisons?: BulletSuggestionItem[];
  missingInfoQuestions: string[];
}

export function DashboardView({
  user,
  uiTheme,
  onToggleUiTheme,
  activeTab,
  onChangeTab,
  resumes,
  activeResumeId,
  onSelectResume,
  onUpdateResume,
  onCreateResume,
  onDeleteResume,
  coverLetters,
  onCreateCoverLetter,
  onDeleteCoverLetter,
  jobApplications,
  onUpdateJobApplications,
  shareLinks,
  onUpdateShareLinks,
  onOpenLinkedInImport,
  onOpenAtsScoreGenerator,
  onDeleteAllUserData,
  onSignOut,
  onBackToLanding,
}: DashboardViewProps) {
  const activeResume =
    resumes.find((r) => r.id === activeResumeId) || resumes[0];
  const isDark = uiTheme === 'dark';

  // Documents filter state (/dashboard/resumes/)
  const [docFilter, setDocFilter] = useState<'all' | 'resumes' | 'cover-letters'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor section state (now includes 'extended' for Projects, Certs, Languages, Awards, Volunteering, Publications, Custom, and Reordering)
  const [editorSection, setEditorSection] = useState<
    'personal' | 'experience' | 'education' | 'skills' | 'extended' | 'design'
  >('personal');
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Undo / Redo Stack for Active Resume
  const [undoStack, setUndoStack] = useState<ResumeDocument[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeDocument[]>([]);

  // Explicit Before/After AI Suggestion Review State
  const [pendingAi, setPendingAi] = useState<PendingAiSuggestion | null>(null);
  const [summaryPolishMode, setSummaryPolishMode] = useState<
    'executive' | 'concise' | 'grammar'
  >('executive');
  const [bulletRewriteTone, setBulletRewriteTone] =
    useState<BulletRewriteTone>('impact_xyz');

  // AI Resume Generator Modal state
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState(false);
  const [genTargetRole, setGenTargetRole] = useState('Staff Full-Stack & AI Architect');
  const [genExpLevel, setGenExpLevel] = useState('Senior (7+ years)');
  const [genFocusArea, setGenFocusArea] = useState(
    'Cloud SaaS, Distributed Systems & LLM Agents'
  );

  // ATS / Heuristic Checker + Job URL + ML/DL + Top MNC & Internship state
  const [selectedJdText, setSelectedJdText] = useState(
    PRESET_JOB_DESCRIPTIONS[0].description
  );
  const [atsReport, setAtsReport] = useState<AtsAuditReport>(() =>
    calculateAtsScore(activeResume, PRESET_JOB_DESCRIPTIONS[0].description)
  );
  const [atsAppliedNotice, setAtsAppliedNotice] = useState(false);

  const [jobUrlInput, setJobUrlInput] = useState(
    TOP_MNC_BENCHMARKS[0].sampleJobUrl
  );
  const [selectedMncId, setSelectedMncId] = useState<MncId>('google');
  const [internshipReadyMode, setInternshipReadyMode] = useState<boolean>(false);
  const [extractedJob, setExtractedJob] = useState<ExtractedJobPosting>(() =>
    extractJobFromUrl(TOP_MNC_BENCHMARKS[0].sampleJobUrl)
  );
  const [mlDlReport, setMlDlReport] = useState<MlDlDiagnosticReport>(() =>
    runMlDlDiagnosticPipeline(activeResume, TOP_MNC_BENCHMARKS[0].sampleJd, {
      targetCompany: TOP_MNC_BENCHMARKS[0].name,
      targetRole: activeResume.personalInfo.jobTitle,
      isInternshipMode: false,
    })
  );
  const [lastAutoOptimizeResult, setLastAutoOptimizeResult] =
    useState<AutoOptimizeResult | null>(null);

  // Cover letter studio state
  const [clCompany, setClCompany] = useState('Stripe');
  const [clRole, setClRole] = useState(activeResume.personalInfo.jobTitle);
  const [clTone, setClTone] = useState('Confident & Executive');
  const [clDraftContent, setClDraftContent] = useState(
    coverLetters[0]?.content || ''
  );
  const [interviewPrepList, setInterviewPrepList] = useState<
    Array<{ question: string; tailoredAnswer: string; reverseQuestion: string }>
  >([
    {
      question:
        'Tell me about a complex cross-functional initiative where you delivered measurable ROI under tight constraints.',
      tailoredAnswer:
        'I spearheaded a multi-team architecture and workflow overhaul that reduced turnaround times by 34% and scaled cleanly across enterprise stakeholders.',
      reverseQuestion:
        'What does success in the first 90 days look like for this role, and which team bottleneck is the highest priority?',
    },
    {
      question:
        'How do you balance rapid product iteration with long-term reliability and quality?',
      tailoredAnswer:
        'By establishing automated validation pipelines, clear SLA metrics, and modular design systems before scaling new user-facing features.',
      reverseQuestion:
        'How do engineering, design, and product leadership align on quarterly roadmap trade-offs?',
    },
  ]);

  // Career Suite & Job Application Tracker state
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobRole, setNewJobRole] = useState('');
  const [newJobStage, setNewJobStage] =
    useState<JobApplicationItem['stage']>('Applied');
  const [newJobDeadline, setNewJobDeadline] = useState('2025-05-30');
  const [careerSuiteTool, setCareerSuiteTool] = useState<
    'bio' | 'linkedin_about' | 'resignation' | 'translate' | 'career_gap'
  >('bio');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [gapContext, setGapContext] = useState(
    '10-month planned family caregiving and cloud architecture certification study'
  );
  const [careerSuiteOutput, setCareerSuiteOutput] = useState<string>('');

  // Template Gallery & Web ATS Template Fetcher state
  const [tplCategoryFilter, setTplCategoryFilter] = useState<
    'All' | TemplateCategory
  >('All');
  const [tplSearch, setTplSearch] = useState('');
  const [webTemplateQuery, setWebTemplateQuery] = useState(
    'https://github.com/sb2nov/resume/blob/master/jake_gutierrez_faang_swe_ats.tex'
  );
  const [webFetchedBlueprints, setWebFetchedBlueprints] = useState<
    WebFetchedTemplateBlueprint[]
  >(WEB_ATS_TEMPLATE_CATALOG);
  const [webFetchStatus, setWebFetchStatus] = useState<string | null>(null);
  const [webFetchBusy, setWebFetchBusy] = useState(false);
  const [pdfTargetId, setPdfTargetId] = useState<string | null>(null);

  // REA Blueprint & Security Audit state
  const [reaData, setReaData] = useState<Record<string, unknown> | null>({
    connected: true,
    version: '6.7.0',
    toolCount: 207,
  });
  const [reaLoading] = useState(false);
  const [securityAudit, setSecurityAudit] = useState<SecurityAuditSummary>(() =>
    runSecurityAuditReport()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsReport(calculateAtsScore(activeResume, selectedJdText));
      setMlDlReport(
        runMlDlDiagnosticPipeline(activeResume, selectedJdText, {
          targetCompany: extractedJob.company,
          targetRole: extractedJob.roleTitle,
          isInternshipMode: internshipReadyMode,
        })
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [
    activeResumeId,
    activeResume,
    selectedJdText,
    extractedJob.company,
    extractedJob.roleTitle,
    internshipReadyMode,
  ]);

  useEffect(() => {
    if (activeTab === 'rea-blueprint') {
      fetch('/api/rea-insights')
        .then((r) => r.json())
        .then((d) => setReaData(d.reaEngine || d))
        .catch(() =>
          setReaData({ connected: true, version: '6.7.0', toolCount: 207 })
        );
    }
  }, [activeTab]);

  const showNotice = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Wrapper around onUpdateResume that records Undo history
  const commitResumeUpdate = (next: ResumeDocument) => {
    setUndoStack((prev) => [...prev.slice(-14), activeResume]);
    setRedoStack([]);
    onUpdateResume(next);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevDoc = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((r) => [activeResume, ...r]);
    onUpdateResume(prevDoc);
    showNotice('Undid last resume change.');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextDoc = redoStack[0];
    setRedoStack((r) => r.slice(1));
    setUndoStack((s) => [...s, activeResume]);
    onUpdateResume(nextDoc);
    showNotice('Redid resume change.');
  };

  const handleSaveVersionSnapshot = () => {
    const snapshotId = `ver-${Date.now()}`;
    const snap = {
      id: snapshotId,
      label: `Snapshot #${(activeResume.versionHistory?.length || 0) + 1} (${
        activeResume.templateId
      })`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      summaryPreview: activeResume.personalInfo.summary.slice(0, 80),
      serialized: JSON.stringify({
        ...activeResume,
        versionHistory: undefined,
      }),
    };
    const nextHistory = [snap, ...(activeResume.versionHistory || [])].slice(
      0,
      8
    );
    onUpdateResume({
      ...activeResume,
      versionHistory: nextHistory,
      updatedAt: 'Saved snapshot just now',
    });
    showNotice(`Saved version snapshot: ${snap.label}`);
  };

  const handleRestoreVersionSnapshot = (serialized: string, label: string) => {
    try {
      const restored = JSON.parse(serialized) as ResumeDocument;
      restored.versionHistory = activeResume.versionHistory;
      restored.updatedAt = `Restored ${label}`;
      commitResumeUpdate(restored);
      showNotice(`Restored version: ${label}`);
    } catch {
      showNotice('Could not restore version snapshot.');
    }
  };

  // Handlers for Editor
  const handlePersonalInfoChange = (
    field: keyof ResumeDocument['personalInfo'],
    value: string
  ) => {
    const next: ResumeDocument = {
      ...activeResume,
      updatedAt: 'Autosaved just now',
      personalInfo: {
        ...activeResume.personalInfo,
        [field]: value,
      },
    };
    next.atsScore = calculateAtsScore(next, selectedJdText).overallScore;
    commitResumeUpdate(next);
  };

  const handleCancelAiRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAiBusy(null);
    showNotice('Cancelled AI request.');
  };

  const handleAiPolishSummary = async () => {
    setAiBusy('summary');
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'polish_summary',
          mode: summaryPolishMode,
          currentSummary: activeResume.personalInfo.summary,
          targetRole: activeResume.personalInfo.jobTitle,
          skills: activeResume.skills.map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.ok && data.summary) {
        setPendingAi({
          type: 'summary',
          originalText: activeResume.personalInfo.summary,
          suggestedText: data.summary,
          missingInfoQuestions: data.missingInfoQuestions || [],
        });
        showNotice(
          'AI Summary draft ready — review Before/After comparison to Accept or Reject.'
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        showNotice('AI request timed out or failed. Click Retry to try again.');
      }
    } finally {
      setAiBusy(null);
    }
  };

  const handleAiRewriteBullets = async (
    expIndex: number,
    customTone?: BulletRewriteTone
  ) => {
    const targetExp = activeResume.experience[expIndex];
    if (!targetExp) return;
    const activeTone = customTone || bulletRewriteTone;
    setAiBusy(`exp-${expIndex}`);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'rewrite_bullets',
          roleTitle: targetExp.role,
          company: targetExp.company,
          currentBullets: targetExp.bullets,
          tone: activeTone,
          skills: activeResume.skills.map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.bullets)) {
        setPendingAi({
          type: 'bullets',
          expIndex,
          tone: activeTone,
          originalText: targetExp.bullets.join('\n'),
          suggestedText: data.bullets.join('\n'),
          suggestedBullets: data.bullets,
          bulletComparisons: Array.isArray(data.bulletComparisons)
            ? data.bulletComparisons
            : data.bullets.map((b: string, i: number) => ({
                index: i,
                original: targetExp.bullets[i] || '',
                rewritten: b,
                actionVerb: b.split(/\s+/)[0] || 'Spearheaded',
                improvementNote:
                  'Upgraded with impact-oriented phrasing and active voice.',
              })),
          missingInfoQuestions: data.missingInfoQuestions || [],
        });
        showNotice(
          `Gemini AI Rewrite ready for ${targetExp.role} — review suggested impact bullets below or click Accept.`
        );
      }
    } catch {
      showNotice('Could not complete bullet rewrite. Please retry.');
    } finally {
      setAiBusy(null);
    }
  };

  const handleApplySingleBulletSuggestion = (
    expIndex: number,
    bulletIdx: number,
    rewrittenText: string
  ) => {
    const targetExp = activeResume.experience[expIndex];
    if (!targetExp) return;
    const nextBullets = [...targetExp.bullets];
    if (bulletIdx < nextBullets.length) {
      nextBullets[bulletIdx] = rewrittenText;
    } else {
      nextBullets.push(rewrittenText);
    }
    const nextExp = [...activeResume.experience];
    nextExp[expIndex] = { ...targetExp, bullets: nextBullets };
    const updated: ResumeDocument = {
      ...activeResume,
      updatedAt: 'Autosaved just now',
      experience: nextExp,
    };
    updated.atsScore = calculateAtsScore(updated, selectedJdText).overallScore;
    commitResumeUpdate(updated);
    showNotice(
      `Applied Gemini impact bullet #${bulletIdx + 1} for ${targetExp.role}.`
    );
  };

  const handleAiRewriteExtendedSection = async (
    sectionKey: 'projects' | 'awards' | 'volunteering' | 'publications'
  ) => {
    setAiBusy(`ext-${sectionKey}`);
    try {
      let currentLines: string[] = [];
      if (sectionKey === 'projects') {
        currentLines = (activeResume.projects || []).map(
          (p) => `${p.name} | ${p.role} | ${p.period} | ${p.description}`
        );
      } else if (sectionKey === 'awards') {
        currentLines = activeResume.awards || [];
      } else if (sectionKey === 'volunteering') {
        currentLines = activeResume.volunteering || [];
      } else if (sectionKey === 'publications') {
        currentLines = (activeResume.publications || []).map(
          (p) => `${p.title} | ${p.venue} | ${p.year}`
        );
      }

      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rewrite_section_text',
          sectionName: sectionKey,
          lines: currentLines,
          targetRole: activeResume.personalInfo.jobTitle,
        }),
      });
      const data = await res.json();
      if (
        data.ok &&
        Array.isArray(data.rewrittenLines) &&
        data.rewrittenLines.length > 0
      ) {
        const lines: string[] = data.rewrittenLines;
        if (sectionKey === 'projects') {
          const projects = lines.map((line, i) => {
            const [name, role, period, ...desc] = line
              .split('|')
              .map((s) => s.trim());
            return {
              id: `proj-${i}`,
              name: name || 'Project',
              role: role || 'Lead',
              period: period || '2024',
              description: desc.join(' | ') || line,
            };
          });
          commitResumeUpdate({
            ...activeResume,
            projects,
            updatedAt: 'Autosaved just now',
          });
        } else if (sectionKey === 'awards') {
          commitResumeUpdate({
            ...activeResume,
            awards: lines,
            updatedAt: 'Autosaved just now',
          });
        } else if (sectionKey === 'volunteering') {
          commitResumeUpdate({
            ...activeResume,
            volunteering: lines,
            updatedAt: 'Autosaved just now',
          });
        } else if (sectionKey === 'publications') {
          const publications = lines.map((line, i) => {
            const [title, venue, year] = line.split('|').map((s) => s.trim());
            return {
              id: `pub-${i}`,
              title: title || line,
              venue: venue || 'Journal / Conference',
              year: year || '2024',
            };
          });
          commitResumeUpdate({
            ...activeResume,
            publications,
            updatedAt: 'Autosaved just now',
          });
        }
        showNotice(`Applied Gemini AI Rewrite to ${sectionKey} section.`);
      }
    } catch {
      showNotice(`Could not rewrite ${sectionKey} section. Please retry.`);
    } finally {
      setAiBusy(null);
    }
  };

  const handleAcceptPendingAi = () => {
    if (!pendingAi) return;
    if (pendingAi.type === 'summary') {
      handlePersonalInfoChange('summary', pendingAi.suggestedText);
      showNotice('Accepted AI summary update.');
    } else if (
      pendingAi.type === 'bullets' &&
      typeof pendingAi.expIndex === 'number' &&
      pendingAi.suggestedBullets
    ) {
      const idx = pendingAi.expIndex;
      const targetExp = activeResume.experience[idx];
      if (targetExp) {
        const nextExp = [...activeResume.experience];
        nextExp[idx] = { ...targetExp, bullets: pendingAi.suggestedBullets };
        const updated = {
          ...activeResume,
          updatedAt: 'Autosaved just now',
          experience: nextExp,
        };
        updated.atsScore = calculateAtsScore(updated, selectedJdText).overallScore;
        commitResumeUpdate(updated);
        showNotice(`Accepted AI bullets for ${targetExp.role}.`);
      }
    }
    setPendingAi(null);
  };

  const handleGenerateFullAiResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTargetRole.trim()) return;
    setAiBusy('full-gen');
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_resume',
          targetRole: genTargetRole,
          experienceLevel: genExpLevel,
          focusArea: genFocusArea,
        }),
      });
      const data = await res.json();
      if (data.ok && data.generated) {
        const g = data.generated;
        const newDoc: ResumeDocument = {
          id: `res-ai-${Date.now()}`,
          title: `${g.personalInfo.fullName} — ${g.personalInfo.jobTitle}`,
          updatedAt: 'Just now',
          templateId: 'green-executive',
          themeColor: 'green',
          fontFamily: 'ibm',
          fontSize: 'standard',
          pageSize: 'A4',
          marginSize: 'standard',
          lineSpacing: 'normal',
          sectionOrder: DEFAULT_SECTION_ORDER,
          atsScore: 95,
          personalInfo: {
            fullName: g.personalInfo.fullName || 'Clara Vance',
            jobTitle: g.personalInfo.jobTitle || genTargetRole,
            email: g.personalInfo.email || 'clara.vance@workspace.io',
            phone: g.personalInfo.phone || '+1 (415) 890-4321',
            location: g.personalInfo.location || 'San Francisco, CA',
            website: g.personalInfo.website || 'linkedin.com/in/claravance',
            summary: g.personalInfo.summary || '',
          },
          experience: (g.experience || []).map(
            (item: Record<string, unknown>, idx: number) => ({
              id: `exp-ai-${idx}`,
              role: String(item.role || genTargetRole),
              company: String(item.company || 'Enterprise Systems'),
              location: String(item.location || 'Remote'),
              period: String(item.period || '02/2022 – PRESENT'),
              bullets: Array.isArray(item.bullets)
                ? item.bullets.map(String)
                : ['Delivered measurable impact across core initiatives.'],
            })
          ),
          education: activeResume.education,
          skills: (g.skills || []).map(
            (sk: { name?: string; level?: number }, idx: number) => ({
              id: `sk-ai-${idx}`,
              name: String(sk.name || 'Core Competency'),
              category: 'CORE',
              level: Number(sk.level || 90),
            })
          ),
          strengths: Array.isArray(g.strengths)
            ? g.strengths.map(String)
            : ['Strategic Execution', 'Cross-Functional Leadership'],
          certifications: activeResume.certifications,
          projects: activeResume.projects || [],
          languages: activeResume.languages || [],
          awards: activeResume.awards || [],
          volunteering: activeResume.volunteering || [],
          publications: activeResume.publications || [],
          customSections: [],
        };
        onCreateResume(newDoc);
        setShowAiGeneratorModal(false);
        onChangeTab('editor');
        showNotice(`Created new AI resume: ${newDoc.title}`);
      }
    } finally {
      setAiBusy(null);
    }
  };

  const handleRunAtsAudit = async () => {
    setAiBusy('ats');
    setAtsAppliedNotice(false);
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ats_audit',
          resume: activeResume,
          jobDescription: selectedJdText,
        }),
      });
      const data = await res.json();
      if (data.ok && data.audit) {
        setAtsReport(data.audit);
      } else {
        setAtsReport(calculateAtsScore(activeResume, selectedJdText));
      }
      setMlDlReport(
        runMlDlDiagnosticPipeline(activeResume, selectedJdText, {
          targetCompany: extractedJob.company,
          targetRole: extractedJob.roleTitle,
          isInternshipMode: internshipReadyMode,
        })
      );
      showNotice(
        'Completed Heuristic & ML/DL Neural Readiness Audit.'
      );
    } catch {
      setAtsReport(calculateAtsScore(activeResume, selectedJdText));
      setMlDlReport(
        runMlDlDiagnosticPipeline(activeResume, selectedJdText, {
          targetCompany: extractedJob.company,
          targetRole: extractedJob.roleTitle,
          isInternshipMode: internshipReadyMode,
        })
      );
    } finally {
      setAiBusy(null);
    }
  };

  const handleFetchJobUrlAndMatch = async (customUrl?: string) => {
    const urlToUse = (customUrl ?? jobUrlInput).trim();
    if (!urlToUse) return;
    setAiBusy('job-url');
    setLastAutoOptimizeResult(null);
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_job_url',
          jobUrl: urlToUse,
          resume: activeResume,
        }),
      });
      const data = await res.json();
      if (data.ok && data.jobPosting) {
        const jp: ExtractedJobPosting = data.jobPosting;
        setExtractedJob(jp);
        setSelectedJdText(jp.extractedDescription);
        setInternshipReadyMode(jp.isInternship);
        if (jp.matchedMncId) setSelectedMncId(jp.matchedMncId);
        setAtsReport(calculateAtsScore(activeResume, jp.extractedDescription));
        setMlDlReport(
          data.mlDlReport ||
            runMlDlDiagnosticPipeline(activeResume, jp.extractedDescription, {
              targetCompany: jp.company,
              targetRole: jp.roleTitle,
              isInternshipMode: jp.isInternship,
            })
        );
        showNotice(
          `Fetched Job URL: ${jp.roleTitle} at ${jp.company} — ML/DL match computed.`
        );
        return;
      }
    } catch {
      // Fallback to local semantic parser
    } finally {
      setAiBusy(null);
    }

    const localJp = extractJobFromUrl(urlToUse);
    setExtractedJob(localJp);
    setSelectedJdText(localJp.extractedDescription);
    setInternshipReadyMode(localJp.isInternship);
    if (localJp.matchedMncId) setSelectedMncId(localJp.matchedMncId);
    setAtsReport(calculateAtsScore(activeResume, localJp.extractedDescription));
    setMlDlReport(
      runMlDlDiagnosticPipeline(activeResume, localJp.extractedDescription, {
        targetCompany: localJp.company,
        targetRole: localJp.roleTitle,
        isInternshipMode: localJp.isInternship,
      })
    );
    showNotice(
      `Parsed Job URL: ${localJp.roleTitle} at ${localJp.company}.`
    );
  };

  const handleSelectMncBenchmark = (mncId: MncId, forceIntern?: boolean) => {
    const mnc =
      TOP_MNC_BENCHMARKS.find((b) => b.id === mncId) || TOP_MNC_BENCHMARKS[0];
    const nextIntern =
      typeof forceIntern === 'boolean' ? forceIntern : internshipReadyMode;
    setSelectedMncId(mncId);
    setInternshipReadyMode(nextIntern);
    const sampleUrl = nextIntern
      ? `${mnc.sampleJobUrl}-internship`
      : mnc.sampleJobUrl;
    setJobUrlInput(sampleUrl);
    const jp = extractJobFromUrl(sampleUrl, mnc.sampleJd);
    jp.isInternship = nextIntern;
    jp.roleTitle = nextIntern
      ? mnc.internshipTrackName
      : `Senior ${mnc.name.split(' ')[0]} Software & AI Engineer`;
    setExtractedJob(jp);
    setSelectedJdText(mnc.sampleJd);
    setAtsReport(calculateAtsScore(activeResume, mnc.sampleJd));
    setMlDlReport(
      runMlDlDiagnosticPipeline(activeResume, mnc.sampleJd, {
        targetCompany: mnc.name,
        targetRole: jp.roleTitle,
        isInternshipMode: nextIntern,
      })
    );
    setLastAutoOptimizeResult(null);
    showNotice(
      `Loaded ${mnc.name} (${
        nextIntern ? 'Internship-Ready Track' : 'Top MNC Benchmark'
      }) rubric.`
    );
  };

  const handleAutoOptimizeResume = (customOpts?: {
    mncId?: MncId;
    internshipReadyMode?: boolean;
  }) => {
    const targetMncId = customOpts?.mncId || selectedMncId;
    const isIntern =
      typeof customOpts?.internshipReadyMode === 'boolean'
        ? customOpts.internshipReadyMode
        : internshipReadyMode;

    const optResult = autoOptimizeResumeForJobOrMnc(activeResume, {
      jobPosting: extractedJob,
      mncId: targetMncId,
      internshipReadyMode: isIntern,
    });

    commitResumeUpdate(optResult.optimizedResume);
    setLastAutoOptimizeResult(optResult);
    setAtsReport(
      calculateAtsScore(optResult.optimizedResume, selectedJdText)
    );
    setMlDlReport(
      runMlDlDiagnosticPipeline(optResult.optimizedResume, selectedJdText, {
        targetCompany: optResult.tailoredForCompany,
        targetRole: optResult.tailoredForRole,
        isInternshipMode: optResult.isInternshipReady,
      })
    );
    setAtsAppliedNotice(true);
    showNotice(
      `Auto-Optimized resume for ${optResult.tailoredForCompany} (${optResult.beforeScore}% → ${optResult.afterScore}% readiness)!`
    );
  };

  const handleApplyAtsTailoringToResume = () => {
    handleAutoOptimizeResume();
  };

  const handleGenerateCoverLetter = async () => {
    setAiBusy('cover-letter');
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_cover_letter',
          resume: activeResume,
          companyName: clCompany,
          roleTitle: clRole,
          jobDescription: selectedJdText,
          tone: clTone,
        }),
      });
      const data = await res.json();
      if (data.ok && data.coverLetter) {
        setClDraftContent(data.coverLetter);
        if (Array.isArray(data.interviewPrep) && data.interviewPrep.length > 0) {
          setInterviewPrepList(data.interviewPrep);
        }
        showNotice(`Generated tailored cover letter for ${clCompany}.`);
      }
    } finally {
      setAiBusy(null);
    }
  };

  const handleRunCareerSuiteTool = async () => {
    setAiBusy('career-suite');
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'career_suite',
          toolType: careerSuiteTool,
          resume: activeResume,
          targetLanguage,
          gapContext,
        }),
      });
      const data = await res.json();
      if (data.ok && data.output) {
        setCareerSuiteOutput(data.output);
        showNotice('Generated grounded AI draft.');
      }
    } finally {
      setAiBusy(null);
    }
  };

  const handleSaveCoverLetter = () => {
    const newCl: CoverLetterDocument = {
      id: `cl-${Date.now()}`,
      title: `${clRole} — ${clCompany}`,
      companyName: clCompany,
      roleTitle: clRole,
      updatedAt: 'Just now',
      templateId: activeResume.templateId,
      themeColor: activeResume.themeColor,
      recipientName: `Hiring Team at ${clCompany}`,
      linkedResumeId: activeResume.id,
      content: clDraftContent,
    };
    onCreateCoverLetter(newCl);
    showNotice(`Saved "${newCl.title}" to My Documents (/dashboard/resumes/).`);
  };

  const handleDownloadMarkdown = (resume: ResumeDocument) => {
    const md = exportResumeToMarkdown(resume);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')}-resume.md`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Exported resume as Markdown (.md) file.');
  };

  const handleDownloadDocx = (resume: ResumeDocument) => {
    const html = exportResumeToDocxHtml(resume);
    const blob = new Blob([html], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')}-resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Exported resume as Word-compatible (.doc) file.');
  };

  const handleDownloadJson = (resume: ResumeDocument) => {
    const json = JSON.stringify(resume, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName
      .toLowerCase()
      .replace(/\s+/g, '-')}-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Exported structured resume JSON.');
  };

  const handleDownloadPdf = (resume: ResumeDocument = activeResume) => {
    setPdfTargetId(resume.id);
    const descriptor = buildPrintStyleDescriptor(resume);

    if (typeof document !== 'undefined') {
      let styleTag = document.getElementById(
        'resume-dynamic-print-style'
      ) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'resume-dynamic-print-style';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = descriptor.styleSheetCss;

      const prevTitle = document.title;
      document.title = descriptor.documentTitle;

      // Generate selectable PDF binary download while also triggering print-stylesheet engine
      try {
        const pdfBytes = generateSelectablePdfBytes(resume);
        const blob = new Blob([pdfBytes as unknown as BlobPart], {
          type: 'application/pdf',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = descriptor.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      } catch (err) {
        console.warn('Direct PDF stream notice:', err);
      }

      setTimeout(() => {
        try {
          window.print();
        } catch {
          // Ignore print dialog restriction in headless frames
        } finally {
          setTimeout(() => {
            document.title = prevTitle;
          }, 500);
        }
      }, 60);
    }

    showNotice(
      `Downloaded "${resume.title}" as PDF (${descriptor.pageDimensionsLabel}) with print styles applied.`
    );
  };

  const handleAddJobApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobCompany.trim() || !newJobRole.trim()) return;
    const item: JobApplicationItem = {
      id: `job-${Date.now()}`,
      company: newJobCompany.trim(),
      role: newJobRole.trim(),
      stage: newJobStage,
      deadline: newJobDeadline,
      linkedResumeId: activeResume.id,
      notes: `Linked version: ${activeResume.title}`,
      updatedAt: 'Added just now',
    };
    onUpdateJobApplications([item, ...jobApplications]);
    setNewJobCompany('');
    setNewJobRole('');
    showNotice(`Added ${item.company} (${item.role}) to Job Application Tracker.`);
  };

  const handleCreateShareLink = () => {
    const token = `rba3-${Math.random().toString(36).slice(2, 9)}`;
    const link: ShareLinkItem = {
      id: `shr-${Date.now()}`,
      resumeId: activeResume.id,
      resumeTitle: activeResume.title,
      token,
      expiresAt: '30 days (Revocable anytime)',
      revoked: false,
      portfolioPublished: true,
      allowIndexing: false,
    };
    onUpdateShareLinks([link, ...shareLinks]);
    showNotice(`Created revocable portfolio share link (/p/${token}).`);
  };

  const completion = calculateResumeCompletion(activeResume);
  const exportValidation = validateResumeExport(activeResume);

  const filteredResumes = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personalInfo.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoverLetters = coverLetters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGalleryTemplates = RESUME_TEMPLATES.filter((t) => {
    const matchCat =
      tplCategoryFilter === 'All' || t.category === tplCategoryFilter;
    const q = tplSearch.trim().toLowerCase();
    const matchQ =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const activePalette =
    THEME_COLORS[activeResume.themeColor] || THEME_COLORS.green;

  const printTargetResume =
    resumes.find((r) => r.id === pdfTargetId) || activeResume;

  return (
    <>
      <div
        className={`no-print print:hidden min-h-screen flex flex-col transition-colors ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#FAF9F6] text-slate-900'
        }`}
      >
      {/* Top Workspace Bar (Balanced 3-Zone Header Matching Home Page Architecture) */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800'
            : 'bg-white/95 border-slate-200/80'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Left Zone: Brand Logo + Active Resume Selector */}
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <button
              type="button"
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-left group shrink-0"
            >
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt="ResumeGPT AI Logo"
                width={36}
                height={36}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200/70 shrink-0"
              />
              <div className="whitespace-nowrap">
                <div
                  className={`font-extrabold text-sm sm:text-base tracking-tight leading-none ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ResumeBuilderAi <span className="text-[#FF5A4E]">3.0</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  /dashboard{activeTab === 'resumes' ? '/resumes/' : '/'}
                </div>
              </div>
            </button>

            <div
              className={`hidden md:flex items-center gap-1.5 pl-2.5 border-l text-xs ${
                isDark
                  ? 'border-slate-800 text-slate-400'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              <span className="font-medium whitespace-nowrap hidden 2xl:inline">
                Active:
              </span>
              <select
                aria-label="Active Resume Selector"
                value={activeResume.id}
                onChange={(e) => onSelectResume(e.target.value)}
                className={`font-semibold rounded-lg px-2 py-1.5 border text-xs max-w-[140px] 2xl:max-w-[200px] truncate focus:outline-none focus:border-[#FF5A4E] ${
                  isDark
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-100 text-slate-900 border-slate-200'
                }`}
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center Zone: Cleanly Aligned Primary Workspace Actions (Desktop xl+) */}
          <div className="hidden xl:flex items-center justify-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenLinkedInImport}
              aria-label="Build from LinkedIn"
              className="px-2.5 py-1.5 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition whitespace-nowrap"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>LinkedIn Import</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAtsScoreGenerator?.()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Score Check</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPdf(activeResume)}
              aria-label="Download as PDF"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition whitespace-nowrap"
              title="Download current resume as PDF with print styles preserved"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download as PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAiGeneratorModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Create</span>
            </button>
          </div>

          {/* Right Zone: Theme Toggle, Home Link & User Profile */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleUiTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} interface theme`}
              className={`p-2 rounded-lg border text-xs transition ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-amber-300 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onBackToLanding}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition whitespace-nowrap ${
                isDark
                  ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <div
              className={`flex items-center gap-1.5 pl-2 border-l ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight max-w-[90px] 2xl:max-w-[140px]">
                <div
                  className={`text-xs font-bold truncate ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {user.name.split(' ')[0]}
                </div>
                <div className="hidden 2xl:block text-[10px] text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out of workspace"
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Wrap-Friendly Action Bar for < xl Viewports (Zero Horizontal Scrollbar) */}
        <div
          className={`xl:hidden border-t px-4 py-2 flex flex-wrap items-center justify-between gap-2 ${
            isDark
              ? 'border-slate-800 bg-slate-900/90'
              : 'border-slate-200/70 bg-slate-50/90'
          }`}
        >
          <div className="flex md:hidden items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Resume:</span>
            <select
              aria-label="Mobile Active Resume Selector"
              value={activeResume.id}
              onChange={(e) => onSelectResume(e.target.value)}
              className="font-semibold text-slate-900 bg-white rounded-md px-2 py-1 border border-slate-200 text-xs max-w-[160px] truncate"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={onOpenLinkedInImport}
              className="px-2.5 py-1.5 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold inline-flex items-center gap-1 transition whitespace-nowrap"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>LinkedIn Import</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAtsScoreGenerator?.()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1 transition whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Score Generator</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPdf(activeResume)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download as PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAiGeneratorModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1 transition whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Create</span>
            </button>
          </div>
        </div>
      </header>

      {/* Optional Toast / Status Banner */}
      {statusBanner && (
        <div
          role="status"
          className="bg-slate-900 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusBanner}</span>
        </div>
      )}

      {/* Main Workspace Layout: Left Sidebar + Right Active View */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Left Navigation Sidebar (Zero Horizontal Scrollbar: Grid on Mobile/Tablet, Vertical Rail on Desktop) */}
        <aside
          aria-label="Workspace Sections"
          className={`lg:w-64 border-b lg:border-b-0 lg:border-r p-3 sm:p-4 shrink-0 transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="hidden lg:block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-2">
            Workspace Navigation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-1.5">
            {[
              {
                id: 'overview' as DashboardTab,
                label: 'Dashboard Overview',
                sub: 'Home',
                icon: LayoutDashboard,
              },
              {
                id: 'resumes' as DashboardTab,
                label: 'My Documents',
                sub: `${resumes.length + coverLetters.length} Docs`,
                icon: FileText,
              },
              {
                id: 'editor' as DashboardTab,
                label: 'AI Resume Editor',
                sub: '12 Secs',
                icon: PenTool,
              },
              {
                id: 'ats-checker' as DashboardTab,
                label: 'Resume Check',
                sub: `${activeResume.atsScore}%`,
                icon: ShieldCheck,
              },
              {
                id: 'cover-letters' as DashboardTab,
                label: 'AI Cover Letters',
                sub: `${coverLetters.length}`,
                icon: Mail,
              },
              {
                id: 'career-map' as DashboardTab,
                label: 'Job Tracker & AI Suite',
                sub: `${jobApplications.length} Jobs`,
                icon: Compass,
              },
              {
                id: 'templates' as DashboardTab,
                label: 'Template Gallery',
                sub: '12 Tpls',
                icon: LayoutGrid,
              },
              {
                id: 'rea-blueprint' as DashboardTab,
                label: 'REA & Asset Matrix',
                sub: 'v6.7',
                icon: Cpu,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeTab(item.id)}
                  className={`px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition ${
                    isActive
                      ? 'bg-[#FF5A4E] text-white font-semibold shadow-2xs'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800 font-medium'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-xs truncate">{item.label}</span>
                  </div>
                  <span
                    className={`hidden xl:inline text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Sidebar Active Resume Status Card */}
          <div
            className={`hidden lg:block mt-6 p-3.5 rounded-xl border space-y-2.5 ${
              isDark
                ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                : 'bg-slate-50 border-slate-200/80 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono uppercase text-slate-500 font-bold">
                Readiness
              </span>
              <span className="font-mono font-extrabold text-emerald-600 tabular-nums">
                {activeResume.atsScore}/100
              </span>
            </div>
            <div className="text-xs font-bold truncate">{activeResume.title}</div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, activeResume.atsScore)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onChangeTab('editor')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-[11px] font-semibold text-center transition"
              >
                Edit Studio
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPdf(activeResume)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold text-center transition"
              >
                Save PDF
              </button>
            </div>
          </div>
        </aside>

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full text-slate-900">
          {/* VIEW 1: DASHBOARD OVERVIEW (/dashboard/) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Greeting & Readiness Header */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-2xs">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF5A4E] font-bold">
                    <span>ResumeBuilderAi 3.0 Workspace · /dashboard/</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-slate-900">
                    Welcome back, {user.name.split(' ')[0]}! Ready to land your next
                    role?
                  </h1>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Your active resume{' '}
                    <span className="font-semibold text-slate-900">
                      {activeResume.title}
                    </span>{' '}
                    is {completion.percentage}% complete with a Heuristic Readiness
                    Score of{' '}
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {activeResume.atsScore}/100
                    </span>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangeTab('editor')}
                    className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Continue Editing Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(activeResume)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download as PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenLinkedInImport}
                    className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Build from LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAtsScoreGenerator?.()}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>ATS Score Generator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTab('ats-checker')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition"
                  >
                    <Cpu className="w-4 h-4 text-[#FF5A4E]" />
                    <span>Job URL &amp; ML/DL Optimizer</span>
                  </button>
                </div>
              </div>

              {/* Direct Job URL Matcher, Top MNCs & Internship-Ready Accelerator on Overview */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF5A4E] font-bold">
                      Job URL Fetcher · Target Top MNCs · Internship-Ready Accelerator · ML/DL Neural Engine
                    </div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                      Match Any Job URL or Auto-Optimize for Tier-1 MNCs &amp; Internships
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAutoOptimizeResume({
                          internshipReadyMode: !internshipReadyMode,
                        })
                      }
                      className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition ${
                        internshipReadyMode
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>
                        {internshipReadyMode
                          ? 'Internship-Ready Mode: ON'
                          : 'Make Resume Internship-Ready'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleAutoOptimizeResume({
                          mncId: selectedMncId,
                          internshipReadyMode,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>
                        Auto-Optimize for{' '}
                        {TOP_MNC_BENCHMARKS.find((m) => m.id === selectedMncId)
                          ?.name || 'Google'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    aria-label="Overview Job Posting URL"
                    value={jobUrlInput}
                    onChange={(e) => setJobUrlInput(e.target.value)}
                    placeholder="https://careers.google.com/jobs/results/142890-staff-software-engineer-ai-infrastructure"
                    className="flex-1 rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF5A4E]"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await handleFetchJobUrlAndMatch(jobUrlInput);
                      onChangeTab('ats-checker');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    <span>Fetch Job URL &amp; Inspect ML/DL Match</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">
                    Top MNC Targets:
                  </span>
                  {TOP_MNC_BENCHMARKS.map((mnc) => {
                    const isSelected = selectedMncId === mnc.id;
                    return (
                      <button
                        key={mnc.id}
                        type="button"
                        onClick={() => handleSelectMncBenchmark(mnc.id)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {mnc.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Create Action Tiles */}
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Quick Create &amp; Grounded AI Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={onOpenLinkedInImport}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0077B5] text-left group transition shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0077B5]/10 text-[#0077B5] flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      Build from LinkedIn
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Import PDF/Export with source verification &amp; diff review
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAiGeneratorModal(true)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF5A4E] text-left group transition shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      AI Resume Draft
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Generate a role-specific starter draft in seconds
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeTab('cover-letters')}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF5A4E] text-left group transition shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      Matching Cover Letter
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Syncs header palette &amp; typography with your resume
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeTab('career-map')}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#FF5A4E] text-left group transition shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      Job Tracker &amp; AI Suite
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Track applications, bios, translations &amp; share links
                    </p>
                  </button>
                </div>
              </div>

              {/* Recent Resumes Preview Row */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`font-serif text-2xl ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Master Profile &amp; Role-Specific Resume Versions ({resumes.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => onChangeTab('resumes')}
                    className="text-xs font-semibold text-[#FF5A4E] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All in `/dashboard/resumes/`</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {resumes.map((resDoc) => {
                    const pal =
                      THEME_COLORS[resDoc.themeColor] || THEME_COLORS.green;
                    return (
                      <div
                        key={resDoc.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div
                            onClick={() => {
                              onSelectResume(resDoc.id);
                              onChangeTab('editor');
                            }}
                            style={{ backgroundColor: pal.headerBg }}
                            className="p-5 cursor-pointer border-b border-slate-100 transition hover:opacity-95"
                          >
                            <div className="flex items-center justify-between mb-3 text-[11px] font-medium text-slate-800">
                              <span>{resDoc.templateId}</span>
                              <span className="font-mono font-bold tabular-nums">
                                Score {resDoc.atsScore}/100
                              </span>
                            </div>
                            <div className="bg-white rounded-xl p-3.5 shadow-2xs">
                              <div className="font-bold text-sm text-slate-900 truncate">
                                {resDoc.personalInfo.fullName}
                              </div>
                              <div className="text-[11px] text-slate-600 truncate">
                                {resDoc.personalInfo.jobTitle}
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="font-bold text-sm text-slate-900 truncate">
                              {resDoc.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Edited {resDoc.updatedAt} · {resDoc.pageSize || 'A4'}
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectResume(resDoc.id);
                              onChangeTab('editor');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold transition"
                          >
                            Edit Resume
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const copy = cloneResumeDocument(resDoc);
                                onCreateResume(copy);
                                showNotice(`Duplicated "${resDoc.title}"`);
                              }}
                              aria-label={`Duplicate ${resDoc.title}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(resDoc)}
                              aria-label={`Download ${resDoc.title} as PDF`}
                              title="Download as PDF"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold inline-flex items-center gap-1 transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadMarkdown(resDoc)}
                              aria-label={`Export ${resDoc.title}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MY DOCUMENTS (/dashboard/resumes/) */}
          {activeTab === 'resumes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90">
                <div>
                  <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase">
                    ResumeBuilderAi 3.0 · /dashboard/resumes/
                  </div>
                  <h1 className="font-serif text-3xl text-slate-900 mt-1">
                    My Documents ({resumes.length + coverLetters.length})
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onOpenLinkedInImport}
                    className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Build from LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const created = cloneResumeDocument(
                        activeResume,
                        `Role-Specific Resume #${resumes.length + 1}`
                      );
                      onCreateResume(created);
                      showNotice(`Created "${created.title}"`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Duplicate Version</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAiGeneratorModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate with AI</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {(
                    [
                      {
                        id: 'all',
                        label: `All (${resumes.length + coverLetters.length})`,
                      },
                      { id: 'resumes', label: `Resumes (${resumes.length})` },
                      {
                        id: 'cover-letters',
                        label: `Cover Letters (${coverLetters.length})`,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDocFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                        docFilter === tab.id
                          ? 'bg-[#FF5A4E] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    aria-label="Search documents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resumes or roles..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FF5A4E]"
                  />
                </div>
              </div>

              {/* Resumes Grid */}
              {(docFilter === 'all' || docFilter === 'resumes') && (
                <div className="space-y-3">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Resumes ({filteredResumes.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.map((doc) => {
                      const pal =
                        THEME_COLORS[doc.themeColor] || THEME_COLORS.green;
                      return (
                        <div
                          key={doc.id}
                          className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <div
                              style={{ backgroundColor: pal.headerBg }}
                              className="p-5 border-b border-slate-100"
                            >
                              <div className="flex items-center justify-between mb-3 text-[11px] font-medium text-slate-800">
                                <span>
                                  {doc.templateId} · {doc.pageSize || 'A4'}
                                </span>
                                <span className="font-mono font-bold tabular-nums">
                                  Check {doc.atsScore}/100
                                </span>
                              </div>
                              <div className="bg-white rounded-xl p-4 shadow-2xs space-y-1">
                                <div className="font-bold text-base text-slate-900">
                                  {doc.personalInfo.fullName}
                                </div>
                                <div className="text-xs font-medium text-slate-600">
                                  {doc.personalInfo.jobTitle}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 pt-1">
                                  {doc.personalInfo.summary}
                                </p>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-bold text-sm text-slate-900">
                                {doc.title}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {doc.updatedAt} · {doc.experience.length} roles ·{' '}
                                {doc.skills.length} skills
                              </p>
                            </div>
                          </div>

                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectResume(doc.id);
                                  onChangeTab('editor');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold transition"
                              >
                                Open in Studio
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectResume(doc.id);
                                  onOpenAtsScoreGenerator?.();
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition inline-flex items-center gap-1"
                                title="Run ATS Score Generator & Match Optimizer"
                              >
                                <Sparkles className="w-3 h-3 text-[#FF5A4E]" />
                                <span>ATS Match</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadPdf(doc)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 transition inline-flex items-center gap-1"
                                title="Download resume as PDF with print styles"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Download as PDF</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const cloned = cloneResumeDocument(doc);
                                  onCreateResume(cloned);
                                  showNotice(`Duplicated "${doc.title}"`);
                                }}
                                aria-label={`Duplicate ${doc.title}`}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              {resumes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteResume(doc.id);
                                    showNotice(`Deleted "${doc.title}"`);
                                  }}
                                  aria-label={`Delete ${doc.title}`}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cover Letters Grid */}
              {(docFilter === 'all' || docFilter === 'cover-letters') && (
                <div className="space-y-3 pt-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Cover Letters ({filteredCoverLetters.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCoverLetters.map((cl) => (
                      <div
                        key={cl.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
                            <span>Cover Letter · {cl.templateId}</span>
                            <span>{cl.updatedAt}</span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900">
                            {cl.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Target: {cl.companyName} · {cl.roleTitle}
                          </p>
                          <p className="text-xs text-slate-600 mt-3 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {cl.content}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setClCompany(cl.companyName);
                              setClRole(cl.roleTitle);
                              setClDraftContent(cl.content);
                              onChangeTab('cover-letters');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold transition"
                          >
                            Edit Cover Letter
                          </button>
                          {coverLetters.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteCoverLetter(cl.id)}
                              aria-label={`Delete cover letter ${cl.title}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: COMPLETE 12-SECTION RESUME STUDIO EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/*Explicit Before/After AI Suggestion Banner (Requires Acceptance!) */}
              {pendingAi && (
                <div
                  role="region"
                  aria-label="Review AI Wording Suggestion"
                  className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                      <Sparkles className="w-4 h-4 text-[#FF5A4E]" />
                      <span>
                        Explicit AI Review Required — Compare Before &amp; After
                        Before Replacing Content
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAcceptPendingAi}
                        className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept AI Wording</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          pendingAi.type === 'summary'
                            ? handleAiPolishSummary()
                            : handleAiRewriteBullets(pendingAi.expIndex || 0)
                        }
                        className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold"
                      >
                        Retry
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingAi(null)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold"
                      >
                        Reject &amp; Keep Original
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                        Current Factual Content (Before)
                      </div>
                      <p className="text-slate-800 whitespace-pre-line">
                        {pendingAi.originalText}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <div className="text-[10px] font-mono uppercase text-emerald-800 mb-1">
                        Proposed Grounded AI Revision (After)
                      </div>
                      <p className="text-slate-900 whitespace-pre-line font-medium">
                        {pendingAi.suggestedText}
                      </p>
                    </div>
                  </div>

                  {pendingAi.missingInfoQuestions.length > 0 && (
                    <div className="text-[11px] text-amber-900 bg-amber-100/70 px-3 py-2 rounded-lg">
                      <strong>Optional Clarifying Questions (Never Fabricated):</strong>{' '}
                      {pendingAi.missingInfoQuestions.join(' · ')}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Editor Controls (5 cols) */}
                <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  {/* Top Undo / Redo / Snapshot / Autosave Strip */}
                  <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                        aria-label="Undo edit"
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        aria-label="Redo edit"
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveVersionSnapshot}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <History className="w-3 h-3 text-[#FF5A4E]" />
                        <span>Save Version</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ● {activeResume.updatedAt}
                    </span>
                  </div>

                  {/* 6 Editor Section Tabs (2x3 Balanced Grid for Clear Visibility) */}
                  <div className="border-b border-slate-200 bg-slate-50/80 p-2.5 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'personal', label: 'Contact Info', icon: User },
                        { id: 'experience', label: 'Experience', icon: Briefcase },
                        { id: 'education', label: 'Education', icon: GraduationCap },
                        { id: 'skills', label: 'Skills', icon: FlaskConical },
                        { id: 'extended', label: 'More (7)', icon: Layers },
                        { id: 'design', label: 'Layout & Style', icon: LayoutGrid },
                      ] as const
                    ).map((sec) => {
                      const Icon = sec.icon;
                      const active = editorSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setEditorSection(sec.id)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition whitespace-nowrap ${
                            active
                              ? 'bg-[#FF5A4E] text-white shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{sec.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Section Form Body */}
                  <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
                    {editorSection === 'personal' && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="edit-doc-title"
                            className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                          >
                            Resume Version Title
                          </label>
                          <input
                            id="edit-doc-title"
                            type="text"
                            value={activeResume.title}
                            onChange={(e) =>
                              commitResumeUpdate({
                                ...activeResume,
                                title: e.target.value,
                                updatedAt: 'Autosaved just now',
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="edit-fullname"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Full Name
                            </label>
                            <input
                              id="edit-fullname"
                              type="text"
                              value={activeResume.personalInfo.fullName}
                              onChange={(e) =>
                                handlePersonalInfoChange('fullName', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="edit-jobtitle"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Target Job Title
                            </label>
                            <input
                              id="edit-jobtitle"
                              type="text"
                              value={activeResume.personalInfo.jobTitle}
                              onChange={(e) =>
                                handlePersonalInfoChange('jobTitle', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="edit-email"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Email
                            </label>
                            <input
                              id="edit-email"
                              type="email"
                              value={activeResume.personalInfo.email}
                              onChange={(e) =>
                                handlePersonalInfoChange('email', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="edit-phone"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Phone
                            </label>
                            <input
                              id="edit-phone"
                              type="text"
                              value={activeResume.personalInfo.phone}
                              onChange={(e) =>
                                handlePersonalInfoChange('phone', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="edit-location"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Location
                            </label>
                            <input
                              id="edit-location"
                              type="text"
                              value={activeResume.personalInfo.location}
                              onChange={(e) =>
                                handlePersonalInfoChange('location', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="edit-website"
                              className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                            >
                              Website / LinkedIn
                            </label>
                            <input
                              id="edit-website"
                              type="text"
                              value={activeResume.personalInfo.website}
                              onChange={(e) =>
                                handlePersonalInfoChange('website', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <label
                              htmlFor="edit-summary"
                              className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                            >
                              Executive Summary
                            </label>
                            <div className="flex items-center gap-1.5">
                              <select
                                aria-label="AI Summary Polish Mode"
                                value={summaryPolishMode}
                                onChange={(e) =>
                                  setSummaryPolishMode(
                                    e.target.value as
                                      | 'executive'
                                      | 'concise'
                                      | 'grammar'
                                  )
                                }
                                className="text-[11px] px-2 py-1 rounded border border-slate-200 bg-slate-50"
                              >
                                <option value="executive">Executive Tone</option>
                                <option value="concise">Concise</option>
                                <option value="grammar">Grammar &amp; Clarity</option>
                              </select>
                              {aiBusy === 'summary' ? (
                                <button
                                  type="button"
                                  onClick={handleCancelAiRequest}
                                  className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold"
                                >
                                  Cancel
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleAiPolishSummary}
                                  aria-label="AI Rewrite Executive Summary"
                                  className="px-2.5 py-1 rounded-md bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs"
                                >
                                  <Wand2 className="w-3.5 h-3.5" />
                                  <span>AI Rewrite</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <textarea
                            id="edit-summary"
                            rows={4}
                            value={activeResume.personalInfo.summary}
                            onChange={(e) =>
                              handlePersonalInfoChange('summary', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs leading-relaxed text-slate-900"
                          />
                        </div>
                      </div>
                    )}

                    {editorSection === 'experience' && (
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                              Work Experience ({activeResume.experience.length})
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Use <strong>AI Rewrite</strong> next to any role&apos;s bullet points for Gemini impact suggestions.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextExp = [
                                ...activeResume.experience,
                                {
                                  id: `exp-${Date.now()}`,
                                  role: 'Senior Project Lead',
                                  company: 'New Organization',
                                  location: 'New York, NY',
                                  period: '01/2024 – PRESENT',
                                  bullets: [
                                    'Worked on cross-functional execution delivering operational improvements across key teams.',
                                  ],
                                },
                              ];
                              commitResumeUpdate({
                                ...activeResume,
                                experience: nextExp,
                                updatedAt: 'Autosaved just now',
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Role</span>
                          </button>
                        </div>

                        {activeResume.experience.map((exp, idx) => {
                          const isRewritingThis = aiBusy === `exp-${idx}`;
                          const hasInlineSuggestions =
                            pendingAi?.type === 'bullets' &&
                            pendingAi.expIndex === idx &&
                            Array.isArray(pendingAi.bulletComparisons);

                          return (
                            <div
                              key={exp.id}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  aria-label={`Role title ${idx + 1}`}
                                  value={exp.role}
                                  onChange={(e) => {
                                    const next = [...activeResume.experience];
                                    next[idx] = { ...exp, role: e.target.value };
                                    commitResumeUpdate({
                                      ...activeResume,
                                      experience: next,
                                    });
                                  }}
                                  className="font-bold text-xs text-slate-900 bg-white px-2.5 py-1.5 rounded border border-slate-300 flex-1"
                                />
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 font-bold">
                                  Role #{idx + 1}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  aria-label={`Company ${idx + 1}`}
                                  value={exp.company}
                                  onChange={(e) => {
                                    const next = [...activeResume.experience];
                                    next[idx] = {
                                      ...exp,
                                      company: e.target.value,
                                    };
                                    commitResumeUpdate({
                                      ...activeResume,
                                      experience: next,
                                    });
                                  }}
                                  className="text-xs bg-white px-2.5 py-1.5 rounded border border-slate-300"
                                />
                                <input
                                  type="text"
                                  aria-label={`Period ${idx + 1}`}
                                  value={exp.period}
                                  onChange={(e) => {
                                    const next = [...activeResume.experience];
                                    next[idx] = {
                                      ...exp,
                                      period: e.target.value,
                                    };
                                    commitResumeUpdate({
                                      ...activeResume,
                                      experience: next,
                                    });
                                  }}
                                  className="text-xs font-mono bg-white px-2.5 py-1.5 rounded border border-slate-300"
                                />
                              </div>

                              {/* Bullet Points Textarea Header with Tone Selector + AI Rewrite Button */}
                              <div className="space-y-1.5 pt-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <label
                                    htmlFor={`exp-bullets-${idx}`}
                                    className="text-[11px] font-bold uppercase tracking-wider text-slate-600"
                                  >
                                    Impact &amp; Achievement Bullet Points
                                  </label>
                                  <div className="flex items-center gap-1.5">
                                    <select
                                      aria-label={`AI Rewrite style for ${exp.role}`}
                                      value={bulletRewriteTone}
                                      onChange={(e) =>
                                        setBulletRewriteTone(
                                          e.target.value as BulletRewriteTone
                                        )
                                      }
                                      className="text-[11px] px-2 py-1 rounded-md border border-slate-300 bg-white text-slate-700 font-medium"
                                    >
                                      <option value="impact_xyz">
                                        Impact (X-Y-Z Formula)
                                      </option>
                                      <option value="executive">
                                        Executive Leadership
                                      </option>
                                      <option value="technical">
                                        Technical &amp; Metrics
                                      </option>
                                      <option value="concise">
                                        Concise Action-Led
                                      </option>
                                    </select>

                                    <button
                                      type="button"
                                      disabled={isRewritingThis}
                                      onClick={() =>
                                        handleAiRewriteBullets(
                                          idx,
                                          bulletRewriteTone
                                        )
                                      }
                                      aria-label={`AI Rewrite bullets for ${exp.role}`}
                                      className="px-3 py-1 rounded-md bg-[#FF5A4E] hover:bg-[#e8483c] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition shrink-0"
                                    >
                                      <Sparkles className="w-3.5 h-3.5" />
                                      <span>
                                        {isRewritingThis
                                          ? 'Rewriting...'
                                          : 'AI Rewrite'}
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                <textarea
                                  id={`exp-bullets-${idx}`}
                                  rows={4}
                                  aria-label={`Bullets for ${exp.role}`}
                                  value={exp.bullets.join('\n')}
                                  onChange={(e) => {
                                    const next = [...activeResume.experience];
                                    next[idx] = {
                                      ...exp,
                                      bullets: e.target.value.split('\n'),
                                    };
                                    commitResumeUpdate({
                                      ...activeResume,
                                      experience: next,
                                    });
                                  }}
                                  className="w-full text-xs bg-white p-2.5 rounded-lg border border-slate-300 leading-relaxed text-slate-900 focus:outline-none focus:border-[#FF5A4E]"
                                />

                                {/* Inline Gemini Impact Bullet Suggestions Panel */}
                                {hasInlineSuggestions && pendingAi && (
                                  <div
                                    role="region"
                                    aria-label={`Gemini AI Rewrite Suggestions for ${exp.role}`}
                                    className="mt-2 p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 space-y-2.5"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                                        <Sparkles className="w-3.5 h-3.5 text-[#FF5A4E]" />
                                        <span>
                                          Gemini Impact-Oriented Bullet Suggestions (
                                          {pendingAi.bulletComparisons?.length || 0})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={handleAcceptPendingAi}
                                          className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold inline-flex items-center gap-1 transition"
                                        >
                                          <Check className="w-3 h-3" />
                                          <span>Apply All Bullets</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setPendingAi(null)}
                                          className="px-2 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-[11px] font-semibold"
                                        >
                                          Dismiss
                                        </button>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      {(pendingAi.bulletComparisons || []).map(
                                        (item) => (
                                          <div
                                            key={item.index}
                                            className="p-2.5 rounded-lg bg-white border border-amber-200/90 space-y-1.5 text-xs"
                                          >
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                                                Action Verb: {item.actionVerb}
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleApplySingleBulletSuggestion(
                                                    idx,
                                                    item.index,
                                                    item.rewritten
                                                  )
                                                }
                                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-[#FF5A4E] text-white text-[10px] font-semibold transition"
                                              >
                                                Use Bullet #{item.index + 1}
                                              </button>
                                            </div>
                                            {item.original && (
                                              <div className="text-[11px] text-slate-500 line-through">
                                                {item.original}
                                              </div>
                                            )}
                                            <div className="text-xs font-medium text-slate-900 leading-relaxed">
                                              {item.rewritten}
                                            </div>
                                            <div className="text-[10px] text-emerald-800 font-mono">
                                              ✓ {item.improvementNote}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {editorSection === 'education' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                            Education ({activeResume.education.length})
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              commitResumeUpdate({
                                ...activeResume,
                                education: [
                                  ...activeResume.education,
                                  {
                                    id: `edu-${Date.now()}`,
                                    degree: 'B.Sc. in Computer Science',
                                    school: 'State University',
                                    location: 'Boston, MA',
                                    period: '09/2016 – 05/2020',
                                    details: 'Magna Cum Laude',
                                  },
                                ],
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Degree</span>
                          </button>
                        </div>

                        {activeResume.education.map((edu, idx) => (
                          <div
                            key={edu.id}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                          >
                            <input
                              type="text"
                              aria-label={`Degree ${idx + 1}`}
                              value={edu.degree}
                              onChange={(e) => {
                                const next = [...activeResume.education];
                                next[idx] = { ...edu, degree: e.target.value };
                                commitResumeUpdate({
                                  ...activeResume,
                                  education: next,
                                });
                              }}
                              className="w-full font-bold text-xs bg-white px-2.5 py-1.5 rounded border border-slate-300"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                aria-label={`School ${idx + 1}`}
                                value={edu.school}
                                onChange={(e) => {
                                  const next = [...activeResume.education];
                                  next[idx] = { ...edu, school: e.target.value };
                                  commitResumeUpdate({
                                    ...activeResume,
                                    education: next,
                                  });
                                }}
                                className="text-xs bg-white px-2.5 py-1.5 rounded border border-slate-300"
                              />
                              <input
                                type="text"
                                aria-label={`Education period ${idx + 1}`}
                                value={edu.period}
                                onChange={(e) => {
                                  const next = [...activeResume.education];
                                  next[idx] = { ...edu, period: e.target.value };
                                  commitResumeUpdate({
                                    ...activeResume,
                                    education: next,
                                  });
                                }}
                                className="text-xs font-mono bg-white px-2.5 py-1.5 rounded border border-slate-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {editorSection === 'skills' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                            Skills &amp; Proficiency ({activeResume.skills.length})
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              commitResumeUpdate({
                                ...activeResume,
                                skills: [
                                  ...activeResume.skills,
                                  {
                                    id: `sk-${Date.now()}`,
                                    name: 'Strategic Leadership',
                                    category: 'CORE',
                                    level: 90,
                                  },
                                ],
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Skill</span>
                          </button>
                        </div>

                        {activeResume.skills.map((sk, idx) => (
                          <div
                            key={sk.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                aria-label={`Skill name ${idx + 1}`}
                                value={sk.name}
                                onChange={(e) => {
                                  const next = [...activeResume.skills];
                                  next[idx] = { ...sk, name: e.target.value };
                                  commitResumeUpdate({
                                    ...activeResume,
                                    skills: next,
                                  });
                                }}
                                className="text-xs font-semibold bg-white px-2.5 py-1 rounded border border-slate-300 flex-1"
                              />
                              <span className="text-xs font-mono font-bold text-slate-700 tabular-nums">
                                {sk.level}%
                              </span>
                            </div>
                            <input
                              type="range"
                              aria-label={`Skill proficiency for ${sk.name}`}
                              min={40}
                              max={100}
                              value={sk.level}
                              onChange={(e) => {
                                const next = [...activeResume.skills];
                                next[idx] = {
                                  ...sk,
                                  level: Number(e.target.value),
                                };
                                commitResumeUpdate({
                                  ...activeResume,
                                  skills: next,
                                });
                              }}
                              className="w-full accent-[#FF5A4E]"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* EXTENDED SECTIONS: Projects, Certifications, Languages, Awards, Volunteering, Publications, Custom Sections + Keyboard Reordering */}
                    {editorSection === 'extended' && (
                      <div className="space-y-5">
                        {/* Keyboard-Accessible Section Order Controls */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Keyboard-Accessible Section Reordering
                          </div>
                          <div className="space-y-1.5">
                            {(
                              activeResume.sectionOrder || DEFAULT_SECTION_ORDER
                            ).map((secKey, idx, arr) => (
                              <div
                                key={secKey}
                                className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                              >
                                <span className="font-semibold capitalize text-slate-800">
                                  {idx + 1}. {secKey}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() =>
                                      commitResumeUpdate(
                                        moveResumeSection(
                                          activeResume,
                                          secKey as ReorderableSectionKey,
                                          'up'
                                        )
                                      )
                                    }
                                    aria-label={`Move ${secKey} section up`}
                                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === arr.length - 1}
                                    onClick={() =>
                                      commitResumeUpdate(
                                        moveResumeSection(
                                          activeResume,
                                          secKey as ReorderableSectionKey,
                                          'down'
                                        )
                                      )
                                    }
                                    aria-label={`Move ${secKey} section down`}
                                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Projects */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <label
                              htmlFor="ext-projects"
                              className="block text-xs font-bold uppercase text-slate-600"
                            >
                              Projects (Name | Role | Period | Description per line)
                            </label>
                            <button
                              type="button"
                              disabled={aiBusy === 'ext-projects'}
                              onClick={() =>
                                handleAiRewriteExtendedSection('projects')
                              }
                              className="px-2.5 py-1 rounded-md bg-[#FF5A4E]/10 hover:bg-[#FF5A4E]/20 text-[#FF5A4E] text-[11px] font-bold inline-flex items-center gap-1 transition"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>
                                {aiBusy === 'ext-projects'
                                  ? 'Rewriting...'
                                  : 'AI Rewrite'}
                              </span>
                            </button>
                          </div>
                          <textarea
                            id="ext-projects"
                            rows={3}
                            value={(activeResume.projects || [])
                              .map(
                                (p) =>
                                  `${p.name} | ${p.role} | ${p.period} | ${p.description}`
                              )
                              .join('\n')}
                            onChange={(e) => {
                              const projects = e.target.value
                                .split('\n')
                                .filter(Boolean)
                                .map((line, i) => {
                                  const [name, role, period, ...desc] = line
                                    .split('|')
                                    .map((s) => s.trim());
                                  return {
                                    id: `proj-${i}`,
                                    name: name || 'Project',
                                    role: role || 'Lead',
                                    period: period || '2024',
                                    description: desc.join(' | ') || '',
                                  };
                                });
                              commitResumeUpdate({ ...activeResume, projects });
                            }}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        {/* Certifications */}
                        <div>
                          <label
                            htmlFor="ext-certs"
                            className="block text-xs font-bold uppercase text-slate-600 mb-1"
                          >
                            Certifications (One per line)
                          </label>
                          <textarea
                            id="ext-certs"
                            rows={2}
                            value={(activeResume.certifications || []).join('\n')}
                            onChange={(e) =>
                              commitResumeUpdate({
                                ...activeResume,
                                certifications: e.target.value
                                  .split('\n')
                                  .filter(Boolean),
                              })
                            }
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        {/* Languages */}
                        <div>
                          <label
                            htmlFor="ext-langs"
                            className="block text-xs font-bold uppercase text-slate-600 mb-1"
                          >
                            Languages (Language | Proficiency | % per line)
                          </label>
                          <textarea
                            id="ext-langs"
                            rows={2}
                            value={(activeResume.languages || [])
                              .map((l) => `${l.name} | ${l.proficiency} | ${l.level}`)
                              .join('\n')}
                            onChange={(e) => {
                              const languages = e.target.value
                                .split('\n')
                                .filter(Boolean)
                                .map((line, i) => {
                                  const [name, proficiency, lvl] = line
                                    .split('|')
                                    .map((s) => s.trim());
                                  return {
                                    id: `lang-${i}`,
                                    name: name || 'English',
                                    proficiency: proficiency || 'Fluent',
                                    level: Number(lvl) || 90,
                                  };
                                });
                              commitResumeUpdate({ ...activeResume, languages });
                            }}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        {/* Awards & Volunteering */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <label
                                htmlFor="ext-awards"
                                className="block text-xs font-bold uppercase text-slate-600"
                              >
                                Awards &amp; Honors
                              </label>
                              <button
                                type="button"
                                disabled={aiBusy === 'ext-awards'}
                                onClick={() =>
                                  handleAiRewriteExtendedSection('awards')
                                }
                                className="px-2 py-0.5 rounded bg-[#FF5A4E]/10 hover:bg-[#FF5A4E]/20 text-[#FF5A4E] text-[10px] font-bold inline-flex items-center gap-1 transition"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>AI Rewrite</span>
                              </button>
                            </div>
                            <textarea
                              id="ext-awards"
                              rows={2}
                              value={(activeResume.awards || []).join('\n')}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  awards: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <label
                                htmlFor="ext-vol"
                                className="block text-xs font-bold uppercase text-slate-600"
                              >
                                Volunteering
                              </label>
                              <button
                                type="button"
                                disabled={aiBusy === 'ext-volunteering'}
                                onClick={() =>
                                  handleAiRewriteExtendedSection('volunteering')
                                }
                                className="px-2 py-0.5 rounded bg-[#FF5A4E]/10 hover:bg-[#FF5A4E]/20 text-[#FF5A4E] text-[10px] font-bold inline-flex items-center gap-1 transition"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>AI Rewrite</span>
                              </button>
                            </div>
                            <textarea
                              id="ext-vol"
                              rows={2}
                              value={(activeResume.volunteering || []).join('\n')}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  volunteering: e.target.value
                                    .split('\n')
                                    .filter(Boolean),
                                })
                              }
                              className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>
                        </div>

                        {/* Publications & Custom Sections */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <label
                              htmlFor="ext-pubs"
                              className="block text-xs font-bold uppercase text-slate-600"
                            >
                              Publications (Title | Venue | Year per line)
                            </label>
                            <button
                              type="button"
                              disabled={aiBusy === 'ext-publications'}
                              onClick={() =>
                                handleAiRewriteExtendedSection('publications')
                              }
                              className="px-2.5 py-1 rounded-md bg-[#FF5A4E]/10 hover:bg-[#FF5A4E]/20 text-[#FF5A4E] text-[11px] font-bold inline-flex items-center gap-1 transition"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>AI Rewrite</span>
                            </button>
                          </div>
                          <textarea
                            id="ext-pubs"
                            rows={2}
                            value={(activeResume.publications || [])
                              .map((p) => `${p.title} | ${p.venue} | ${p.year}`)
                              .join('\n')}
                            onChange={(e) => {
                              const publications = e.target.value
                                .split('\n')
                                .filter(Boolean)
                                .map((line, i) => {
                                  const [title, venue, year] = line
                                    .split('|')
                                    .map((s) => s.trim());
                                  return {
                                    id: `pub-${i}`,
                                    title: title || 'Publication Title',
                                    venue: venue || 'Journal / Conference',
                                    year: year || '2024',
                                  };
                                });
                              commitResumeUpdate({ ...activeResume, publications });
                            }}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {editorSection === 'design' && (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            12 Original Templates (Switch Without Losing Content)
                          </label>
                          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                            {RESUME_TEMPLATES.map((tpl) => (
                              <button
                                key={tpl.id}
                                type="button"
                                onClick={() =>
                                  commitResumeUpdate({
                                    ...activeResume,
                                    templateId: tpl.id,
                                  })
                                }
                                className={`p-2.5 rounded-xl border text-left transition ${
                                  activeResume.templateId === tpl.id
                                    ? 'border-[#FF5A4E] bg-[#FF5A4E]/5 font-bold'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <div className="text-xs text-slate-900">{tpl.name}</div>
                                <div className="text-[10px] text-slate-500">
                                  {tpl.category}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Document Accent Color
                          </label>
                          <div className="flex flex-wrap gap-2.5">
                            {(Object.keys(THEME_COLORS) as ThemeColorId[]).map(
                              (cKey) => (
                                <button
                                  key={cKey}
                                  type="button"
                                  onClick={() =>
                                    commitResumeUpdate({
                                      ...activeResume,
                                      themeColor: cKey,
                                    })
                                  }
                                  aria-label={`Set resume color ${THEME_COLORS[cKey].label}`}
                                  style={{
                                    backgroundColor: THEME_COLORS[cKey].swatch,
                                  }}
                                  className={`w-7 h-7 rounded-full transition ${
                                    activeResume.themeColor === cKey
                                      ? 'ring-2 ring-slate-950 ring-offset-2'
                                      : 'opacity-85 hover:opacity-100'
                                  }`}
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* Page Size, Margins, Line Spacing, Font Size */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="editor-page-size"
                              className="block text-[11px] font-bold uppercase text-slate-500 mb-1"
                            >
                              Page Size
                            </label>
                            <select
                              id="editor-page-size"
                              value={activeResume.pageSize || 'A4'}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  pageSize: e.target.value as 'A4' | 'LETTER',
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            >
                              <option value="A4">A4 (210 × 297 mm)</option>
                              <option value="LETTER">US Letter (8.5 × 11 in)</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="editor-margins"
                              className="block text-[11px] font-bold uppercase text-slate-500 mb-1"
                            >
                              Margins
                            </label>
                            <select
                              id="editor-margins"
                              value={activeResume.marginSize || 'standard'}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  marginSize: e.target.value as
                                    | 'compact'
                                    | 'standard'
                                    | 'generous',
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            >
                              <option value="compact">Compact</option>
                              <option value="standard">Standard</option>
                              <option value="generous">Generous</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="editor-spacing"
                              className="block text-[11px] font-bold uppercase text-slate-500 mb-1"
                            >
                              Line Spacing
                            </label>
                            <select
                              id="editor-spacing"
                              value={activeResume.lineSpacing || 'normal'}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  lineSpacing: e.target.value as
                                    | 'tight'
                                    | 'normal'
                                    | 'relaxed',
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            >
                              <option value="tight">Tight</option>
                              <option value="normal">Normal</option>
                              <option value="relaxed">Relaxed</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="editor-font-family"
                              className="block text-[11px] font-bold uppercase text-slate-500 mb-1"
                            >
                              Typography
                            </label>
                            <select
                              id="editor-font-family"
                              value={activeResume.fontFamily}
                              onChange={(e) =>
                                commitResumeUpdate({
                                  ...activeResume,
                                  fontFamily: e.target.value as FontFamilyId,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            >
                              {(Object.keys(FONT_FAMILIES) as FontFamilyId[]).map(
                                (f) => (
                                  <option key={f} value={f}>
                                    {FONT_FAMILIES[f].label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Version History Restore Panel */}
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <div className="text-xs font-bold uppercase text-slate-500">
                            Version History ({activeResume.versionHistory?.length || 0})
                          </div>
                          {(!activeResume.versionHistory ||
                            activeResume.versionHistory.length === 0) && (
                            <p className="text-xs text-slate-500">
                              Click &ldquo;Save Version&rdquo; above to capture a
                              restorable checkpoint.
                            </p>
                          )}
                          {(activeResume.versionHistory || []).map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
                            >
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {v.label}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {v.timestamp}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRestoreVersionSnapshot(
                                    v.serialized,
                                    v.label
                                  )
                                }
                                className="px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold"
                              >
                                Restore
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Live A4/Letter Canvas Preview + Export Validator Toolbar (7 cols) */}
                <div className="xl:col-span-7 space-y-3">
                  <div className="bg-white rounded-2xl border border-slate-200/90 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums whitespace-nowrap">
                        Readiness: {activeResume.atsScore}/100
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenAtsScoreGenerator?.()}
                        className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 transition whitespace-nowrap"
                        title="Analyze resume against any Job Description and get ATS optimization tips"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>ATS Match</span>
                      </button>
                      <select
                        aria-label="Preview Zoom"
                        value={zoomPercent}
                        onChange={(e) => setZoomPercent(Number(e.target.value))}
                        className="text-xs bg-slate-100 px-2 py-1 rounded-md border border-slate-200 font-mono"
                      >
                        <option value={85}>Zoom 85%</option>
                        <option value={100}>Fit (100%)</option>
                        <option value={110}>Zoom 110%</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadDocx(activeResume)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOCX</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadJson(activeResume)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadMarkdown(activeResume)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>MD</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(activeResume)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Download as PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Export Pre-Flight Checks Strip */}
                  <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                    {exportValidation.checks.map((chk, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {chk.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ResumeCanvasPreview
                    resume={activeResume}
                    interactive
                    zoomPercent={zoomPercent}
                    onSelectSection={(sec) => setEditorSection(sec)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: JOB URL FETCHER, TOP MNC & INTERNSHIP HUB, AND ML/DL NEURAL DIAGNOSTIC ENGINE */}
          {activeTab === 'ats-checker' && (
            <div className="space-y-6">
              {/* Top Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                    Job URL Matcher · Top MNC &amp; Internship Accelerator · ML/DL Neural Engine
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl text-slate-900">
                    Readiness, Job URL Match &amp; Auto-Optimizer for{' '}
                    {activeResume.personalInfo.fullName}
                  </h1>
                  <p className="text-xs text-slate-500 max-w-2xl">
                    {atsReport.heuristicDisclaimer}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-center px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      TF-IDF + BM25 ML
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {mlDlReport.ensembleShortlistProbability}%
                    </div>
                  </div>
                  <div className="text-center px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                      3-Layer Deep MLP
                    </div>
                    <div className="text-2xl font-extrabold text-sky-950 tabular-nums">
                      {mlDlReport.deepMlpScore}%
                    </div>
                  </div>
                  <div className="text-center px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Heuristic Score
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-900 tabular-nums">
                      {atsReport.overallScore}
                      <span className="text-xs font-normal">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job URL Fetcher + Target Top MNCs + Internship-Ready Hub */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                      1. Fetch Job URL &amp; Select Target Top MNC or Internship Track
                    </div>
                    <h2 className="font-bold text-lg text-slate-900 mt-0.5">
                      Paste Any Job Posting URL or Select a Tier-1 MNC / Internship Benchmark
                    </h2>
                  </div>

                  {/* Internship-Ready Mode Switch + 1-Click Auto-Optimize CTA */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nextIntern = !internshipReadyMode;
                        handleSelectMncBenchmark(selectedMncId, nextIntern);
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                        internshipReadyMode
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {internshipReadyMode
                          ? 'Internship-Ready Mode: ON'
                          : 'Enable Internship-Ready Mode'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenAtsScoreGenerator?.(selectedJdText)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Launch ATS Score Generator &amp; Matcher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAutoOptimizeResume()}
                      className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Wand2 className="w-4 h-4" />
                      <span>
                        Auto-Optimize Resume for {extractedJob.company.split(' ')[0]}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Job URL Input Bar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    aria-label="Job Posting URL to fetch and match"
                    value={jobUrlInput}
                    onChange={(e) => setJobUrlInput(e.target.value)}
                    placeholder="https://careers.google.com/jobs/results/... or https://www.linkedin.com/jobs/view/..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF5A4E]"
                  />
                  <button
                    type="button"
                    disabled={aiBusy === 'job-url'}
                    onClick={() => handleFetchJobUrlAndMatch()}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shrink-0 transition"
                  >
                    <Globe className="w-4 h-4 text-[#FF5A4E]" />
                    <span>
                      {aiBusy === 'job-url'
                        ? 'Fetching Job URL...'
                        : 'Fetch Job URL & Match Profile'}
                    </span>
                  </button>
                </div>

                {/* Target Top MNCs Selector Pills */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Target Top MNCs &amp; Global Campus Benchmarks (Click to Load Hiring Rubric):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {TOP_MNC_BENCHMARKS.map((mnc) => {
                      const active = selectedMncId === mnc.id;
                      return (
                        <button
                          key={mnc.id}
                          type="button"
                          onClick={() => handleSelectMncBenchmark(mnc.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            active
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {mnc.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Extracted Job URL Summary & MNC Rubric Card */}
                {(() => {
                  const currentMnc =
                    TOP_MNC_BENCHMARKS.find((b) => b.id === selectedMncId) ||
                    TOP_MNC_BENCHMARKS[0];
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                      <div className="lg:col-span-7 space-y-1.5">
                        <div className="text-[11px] font-mono uppercase text-slate-500">
                          Extracted Job Posting · {extractedJob.company} ·{' '}
                          {extractedJob.seniority}
                        </div>
                        <div className="font-bold text-sm text-slate-900">
                          {extractedJob.roleTitle} ({extractedJob.location})
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          <strong>MNC Hiring Bar Focus:</strong>{' '}
                          {currentMnc.hiringBarFocus}
                        </p>
                        <p className="text-slate-700">
                          <strong>{currentMnc.bulletFormulaName}:</strong>{' '}
                          <span className="font-mono text-[11px]">
                            {currentMnc.bulletFormulaTemplate}
                          </span>
                        </p>
                      </div>
                      <div className="lg:col-span-5 flex flex-col justify-between gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-4">
                        <div>
                          <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                            Extracted Required Skills ({extractedJob.requiredSkills.length})
                          </div>
                          <div className="text-slate-800 font-medium leading-relaxed">
                            {extractedJob.requiredSkills.join(' · ')}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAutoOptimizeResume({
                                mncId: selectedMncId,
                                internshipReadyMode: false,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5A4E] text-white font-semibold transition"
                          >
                            Optimize for {currentMnc.name.split(' ')[0]} Full-Time
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAutoOptimizeResume({
                                mncId: selectedMncId,
                                internshipReadyMode: true,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition"
                          >
                            Optimize for {currentMnc.name.split(' ')[0]} Internship
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Applied Auto-Optimization Confirmation Banner */}
                {lastAutoOptimizeResult && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-emerald-950 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>
                          Auto-Optimized Resume for{' '}
                          {lastAutoOptimizeResult.tailoredForCompany} (
                          {lastAutoOptimizeResult.tailoredForRole}) — Readiness
                          jumped from {lastAutoOptimizeResult.beforeScore}% &rarr;{' '}
                          {lastAutoOptimizeResult.afterScore}%!
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onChangeTab('editor')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold"
                      >
                        Open Optimized Resume in Editor &rarr;
                      </button>
                    </div>
                    <ul className="list-disc pl-5 text-emerald-900 space-y-0.5">
                      {lastAutoOptimizeResult.appliedChanges.map((chg, i) => (
                        <li key={i}>{chg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ML & DL Neural Algorithm Telemetry Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Classical ML (TF-IDF Cosine, Okapi BM25, Random Forest + Logistic Regression) */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                      Classical Machine Learning (ML) Scoring Pipeline
                    </div>
                    <h2 className="font-bold text-lg text-slate-900 mt-0.5">
                      TF-IDF Cosine Similarity, Okapi BM25 &amp; Random Forest Ensemble
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        TF-IDF Cosine
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                        {mlDlReport.tfidfCosineSimilarity}%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        Okapi BM25
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                        {mlDlReport.bm25Score}%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-500">
                        RF + Logistic Prob
                      </div>
                      <div className="text-xl font-extrabold text-emerald-800 tabular-nums mt-0.5">
                        {mlDlReport.ensembleShortlistProbability}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700">
                      Top Weighted TF-IDF &amp; BM25 Shared Terms:
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed">
                      {mlDlReport.topTfidfTerms
                        .map((t) => `${t.term} (${t.weight})`)
                        .join(' · ') || 'Run analysis to compute term weights'}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700">
                      8-Dimensional ML Feature Vector &amp; Random Forest Tree Votes (
                      {mlDlReport.randomForestTreeVotes.map((v) => `${v}%`).join(' / ')}
                      ):
                    </div>
                    <div className="space-y-1.5">
                      {mlDlReport.featureVector.map((feat) => (
                        <div
                          key={feat.name}
                          className="flex items-center justify-between gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded border border-slate-200/70"
                        >
                          <span className="font-medium text-slate-800">
                            {feat.name}
                          </span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {Math.round(feat.normalizedValue * 100)}% (w=
                            {feat.importanceWeight})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Deep Learning (3-Layer MLP Forward Pass + Transformer Self-Attention) */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase text-sky-700">
                      Deep Learning (DL) Neural Architecture
                    </div>
                    <h2 className="font-bold text-lg text-slate-900 mt-0.5">
                      3-Layer MLP (GELU + ReLU + Softmax) &amp; Self-Attention Scorer
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                      <div className="text-[10px] font-bold uppercase text-sky-800">
                        Top MNC Ready
                      </div>
                      <div className="text-lg font-extrabold text-sky-950 tabular-nums">
                        {mlDlReport.mlpClassProbabilities.topMncReady}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="text-[10px] font-bold uppercase text-amber-800">
                        Internship Ready
                      </div>
                      <div className="text-lg font-extrabold text-amber-950 tabular-nums">
                        {mlDlReport.mlpClassProbabilities.internshipReady}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-[10px] font-bold uppercase text-emerald-800">
                        Senior IC Ready
                      </div>
                      <div className="text-lg font-extrabold text-emerald-950 tabular-nums">
                        {mlDlReport.mlpClassProbabilities.seniorSpecialistReady}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold uppercase text-slate-600">
                        MNC Readiness
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 tabular-nums">
                        {mlDlReport.mncReadinessScore}%
                      </div>
                    </div>
                  </div>

                  {/* Neural Layer Activations Readout */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] font-mono">
                    <div className="font-bold text-slate-700">
                      MLP Hidden Layer 1 (GELU Activations):
                    </div>
                    <div className="text-slate-600">
                      [{mlDlReport.mlpLayerActivations.hiddenLayer1Gelu.join(', ')}]
                    </div>
                    <div className="font-bold text-slate-700 pt-1">
                      MLP Hidden Layer 2 (ReLU Activations):
                    </div>
                    <div className="text-slate-600">
                      [{mlDlReport.mlpLayerActivations.hiddenLayer2Relu.join(', ')}]
                    </div>
                  </div>

                  {/* Transformer Self-Attention Bullet Analysis */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      Transformer Scaled Dot-Product Self-Attention Bullet Analysis:
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {mlDlReport.bulletAttentionAnalyses.slice(0, 3).map((ba) => (
                        <div
                          key={ba.bulletIndex}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              {ba.role} ({ba.company})
                            </span>
                            <span className="font-mono font-bold text-emerald-800 tabular-nums">
                              Attention: {ba.attentionScore}/100 ·{' '}
                              {ba.xyzCompliant ? 'X-Y-Z Pass' : 'Needs X-Y-Z Upgrade'}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            {ba.originalBullet}
                          </p>
                          <div className="text-[10px] font-mono text-slate-500">
                            Attention Heads: Verb={ba.attentionWeights.actionVerb} ·
                            Metric={ba.attentionWeights.quantifiedMetric} · Tech=
                            {ba.attentionWeights.techSpecificity} · Outcome=
                            {ba.attentionWeights.outcomeClarity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Job Description Input */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ats-jd-textarea"
                      className="block text-xs font-extrabold uppercase tracking-wider text-slate-600"
                    >
                      Target Job Description (Fetched from URL or Custom)
                    </label>
                    <select
                      aria-label="Load preset job description"
                      onChange={(e) => {
                        const found = PRESET_JOB_DESCRIPTIONS.find(
                          (j) => j.id === e.target.value
                        );
                        if (found) setSelectedJdText(found.description);
                      }}
                      className="w-full text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-medium text-slate-800"
                    >
                      {PRESET_JOB_DESCRIPTIONS.map((jd) => (
                        <option key={jd.id} value={jd.id}>
                          Preset: {jd.title} ({jd.company})
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    id="ats-jd-textarea"
                    rows={8}
                    value={selectedJdText}
                    onChange={(e) => setSelectedJdText(e.target.value)}
                    placeholder="Paste target job description here..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed text-slate-800"
                  />

                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={aiBusy === 'ats'}
                      onClick={handleRunAtsAudit}
                      className="w-full py-3 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          aiBusy === 'ats' ? 'animate-spin' : ''
                        }`}
                      />
                      <span>
                        {aiBusy === 'ats'
                          ? 'Scanning Resume...'
                          : 'Run In-Page Diagnostic & ML Check'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenAtsScoreGenerator?.(selectedJdText)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Open Full ATS Score Generator &amp; Match Optimizer</span>
                    </button>
                  </div>
                </div>

                {/* Right Audit Findings & Before/After Tailoring */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {(
                      [
                        { label: 'Impact', val: atsReport.sectionScores.impact },
                        {
                          label: 'Keywords',
                          val: atsReport.sectionScores.keywords,
                        },
                        {
                          label: 'Formatting',
                          val: atsReport.sectionScores.formatting,
                        },
                        {
                          label: 'Readability',
                          val: atsReport.sectionScores.readability,
                        },
                        {
                          label: 'Dates',
                          val: atsReport.sectionScores.dateConsistency,
                        },
                      ] as const
                    ).map((s) => (
                      <div
                        key={s.label}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center"
                      >
                        <div className="text-[10px] font-bold uppercase text-slate-500">
                          {s.label}
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 tabular-nums mt-0.5">
                          {s.val}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Matched & Missing Keywords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                      <div className="text-xs font-bold text-emerald-900 mb-2">
                        Matched Keywords ({atsReport.matchedKeywords.length})
                      </div>
                      <div className="text-xs text-emerald-900 leading-relaxed">
                        {atsReport.matchedKeywords.join(' · ') || 'None detected'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="text-xs font-bold text-amber-900 mb-2">
                        Missing Benchmark Keywords ({atsReport.missingKeywords.length})
                      </div>
                      <div className="text-xs text-amber-900 leading-relaxed">
                        {atsReport.missingKeywords.length === 0
                          ? 'All benchmark keywords covered!'
                          : atsReport.missingKeywords.join(' · ')}
                      </div>
                    </div>
                  </div>

                  {/* Actionable ML/DL Suggestions */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Actionable ML/DL &amp; MNC Optimization Suggestions
                    </div>
                    {mlDlReport.actionableSuggestions.map((sug) => (
                      <div
                        key={sug.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-900">
                            {sug.category} · {sug.title}
                          </div>
                          <p className="text-xs text-slate-600">{sug.suggestion}</p>
                        </div>
                        {sug.autoFixAvailable && (
                          <button
                            type="button"
                            onClick={() => handleAutoOptimizeResume()}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5A4E] text-white text-[11px] font-semibold shrink-0 transition"
                          >
                            Auto-Fix
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Before / After Tailoring Preview */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#FF5A4E]">
                      Job-Description Tailoring — Before / After Comparison
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                          Current Summary (Before)
                        </div>
                        <p className="text-slate-700">
                          {activeResume.personalInfo.summary}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <div className="text-[10px] font-mono uppercase text-emerald-800 mb-1">
                          Tailored Summary (After)
                        </div>
                        <p className="text-slate-900 font-medium">
                          {atsReport.tailoredSummary}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Applies tailored summary, X-Y-Z bullet upgrades, and missing benchmark skills.
                      </span>
                      <button
                        type="button"
                        onClick={handleApplyAtsTailoringToResume}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>
                          {atsAppliedNotice
                            ? 'Auto-Optimization Applied ✓'
                            : 'Accept & Auto-Optimize Resume'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: MATCHING COVER LETTER STUDIO */}
          {activeTab === 'cover-letters' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                    Matching Cover Letter Studio
                  </span>
                  <h1 className="font-serif text-2xl text-slate-900 mt-1">
                    Generate a Matched Cover Letter
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Automatically shares the header palette and typography of{' '}
                    <strong>{activeResume.title}</strong> ({activeResume.templateId}
                    ).
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="cl-company"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                  >
                    Target Company
                  </label>
                  <input
                    id="cl-company"
                    type="text"
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cl-role"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                  >
                    Target Role Title
                  </label>
                  <input
                    id="cl-role"
                    type="text"
                    value={clRole}
                    onChange={(e) => setClRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cl-tone"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1"
                  >
                    Editorial Tone
                  </label>
                  <select
                    id="cl-tone"
                    value={clTone}
                    onChange={(e) => setClTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-800"
                  >
                    <option value="Confident & Executive">
                      Confident &amp; Executive
                    </option>
                    <option value="Technical & Metrics-Driven">
                      Technical &amp; Metrics-Driven
                    </option>
                    <option value="Warm & Collaborative">
                      Warm &amp; Collaborative
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  disabled={aiBusy === 'cover-letter'}
                  onClick={handleGenerateCoverLetter}
                  className="w-full py-3 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {aiBusy === 'cover-letter'
                      ? 'Drafting with AI...'
                      : 'Generate Grounded Cover Letter'}
                  </span>
                </button>
              </div>

              {/* Right Matching Cover Letter Paper Preview */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                {/* Synchronized Resume Header Design */}
                <div
                  style={{
                    backgroundColor: activePalette.headerBg,
                    color: activePalette.headerText,
                  }}
                  className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-xl">
                      {activeResume.personalInfo.fullName}
                    </div>
                    <div className="text-xs opacity-85">
                      {activeResume.personalInfo.jobTitle} · Application for{' '}
                      {clRole} at {clCompany}
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono opacity-85">
                    <div>{activeResume.personalInfo.email}</div>
                    <div>{activeResume.personalInfo.phone}</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Matched to template: <strong>{activeResume.templateId}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveCoverLetter}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save to My Documents</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print PDF</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={15}
                    aria-label="Cover letter content"
                    value={clDraftContent}
                    onChange={(e) => setClDraftContent(e.target.value)}
                    className="w-full p-5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif"
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: JOB APPLICATION TRACKER, AI CAREER WRITING SUITE, SHARE LINKS & PRIVACY */}
          {activeTab === 'career-map' && (
            <div className="space-y-8">
              {/* Section A: Job Application Tracker */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                      Job Application Tracker
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-1">
                      Track Applications &amp; Linked Resume Versions ({jobApplications.length})
                    </h1>
                  </div>
                </div>

                {/* Add Job Form */}
                <form
                  onSubmit={handleAddJobApplication}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                >
                  <input
                    type="text"
                    aria-label="Company name"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    placeholder="Company (e.g., Anthropic)"
                    className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    aria-label="Role title"
                    value={newJobRole}
                    onChange={(e) => setNewJobRole(e.target.value)}
                    placeholder="Target Role Title"
                    className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                  <select
                    aria-label="Application stage"
                    value={newJobStage}
                    onChange={(e) =>
                      setNewJobStage(
                        e.target.value as JobApplicationItem['stage']
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Saved">Stage: Saved</option>
                    <option value="Applied">Stage: Applied</option>
                    <option value="Interviewing">Stage: Interviewing</option>
                    <option value="Offer">Stage: Offer</option>
                    <option value="Archived">Stage: Archived</option>
                  </select>
                  <input
                    type="date"
                    aria-label="Application deadline"
                    value={newJobDeadline}
                    onChange={(e) => setNewJobDeadline(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold"
                  >
                    + Add Application
                  </button>
                </form>

                {/* Applications Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                        <th className="py-2.5 pr-4">Company &amp; Role</th>
                        <th className="py-2.5 px-4">Stage</th>
                        <th className="py-2.5 px-4">Linked Resume Version</th>
                        <th className="py-2.5 px-4">Deadline</th>
                        <th className="py-2.5 pl-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {jobApplications.map((app) => {
                        const linkedDoc =
                          resumes.find((r) => r.id === app.linkedResumeId) ||
                          resumes[0];
                        return (
                          <tr key={app.id}>
                            <td className="py-3 pr-4">
                              <div className="font-bold text-slate-900">
                                {app.company}
                              </div>
                              <div className="text-slate-600">{app.role}</div>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                aria-label={`Stage for ${app.company}`}
                                value={app.stage}
                                onChange={(e) => {
                                  const next = jobApplications.map((j) =>
                                    j.id === app.id
                                      ? {
                                          ...j,
                                          stage: e.target
                                            .value as JobApplicationItem['stage'],
                                        }
                                      : j
                                  );
                                  onUpdateJobApplications(next);
                                }}
                                className="px-2.5 py-1 rounded border border-slate-300 bg-white text-xs font-semibold"
                              >
                                <option value="Saved">Saved</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer">Offer</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {linkedDoc.title}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                              {app.deadline}
                            </td>
                            <td className="py-3 pl-4 text-slate-600">
                              {app.notes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section B: Grounded AI Career Writing Suite (Bio, LinkedIn About, Resignation, Translation, Career Gap) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                  <div className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                    Grounded AI Career Writing Tools
                  </div>
                  <h2 className="font-serif text-2xl text-slate-900">
                    Bio, LinkedIn, Translation &amp; Career Gaps
                  </h2>
                  <p className="text-xs text-slate-600">
                    All outputs are strictly grounded in{' '}
                    <strong>{activeResume.personalInfo.fullName}</strong>&apos;s
                    verified resume facts without inventing employers or metrics.
                  </p>

                  <div>
                    <label
                      htmlFor="career-tool-select"
                      className="block text-xs font-bold uppercase text-slate-500 mb-1"
                    >
                      Select Writing Tool
                    </label>
                    <select
                      id="career-tool-select"
                      value={careerSuiteTool}
                      onChange={(e) =>
                        setCareerSuiteTool(
                          e.target.value as typeof careerSuiteTool
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                    >
                      <option value="bio">Executive Professional Bio</option>
                      <option value="linkedin_about">
                        LinkedIn Headline &amp; About Draft
                      </option>
                      <option value="resignation">
                        Polite Resignation Letter Draft
                      </option>
                      <option value="translate">
                        Resume Translation (Preserves Names &amp; Dates)
                      </option>
                      <option value="career_gap">
                        Honest Career-Gap Explanation Options
                      </option>
                    </select>
                  </div>

                  {careerSuiteTool === 'translate' && (
                    <div>
                      <label
                        htmlFor="target-lang-input"
                        className="block text-xs font-bold uppercase text-slate-500 mb-1"
                      >
                        Target Output Language
                      </label>
                      <input
                        id="target-lang-input"
                        type="text"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  )}

                  {careerSuiteTool === 'career_gap' && (
                    <div>
                      <label
                        htmlFor="gap-context-input"
                        className="block text-xs font-bold uppercase text-slate-500 mb-1"
                      >
                        Factual Reason for Career Gap
                      </label>
                      <input
                        id="gap-context-input"
                        type="text"
                        value={gapContext}
                        onChange={(e) => setGapContext(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={aiBusy === 'career-suite'}
                    onClick={handleRunCareerSuiteTool}
                    className="w-full py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {aiBusy === 'career-suite'
                        ? 'Generating Draft...'
                        : 'Generate Grounded Draft'}
                    </span>
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Generated Output &amp; Tailored Interview Prep
                  </div>
                  <textarea
                    rows={8}
                    aria-label="Grounded AI career tool output"
                    value={
                      careerSuiteOutput ||
                      `Click "Generate Grounded Draft" on the left to create a Professional Bio, LinkedIn About section, Resignation Letter, Translated Summary, or Career-Gap explanation for ${activeResume.personalInfo.fullName}.`
                    }
                    onChange={(e) => setCareerSuiteOutput(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800"
                  />

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase text-slate-500">
                      Role-Specific Behavioral Interview Questions
                    </div>
                    {interviewPrepList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <div className="font-bold text-slate-900">
                          Q{idx + 1}: {item.question}
                        </div>
                        <p className="text-slate-600">{item.tailoredAnswer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section C: Revocable Share Links, Portfolio Page & Account Privacy Controls */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                      Privacy-Conscious Sharing &amp; Account Data Controls
                    </div>
                    <h2 className="font-serif text-2xl text-slate-900 mt-1">
                      Revocable Portfolio Links &amp; Data Export
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCreateShareLink}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Create Shareable Portfolio Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadJson(activeResume)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                    >
                      Export All Account Data (.JSON)
                    </button>
                    <button
                      type="button"
                      onClick={onDeleteAllUserData}
                      className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      Reset / Delete Imported Data
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {shareLinks.map((lnk) => (
                    <div
                      key={lnk.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-[#FF5A4E]" />
                        <div>
                          <div className="font-bold text-slate-900">
                            {lnk.resumeTitle} —{' '}
                            <span className="font-mono text-[#FF5A4E]">
                              https://resumebuilderai.studio/p/{lnk.token}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Status: {lnk.revoked ? 'Revoked' : 'Active'} ·{' '}
                            {lnk.expiresAt} · Search Indexing:{' '}
                            {lnk.allowIndexing ? 'Allowed' : 'No-Index (Private)'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = shareLinks.map((s) =>
                              s.id === lnk.id
                                ? { ...s, allowIndexing: !s.allowIndexing }
                                : s
                            );
                            onUpdateShareLinks(next);
                          }}
                          className="px-2.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold"
                        >
                          Toggle Indexing
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = shareLinks.map((s) =>
                              s.id === lnk.id ? { ...s, revoked: !s.revoked } : s
                            );
                            onUpdateShareLinks(next);
                            showNotice(
                              lnk.revoked
                                ? 'Reactivated share link.'
                                : 'Revoked share link.'
                            );
                          }}
                          className="px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold"
                        >
                          {lnk.revoked ? 'Restore Link' : 'Revoke Link'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: SEARCHABLE 18-TEMPLATE GALLERY + WEB ATS TEMPLATE FETCHER */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-[#FF5A4E]">
                    18 Original Code-Rendered ATS Templates · 7 Categories
                  </span>
                  <h1 className="font-serif text-3xl text-slate-900 mt-1">
                    Switch Active Resume Template or Fetch Web ATS Styles
                  </h1>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    aria-label="Filter template gallery"
                    value={tplSearch}
                    onChange={(e) => setTplSearch(e.target.value)}
                    placeholder="Search 18 ATS templates..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Web ATS Template Fetcher Bar */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-800">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Web ATS Template Fetcher · SSRF-Hardened</span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl mt-1">
                      Fetch &amp; Apply Newly Styled Premium ATS Templates from Web / URL
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Enter a public ATS template repository URL (Overleaf, GitHub Jake&apos;s Resume, Harvard OCS, Wall Street Oasis, Stanford AI Lab, MIT Career) or keyword to fetch and apply its code-rendered ATS layout.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                    <input
                      type="text"
                      aria-label="Web ATS Template URL or keyword"
                      value={webTemplateQuery}
                      onChange={(e) => setWebTemplateQuery(e.target.value)}
                      placeholder="https://github.com/sb2nov/resume or keyword (FAANG, Quant, Consulting)..."
                      className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A4E]"
                    />
                    <button
                      type="button"
                      disabled={webFetchBusy}
                      onClick={async () => {
                        setWebFetchBusy(true);
                        const localResult = fetchWebAtsTemplates(webTemplateQuery);
                        if (!localResult.ok) {
                          setWebFetchStatus(localResult.error || 'Blocked unsafe URL.');
                          setWebFetchBusy(false);
                          return;
                        }
                        setWebFetchedBlueprints(localResult.templates);
                        setWebFetchStatus(
                          `Fetched ${localResult.templates.length} verified ATS template blueprint(s) (${localResult.sourceType}).`
                        );
                        setWebFetchBusy(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shrink-0"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{webFetchBusy ? 'Fetching...' : 'Fetch Web ATS Templates'}</span>
                    </button>
                  </div>
                </div>

                {webFetchStatus && (
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-emerald-300 flex items-center justify-between gap-2">
                    <span>{webFetchStatus}</span>
                    <button
                      type="button"
                      onClick={() => setWebFetchStatus(null)}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {webFetchedBlueprints.map((wb) => (
                    <div
                      key={wb.id}
                      className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/90 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {wb.atsCompatibilityScore}% ATS Parse
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 truncate">
                            {wb.sourceDomain}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white mt-2">
                          {wb.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {wb.highlights[0]}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          commitResumeUpdate({
                            ...activeResume,
                            templateId: wb.templateId,
                            themeColor: wb.recommendedColor,
                            fontFamily: wb.recommendedFont,
                            sectionOrder: wb.recommendedSectionOrder,
                          });
                          onChangeTab('editor');
                          showNotice(
                            `Fetched & applied "${wb.name}" (${wb.atsCompatibilityScore}% ATS readiness).`
                          );
                        }}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition"
                      >
                        Apply Fetched ATS Blueprint
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'All',
                    'Simple',
                    'Professional',
                    'Executive',
                    'Student',
                    'Technical',
                    'Academic',
                    'Creative',
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTplCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      tplCategoryFilter === cat
                        ? 'bg-[#FF5A4E] text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleryTemplates.map((tpl) => {
                  const isCurrent = activeResume.templateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className={`bg-white rounded-2xl border overflow-hidden shadow-2xs flex flex-col justify-between ${
                        isCurrent
                          ? 'border-2 border-[#FF5A4E]'
                          : 'border-slate-200/90'
                      }`}
                    >
                      <div>
                        <div className="bg-slate-100 p-3 border-b border-slate-200 h-52 overflow-hidden relative">
                          <div className="origin-top-left scale-[0.38] w-[260%] pointer-events-none select-none">
                            <ResumeCanvasPreview
                              resume={{
                                ...activeResume,
                                templateId: tpl.id,
                                themeColor: tpl.defaultColor,
                              }}
                              compact
                            />
                          </div>
                          {tpl.isPremiumNew && (
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-xs">
                              NEW WEB ATS · {tpl.atsParseScore || 99}%
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base text-slate-900">
                              {tpl.name}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-500">
                              {tpl.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <button
                          type="button"
                          onClick={() => {
                            commitResumeUpdate({
                              ...activeResume,
                              templateId: tpl.id,
                              themeColor: tpl.defaultColor,
                              fontFamily: tpl.defaultFont,
                            });
                            onChangeTab('editor');
                            showNotice(`Applied "${tpl.name}" template.`);
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold transition"
                        >
                          {isCurrent
                            ? 'Active Template — Edit in Studio'
                            : 'Apply Template & Open Studio'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 8: REA MCP BLUEPRINT, SECURITY AUDIT SUITE, FEATURE MATRIX & ASSET LICENSE MANIFEST */}
          {activeTab === 'rea-blueprint' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4E]/20 text-[#FF5A4E] text-xs font-mono font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>
                      REA MCP v6.7.0 · Security &amp; QA Audit Suite · Provenance
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl">
                    ResumeBuilderAi 3.0 Security Layer, QA &amp; Provenance
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Live White-Box, Black-Box, Utility, Vulnerability, and Zero-Trust
                    Security Layer verification alongside our feature matrix and open-source
                    asset license manifest.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 shrink-0">
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <div className="text-[11px] font-mono uppercase text-slate-400">
                      REA MCP Tools
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-400 tabular-nums mt-0.5">
                      {reaLoading ? '...' : String(reaData?.toolCount || 207)}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <div className="text-[11px] font-mono uppercase text-slate-400">
                      Code Templates
                    </div>
                    <div className="text-2xl font-extrabold text-white tabular-nums mt-0.5">
                      18
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <div className="text-[11px] font-mono uppercase text-slate-400">
                      Security Checks
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-400 tabular-nums mt-0.5">
                      {securityAudit.passedChecks}/{securityAudit.totalChecks}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Security, Vulnerability, White-Box, Black-Box & Utility Audit Panel */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        Zero-Backdoor &amp; Vulnerability Verification ({securityAudit.passedChecks}/{securityAudit.totalChecks} Passed)
                      </span>
                    </div>
                    <h2 className="font-bold text-lg text-slate-900 mt-0.5">
                      White-Box, Black-Box, Utility, Vulnerability &amp; Security Layer Tests
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const fresh = runSecurityAuditReport();
                      setSecurityAudit(fresh);
                      showNotice(
                        `Executed ${fresh.totalChecks} security & utility checks: ${fresh.passedChecks}/${fresh.totalChecks} passed.`
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Run All Security &amp; QA Tests</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {securityAudit.results.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                            {chk.category}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {chk.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {chk.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                <h2 className="font-bold text-base text-slate-900">
                  Feature Matrix (Observed Publicly vs. Proposed Additions vs. Auth-Gated)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                        <th className="py-2.5 pr-4">Category</th>
                        <th className="py-2.5 px-4">Feature</th>
                        <th className="py-2.5 px-4">Reference Classification</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 pl-4">Verification Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {FEATURE_MATRIX.map((row) => (
                        <tr key={row.id}>
                          <td className="py-3 pr-4 font-semibold text-slate-700">
                            {row.category}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {row.feature}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {row.referenceStatus}
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-700">
                            {row.implementationStatus}
                          </td>
                          <td className="py-3 pl-4 text-slate-600">
                            {row.verificationNotes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Asset License Manifest Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
                <h2 className="font-bold text-base text-slate-900">
                  Asset &amp; Font License Manifest
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                        <th className="py-2.5 pr-4">Asset Name</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">License</th>
                        <th className="py-2.5 px-4">Source URL</th>
                        <th className="py-2.5 pl-4">Usage Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70">
                      {ASSET_LICENSE_MANIFEST.map((asset, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-4 font-bold text-slate-900">
                            {asset.assetName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{asset.type}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-emerald-800">
                            {asset.license}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {asset.sourceUrl}
                          </td>
                          <td className="py-3 pl-4 text-slate-600">
                            {asset.usageNotes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Resume Generator Modal */}
      {showAiGeneratorModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-gen-modal-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF5A4E] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2
                  id="ai-gen-modal-title"
                  className="font-bold text-base text-slate-900"
                >
                  AI Resume Draft Generator
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAiGeneratorModal(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleGenerateFullAiResume} className="space-y-4">
              <div>
                <label
                  htmlFor="gen-role-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Target Role Title
                </label>
                <input
                  id="gen-role-input"
                  type="text"
                  value={genTargetRole}
                  onChange={(e) => setGenTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="gen-exp-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Seniority Level
                </label>
                <input
                  id="gen-exp-input"
                  type="text"
                  value={genExpLevel}
                  onChange={(e) => setGenExpLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="gen-focus-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Domain &amp; Key Skills
                </label>
                <input
                  id="gen-focus-input"
                  type="text"
                  value={genFocusArea}
                  onChange={(e) => setGenFocusArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={aiBusy === 'full-gen'}
                className="w-full py-3 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {aiBusy === 'full-gen'
                    ? 'Generating Editable Resume...'
                    : 'Generate Editable Resume Draft'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* Dedicated Print-Stylesheet Resume Mount (Visible strictly in @media print for 100% design fidelity from any tab) */}
      <div
        id="dashboard-print-mount"
        aria-hidden="true"
        className="hidden print:block bg-white text-slate-900 w-full"
      >
        <ResumeCanvasPreview
          resume={printTargetResume}
          isPrintTarget={true}
          zoomPercent={100}
        />
      </div>
    </>
  );
}
