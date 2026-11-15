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
} from 'lucide-react';
import { ResumeDocument, CoverLetterDocument, JobApplicationItem } from '@/lib/resume-engine';

interface DashboardOverviewTabProps {
  user: { name: string; email: string; plan: string };
  resumes: ResumeDocument[];
  coverLetters: CoverLetterDocument[];
  jobApplications: JobApplicationItem[];
  activeResume: ResumeDocument;
  onSelectResume: (id: string) => void;
  onOpenEditor: () => void;
  onOpenCoverLetters: () => void;
  onOpenAtsChecker: () => void;
  onOpenLinkedInImport: () => void;
  onOpenJobTracker: () => void;
  onCreateNewResume: () => void;
  isDark?: boolean;
}

export function DashboardOverviewTab({
  user,
  resumes,
  coverLetters,
  jobApplications,
  activeResume,
  onSelectResume,
  onOpenEditor,
  onOpenCoverLetters,
  onOpenAtsChecker,
  onOpenLinkedInImport,
  onOpenJobTracker,
  onCreateNewResume,
  isDark,
}: DashboardOverviewTabProps) {
  const interviewingCount = jobApplications.filter((j) => j.stage === 'Interviewing').length;
  const appliedCount = jobApplications.filter((j) => j.stage === 'Applied').length;
  const offerCount = jobApplications.filter((j) => j.stage === 'Offer').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Welcome Profile Card & Quick Stats */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs relative overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.plan || 'ResumeBuilderAi 3.0 Pro'} Workspace</span>
            </div>
            <h2 className={`font-serif text-2xl sm:text-4xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Your career documents are protected with Cloud Firestore isolation. Manage your resumes, track open applications, and prepare for upcoming interviews below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCreateNewResume}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </button>
            <button
              type="button"
              onClick={onOpenLinkedInImport}
              className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
            >
              <FileUp className="w-4 h-4" />
              <span>Import LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/70 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Resumes</div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5 tabular-nums">
              {resumes.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Cover Letters</div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5 tabular-nums">
              {coverLetters.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Applications</div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5 tabular-nums">
              {jobApplications.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-[11px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold">
              Active ATS Score
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-0.5 tabular-nums">
              {activeResume.atsScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recently Edited Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF5A4E]" />
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recently Edited Resumes ({resumes.length})
            </h3>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.slice(0, 3).map((r) => {
            const isActive = r.id === activeResume.id;
            return (
              <div
                key={r.id}
                onClick={() => onSelectResume(r.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-[#FF5A4E] bg-white dark:bg-slate-900 shadow-xs'
                    : isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {r.templateId} · {r.pageSize || 'A4'}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-600">
                      {r.atsScore}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {r.personalInfo.fullName} · {r.personalInfo.jobTitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{r.updatedAt || 'Updated recently'}</span>
                  </span>
                  <span className="text-[#FF5A4E] font-semibold text-xs">
                    {isActive ? 'Active' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Job Application Pipeline Status Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-600" />
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Application Pipeline Overview
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenJobTracker}
            className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
            <div className="text-slate-400 font-mono uppercase text-[10px]">Applied</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">{appliedCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
            <div className="text-amber-500 font-mono uppercase text-[10px]">Interviewing</div>
            <div className="text-xl font-bold text-amber-600 mt-1 tabular-nums">{interviewingCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
            <div className="text-emerald-500 font-mono uppercase text-[10px]">Active Offers</div>
            <div className="text-xl font-bold text-emerald-600 mt-1 tabular-nums">{offerCount}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-slate-400 font-mono uppercase text-[10px]">Next Milestone</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Prepare Interview</div>
            </div>
            <button
              type="button"
              onClick={onOpenJobTracker}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
