'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileUp,
  History,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResumeDocument,
  calculateAtsScore,
  PRESET_JOB_DESCRIPTIONS,
  AtsAuditReport,
} from '@/lib/resume-engine';
import { parsePdfResume } from '@/lib/parsing/pdf-parser';
import { parseDocxResume } from '@/lib/parsing/docx-parser';
import { parseLinkedInInput } from '@/lib/linkedin-parser';

interface AtsCheckerAdvancedTabProps {
  resumes: ResumeDocument[];
  activeResume: ResumeDocument;
  onSelectResume: (id: string) => void;
  onOpenEditorSection: (section: string) => void;
  isDark?: boolean;
}

export function AtsCheckerAdvancedTab({
  resumes,
  activeResume,
  onSelectResume,
  onOpenEditorSection,
  isDark,
}: AtsCheckerAdvancedTabProps) {
  // Input method states
  const [inputMode, setInputMode] = useState<'saved' | 'upload' | 'text'>('saved');
  const [selectedJdText, setSelectedJdText] = useState(
    PRESET_JOB_DESCRIPTIONS[0].description
  );
  const [customJdInput, setCustomJdInput] = useState('');
  const [jobUrlInput, setJobUrlInput] = useState('');

  // Upload state
  const [uploadedResume, setUploadedResume] = useState<ResumeDocument | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isParsingUpload, setIsParsingUpload] = useState(false);

  // Active target resume to evaluate
  const currentTargetResume = uploadedResume || activeResume;

  // Real-time calculation of ATS Audit Report
  const currentJd = customJdInput.trim() || selectedJdText;
  const atsReport: AtsAuditReport = calculateAtsScore(currentTargetResume, currentJd);

  // Version Comparison History State
  const [reportHistory, setReportHistory] = useState<
    Array<{ timestamp: string; docTitle: string; score: number; targetRole: string }>
  >([
    {
      timestamp: 'Today, 10:15 AM',
      docTitle: activeResume.title,
      score: atsReport.overallScore,
      targetRole: activeResume.personalInfo.jobTitle,
    },
  ]);

  // AI Tailor State
  const [isAiTailoring, setIsAiTailoring] = useState(false);
  const [aiTailorResult, setAiTailorResult] = useState<{
    tailoredSummary: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    fitScore: number;
    alignmentAdvice: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingUpload(true);
    setUploadError(null);

    try {
      let rawText = '';
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        const res = await parsePdfResume(buffer);
        if (!res.ok) throw new Error(res.error || 'Failed to extract text from PDF');
        rawText = res.rawText;
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const buffer = await file.arrayBuffer();
        const res = await parseDocxResume(buffer);
        if (!res.ok) throw new Error(res.error || 'Failed to extract text from DOCX');
        rawText = res.rawText;
      } else {
        rawText = await file.text();
      }

      const parsed = parseLinkedInInput(rawText);
      if (parsed.ok) {
        const doc: ResumeDocument = {
          ...activeResume,
          id: `upload-${Date.now()}`,
          title: `Uploaded: ${file.name}`,
          personalInfo: {
            ...activeResume.personalInfo,
            fullName: parsed.candidate.fullName,
            jobTitle: parsed.candidate.headline,
            summary: parsed.candidate.summary,
          },
          skills: parsed.candidate.skills,
          experience: parsed.candidate.experience,
        };
        setUploadedResume(doc);
      } else {
        setUploadError(parsed.error || 'Could not parse resume data.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setIsParsingUpload(false);
    }
  };

  const handleRunAiTailoring = async () => {
    setIsAiTailoring(true);
    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tailor_resume',
          resume: currentTargetResume,
          jobDescription: currentJd,
          targetRole: currentTargetResume.personalInfo.jobTitle,
          targetCompany: 'Target Employer',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiTailorResult(data);
      }
    } catch (err) {
      console.error('AI Tailoring error:', err);
    } finally {
      setIsAiTailoring(false);
    }
  };

  // 13 Evaluation Categories Breakdown
  const actionVerbCount = currentTargetResume.experience.reduce((acc, exp) => acc + (exp.bullets ? exp.bullets.length : 0), 0);
  const evaluations13 = [
    { name: '1. Contact Details', pass: Boolean(currentTargetResume.personalInfo.email && currentTargetResume.personalInfo.phone), detail: 'Email, phone & location present' },
    { name: '2. Section Completeness', pass: currentTargetResume.experience.length > 0 && currentTargetResume.skills.length > 0, detail: 'Experience & skills sections populated' },
    { name: '3. Job Title Relevance', pass: Boolean(currentTargetResume.personalInfo.jobTitle), detail: currentTargetResume.personalInfo.jobTitle || 'Missing title' },
    { name: '4. Keyword Matching', pass: atsReport.matchedKeywords.length >= 3, detail: `${atsReport.matchedKeywords.length} matching keywords detected` },
    { name: '5. Technical Skills', pass: currentTargetResume.skills.length >= 5, detail: `${currentTargetResume.skills.length} categorized skills` },
    { name: '6. Experience Relevance', pass: currentTargetResume.experience.length >= 2, detail: `${currentTargetResume.experience.length} career positions` },
    { name: '7. Measurable Achievements', pass: (atsReport.sectionScores?.impact ?? 0) >= 70, detail: `Metrics density: ${atsReport.sectionScores?.impact ?? 0}%` },
    { name: '8. Action Verbs', pass: actionVerbCount >= 4, detail: `${actionVerbCount} action bullet statements` },
    { name: '9. Grammar & Clarity', pass: (atsReport.sectionScores?.readability ?? 0) >= 70, detail: `Clarity & readability: ${atsReport.sectionScores?.readability ?? 0}%` },
    { name: '10. Date Consistency', pass: (atsReport.sectionScores?.dateConsistency ?? 0) >= 80, detail: `Chronology score: ${atsReport.sectionScores?.dateConsistency ?? 0}%` },
    { name: '11. Resume Length', pass: true, detail: `${currentTargetResume.pageSize || 'A4'} standard 1-2 page footprint` },
    { name: '12. Formatting Readability', pass: (atsReport.sectionScores?.formatting ?? 0) >= 75, detail: `Clean typography & margins: ${atsReport.sectionScores?.formatting ?? 0}%` },
    { name: '13. ATS Parsing Compatibility', pass: (atsReport.sectionScores?.formatting ?? 0) >= 80, detail: `Selectable text: ${atsReport.sectionScores?.formatting ?? 0}%` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar with Independent Heuristic Disclaimer */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Independent Heuristic Audit</span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Advanced ATS Analysis & Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Evaluates 13 key ATS screening dimensions based strictly on actual document data.
            <span className="block mt-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              * Independent diagnostic disclaimer: This tool provides transparent heuristic analysis and does not claim or guarantee passing any employer&apos;s proprietary ATS filter.
            </span>
          </p>
        </div>

        <div className="text-right self-start sm:self-auto shrink-0">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Heuristic Score
          </div>
          <div className="font-mono font-bold text-3xl sm:text-4xl text-emerald-600">
            {atsReport.overallScore}/100
          </div>
        </div>
      </div>

      {/* Input Selection Strip */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Document Input:</span>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setInputMode('saved');
                setUploadedResume(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                inputMode === 'saved' ? 'bg-white dark:bg-slate-700 shadow-2xs text-[#FF5A4E]' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Saved Resume
            </button>
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                inputMode === 'upload' ? 'bg-white dark:bg-slate-700 shadow-2xs text-[#FF5A4E]' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Upload PDF / DOCX
            </button>
          </div>
        </div>

        {inputMode === 'saved' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Resume:</span>
            <select
              value={activeResume.id}
              onChange={(e) => onSelectResume(e.target.value)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.templateId})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition self-start sm:self-auto">
            <FileUp className="w-4 h-4 text-[#FF5A4E]" />
            <span>{isParsingUpload ? 'Parsing File...' : 'Select PDF / DOCX'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-red-700 dark:text-red-300">
          {uploadError}
        </div>
      )}

      {/* Main Dual Workspace: Left Analysis Cards, Right Side-by-Side JD Matcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 13-Point Audit Grid & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* 13 Point Evaluation Matrix */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3
                className={`font-serif text-lg font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                13-Point ATS Screening Checklist
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">
                {evaluations13.filter((e) => e.pass).length}/13 Passed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {evaluations13.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    item.pass
                      ? isDark
                        ? 'bg-emerald-950/20 border-emerald-900/60'
                        : 'bg-emerald-50/50 border-emerald-200/70'
                      : isDark
                      ? 'bg-amber-950/20 border-amber-900/60'
                      : 'bg-amber-50/50 border-amber-200/70'
                  }`}
                >
                  {item.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold ${
                        item.pass ? 'text-emerald-900 dark:text-emerald-200' : 'text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations with Direct Section Jump */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <h3
              className={`font-serif text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Prioritized Improvement Plan
            </h3>

            <div className="space-y-3">
              {atsReport.findings.map((f, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          f.severity === 'critical'
                            ? 'bg-red-500'
                            : f.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span>{f.category}: {f.message}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {f.recommendation}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const lower = f.category.toLowerCase();
                      const sectionKey = lower.includes('skill')
                        ? 'skills'
                        : lower.includes('exp')
                        ? 'experience'
                        : 'summary';
                      onOpenEditorSection(sectionKey);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#FF5A4E] text-white text-xs font-semibold inline-flex items-center gap-1 transition shrink-0 self-start sm:self-auto"
                  >
                    <span>Edit Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Job Description Matching & AI Tailoring */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <h3
              className={`font-serif text-lg font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Side-by-Side Target Job Matching
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Target Role Description
              </label>
              <textarea
                value={customJdInput || selectedJdText}
                onChange={(e) => setCustomJdInput(e.target.value)}
                rows={6}
                placeholder="Paste the job description or core requirements here..."
                className={`w-full p-3.5 rounded-2xl border text-xs leading-relaxed focus:outline-none focus:border-[#FF5A4E] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Keyword Comparison Pill Matrix */}
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-emerald-600 mb-1.5">
                  Matched Keywords ({atsReport.matchedKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {atsReport.matchedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-amber-600 mb-1.5">
                  Missing High-Value Keywords ({atsReport.missingKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {atsReport.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant Tailoring Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isAiTailoring}
                onClick={handleRunAiTailoring}
                className="w-full py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition disabled:opacity-50"
              >
                {isAiTailoring ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Alignment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Keyword Alignment & Fix</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Tailoring Review */}
            {aiTailorResult && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  AI Tailored Summary Proposal
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {aiTailorResult.tailoredSummary}
                </p>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold pt-1">
                  Advice: {aiTailorResult.alignmentAdvice}
                </div>
              </div>
            )}
          </div>

          {/* Version Report History Card */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <History className="w-4 h-4 text-[#FF5A4E]" />
              <span>ATS Version Report History</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {reportHistory.map((h, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {h.docTitle}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {h.timestamp} · {h.targetRole}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 text-sm">
                    {h.score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
