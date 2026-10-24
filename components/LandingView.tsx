'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  LayoutGrid,
  Sparkles,
  MessageSquare,
  Undo2,
  Redo2,
  CheckCircle2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Wand2,
  Cpu,
  FolderKanban,
  FileUp,
  Sun,
  Moon,
  Search,
  Eye,
  X,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { AppUserProfile } from '@/lib/auth-service';
import {
  ResumeDocument,
  ThemeColorId,
  FontFamilyId,
  TemplateId,
  TemplateCategory,
  THEME_COLORS,
  FONT_FAMILIES,
  RESUME_TEMPLATES,
  calculateAtsScore,
} from '@/lib/resume-engine';
import { ResumeCanvasPreview } from './ResumeCanvasPreview';

interface LandingViewProps {
  heroResume: ResumeDocument;
  uiTheme: 'light' | 'dark';
  onToggleUiTheme: () => void;
  onUpdateHeroResume: (
    updates: Partial<
      Pick<
        ResumeDocument,
        'themeColor' | 'fontFamily' | 'templateId' | 'fontSize' | 'pageSize'
      >
    >
  ) => void;
  onOpenDashboard: (
    initialTab?:
      | 'overview'
      | 'resumes'
      | 'editor'
      | 'cover-letters'
      | 'ats-checker'
      | 'career-map'
      | 'templates'
      | 'rea-blueprint'
  ) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenLinkedInImport: () => void;
  onOpenAtsScoreGenerator?: () => void;
  onShuffleDemoPersona?: () => void;
  onCreateWithTemplate: (templateId: TemplateId) => void;
  user: AppUserProfile | null;
  onSignOut?: () => void;
}

const TEMPLATE_CATEGORIES: Array<'All' | TemplateCategory> = [
  'All',
  'Simple',
  'Professional',
  'Executive',
  'Student',
  'Technical',
  'Academic',
  'Creative',
];

export function LandingView({
  heroResume,
  uiTheme,
  onToggleUiTheme,
  onUpdateHeroResume,
  onOpenDashboard,
  onOpenAuth,
  onOpenLinkedInImport,
  onOpenAtsScoreGenerator,
  onShuffleDemoPersona,
  onCreateWithTemplate,
  user,
  onSignOut,
}: LandingViewProps) {
  const [heroTab, setHeroTab] = useState<'build' | 'ats' | 'career'>('build');
  const [templateFilter, setTemplateFilter] = useState<'All' | TemplateCategory>('All');
  const [templateSearch, setTemplateSearch] = useState('');
  const [fullPreviewTemplateId, setFullPreviewTemplateId] = useState<TemplateId | null>(
    null
  );
  const [colorHistory, setColorHistory] = useState<ThemeColorId[]>(['green']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const isDark = uiTheme === 'dark';

  const handleSelectColor = (color: ThemeColorId) => {
    const nextHistory = [...colorHistory.slice(0, historyIndex + 1), color];
    setColorHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    onUpdateHeroResume({ themeColor: color });
  };

  const handleUndoColor = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      onUpdateHeroResume({ themeColor: colorHistory[nextIdx] });
    }
  };

  const handleRedoColor = () => {
    if (historyIndex < colorHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      onUpdateHeroResume({ themeColor: colorHistory[nextIdx] });
    }
  };

  const requireAuth = (action: () => void) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    action();
  };

  const filteredTemplates = RESUME_TEMPLATES.filter((t) => {
    const matchesCat = templateFilter === 'All' || t.category === templateFilter;
    const q = templateSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const liveAtsPreview = calculateAtsScore(heroResume);

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#FAF9F6] text-slate-900'
      }`}
    >
      {/* Top Navigation Bar (Balanced 3-Zone Header + Zero-Scrollbar Responsive Row) */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-slate-950/95 border-slate-800'
            : 'bg-white/95 border-slate-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          {/* Left Zone: Brand Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0"
          >
            <Image
              src="/assets/aistudio/image_663e4373.png"
              alt="ResumeGPT AI Logo"
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover shadow-xs border border-slate-200/70 shrink-0"
            />
            <div>
              <div
                className={`font-extrabold text-base sm:text-lg tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                ResumeBuilderAi <span className="text-[#FF5A4E]">3.0</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                AI Resume &amp; Career Studio
              </div>
            </div>
          </button>

          {/* Center Zone: Cleanly Aligned Primary Navigation Tabs */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById('templates-showcase-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              18 Templates
            </button>
            <button
              type="button"
              onClick={() => requireAuth(() => onOpenDashboard('editor'))}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              AI Studio Editor
            </button>
            <button
              type="button"
              onClick={() =>
                requireAuth(() =>
                  onOpenAtsScoreGenerator
                    ? onOpenAtsScoreGenerator()
                    : onOpenDashboard('ats-checker')
                )
              }
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              ATS Score Check
            </button>
            <button
              type="button"
              onClick={() => requireAuth(onOpenLinkedInImport)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              LinkedIn Import
            </button>
            <button
              type="button"
              onClick={() => requireAuth(() => onOpenDashboard('cover-letters'))}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Cover Letters
            </button>
            <button
              type="button"
              onClick={() => requireAuth(() => onOpenDashboard('overview'))}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                isDark
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#FF5A4E]" />
              <span>Dashboard</span>
            </button>
          </nav>

          {/* Right Zone: Theme & Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleUiTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} interface theme`}
              className={`p-2 rounded-lg border text-xs font-semibold transition ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDashboard('overview')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold transition shadow-2xs"
                >
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {user.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span>Open Workspace</span>
                </button>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className={`p-2 rounded-lg transition text-xs border ${
                      isDark
                        ? 'border-slate-700 text-slate-300 hover:text-red-400'
                        : 'border-slate-200 text-slate-500 hover:text-red-600'
                    }`}
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 sm:px-5 py-2 rounded-lg bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold whitespace-nowrap shadow-xs transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tablet & Mobile Wrap-Friendly Navigation Bar (Zero Horizontal Scrollbar) */}
        <div
          className={`lg:hidden border-t px-4 py-2 flex flex-wrap items-center justify-center gap-1.5 ${
            isDark
              ? 'border-slate-800 bg-slate-900/80'
              : 'border-slate-200/70 bg-slate-50/80'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              document
                .getElementById('templates-showcase-section')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            18 Templates
          </button>
          <button
            type="button"
            onClick={() => requireAuth(() => onOpenDashboard('editor'))}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            AI Studio
          </button>
          <button
            type="button"
            onClick={() =>
              requireAuth(() =>
                onOpenAtsScoreGenerator
                  ? onOpenAtsScoreGenerator()
                  : onOpenDashboard('ats-checker')
              )
            }
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            ATS Score Check
          </button>
          <button
            type="button"
            onClick={() => requireAuth(onOpenLinkedInImport)}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            LinkedIn Import
          </button>
          <button
            type="button"
            onClick={() => requireAuth(() => onOpenDashboard('overview'))}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#FF5A4E] bg-white border border-slate-200/80 transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <p
          className={`text-xs sm:text-sm font-bold tracking-tight mb-3 ${
            isDark ? 'text-emerald-400' : 'text-[#FF5A4E]'
          }`}
        >
          ResumeBuilderAi 3.0 · Complete AI Resume &amp; Career Studio
        </p>

        <h1
          className={`font-serif text-4xl sm:text-6xl font-normal tracking-tight mb-5 max-w-4xl mx-auto text-balance ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Build a factual, recruiter-ready resume. Land your next role.
        </h1>

        <p
          className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Craft multi-section resumes across 18 code-rendered ATS templates, import your
          LinkedIn profile export with source verification, and tailor bullets with
          grounded Gemini AI before/after review.
        </p>

        {/* Primary Onboarding Actions: Studio + LinkedIn + ATS Check + Dashboard */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
          <button
            type="button"
            onClick={() => requireAuth(() => onOpenDashboard('editor'))}
            className="px-6 py-3.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white font-semibold text-sm shadow-sm transition inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Wand2 className="w-4 h-4" />
            <span>Create Resume in Studio</span>
          </button>

          <button
            type="button"
            onClick={() => requireAuth(onOpenLinkedInImport)}
            className="px-5 py-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-semibold text-sm shadow-sm transition inline-flex items-center gap-2 whitespace-nowrap"
          >
            <FileUp className="w-4 h-4" />
            <span>Build from LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() =>
              requireAuth(() =>
                onOpenAtsScoreGenerator
                  ? onOpenAtsScoreGenerator()
                  : onOpenDashboard('ats-checker')
              )
            }
            className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition inline-flex items-center gap-2 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ATS Score Generator</span>
          </button>

          <button
            type="button"
            onClick={() => requireAuth(() => onOpenDashboard('overview'))}
            className={`px-5 py-3.5 rounded-xl border font-semibold text-sm transition inline-flex items-center gap-2 whitespace-nowrap ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>Open My Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#FF5A4E]" />
          </button>
        </div>

        {/* Unboxed Platform Capability Summary (Zero-Pill Discipline) */}
        <div
          className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs mb-10 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <span>18 Original Code-Rendered ATS Templates</span>
          <span aria-hidden="true">·</span>
          <span>A4 &amp; US Letter Selectable PDF, DOCX &amp; JSON Exports</span>
          <span aria-hidden="true">·</span>
          <span>12 Structured Sections with Keyboard Reordering</span>
          <span aria-hidden="true">·</span>
          <span>Grounded Gemini AI with Explicit Fact Guardrails</span>
        </div>

        {/* Interactive Studio Showcase Frame (Aligned 3-Zone Top Bar + Clean Split Layout) */}
        <div className="relative mx-auto max-w-6xl rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200/90 overflow-hidden text-left">
          {/* Balanced Window Header Bar */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
            {/* Left: Traffic Lights + Demo Persona Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A4E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="h-4 w-px bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                <span className="text-slate-400 hidden sm:inline">Demo:</span>
                <strong className="text-white font-semibold">
                  {heroResume.personalInfo.fullName}
                </strong>
                {onShuffleDemoPersona && (
                  <button
                    type="button"
                    onClick={onShuffleDemoPersona}
                    aria-label="Shuffle Random Demo Name"
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold inline-flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Randomize Demo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Center: Single-Row Segmented Tab Switcher */}
            <div
              role="tablist"
              aria-label="Studio Preview Mode"
              className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 bg-slate-800/90 p-1 rounded-xl shrink-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={heroTab === 'build'}
                onClick={() => setHeroTab('build')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                  heroTab === 'build'
                    ? 'bg-[#FF5A4E] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Build Resumes</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroTab === 'ats'}
                onClick={() => setHeroTab('ats')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                  heroTab === 'ats'
                    ? 'bg-[#FF5A4E] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heuristic Resume Check</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroTab === 'career'}
                onClick={() => setHeroTab('career')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap ${
                  heroTab === 'career'
                    ? 'bg-[#FF5A4E] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Job Tracker &amp; AI Suite</span>
              </button>
            </div>

            {/* Right: Direct Studio Launch */}
            <div className="hidden xl:flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => requireAuth(() => onOpenDashboard('editor'))}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition whitespace-nowrap"
              >
                <span>Open Full Studio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF5A4E]" />
              </button>
            </div>
          </div>

          {/* Tab 1: Build Resumes (Clean 4-Col Controls + 8-Col Live Resume Preview) */}
          {heroTab === 'build' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#F5F7F9]">
              {/* Left Customizer Rail (4 cols for generous, uncramped alignment) */}
              <div className="lg:col-span-4 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 p-5 sm:p-6 space-y-5">
                {/* Fictional Demo Sample Persona Switcher Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Active Demo Persona
                    </span>
                    {onShuffleDemoPersona && (
                      <button
                        type="button"
                        onClick={onShuffleDemoPersona}
                        aria-label="Shuffle Random Demo Persona"
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-[#FF5A4E] text-[#FF5A4E] text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Shuffle</span>
                      </button>
                    )}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {heroResume.personalInfo.fullName}
                  </div>
                  <div className="text-xs text-slate-600">
                    {heroResume.personalInfo.jobTitle} · {heroResume.personalInfo.location}
                  </div>
                </div>

                {/* Template Layout Switcher (All 12 Templates) */}
                <div>
                  <label
                    htmlFor="hero-template-select"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Template Style (18 Original ATS Designs)
                  </label>
                  <select
                    id="hero-template-select"
                    value={heroResume.templateId}
                    onChange={(e) =>
                      onUpdateHeroResume({
                        templateId: e.target.value as TemplateId,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5A4E]"
                  >
                    {RESUME_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Swatches + Undo/Redo */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="text-xs font-semibold text-slate-700">
                      Theme Accent:{' '}
                      <span className="font-bold text-slate-900">
                        {THEME_COLORS[heroResume.themeColor]?.label || 'Green'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleUndoColor}
                        disabled={historyIndex <= 0}
                        aria-label="Undo style change"
                        className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700 transition"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRedoColor}
                        disabled={historyIndex >= colorHistory.length - 1}
                        aria-label="Redo style change"
                        className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700 transition"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 justify-items-center">
                    {(Object.keys(THEME_COLORS) as ThemeColorId[]).map((colorKey) => {
                      const item = THEME_COLORS[colorKey];
                      const active = heroResume.themeColor === colorKey;
                      return (
                        <button
                          key={colorKey}
                          type="button"
                          onClick={() => handleSelectColor(colorKey)}
                          aria-label={`Select ${item.label} color theme`}
                          style={{ backgroundColor: item.swatch }}
                          className={`w-8 h-8 rounded-full transition relative ${
                            active
                              ? 'ring-2 ring-[#FF5A4E] ring-offset-2 scale-105'
                              : 'hover:scale-105 opacity-85 hover:opacity-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Font Family & Paper Size in a Clean 2-Column Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="hero-font-select"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Font Family
                    </label>
                    <select
                      id="hero-font-select"
                      value={heroResume.fontFamily}
                      onChange={(e) =>
                        onUpdateHeroResume({
                          fontFamily: e.target.value as FontFamilyId,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF5A4E]"
                    >
                      {(Object.keys(FONT_FAMILIES) as FontFamilyId[]).map((fKey) => (
                        <option key={fKey} value={fKey}>
                          {FONT_FAMILIES[fKey].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="hero-pagesize-select"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Paper Format
                    </label>
                    <select
                      id="hero-pagesize-select"
                      value={heroResume.pageSize || 'A4'}
                      onChange={(e) =>
                        onUpdateHeroResume({
                          pageSize: e.target.value as 'A4' | 'LETTER',
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF5A4E]"
                    >
                      <option value="A4">A4 (210 × 297 mm)</option>
                      <option value="LETTER">US Letter (8.5 × 11 in)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => requireAuth(() => onOpenDashboard('editor'))}
                    className="w-full py-3 px-4 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Edit Full Resume in Studio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => requireAuth(onOpenLinkedInImport)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Import LinkedIn Profile</span>
                  </button>
                </div>
              </div>

              {/* Right Live Resume Canvas (8 cols) */}
              <div className="lg:col-span-8 p-4 sm:p-8 flex items-start justify-center">
                <ResumeCanvasPreview
                  resume={heroResume}
                  interactive
                  onSelectSection={() => requireAuth(() => onOpenDashboard('editor'))}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Heuristic Resume Check */}
          {heroTab === 'ats' && (
            <div className="p-6 sm:p-10 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Explainable Heuristic Readiness Check</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-slate-900">
                  Readiness Score: {liveAtsPreview.overallScore}/100
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {liveAtsPreview.heuristicDisclaimer}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">
                      Impact Density
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                      {liveAtsPreview.sectionScores.impact}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] uppercase text-slate-500 font-semibold">
                      Date Consistency
                    </div>
                    <div className="text-xl font-extrabold text-emerald-600 tabular-nums mt-0.5">
                      {liveAtsPreview.sectionScores.dateConsistency}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      requireAuth(() =>
                        onOpenAtsScoreGenerator
                          ? onOpenAtsScoreGenerator()
                          : onOpenDashboard('ats-checker')
                      )
                    }
                    className="px-5 py-3 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Launch ATS Score Generator &amp; Matcher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => requireAuth(() => onOpenDashboard('ats-checker'))}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition"
                  >
                    <span>Full Diagnostic Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3 bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Explainable Diagnostic Findings for {heroResume.personalInfo.fullName}
                </div>
                {liveAtsPreview.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{f.category}</div>
                      <p className="text-xs text-slate-600 mt-0.5">{f.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Job Application Tracker & Grounded AI Suite */}
          {heroTab === 'career' && (
            <div className="p-6 sm:p-10 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Career Suite &amp; Application Tracker</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-slate-900">
                  Track applications, tailor cover letters &amp; prepare for interviews.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Link role-specific resume versions to target job applications, draft
                  matching cover letters, executive bios, LinkedIn About sections, and
                  honest career-gap explanations.
                </p>
                <button
                  type="button"
                  onClick={() => requireAuth(() => onOpenDashboard('career-map'))}
                  className="px-5 py-3 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition"
                >
                  <span>Open Career Suite &amp; Job Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#FF5A4E]">
                    Job Application Tracker
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    Stage Pipeline &amp; Linked Resumes
                  </div>
                  <p className="text-xs text-slate-600">
                    Track Saved, Applied, Interviewing, and Offer stages with deadlines
                    and linked resume versions.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Grounded AI Writing Tools
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    Bio, LinkedIn, Translation &amp; Gaps
                  </div>
                  <p className="text-xs text-slate-600">
                    Preserves candidate names, dates, and facts—never invents employers or
                    qualifications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Searchable 12-Template Showcase Section (Live Code-Rendered Previews) */}
      <section
        id="templates-showcase-section"
        className={`py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t ${
          isDark ? 'border-slate-800' : 'border-slate-200/70'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A4E] mb-2">
              18 Original Code-Rendered ATS Templates · 7 Categories
            </p>
            <h2
              className={`font-serif text-3xl sm:text-4xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Pick an original template and customize it in real time.
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              aria-label="Search resume templates"
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              placeholder="Search 18 templates by style..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTemplateFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                templateFilter === cat
                  ? 'bg-[#FF5A4E] text-white'
                  : isDark
                  ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 12 Templates Grid with Live Code-Rendered Miniature Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const previewDoc: ResumeDocument = {
              ...heroResume,
              templateId: tpl.id,
              themeColor: tpl.defaultColor,
              fontFamily: tpl.defaultFont,
            };
            return (
              <div
                key={tpl.id}
                className={`group rounded-2xl border overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  {/* Live Code-Rendered Thumbnail Container (not a static image!) */}
                  <div className="bg-slate-100 p-3 border-b border-slate-200/80 h-60 overflow-hidden relative">
                    <div className="origin-top-left scale-[0.42] w-[238%] pointer-events-none select-none">
                      <ResumeCanvasPreview resume={previewDoc} compact />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end justify-between p-3">
                      <span className="text-[11px] font-medium text-white">
                        {tpl.category} · {tpl.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFullPreviewTemplateId(tpl.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3 h-3 text-[#FF5A4E]" />
                        <span>Full Preview</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className={`font-bold text-base ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {tpl.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {tpl.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => requireAuth(() => onCreateWithTemplate(tpl.id))}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-[#FF5A4E] text-white text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Use This Template</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full-Size Template Preview Modal */}
      {fullPreviewTemplateId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-Size Template Preview"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {
                    RESUME_TEMPLATES.find((t) => t.id === fullPreviewTemplateId)
                      ?.name
                  }{' '}
                  — Full A4 Live Renderer Preview
                </h3>
                <p className="text-xs text-slate-500">
                  Rendered with selectable HTML/CSS text and matching Cover Letter
                  header styling
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const id = fullPreviewTemplateId;
                    setFullPreviewTemplateId(null);
                    requireAuth(() => onCreateWithTemplate(id));
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF5A4E] text-white text-xs font-semibold"
                >
                  Use Template in Studio
                </button>
                <button
                  type="button"
                  onClick={() => setFullPreviewTemplateId(null)}
                  aria-label="Close full preview"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-100 p-4 sm:p-6 rounded-xl">
              <ResumeCanvasPreview
                resume={{
                  ...heroResume,
                  templateId: fullPreviewTemplateId,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
