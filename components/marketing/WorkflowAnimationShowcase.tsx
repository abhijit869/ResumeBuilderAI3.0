'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  Search,
  Check,
  TrendingUp,
  FileText,
  Clock,
  Target,
} from 'lucide-react';

interface WorkflowAnimationShowcaseProps {
  isDark?: boolean;
  onNavigateTab?: (tab: 'editor' | 'ats-checker' | 'career-map') => void;
}

interface WorkflowStage {
  id: 'build' | 'optimize' | 'prepare';
  number: string;
  title: string;
  label: string;
  badge: string;
  heading: string;
  description: string;
  ctaText: string;
  targetTab: 'editor' | 'ats-checker' | 'career-map';
  metrics: { label: string; value: string }[];
}

const STAGES: WorkflowStage[] = [
  {
    id: 'build',
    number: '01',
    title: 'Build',
    label: 'Instant Document Studio',
    badge: '18 Code-Rendered Templates',
    heading: 'Build fact-verified resumes & cover letters in minutes',
    description:
      'Start from 18 code-rendered ATS templates, import your 1-click LinkedIn profile export, or generate role-specific achievements with grounded Gemini AI.',
    ctaText: 'Launch AI Studio Editor',
    targetTab: 'editor',
    metrics: [
      { label: 'Template Options', value: '18 Original' },
      { label: 'Export Formats', value: 'PDF / DOCX' },
      { label: 'AI Grounding', value: '100% Fact-Checked' },
    ],
  },
  {
    id: 'optimize',
    number: '02',
    title: 'Optimize',
    label: '13-Dimension ATS Optimizer',
    badge: '94/100 ATS Heuristic Score',
    heading: 'Score, match keywords & eliminate formatting friction',
    description:
      'Analyze your resume against real job descriptions. Get transparent heuristic scoring across contact details, keyword density, measurable achievements, and ATS parsing readability.',
    ctaText: 'Run 13-Dimension ATS Check',
    targetTab: 'ats-checker',
    metrics: [
      { label: 'Audit Dimensions', value: '13 Verified' },
      { label: 'MNC Benchmarks', value: 'Top 10 Analyzed' },
      { label: 'Keyword Match', value: 'Real-Time Heuristic' },
    ],
  },
  {
    id: 'prepare',
    number: '03',
    title: 'Prepare',
    label: 'Interview & Pipeline Suite',
    badge: '4-Stage Application Kanban',
    heading: 'Rehearse interview questions & track every opportunity',
    description:
      'Organize your applications from Saved to Offer, link role-specific resume revisions, and simulate behavioral interview questions using the proven STAR framework.',
    ctaText: 'Open Career Suite & Tracker',
    targetTab: 'career-map',
    metrics: [
      { label: 'Pipeline Stages', value: 'Saved → Offer' },
      { label: 'STAR Practice', value: 'Guided AI Coach' },
      { label: 'Application Linking', value: '1-to-1 Resumes' },
    ],
  },
];

export function WorkflowAnimationShowcase({
  isDark = false,
  onNavigateTab,
}: WorkflowAnimationShowcaseProps) {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStage = STAGES[activeStageIndex];
  const STAGE_DURATION_MS = 5000;
  const TICK_INTERVAL_MS = 50;

  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / STAGE_DURATION_MS) * 100;
        if (next >= 100) {
          setActiveStageIndex((current) => (current + 1) % STAGES.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, activeStageIndex]);

  const handleSelectStage = (idx: number) => {
    setActiveStageIndex(idx);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setActiveStageIndex(0);
    setProgress(0);
  };

  return (
    <section
      aria-label="Interactive AI Career Workflow Showcase"
      className={`py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t transition-colors ${
        isDark ? 'border-slate-800' : 'border-slate-200/80'
      }`}
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4E]/10 border border-[#FF5A4E]/20 text-[#FF5A4E] text-xs font-mono font-bold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Complete 3-Stage Career Acceleration Cycle</span>
        </div>
        <h2
          className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          From blank draft to signed offer in three continuous steps.
        </h2>
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Watch how ResumeBuilderAI 3.0 unifies creation, ATS validation, and interview
          execution into one cohesive workflow.
        </p>
      </div>

      {/* Main Showcase Container (Preserving Exact Kickresume-Style Outer Hook Attribute) */}
      <div
        className="hp-animation relative rounded-3xl overflow-hidden border shadow-xl transition-all"
        data-paths='["https://d1civoyjepycei.cloudfront.net/static/animations/homepage/build.44eafc613a3b.json","https://d1civoyjepycei.cloudfront.net/static/animations/homepage/optimize.18a91f446445.json","https://d1civoyjepycei.cloudfront.net/static/animations/homepage/prepare.9d454292ca7b.json"]'
        {...({ bis_skin_checked: '1', 'data-bis-skin-checked': '1' } as any)}
        style={{
          borderColor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(226, 232, 240, 0.9)',
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Control Bar: Stage Tabs + Playback Controls */}
        <div
          className={`px-4 sm:px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Stage Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {STAGES.map((stage, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 ${
                    isActive
                      ? isDark
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                        : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#FF5A4E] text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{stage.title}</span>
                  <span
                    className={`hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? isDark
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-slate-100 text-slate-700'
                        : 'opacity-0'
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Autoplay & Reset Controls */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause Auto-cycle' : 'Play Auto-cycle'}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              title={isPlaying ? 'Pause Animation' : 'Start Animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Restart Animation Workflow"
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              title="Restart from Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
          <div
            className="h-full bg-[#FF5A4E] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage Content Grid: Left Description + Right Interactive SVG Visualization */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context, Features & Deep Link CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#FF5A4E]/15 text-[#FF5A4E]">
                STAGE {activeStage.number}
              </span>
              <span
                className={`text-xs font-bold ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {activeStage.badge}
              </span>
            </div>

            <h3
              className={`font-serif text-2xl sm:text-3xl font-semibold leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {activeStage.heading}
            </h3>

            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {activeStage.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {activeStage.metrics.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-center ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    className="text-xs sm:text-sm font-bold truncate"
                    style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
                  >
                    {m.value}
                  </div>
                  <div
                    className={`text-[10px] font-medium mt-0.5 truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Stage Direct Launch CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab(activeStage.targetTab)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white font-semibold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
              >
                {activeStage.id === 'build' && <Wand2 className="w-4 h-4" />}
                {activeStage.id === 'optimize' && <ShieldCheck className="w-4 h-4" />}
                {activeStage.id === 'prepare' && <Briefcase className="w-4 h-4" />}
                <span>{activeStage.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Original Responsive Animated SVG Vector Scene (7 Cols) */}
          <div className="lg:col-span-7">
            <div
              className={`hp-animation__layer relative rounded-2xl border p-4 sm:p-6 transition-all duration-300 overflow-hidden shadow-inner ${
                isDark
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-slate-50/90 border-slate-200'
              }`}
              {...({ bis_skin_checked: '1', 'data-bis-skin-checked': '1' } as any)}
            >
              {/* Dynamic SVG Visual Canvas */}
              {activeStage.id === 'build' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1100 600"
                  width="1100"
                  height="600"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-auto drop-shadow-sm select-none"
                >
                  <defs>
                    <linearGradient id="build-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? '#1E293B' : '#FFFFFF'} />
                      <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8FAFC'} />
                    </linearGradient>
                    <linearGradient id="build-grad-coral" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF5A4E" />
                      <stop offset="100%" stopColor="#FF7A6E" />
                    </linearGradient>
                    <filter id="shadow-card" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Backdrop Frame */}
                  <rect
                    width="1100"
                    height="600"
                    rx="16"
                    fill="url(#build-grad-bg)"
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="2"
                  />

                  {/* Top Bar of Editor Mockup */}
                  <rect
                    x="30"
                    y="30"
                    width="1040"
                    height="46"
                    rx="8"
                    fill={isDark ? '#0B1329' : '#EDE8DF'}
                  />
                  <circle cx="55" cy="53" r="6" fill="#FF5A4E" />
                  <circle cx="75" cy="53" r="6" fill="#FBBF24" />
                  <circle cx="95" cy="53" r="6" fill="#34D399" />
                  <text
                    x="120"
                    y="57"
                    fill={isDark ? '#94A3B8' : '#475569'}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ResumeBuilderAI 3.0 · Studio Mode: Senior Software Architect
                  </text>

                  {/* Document Page Canvas */}
                  <g filter="url(#shadow-card)">
                    <rect
                      x="70"
                      y="100"
                      width="540"
                      height="460"
                      rx="10"
                      fill={isDark ? '#1E293B' : '#FFFFFF'}
                      stroke={isDark ? '#475569' : '#CBD5E1'}
                      strokeWidth="1.5"
                    />

                    {/* Resume Header */}
                    <rect x="100" y="130" width="180" height="18" rx="4" fill="url(#build-grad-coral)" />
                    <rect
                      x="100"
                      y="156"
                      width="260"
                      height="10"
                      rx="3"
                      fill={isDark ? '#64748B' : '#94A3B8'}
                    />

                    {/* Section 1: Professional Summary */}
                    <rect
                      x="100"
                      y="185"
                      width="90"
                      height="12"
                      rx="3"
                      fill={isDark ? '#38BDF8' : '#0284C7'}
                    />
                    <rect
                      x="100"
                      y="205"
                      width="480"
                      height="8"
                      rx="2"
                      fill={isDark ? '#475569' : '#CBD5E1'}
                    />
                    <rect
                      x="100"
                      y="220"
                      width="420"
                      height="8"
                      rx="2"
                      fill={isDark ? '#475569' : '#CBD5E1'}
                    />

                    {/* Section 2: Experience Bullets */}
                    <rect
                      x="100"
                      y="248"
                      width="120"
                      height="12"
                      rx="3"
                      fill={isDark ? '#38BDF8' : '#0284C7'}
                    />

                    {/* Bullet 1 with AI enhancement pill */}
                    <circle cx="106" cy="274" r="3" fill="#FF5A4E" />
                    <rect
                      x="118"
                      y="270"
                      width="450"
                      height="9"
                      rx="2"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                    />
                    <circle cx="106" cy="292" r="3" fill="#FF5A4E" />
                    <rect
                      x="118"
                      y="288"
                      width="400"
                      height="9"
                      rx="2"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                    />

                    {/* Bullet 2 */}
                    <circle cx="106" cy="316" r="3" fill="#FF5A4E" />
                    <rect
                      x="118"
                      y="312"
                      width="460"
                      height="9"
                      rx="2"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                    />
                    <circle cx="106" cy="334" r="3" fill="#FF5A4E" />
                    <rect
                      x="118"
                      y="330"
                      width="380"
                      height="9"
                      rx="2"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                    />

                    {/* Skills Grid */}
                    <rect
                      x="100"
                      y="360"
                      width="100"
                      height="12"
                      rx="3"
                      fill={isDark ? '#38BDF8' : '#0284C7'}
                    />
                    <rect x="100" y="382" width="70" height="20" rx="6" fill="#FF5A4E" fillOpacity="0.15" />
                    <text x="110" y="396" fill="#FF5A4E" fontSize="10" fontWeight="bold">
                      React 19
                    </text>
                    <rect x="180" y="382" width="85" height="20" rx="6" fill="#3B82F6" fillOpacity="0.15" />
                    <text x="190" y="396" fill="#3B82F6" fontSize="10" fontWeight="bold">
                      TypeScript
                    </text>
                    <rect x="275" y="382" width="85" height="20" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="285" y="396" fill="#10B981" fontSize="10" fontWeight="bold">
                      Next.js 15
                    </text>
                    <rect x="370" y="382" width="90" height="20" rx="6" fill="#8B5CF6" fillOpacity="0.15" />
                    <text x="380" y="396" fill="#8B5CF6" fontSize="10" fontWeight="bold">
                      Gemini API
                    </text>
                  </g>

                  {/* Right Floating Inspector: AI Assistant Callout */}
                  <g filter="url(#shadow-card)">
                    <rect
                      x="650"
                      y="110"
                      width="390"
                      height="210"
                      rx="12"
                      fill={isDark ? '#0F172A' : '#FFFFFF'}
                      stroke="#FF5A4E"
                      strokeWidth="2"
                    />
                    <rect x="670" y="130" width="160" height="18" rx="4" fill="#FF5A4E" fillOpacity="0.15" />
                    <text x="680" y="143" fill="#FF5A4E" fontSize="11" fontWeight="bold">
                      ✦ Grounded Gemini AI
                    </text>
                    <text
                      x="670"
                      y="172"
                      fill={isDark ? '#FFFFFF' : '#0F172A'}
                      fontSize="14"
                      fontWeight="bold"
                    >
                      Impact-Oriented Bullet Suggestion
                    </text>
                    <rect
                      x="670"
                      y="190"
                      width="350"
                      height="65"
                      rx="8"
                      fill={isDark ? '#1E293B' : '#F1F5F9'}
                    />
                    <text
                      x="685"
                      y="212"
                      fill={isDark ? '#38BDF8' : '#0369A1'}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Spearheaded cloud migration of 14 core services:
                    </text>
                    <text
                      x="685"
                      y="232"
                      fill={isDark ? '#94A3B8' : '#475569'}
                      fontSize="11"
                    >
                      Reduced monthly cloud expenditure by 34% ($180K/yr).
                    </text>
                    <rect x="670" y="270" width="130" height="32" rx="8" fill="#FF5A4E" />
                    <text x="690" y="291" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                      Apply to Resume
                    </text>
                  </g>

                  {/* Right Bottom Inspector: 18 Templates Carousel Preview */}
                  <g filter="url(#shadow-card)">
                    <rect
                      x="650"
                      y="340"
                      width="390"
                      height="210"
                      rx="12"
                      fill={isDark ? '#1E293B' : '#FFFFFF'}
                      stroke={isDark ? '#334155' : '#E2E8F0'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="670"
                      y="370"
                      fill={isDark ? '#FFFFFF' : '#0F172A'}
                      fontSize="13"
                      fontWeight="bold"
                    >
                      18 Code-Rendered ATS Templates
                    </text>
                    <text
                      x="670"
                      y="390"
                      fill={isDark ? '#94A3B8' : '#64748B'}
                      fontSize="11"
                    >
                      Zero PDF canvas distortion · 100% Selectable text
                    </text>
                    <rect x="670" y="410" width="105" height="120" rx="6" fill={isDark ? '#0F172A' : '#F8FAFC'} stroke="#3B82F6" strokeWidth="1.5" />
                    <rect x="790" y="410" width="105" height="120" rx="6" fill={isDark ? '#0F172A' : '#F8FAFC'} stroke="#10B981" strokeWidth="1.5" />
                    <rect x="910" y="410" width="105" height="120" rx="6" fill={isDark ? '#0F172A' : '#F8FAFC'} stroke="#F59E0B" strokeWidth="1.5" />
                  </g>
                </svg>
              )}

              {activeStage.id === 'optimize' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1100 600"
                  width="1100"
                  height="600"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-auto drop-shadow-sm select-none"
                >
                  <defs>
                    <linearGradient id="opt-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? '#1E293B' : '#FFFFFF'} />
                      <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8FAFC'} />
                    </linearGradient>
                    <linearGradient id="opt-meter" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Backdrop */}
                  <rect
                    width="1100"
                    height="600"
                    rx="16"
                    fill="url(#opt-grad-bg)"
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="2"
                  />

                  {/* Top Bar */}
                  <rect
                    x="30"
                    y="30"
                    width="1040"
                    height="46"
                    rx="8"
                    fill={isDark ? '#0B1329' : '#EDE8DF'}
                  />
                  <circle cx="55" cy="53" r="6" fill="#10B981" />
                  <circle cx="75" cy="53" r="6" fill="#3B82F6" />
                  <circle cx="95" cy="53" r="6" fill="#FF5A4E" />
                  <text
                    x="120"
                    y="57"
                    fill={isDark ? '#94A3B8' : '#475569'}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ResumeBuilderAI 3.0 · 13-Dimension Heuristic ATS Engine
                  </text>

                  {/* Score Gauge Card */}
                  <rect
                    x="60"
                    y="100"
                    width="360"
                    height="460"
                    rx="14"
                    fill={isDark ? '#1E293B' : '#FFFFFF'}
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="1.5"
                  />

                  {/* Circular Radial Gauge */}
                  <circle
                    cx="240"
                    cy="210"
                    r="80"
                    fill="none"
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="16"
                  />
                  <circle
                    cx="240"
                    cy="210"
                    r="80"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="16"
                    strokeDasharray="502"
                    strokeDashoffset="40"
                    strokeLinecap="round"
                    transform="rotate(-90 240 210)"
                  />
                  <text
                    x="240"
                    y="205"
                    textAnchor="middle"
                    fill={isDark ? '#FFFFFF' : '#0F172A'}
                    fontSize="44"
                    fontWeight="900"
                  >
                    94
                  </text>
                  <text
                    x="240"
                    y="235"
                    textAnchor="middle"
                    fill="#10B981"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    ATS READY · TIER A
                  </text>

                  {/* Scoring Formula Transparency Badge */}
                  <rect
                    x="90"
                    y="320"
                    width="300"
                    height="60"
                    rx="8"
                    fill={isDark ? '#0F172A' : '#ECFDF5'}
                    stroke="#A7F3D0"
                    strokeWidth="1"
                  />
                  <text
                    x="105"
                    y="342"
                    fill="#065F46"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    Independent Heuristic Formula
                  </text>
                  <text
                    x="105"
                    y="362"
                    fill={isDark ? '#6EE7B7' : '#047857'}
                    fontSize="10"
                  >
                    No false ATS guarantees. 13 transparent rule checks.
                  </text>

                  {/* 4 Category Meters */}
                  <g>
                    <rect
                      x="450"
                      y="100"
                      width="590"
                      height="220"
                      rx="14"
                      fill={isDark ? '#1E293B' : '#FFFFFF'}
                      stroke={isDark ? '#334155' : '#E2E8F0'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="480"
                      y="135"
                      fill={isDark ? '#FFFFFF' : '#0F172A'}
                      fontSize="14"
                      fontWeight="bold"
                    >
                      Audit Category Breakdown
                    </text>

                    {/* Cat 1: Keywords */}
                    <text x="480" y="165" fill={isDark ? '#94A3B8' : '#475569'} fontSize="11" fontWeight="bold">
                      Job Keyword Alignment (96%)
                    </text>
                    <rect x="480" y="175" width="530" height="8" rx="4" fill={isDark ? '#334155' : '#E2E8F0'} />
                    <rect x="480" y="175" width="508" height="8" rx="4" fill="#10B981" />

                    {/* Cat 2: Measurable Impact */}
                    <text x="480" y="205" fill={isDark ? '#94A3B8' : '#475569'} fontSize="11" fontWeight="bold">
                      Measurable Achievements &amp; Metrics (92%)
                    </text>
                    <rect x="480" y="215" width="530" height="8" rx="4" fill={isDark ? '#334155' : '#E2E8F0'} />
                    <rect x="480" y="215" width="487" height="8" rx="4" fill="#3B82F6" />

                    {/* Cat 3: Contact & Structure */}
                    <text x="480" y="245" fill={isDark ? '#94A3B8' : '#475569'} fontSize="11" fontWeight="bold">
                      Contact Details &amp; Section Completeness (100%)
                    </text>
                    <rect x="480" y="255" width="530" height="8" rx="4" fill={isDark ? '#334155' : '#E2E8F0'} />
                    <rect x="480" y="255" width="530" height="8" rx="4" fill="#10B981" />

                    {/* Cat 4: Date Consistency */}
                    <text x="480" y="285" fill={isDark ? '#94A3B8' : '#475569'} fontSize="11" fontWeight="bold">
                      Date Consistency &amp; Chronology (98%)
                    </text>
                    <rect x="480" y="295" width="530" height="8" rx="4" fill={isDark ? '#334155' : '#E2E8F0'} />
                    <rect x="480" y="295" width="519" height="8" rx="4" fill="#8B5CF6" />
                  </g>

                  {/* Matched Keywords Grid */}
                  <rect
                    x="450"
                    y="340"
                    width="590"
                    height="220"
                    rx="14"
                    fill={isDark ? '#1E293B' : '#FFFFFF'}
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="480"
                    y="375"
                    fill={isDark ? '#FFFFFF' : '#0F172A'}
                    fontSize="14"
                    fontWeight="bold"
                  >
                    Extracted Job Keywords Comparison
                  </text>
                  <text
                    x="480"
                    y="395"
                    fill={isDark ? '#94A3B8' : '#64748B'}
                    fontSize="11"
                  >
                    Green indicates high-frequency ATS match · Blue indicates suggested addition
                  </text>

                  {/* Pills */}
                  <g transform="translate(480, 415)">
                    <rect x="0" y="0" width="110" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="12" y="18" fill="#10B981" fontSize="11" fontWeight="bold">
                      ✓ React 19 (9x)
                    </text>

                    <rect x="120" y="0" width="130" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="132" y="18" fill="#10B981" fontSize="11" fontWeight="bold">
                      ✓ TypeScript (14x)
                    </text>

                    <rect x="260" y="0" width="130" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="272" y="18" fill="#10B981" fontSize="11" fontWeight="bold">
                      ✓ Cloud Infra (6x)
                    </text>

                    <rect x="400" y="0" width="115" height="28" rx="6" fill="#3B82F6" fillOpacity="0.15" />
                    <text x="412" y="18" fill="#3B82F6" fontSize="11" fontWeight="bold">
                      + Kubernetes
                    </text>
                  </g>

                  <g transform="translate(480, 455)">
                    <rect x="0" y="0" width="130" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="12" y="18" fill="#10B981" fontSize="11" fontWeight="bold">
                      ✓ Microservices (8x)
                    </text>

                    <rect x="140" y="0" width="125" height="28" rx="6" fill="#10B981" fillOpacity="0.15" />
                    <text x="152" y="18" fill="#10B981" fontSize="11" fontWeight="bold">
                      ✓ CI/CD Action (5x)
                    </text>

                    <rect x="275" y="0" width="120" height="28" rx="6" fill="#3B82F6" fillOpacity="0.15" />
                    <text x="287" y="18" fill="#3B82F6" fontSize="11" fontWeight="bold">
                      + Terraform
                    </text>
                  </g>
                </svg>
              )}

              {activeStage.id === 'prepare' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1100 600"
                  width="1100"
                  height="600"
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full h-auto drop-shadow-sm select-none"
                >
                  <defs>
                    <linearGradient id="prep-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? '#1E293B' : '#FFFFFF'} />
                      <stop offset="100%" stopColor={isDark ? '#0F172A' : '#F8FAFC'} />
                    </linearGradient>
                  </defs>

                  {/* Backdrop */}
                  <rect
                    width="1100"
                    height="600"
                    rx="16"
                    fill="url(#prep-grad-bg)"
                    stroke={isDark ? '#334155' : '#E2E8F0'}
                    strokeWidth="2"
                  />

                  {/* Top Bar */}
                  <rect
                    x="30"
                    y="30"
                    width="1040"
                    height="46"
                    rx="8"
                    fill={isDark ? '#0B1329' : '#EDE8DF'}
                  />
                  <circle cx="55" cy="53" r="6" fill="#3B82F6" />
                  <circle cx="75" cy="53" r="6" fill="#10B981" />
                  <circle cx="95" cy="53" r="6" fill="#8B5CF6" />
                  <text
                    x="120"
                    y="57"
                    fill={isDark ? '#94A3B8' : '#475569'}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ResumeBuilderAI 3.0 · Job Pipeline &amp; STAR Interview Simulator
                  </text>

                  {/* Left Column: Kanban Application Board (4 Columns) */}
                  <g>
                    {/* Stage 1: Saved */}
                    <rect x="60" y="100" width="140" height="460" rx="10" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="75" y="130" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="12" fontWeight="bold">
                      Saved (3)
                    </text>
                    <rect x="70" y="145" width="120" height="70" rx="8" fill={isDark ? '#1E293B' : '#FFFFFF'} stroke={isDark ? '#334155' : '#E2E8F0'} />
                    <text x="80" y="170" fill={isDark ? '#FFFFFF' : '#0F172A'} fontSize="11" fontWeight="bold">
                      Stripe
                    </text>
                    <text x="80" y="190" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="10">
                      Staff Engineer
                    </text>

                    {/* Stage 2: Applied */}
                    <rect x="215" y="100" width="140" height="460" rx="10" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="230" y="130" fill="#3B82F6" fontSize="12" fontWeight="bold">
                      Applied (5)
                    </text>
                    <rect x="225" y="145" width="120" height="70" rx="8" fill={isDark ? '#1E293B' : '#FFFFFF'} stroke="#3B82F6" />
                    <text x="235" y="170" fill={isDark ? '#FFFFFF' : '#0F172A'} fontSize="11" fontWeight="bold">
                      Vercel
                    </text>
                    <text x="235" y="190" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="10">
                      Lead Frontend
                    </text>

                    {/* Stage 3: Interviewing */}
                    <rect x="370" y="100" width="140" height="460" rx="10" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="385" y="130" fill="#F59E0B" fontSize="12" fontWeight="bold">
                      Interviewing (2)
                    </text>
                    <rect x="380" y="145" width="120" height="70" rx="8" fill={isDark ? '#1E293B' : '#FFFFFF'} stroke="#F59E0B" />
                    <text x="390" y="170" fill={isDark ? '#FFFFFF' : '#0F172A'} fontSize="11" fontWeight="bold">
                      Datadog
                    </text>
                    <text x="390" y="190" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="10">
                      Principal Arch
                    </text>

                    {/* Stage 4: Offer */}
                    <rect x="525" y="100" width="140" height="460" rx="10" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="540" y="130" fill="#10B981" fontSize="12" fontWeight="bold">
                      Offer (1)
                    </text>
                    <rect x="535" y="145" width="120" height="70" rx="8" fill={isDark ? '#1E293B' : '#FFFFFF'} stroke="#10B981" strokeWidth="2" />
                    <text x="545" y="170" fill="#10B981" fontSize="11" fontWeight="bold">
                      Figma
                    </text>
                    <text x="545" y="190" fill={isDark ? '#FFFFFF' : '#0F172A'} fontSize="10">
                      $210k + Equity
                    </text>
                  </g>

                  {/* Right Column: AI Interview Simulator Card */}
                  <g>
                    <rect
                      x="690"
                      y="100"
                      width="350"
                      height="460"
                      rx="14"
                      fill={isDark ? '#1E293B' : '#FFFFFF'}
                      stroke={isDark ? '#334155' : '#E2E8F0'}
                      strokeWidth="1.5"
                    />
                    <rect x="715" y="125" width="160" height="20" rx="4" fill="#8B5CF6" fillOpacity="0.15" />
                    <text x="725" y="139" fill="#8B5CF6" fontSize="11" fontWeight="bold">
                      ★ AI Interview Simulator
                    </text>

                    <text
                      x="715"
                      y="175"
                      fill={isDark ? '#FFFFFF' : '#0F172A'}
                      fontSize="14"
                      fontWeight="bold"
                    >
                      Target Question Rehearsal
                    </text>
                    <rect
                      x="715"
                      y="190"
                      width="300"
                      height="70"
                      rx="8"
                      fill={isDark ? '#0F172A' : '#F8FAFC'}
                    />
                    <text
                      x="725"
                      y="215"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                      fontSize="11"
                      fontWeight="600"
                    >
                      &quot;Tell me about a high-concurrency outage
                    </text>
                    <text
                      x="725"
                      y="235"
                      fill={isDark ? '#E2E8F0' : '#1E293B'}
                      fontSize="11"
                      fontWeight="600"
                    >
                      you resolved under production SLA.&quot;
                    </text>

                    {/* STAR Breakdown Pills */}
                    <text x="715" y="290" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="bold">
                      Recommended STAR Structure:
                    </text>

                    <rect x="715" y="305" width="300" height="38" rx="6" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="725" y="328" fill="#3B82F6" fontSize="11" fontWeight="bold">
                      S:
                    </text>
                    <text x="745" y="328" fill={isDark ? '#CBD5E1' : '#334155'} fontSize="10">
                      Black Friday traffic surge spiked latency 4x.
                    </text>

                    <rect x="715" y="350" width="300" height="38" rx="6" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="725" y="373" fill="#F59E0B" fontSize="11" fontWeight="bold">
                      T:
                    </text>
                    <text x="745" y="373" fill={isDark ? '#CBD5E1' : '#334155'} fontSize="10">
                      Restore p99 response times below 150ms in 20m.
                    </text>

                    <rect x="715" y="395" width="300" height="38" rx="6" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="725" y="418" fill="#10B981" fontSize="11" fontWeight="bold">
                      A:
                    </text>
                    <text x="745" y="418" fill={isDark ? '#CBD5E1' : '#334155'} fontSize="10">
                      Triggered Redis read replica autoscaling.
                    </text>

                    <rect x="715" y="440" width="300" height="38" rx="6" fill={isDark ? '#0F172A' : '#F1F5F9'} />
                    <text x="725" y="463" fill="#8B5CF6" fontSize="11" fontWeight="bold">
                      R:
                    </text>
                    <text x="745" y="463" fill={isDark ? '#CBD5E1' : '#334155'} fontSize="10">
                      Slashed p99 to 92ms; zero transactions dropped.
                    </text>

                    <rect x="715" y="495" width="300" height="34" rx="8" fill="#8B5CF6" />
                    <text x="800" y="517" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                      Record Voice Rehearsal
                    </text>
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
