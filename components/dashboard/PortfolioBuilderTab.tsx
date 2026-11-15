'use client';

import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Sparkles,
  Link2,
  Github,
  Linkedin,
  Twitter,
  Layout,
  Share2,
  Smartphone,
  Monitor,
  Video,
  ShieldCheck,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface PortfolioBuilderTabProps {
  activeResume: ResumeDocument;
  isDark?: boolean;
}

export type PortfolioStyleId =
  | 'minimal-dev'
  | 'executive'
  | 'creative'
  | 'tech-engineer'
  | 'student'
  | 'academic'
  | 'designer'
  | 'consultant';

const PORTFOLIO_STYLES: Array<{ id: PortfolioStyleId; name: string; tag: string; description: string }> = [
  { id: 'minimal-dev', name: 'Minimal Developer', tag: 'Monochrome', description: 'Clean single-column layout prioritizing GitHub repos and terminal aesthetics.' },
  { id: 'executive', name: 'Professional Executive', tag: 'Editorial', description: 'Warm editorial typography with strategic achievements and board experience.' },
  { id: 'creative', name: 'Creative Studio', tag: 'Vibrant', description: 'Bold color accents, project visual cards, and animated showcase.' },
  { id: 'tech-engineer', name: 'Technical Engineer', tag: 'Systems', description: 'System architecture highlights, metrics gauges, and tech taxonomy.' },
  { id: 'student', name: 'Student & Co-Op', tag: 'Campus', description: 'Academic honors, coursework, hackathons, and internship milestones.' },
  { id: 'academic', name: 'Academic Profile', tag: 'Research', description: 'Peer-reviewed publications, teaching fellowships, and citations.' },
  { id: 'designer', name: 'Designer Portfolio', tag: 'Visual', description: 'High-contrast galleries, visual case studies, and Figma prototypes.' },
  { id: 'consultant', name: 'Freelance Consultant', tag: 'Client-Ready', description: 'Service offerings, client logos, case studies, and Calendly booking.' },
];

export function PortfolioBuilderTab({ activeResume, isDark }: PortfolioBuilderTabProps) {
  const [isPublished, setIsPublished] = useState(true);
  const [slug, setSlug] = useState(
    activeResume.personalInfo.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') || 'alex-rivera'
  );
  const [selectedStyle, setSelectedStyle] = useState<PortfolioStyleId>('executive');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  // Video elevator pitch state
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [includeVideo, setIncludeVideo] = useState(true);

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${slug}` : `https://resumebuilderai.com/p/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Personal Web Portfolio Builder</span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Personal Website & Web Presence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Generate an instant, responsive personal website directly from your resume data. 8 original design styles with live public publishing controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      {/* Main Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Style Picker & Configuration */}
        <div className="lg:col-span-6 space-y-6">
          {/* Publishing & Slug Card */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Publishing Status
                </div>
                <div className="text-[11px] text-slate-500">
                  {isPublished ? 'Publicly accessible on the web' : 'Draft mode (private)'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublished ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Custom Public URL Slug
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500">
                  /p/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  }
                  className={`flex-1 px-3 py-2 rounded-r-xl border text-xs font-mono focus:outline-none focus:border-[#FF5A4E] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 8 Original Website Styles Picker */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-serif text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Choose Website Style (8 Styles)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                100% Mobile Responsive
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PORTFOLIO_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    selectedStyle === style.id
                      ? 'border-[#FF5A4E] ring-2 ring-[#FF5A4E]/20 bg-[#FF5A4E]/5'
                      : isDark
                      ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        selectedStyle === style.id ? 'text-[#FF5A4E]' : isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {style.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                      {style.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Video Elevator Pitch Settings */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <h3
                  className={`font-serif text-base font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  60-Second Video Introduction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIncludeVideo(!includeVideo)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  includeVideo ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    includeVideo ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {includeVideo && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Video Share URL (YouTube, Loom, Vimeo, MP4)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                    }`}
                  />
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 leading-relaxed">
                  * Note: For PDF exports, video items are represented by a high-resolution poster frame and a verifiable QR code to prevent broken media embedding.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mockup Simulator (Desktop vs Mobile Toggle) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Interactive Preview Simulator
            </span>
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                aria-label="Desktop preview"
                className={`p-1.5 rounded-lg transition ${
                  previewDevice === 'desktop' ? 'bg-[#FF5A4E] text-white' : 'text-slate-400'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                aria-label="Mobile preview"
                className={`p-1.5 rounded-lg transition ${
                  previewDevice === 'mobile' ? 'bg-[#FF5A4E] text-white' : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simulator Container */}
          <div
            className={`rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 mx-auto ${
              previewDevice === 'mobile' ? 'max-w-xs' : 'max-w-full'
            } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            {/* Top Browser URL Bar */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 text-center font-mono text-[10px] text-slate-400 truncate">
                resumebuilderai.com/p/{slug}
              </div>
            </div>

            {/* Simulated Page Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-mono font-bold">
                  ● Available for Hire
                </div>
                <h2
                  className={`font-serif text-2xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {activeResume.personalInfo.fullName}
                </h2>
                <div className="text-xs font-semibold text-[#FF5A4E]">
                  {activeResume.personalInfo.jobTitle}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activeResume.personalInfo.summary}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="pt-2">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
                  Skills Taxonomy
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeResume.skills.slice(0, 6).map((sk, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Highlights */}
              <div className="pt-2">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">
                  Experience
                </div>
                <div className="space-y-2">
                  {activeResume.experience.slice(0, 2).map((exp, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {exp.role} · {exp.company}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{exp.period}</div>
                    </div>
                  ))}
                </div>
              </div>

              {includeVideo && (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#FF5A4E]" />
                    <span className="font-semibold">60-Sec Intro Video</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Embed Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
