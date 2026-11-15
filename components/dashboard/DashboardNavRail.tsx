'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Mail,
  ShieldCheck,
  Compass,
  LayoutGrid,
  Cpu,
  Globe,
  Briefcase,
  MessageSquare,
  Wand2,
  FolderKanban,
  Settings,
} from 'lucide-react';

export type DashboardNavTab =
  | 'overview'
  | 'resumes'
  | 'editor'
  | 'cover-letters'
  | 'ats-checker'
  | 'career-map'
  | 'templates'
  | 'rea-blueprint'
  | 'portfolios'
  | 'interview-prep'
  | 'media-library'
  | 'settings';

interface DashboardNavRailProps {
  activeTab: DashboardNavTab;
  onChangeTab: (tab: DashboardNavTab) => void;
  isDark?: boolean;
  resumeCount: number;
  coverLetterCount: number;
  jobCount: number;
  activeResumeAtsScore: number;
  activeResumeTitle: string;
}

export function DashboardNavRail({
  activeTab,
  onChangeTab,
  isDark,
  resumeCount,
  coverLetterCount,
  jobCount,
  activeResumeAtsScore,
  activeResumeTitle,
}: DashboardNavRailProps) {
  const navItems: Array<{
    id: DashboardNavTab;
    label: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      sub: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'resumes',
      label: 'My Documents',
      sub: `${resumeCount} Resumes`,
      icon: FileText,
    },
    {
      id: 'editor',
      label: 'AI Resume Studio',
      sub: '3-Panel Editor',
      icon: PenTool,
    },
    {
      id: 'cover-letters',
      label: 'Cover Letters',
      sub: `${coverLetterCount} Letters`,
      icon: Mail,
    },
    {
      id: 'ats-checker',
      label: 'ATS Match & Checker',
      sub: `${activeResumeAtsScore}%`,
      icon: ShieldCheck,
    },
    {
      id: 'templates',
      label: '18 ATS Templates',
      sub: 'Code Previews',
      icon: LayoutGrid,
    },
    {
      id: 'career-map',
      label: 'Job Tracker Pipeline',
      sub: `${jobCount} Applications`,
      icon: Briefcase,
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep (STAR)',
      sub: 'AI Questions',
      icon: MessageSquare,
    },
    {
      id: 'portfolios',
      label: 'Portfolio Website',
      sub: '/p/slug',
      icon: Globe,
    },
    {
      id: 'media-library',
      label: 'Media & Assets',
      sub: 'Photos/Videos',
      icon: FolderKanban,
    },
    {
      id: 'rea-blueprint',
      label: 'REA & Systems',
      sub: 'v6.9 Engine',
      icon: Cpu,
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      sub: 'Privacy/Data',
      icon: Settings,
    },
  ];

  return (
    <aside
      aria-label="Workspace Sections"
      className={`lg:w-64 border-b lg:border-b-0 lg:border-r p-3 sm:p-4 shrink-0 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}
    >
      <div className="hidden lg:block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 mb-2">
        Career Studio Navigation
      </div>

      {/* Responsive: Horizontal Scrollable Segmented Rail on Mobile/Tablet, Vertical Rail on Desktop */}
      <div className="flex overflow-x-auto lg:flex-col gap-1.5 scrollbar-none pb-1 lg:pb-0 snap-x overscroll-x-contain">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition shrink-0 snap-start whitespace-nowrap min-h-[44px] ${
                isActive
                  ? 'bg-[#FF5A4E] text-white font-semibold shadow-2xs'
                  : isDark
                  ? 'text-slate-300 hover:bg-slate-800 font-medium'
                  : 'text-slate-700 hover:bg-slate-100 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
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
        className={`hidden lg:block mt-6 p-3.5 rounded-2xl border space-y-2.5 ${
          isDark
            ? 'bg-slate-950/70 border-slate-800 text-slate-200'
            : 'bg-slate-50 border-slate-200/80 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono uppercase text-slate-500 font-bold">Active Doc Readiness</span>
          <span className="font-mono font-extrabold text-emerald-600 tabular-nums">
            {activeResumeAtsScore}/100
          </span>
        </div>
        <div className="text-xs font-bold truncate">{activeResumeTitle}</div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, activeResumeAtsScore))}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
