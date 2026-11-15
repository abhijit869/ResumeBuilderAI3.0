'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Building,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Compass,
  FileText,
  Wand2,
} from 'lucide-react';
import {
  ResumeDocument,
  PRESET_JOB_DESCRIPTIONS,
} from '@/lib/resume-engine';
import {
  TOP_MNC_BENCHMARKS,
  MncId,
  extractJobFromUrl,
  runMlDlDiagnosticPipeline,
  MlDlDiagnosticReport,
} from '@/lib/ml-dl-engine';

interface CareerIntelligencePanelProps {
  activeResume: ResumeDocument;
  onUpdateResume: (resume: ResumeDocument) => void;
  onOpenEditor: () => void;
  isDark?: boolean;
}

export function CareerIntelligencePanel({
  activeResume,
  onUpdateResume,
  onOpenEditor,
  isDark,
}: CareerIntelligencePanelProps) {
  const [jobInput, setJobInput] = useState('');
  const [selectedMnc, setSelectedMnc] = useState<MncId>('google');
  const [targetRole, setTargetRole] = useState(
    activeResume.personalInfo.jobTitle || 'Staff Software Architect'
  );
  const [isInternshipMode, setIsInternshipMode] = useState(false);
  const [showMncBenchmarks, setShowMncBenchmarks] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<MlDlDiagnosticReport | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // If user pasted a URL, extract title/JD or use preset benchmark
      let jdText = jobInput.trim();
      let companyName = 'Target Employer';

      if (jobInput.startsWith('http://') || jobInput.startsWith('https://')) {
        const extracted = extractJobFromUrl(jobInput);
        jdText = extracted.extractedDescription;
        companyName = extracted.company;
      } else if (!jdText) {
        const benchmark = TOP_MNC_BENCHMARKS.find((b) => b.id === selectedMnc) || TOP_MNC_BENCHMARKS[0];
        jdText = benchmark.sampleJd;
        companyName = benchmark.name;
      }

      // Run ML/DL Diagnostic Pipeline
      const diagnostic = runMlDlDiagnosticPipeline(activeResume, jdText, {
        targetCompany: companyName,
        targetRole,
        isInternshipMode,
      });

      setReport(diagnostic);
    } catch (err) {
      console.error('Career Intelligence analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Career Intelligence</span>
          </div>
          <h2
            className={`font-serif text-xl sm:text-2xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Job Description & MNC Benchmark Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-0.5">
            Evaluate your active resume against real job requirements or Fortune 500 benchmarks.
          </p>
        </div>
      </div>

      {/* Main Input Row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-300 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              placeholder="Paste job posting URL (e.g. careers.google.com/...) or job description snippet..."
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:border-[#FF5A4E] transition ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleRunAnalysis}
            className="px-6 py-3 rounded-2xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-2xs transition disabled:opacity-50 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Parameters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Target Role input */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Role:</span>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Position"
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Seniority / Internship Switcher */}
            <button
              type="button"
              onClick={() => setIsInternshipMode(!isInternshipMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                isInternshipMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 font-semibold'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              Mode: {isInternshipMode ? 'Internship & Co-op' : 'Senior / Experienced'}
            </button>
          </div>

          {/* Toggle MNC Benchmarks Collapsible */}
          <button
            type="button"
            onClick={() => setShowMncBenchmarks(!showMncBenchmarks)}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1"
          >
            <span>Top MNC Benchmarks ({TOP_MNC_BENCHMARKS.length})</span>
            {showMncBenchmarks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible MNC Benchmarks Pill Bar */}
        {showMncBenchmarks && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-150 ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200/80'
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
              Select Benchmark Profile
            </div>
            <div className="flex flex-wrap gap-2">
              {TOP_MNC_BENCHMARKS.map((mnc) => (
                <button
                  key={mnc.id}
                  type="button"
                  onClick={() => {
                    setSelectedMnc(mnc.id);
                    setJobInput('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedMnc === mnc.id
                      ? 'bg-[#FF5A4E] text-white shadow-2xs'
                      : isDark
                      ? 'bg-slate-700/80 hover:bg-slate-700 text-slate-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mnc.name} ({mnc.tierLabel.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Result Display */}
      {report && (
        <div
          className={`p-6 rounded-2xl border space-y-5 animate-in fade-in duration-200 ${
            isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Compatibility Results for {report.targetCompany}
              </div>
              <div
                className={`font-serif text-lg font-bold mt-0.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Target Role: {report.targetRole}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Match Score
                </div>
                <div className="font-mono font-bold text-2xl text-emerald-600">
                  {report.ensembleShortlistProbability}%
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenEditor}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#FF5A4E]" />
                <span>Tailor in Editor</span>
              </button>
            </div>
          </div>

          {/* Keywords breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Core Keywords ({report.topTfidfTerms.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.topTfidfTerms.slice(0, 10).map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-medium"
                  >
                    {t.term}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Actionable Competencies ({report.actionableSuggestions.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.actionableSuggestions.slice(0, 8).map((sug, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-mono font-medium"
                  >
                    {sug.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
