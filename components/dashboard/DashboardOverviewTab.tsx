'use client';

import React from 'react';
import {
  FileText,
  Mail,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Compass,
  FileUp,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ResumeDocument, CoverLetterDocument, JobApplicationItem } from '@/lib/resume-engine';
import { DashboardWelcome } from './DashboardWelcome';
import { CareerIntelligencePanel } from './CareerIntelligencePanel';
import { QuickCreateSection } from './QuickCreateSection';

interface DashboardOverviewTabProps {
  user: { name: string; email: string; plan: string };
  resumes: ResumeDocument[];
  coverLetters: CoverLetterDocument[];
  jobApplications: JobApplicationItem[];
  activeResume: ResumeDocument;
  onSelectResume: (id: string) => void;
  onUpdateResume: (resume: ResumeDocument) => void;
  onOpenEditor: () => void;
  onOpenCoverLetters: () => void;
  onOpenAtsChecker: () => void;
  onOpenLinkedInImport: () => void;
  onOpenAiGenerator: () => void;
  onOpenJobTracker: () => void;
  onOpenTemplates: () => void;
  onOpenPortfolios: () => void;
  onOpenInterviewPrep: () => void;
  onCreateNewResume: () => void;
  onDownloadPdf: () => void;
  isDark?: boolean;
}

export function DashboardOverviewTab({
  user,
  resumes,
  coverLetters,
  jobApplications,
  activeResume,
  onSelectResume,
  onUpdateResume,
  onOpenEditor,
  onOpenCoverLetters,
  onOpenAtsChecker,
  onOpenLinkedInImport,
  onOpenAiGenerator,
  onOpenJobTracker,
  onOpenTemplates,
  onOpenPortfolios,
  onOpenInterviewPrep,
  onCreateNewResume,
  onDownloadPdf,
  isDark,
}: DashboardOverviewTabProps) {
  const interviewingCount = jobApplications.filter((j) => j.stage === 'Interviewing').length;
  const appliedCount = jobApplications.filter((j) => j.stage === 'Applied').length;
  const offerCount = jobApplications.filter((j) => j.stage === 'Offer').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Redesigned Welcome Section (Prioritized Action Hierarchy) */}
      <DashboardWelcome
        userName={user.name}
        activeResume={activeResume}
        onOpenEditor={onOpenEditor}
        onCreateResume={onCreateNewResume}
        onOpenLinkedInImport={onOpenLinkedInImport}
        onOpenAtsChecker={onOpenAtsChecker}
        onDownloadPdf={onDownloadPdf}
        isDark={isDark}
      />

      {/* 2. Career Intelligence & MNC Benchmarking Panel */}
      <CareerIntelligencePanel
        activeResume={activeResume}
        onUpdateResume={onUpdateResume}
        onOpenEditor={onOpenEditor}
        isDark={isDark}
      />

      {/* 3. 4-Column Responsive Quick Create Tool Suite */}
      <QuickCreateSection
        onOpenLinkedInImport={onOpenLinkedInImport}
        onOpenAiGenerator={onOpenAiGenerator}
        onOpenCoverLetters={onOpenCoverLetters}
        onOpenAtsChecker={onOpenAtsChecker}
        onOpenJobTracker={onOpenJobTracker}
        onOpenTemplates={onOpenTemplates}
        onOpenPortfolios={onOpenPortfolios}
        onOpenInterviewPrep={onOpenInterviewPrep}
        isDark={isDark}
      />

      {/* 4. Recently Edited Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recently Edited Documents
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
              Active documents synchronized to your workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEditor}
            className="text-xs font-semibold text-[#FF5A4E] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Studio Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resumes.slice(0, 3).map((r) => {
            const isActive = r.id === activeResume.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectResume(r.id)}
                className={`p-5 rounded-3xl border transition cursor-pointer card-hover-lift flex flex-col justify-between ${
                  isActive
                    ? 'border-[#FF5A4E] ring-1 ring-[#FF5A4E]/30 bg-white dark:bg-slate-900 shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {r.templateId} · {r.pageSize || 'A4'}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-600">
                      ATS {r.atsScore}/100
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white truncate">
                    {r.title}
                  </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 truncate">
                    {r.personalInfo.fullName} · {r.personalInfo.jobTitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>{r.updatedAt}</span>
                  <span className="font-semibold text-[#FF5A4E]">Select</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Job Application Pipeline Overview */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
              Career Pipeline
            </div>
            <h3 className={`font-serif text-lg font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Job Applications Status ({jobApplications.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenJobTracker}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition self-start sm:self-auto shadow-2xs"
          >
            <span>Open Kanban Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 uppercase">Total Saved</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {jobApplications.length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="text-[11px] font-mono text-blue-600 uppercase">Applied</div>
            <div className="text-xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
              {appliedCount}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="text-[11px] font-mono text-amber-600 uppercase">Interviews</div>
            <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1">
              {interviewingCount}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="text-[11px] font-mono text-emerald-600 uppercase">Offers</div>
            <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
              {offerCount}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Career Acceleration Hub: Pro Tips & System Health */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
              Career Acceleration Hub
            </div>
            <h3
              className={`font-serif text-lg font-bold mt-0.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Executive Insights &amp; ATS Best Practices
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenAtsChecker}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition self-start sm:self-auto shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch ATS Audit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5A4E]" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Google X-Y-Z Formula
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Frame bullet points with measurable outcomes: Accomplished [X] as measured by [Y], by doing [Z].
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Vector ATS Selectability
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All 18 original templates generate pure vector character streams parsed cleanly by Workday and Greenhouse.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                Zero-Trust Isolation
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Documents are isolated to your authenticated account in Firestore and MongoDB with 100% free community access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
