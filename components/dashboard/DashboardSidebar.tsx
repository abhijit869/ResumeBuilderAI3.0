'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  LayoutGrid,
  ShieldCheck,
  Briefcase,
  Mail,
  MessageSquare,
  Compass,
  Globe,
  Palette,
  FolderKanban,
  Settings,
  Cpu,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';

export type DashboardNavTab =
  | 'overview'
  | 'resumes'
  | 'editor'
  | 'templates'
  | 'ats-checker'
  | 'career-map'
  | 'cover-letters'
  | 'interview-prep'
  | 'career-planner'
  | 'portfolios'
  | 'cover-page'
  | 'media-library'
  | 'settings'
  | 'rea-blueprint';

interface DashboardSidebarProps {
  activeTab: DashboardNavTab;
  onChangeTab: (tab: DashboardNavTab) => void;
  isDark?: boolean;
  resumeCount: number;
  coverLetterCount: number;
  jobCount: number;
  activeResumeAtsScore: number;
  activeResumeTitle: string;
}

export function DashboardSidebar({
  activeTab,
  onChangeTab,
  isDark,
  resumeCount,
  coverLetterCount,
  jobCount,
  activeResumeAtsScore,
  activeResumeTitle,
}: DashboardSidebarProps) {
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  const navGroups: Array<{
    title: string;
    items: Array<{
      id: DashboardNavTab;
      label: string;
      badge?: string | number;
      badgeColor?: string;
      icon: React.ComponentType<{ className?: string }>;
    }>;
  }> = [
    {
      title: 'Workspace',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'resumes',
          label: 'My Documents',
          badge: resumeCount,
          badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
          icon: FileText,
        },
        {
          id: 'editor',
          label: 'Resume Editor',
          badge: 'Studio',
          badgeColor: 'bg-[#FF5A4E]/10 text-[#FF5A4E]',
          icon: PenTool,
        },
        {
          id: 'templates',
          label: 'Resume Templates',
          badge: '18',
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: 'Career Toolbox',
      items: [
        {
          id: 'ats-checker',
          label: 'ATS Analysis & Checker',
          badge: `${activeResumeAtsScore}%`,
          badgeColor: 'bg-emerald-500/10 text-emerald-600',
          icon: ShieldCheck,
        },
        {
          id: 'career-map',
          label: 'Job Board & Tracker',
          badge: jobCount > 0 ? jobCount : undefined,
          badgeColor: 'bg-blue-500/10 text-blue-600',
          icon: Briefcase,
        },
        {
          id: 'cover-letters',
          label: 'Cover Letter Studio',
          badge: coverLetterCount > 0 ? coverLetterCount : undefined,
          icon: Mail,
        },
        {
          id: 'interview-prep',
          label: 'Interview Prep (STAR)',
          icon: MessageSquare,
        },
        {
          id: 'career-planner',
          label: 'Career Map Planner',
          icon: Compass,
        },
      ],
    },
    {
      title: 'Creative Studio',
      items: [
        {
          id: 'portfolios',
          label: 'Portfolio Website',
          badge: '/p/slug',
          icon: Globe,
        },
        {
          id: 'cover-page',
          label: 'Cover Page Designer',
          icon: Palette,
        },
        {
          id: 'media-library',
          label: 'Media & Assets',
          icon: FolderKanban,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          id: 'settings',
          label: 'Account & Security',
          icon: Settings,
        },
        {
          id: 'rea-blueprint',
          label: 'REA & System Blueprint',
          icon: Cpu,
        },
      ],
    },
  ];

  return (
    <>
      <aside
        aria-label="Sidebar Navigation"
        className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-r shrink-0 transition-colors flex flex-col justify-between ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200/80'
        }`}
      >
        {/* Navigation Groups Container */}
        <div className="p-3 sm:p-4 space-y-6 overflow-x-auto lg:overflow-x-visible scrollbar-none flex lg:flex-col">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1 shrink-0 lg:shrink min-w-[180px] lg:min-w-0 pr-4 lg:pr-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2.5 py-1">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeTab(item.id)}
                      className={`w-full h-10 px-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition ${
                        isActive
                          ? 'bg-[#FF5A4E] text-white font-semibold shadow-2xs'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-xs truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Clean Bottom Resume Readiness Widget (Zero Overlapping Badges) */}
        <div className="p-3 sm:p-4 pt-0 hidden lg:block">
          <div
            className={`p-3.5 rounded-2xl border transition ${
              isDark
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A4E]" />
                <span>Resume Readiness</span>
              </span>
              <span className="font-mono font-bold text-emerald-600 text-xs">
                {activeResumeAtsScore}/100
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, activeResumeAtsScore)}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-500 truncate mb-3">
              {activeResumeTitle}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onChangeTab('editor')}
                className="px-2 py-1.5 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-[11px] font-semibold text-center transition"
              >
                Edit Studio
              </button>
              <button
                type="button"
                onClick={() => setShowDiagnosticModal(true)}
                className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold text-center transition"
              >
                Diagnostics
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Clean Diagnostic Status Modal (Does NOT cover navigation) */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Resume Readiness Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnosticModal(false)}
                aria-label="Close diagnostics"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Overall ATS Compatibility
                </span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {activeResumeAtsScore}%
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Contact information & layout verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Standard chronology and section headings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Recommend tailoring keywords for specific job targets</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDiagnosticModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiagnosticModal(false);
                  onChangeTab('ats-checker');
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-2xs"
              >
                Run Full ATS Checker
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
