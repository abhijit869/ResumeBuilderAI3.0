'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Plus,
  Sliders,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  Wand2,
  GraduationCap,
  ShieldCheck,
  HelpCircle,
  Briefcase,
  Zap,
} from 'lucide-react';
import { ResumeDocument, PRESET_JOB_DESCRIPTIONS } from '@/lib/resume-engine';
import {
  generateAtsAnalysis,
  AtsScoreBreakdown,
  AtsOptimizationTip,
} from '@/lib/ats-optimizer';

interface AtsScoreGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  resumes: ResumeDocument[];
  activeResumeId: string;
  onSelectResumeId?: (id: string) => void;
  onUpdateResume?: (updated: ResumeDocument) => void;
  initialJdText?: string;
  onOpenEditorTab?: () => void;
}

const SAMPLE_ROLES = [
  {
    label: 'Google · Staff AI & Full-Stack Systems Architect',
    text: `We are looking for a Staff AI & Full-Stack Systems Architect to drive distributed cloud infrastructure and generative AI developer workflows.
Requirements:
- 8+ years experience building high-scale distributed systems in TypeScript, Next.js, React, Node.js, and Python.
- Proven expertise in PostgreSQL, Redis, Kubernetes, Docker, and CI/CD automation on Google Cloud (GCP) or AWS.
- Hands-on background with LLM agents, Model Context Protocol (MCP), embedding retrieval, and low-latency API design.
- Demonstrated track record reducing system latency, optimizing cloud spend by 30%+, and mentoring senior engineering staff.
- Strong command of System Design, High Availability, Unit Testing, and WCAG accessibility standards.`,
  },
  {
    label: 'Meta · Senior Frontend Engineer (Design Systems & React)',
    text: `Seeking a Senior Frontend Engineer with deep mastery of TypeScript, React, Next.js, Tailwind CSS, and Design Systems.
Responsibilities:
- Build accessible, reusable UI component libraries compliant with WCAG AA standards.
- Partner with Product Designers in Figma to implement responsive web architectures and A/B conversion funnels.
- Improve client-side Core Web Vitals, reduce bundle size by 25%+, and enforce strict TypeScript typing.
- Expertise in Jest, Playwright E2E testing, GraphQL API integration, and performance profiling.`,
  },
  {
    label: 'Stripe · Technical Product Manager (Platform APIs)',
    text: `Stripe is hiring a Technical Product Manager to lead Core Platform APIs, developer experience, and global payment reliability.
Qualifications:
- 5+ years experience in Technical Product Management, API design, and cross-functional leadership.
- Track record owning roadmap prioritization, sprint planning, customer discovery, and developer documentation.
- Strong analytical skills: SQL, Snowflake, KPI/OKR tracking, and A/B experiment evaluation.
- Experience partnering closely with distributed engineering, compliance, and developer advocacy teams.`,
  },
  {
    label: 'City Regional Council · Director of Urban Planning',
    text: `Seeking an AICP Certified Urban Planner with LEED-ND accreditation to direct municipal zoning codes, transit-oriented development, and environmental impact assessments.
Requirements:
- 7+ years in urban master planning, ArcGIS Pro, spatial GIS demographic modeling, and AutoCAD Civil 3D.
- Experience facilitating public stakeholder hearings and municipal capital budgeting of $10M+.
- Expertise in climate adaptation, heat-island mitigation, and multimodal green mobility corridors.`,
  },
];

export function AtsScoreGeneratorModal({
  open,
  onClose,
  resumes,
  activeResumeId,
  onSelectResumeId,
  onUpdateResume,
  initialJdText = '',
  onOpenEditorTab,
}: AtsScoreGeneratorModalProps) {
  const [selectedResumeId, setSelectedResumeId] = useState(activeResumeId);
  const [prevActiveResumeId, setPrevActiveResumeId] = useState(activeResumeId);
  const [jdInput, setJdInput] = useState(
    initialJdText || SAMPLE_ROLES[0].text
  );
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [appliedTips, setAppliedTips] = useState<Set<string>>(new Set());
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Sync selected resume when activeResumeId changes without effect cascading renders
  if (activeResumeId !== prevActiveResumeId) {
    setPrevActiveResumeId(activeResumeId);
    setSelectedResumeId(activeResumeId);
  }

  const currentResume = useMemo(() => {
    return (
      resumes.find((r) => r.id === selectedResumeId) ||
      resumes[0]
    );
  }, [resumes, selectedResumeId]);

  // Compute live analysis
  const analysis: AtsScoreBreakdown = useMemo(() => {
    if (!currentResume) {
      return {
        overallScore: 0,
        matchTier: 'Low Match',
        matchTierColor: '#EF4444',
        subScores: {
          keywordMatch: 0,
          skillsCoverage: 0,
          quantifiedImpact: 0,
          formattingReadability: 0,
          titleSummaryRelevance: 0,
        },
        matchedKeywords: [],
        missingKeywords: [],
        actionableTips: [],
        tailoredHeadline: '',
        tailoredSummary: '',
        suggestedBullets: [],
        totalJdWordCount: 0,
        totalResumeWordCount: 0,
      };
    }
    return generateAtsAnalysis(currentResume, jdInput);
  }, [currentResume, jdInput]);

  if (!open) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 450);
  };

  const handleApplyTip = (tip: AtsOptimizationTip) => {
    if (!onUpdateResume || !currentResume || !tip.autoApplyData) return;

    let updatedDoc: ResumeDocument = { ...currentResume };

    if (tip.autoApplyData.type === 'add_skill') {
      const skillName = tip.autoApplyData.value;
      const alreadyHas = updatedDoc.skills.some(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );
      if (!alreadyHas) {
        const safeSkillSlug = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        updatedDoc = {
          ...updatedDoc,
          skills: [
            ...updatedDoc.skills,
            {
              id: `sk-${updatedDoc.skills.length + 1}-${safeSkillSlug}`,
              name: skillName,
              category: 'CORE COMPETENCIES',
              level: 90,
            },
          ],
        };
      }
    } else if (tip.autoApplyData.type === 'update_summary') {
      updatedDoc = {
        ...updatedDoc,
        personalInfo: {
          ...updatedDoc.personalInfo,
          summary: tip.autoApplyData.value,
        },
      };
    } else if (tip.autoApplyData.type === 'update_title') {
      updatedDoc = {
        ...updatedDoc,
        personalInfo: {
          ...updatedDoc.personalInfo,
          jobTitle: tip.autoApplyData.value,
        },
      };
    }

    onUpdateResume(updatedDoc);
    setAppliedTips((prev) => new Set([...prev, tip.id]));
  };

  const handleApplyTailoredSummary = () => {
    if (!onUpdateResume || !currentResume) return;
    const updatedDoc: ResumeDocument = {
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        summary: analysis.tailoredSummary,
      },
    };
    onUpdateResume(updatedDoc);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleAddMissingSkill = (skillName: string) => {
    if (!onUpdateResume || !currentResume) return;
    const alreadyHas = currentResume.skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    if (!alreadyHas) {
      const safeSkillSlug = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const updatedDoc: ResumeDocument = {
        ...currentResume,
        skills: [
          ...currentResume.skills,
          {
            id: `sk-${currentResume.skills.length + 1}-${safeSkillSlug}`,
            name: skillName,
            category: 'JOB REQUIREMENTS',
            level: 88,
          },
        ],
      };
      onUpdateResume(updatedDoc);
    }
  };

  const handleCopyText = (text: string, tipId?: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (tipId) {
        setCopiedTipId(tipId);
        setTimeout(() => setCopiedTipId(null), 2000);
      }
    }
  };

  const handleCopyFullReport = () => {
    const reportText = `=== RESUMEBUILDERAI 3.0 ATS SCORE AUDIT REPORT ===
Candidate: ${currentResume.personalInfo.fullName}
Target Title: ${currentResume.personalInfo.jobTitle}
Overall ATS Match Score: ${analysis.overallScore}% (${analysis.matchTier})

SUB-SCORES:
- Keyword Match Rate: ${analysis.subScores.keywordMatch}%
- Hard Skills Coverage: ${analysis.subScores.skillsCoverage}%
- Quantified Impact & Metrics: ${analysis.subScores.quantifiedImpact}%
- ATS Formatting & Readability: ${analysis.subScores.formattingReadability}%
- Title & Summary Relevance: ${analysis.subScores.titleSummaryRelevance}%

MATCHED KEYWORDS (${analysis.matchedKeywords.length}):
${analysis.matchedKeywords.map((k) => `• ${k.term} (found in JD & Resume)`).join('\n')}

MISSING KEYWORDS (${analysis.missingKeywords.length}):
${analysis.missingKeywords.map((k) => `• [${k.importance}] ${k.term}`).join('\n')}

ACTIONABLE OPTIMIZATION TIPS:
${analysis.actionableTips
  .map(
    (t, i) => `${i + 1}. [${t.severity.toUpperCase()}] ${t.title}
Problem: ${t.problem}
Recommendation: ${t.recommendation}
${t.exampleSnippet ? `Example: ${t.exampleSnippet}` : ''}`
  )
  .join('\n\n')}

RECOMMENDED TAILORED SUMMARY:
"${analysis.tailoredSummary}"
`;
    handleCopyText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const filteredTips =
    selectedFilter === 'all'
      ? analysis.actionableTips
      : analysis.actionableTips.filter((t) => t.category === selectedFilter);

  // SVG circular gauge math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (analysis.overallScore / 100) * circumference;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ATS Score Generator and Job Description Analyzer"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F6] text-slate-900 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/aistudio/image_663e4373.png"
              alt="ResumeGPT AI Logo"
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover shadow-xs border border-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  ATS Score Generator &amp; Match Optimizer
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  Explainable Heuristics
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Analyze your resume against any job description, check your
                percentage score, and apply targeted fixes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyFullReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Copy complete ATS analysis report to clipboard"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Full Report</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close ATS Score Generator"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Split Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Job Description & Controls */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              {/* Resume Selector */}
              <div>
                <label
                  htmlFor="ats-resume-select"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Select Active Candidate Resume
                </label>
                <div className="relative">
                  <select
                    id="ats-resume-select"
                    value={selectedResumeId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedResumeId(nextId);
                      if (onSelectResumeId) onSelectResumeId(nextId);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF5A4E] focus:ring-2 focus:ring-[#FF5A4E]/20"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.personalInfo.fullName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sample Target Job Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Sample Benchmark Job Descriptions
                  </label>
                  <span className="text-[10px] text-slate-400">1-click fill</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_ROLES.map((role, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setJdInput(role.text)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-medium text-slate-800 transition text-left"
                    >
                      {role.label.split('·')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="job-desc-textarea"
                    className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600"
                  >
                    Target Job Description Text
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {analysis.totalJdWordCount} words
                    </span>
                    {jdInput && (
                      <button
                        type="button"
                        onClick={() => setJdInput('')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  id="job-desc-textarea"
                  rows={10}
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste the target job posting, requirements, qualifications, or company hiring rubric here..."
                  className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs leading-relaxed text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#FF5A4E] focus:ring-2 focus:ring-[#FF5A4E]/20"
                />
              </div>

              {/* Re-Analyze CTA Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning || !jdInput.trim()}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`}
                />
                <span>
                  {isScanning
                    ? 'Scanning Resume & Keywords...'
                    : 'Analyze & Generate ATS Score'}
                </span>
              </button>
            </div>

            {/* Bottom Tip for ATS Compliance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Workday &amp; Greenhouse Ready</span>
              </div>
              <p>
                Our scoring algorithm models strict keyword parsing, chronological
                MM/YYYY parsing, and action verb density used by top Fortune 500 ATS
                gateways.
              </p>
            </div>
          </div>

          {/* Right Column: Score Breakdown & Actionable Tips */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-6 bg-[#FAF9F6] overflow-y-auto">
            {/* Main Percentage Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  {/* Circular Percentage Dial */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="text-slate-100"
                        strokeWidth="9"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      {/* Active progress ring */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        strokeWidth="9"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke={analysis.matchTierColor}
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-2xl font-black text-slate-900 tabular-nums leading-none">
                        {analysis.overallScore}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        MATCH
                      </span>
                    </div>
                  </div>

                  {/* Summary of Tier */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: analysis.matchTierColor }}
                        className="text-base font-extrabold uppercase tracking-wide"
                      >
                        {analysis.matchTier}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Overall ATS Readiness Score
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {analysis.overallScore >= 80
                        ? 'High probability of passing automated keyword filters and reaching hiring managers.'
                        : analysis.overallScore >= 60
                        ? 'Good baseline. Adding missing critical keywords will push this resume over the 80% threshold.'
                        : 'Significant keyword and metric gaps detected. Follow the actionable recommendations below.'}
                    </p>
                  </div>
                </div>

                {onOpenEditorTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditorTab();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shrink-0"
                  >
                    <span>Open Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 5 Sub-Score Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-medium">
                      Keyword Match Rate
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {analysis.subScores.keywordMatch}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${analysis.subScores.keywordMatch}%` }}
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-medium">
                      Hard Skills Coverage
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {analysis.subScores.skillsCoverage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${analysis.subScores.skillsCoverage}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-medium">
                      Quantified Metric Impact
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {analysis.subScores.quantifiedImpact}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{
                        width: `${analysis.subScores.quantifiedImpact}%`,
                      }}
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-medium">
                      ATS Format &amp; Readability
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {analysis.subScores.formattingReadability}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{
                        width: `${analysis.subScores.formattingReadability}%`,
                      }}
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matched Keywords ({analysis.matchedKeywords.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Present in resume</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {analysis.matchedKeywords.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      No keyword overlap detected yet.
                    </span>
                  ) : (
                    analysis.matchedKeywords.map((kw) => (
                      <span
                        key={kw.term}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{kw.term}</span>
                        {kw.frequencyInResume > 1 && (
                          <span className="text-[10px] text-emerald-600 font-mono">
                            ×{kw.frequencyInResume}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>
                      Missing Keywords ({analysis.missingKeywords.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Click + to add to Skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {analysis.missingKeywords.length === 0 ? (
                    <span className="text-xs text-emerald-600 font-medium">
                      All benchmark keywords covered!
                    </span>
                  ) : (
                    analysis.missingKeywords.map((kw) => (
                      <button
                        key={kw.term}
                        type="button"
                        onClick={() => handleAddMissingSkill(kw.term)}
                        title={`Click to add "${kw.term}" directly to resume skills`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium transition group"
                      >
                        <Plus className="w-3 h-3 text-amber-600 group-hover:scale-125 transition" />
                        <span>{kw.term}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                            kw.importance === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-200/60 text-amber-800'
                          }`}
                        >
                          {kw.importance}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Tips Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-[#FF5A4E]" />
                    <span>Actionable Optimization Tips ({analysis.actionableTips.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prioritized recommendations to maximize interview callbacks.
                  </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  {['all', 'Critical Skill', 'Impact & Metrics', 'Title & Summary'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                          selectedFilter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Tips Cards List */}
              <div className="space-y-3">
                {filteredTips.map((tip) => {
                  const isApplied = appliedTips.has(tip.id);
                  const isCopied = copiedTipId === tip.id;

                  return (
                    <div
                      key={tip.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                tip.severity === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : tip.severity === 'medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {tip.severity} Priority
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {tip.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {tip.title}
                          </h4>
                        </div>

                        {tip.autoApplyData && onUpdateResume && (
                          <button
                            type="button"
                            onClick={() => handleApplyTip(tip)}
                            disabled={isApplied}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shrink-0 ${
                              isApplied
                                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                : 'bg-[#FF5A4E] hover:bg-[#e8483c] text-white shadow-xs'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Applied ✓</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>1-Click Apply</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {tip.problem}
                      </p>

                      <div className="text-xs text-slate-800 font-medium bg-white p-3 rounded-lg border border-slate-200/90 space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                          Recommended Optimization:
                        </div>
                        <p>{tip.recommendation}</p>

                        {tip.exampleSnippet && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <code className="text-[11px] font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded flex-1 truncate">
                              {tip.exampleSnippet}
                            </code>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(tip.exampleSnippet!, tip.id)
                              }
                              className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 inline-flex items-center gap-1"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Before / After Tailored Summary Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#FF5A4E]">
                    Tailored Professional Summary for this Target Role
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pre-optimized with top keywords and verified leadership outcomes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyText(analysis.tailoredSummary)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition inline-flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  {onUpdateResume && (
                    <button
                      type="button"
                      onClick={handleApplyTailoredSummary}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Summary Updated ✓</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply to Resume</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                &ldquo;{analysis.tailoredSummary}&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
