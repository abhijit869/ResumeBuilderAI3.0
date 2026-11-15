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
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface PortfoliosTabProps {
  activeResume: ResumeDocument;
  isDark?: boolean;
}

export function PortfoliosTab({ activeResume, isDark }: PortfoliosTabProps) {
  const [isPublished, setIsPublished] = useState(true);
  const [slug, setSlug] = useState(
    activeResume.personalInfo.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-') || 'alex-rivera'
  );
  const [theme, setTheme] = useState<'editorial' | 'dark-tech' | 'minimal' | 'coral'>('editorial');
  const [headline, setHeadline] = useState(
    activeResume.personalInfo.jobTitle || 'Staff Full-Stack & AI Systems Architect'
  );
  const [bio, setBio] = useState(
    activeResume.personalInfo.summary ||
      'Staff Software Architect specializing in Next.js, distributed microservices, and LLM automation.'
  );

  // Social Links
  const [githubUrl, setGithubUrl] = useState('https://github.com');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in');
  const [twitterUrl, setTwitterUrl] = useState('https://x.com');

  const [copied, setCopied] = useState(false);

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
        className={`p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            ResumeBuilderAi 3.0 · Web Studio
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Personal Portfolio Website
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish an instant, professional personal web portfolio derived directly from your resume data.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration Settings */}
        <div className="lg:col-span-7 space-y-6">
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
              Public Domain & Publishing Status
            </h3>

            {/* Publishing Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  Publish to Public Web
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  When enabled, your portfolio is accessible via public URL.
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

            {/* Slug input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Custom Public Slug (/p/[slug])
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500">
                  resumebuilderai.com/p/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  }
                  className={`flex-1 px-3.5 py-2.5 rounded-r-xl border text-xs font-mono focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Portfolio Theme Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'editorial', label: 'Editorial Warm', color: 'bg-[#FAF8F5] border-amber-300' },
                  { id: 'dark-tech', label: 'Dark Tech', color: 'bg-slate-950 border-cyan-500' },
                  { id: 'minimal', label: 'Minimal Clean', color: 'bg-white border-slate-300' },
                  { id: 'coral', label: 'Coral Modern', color: 'bg-rose-50 border-[#FF5A4E]' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      theme === t.id
                        ? 'ring-2 ring-[#FF5A4E] border-[#FF5A4E]'
                        : 'hover:border-slate-300 dark:hover:border-slate-700'
                    } ${t.color}`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Headline and Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Personal Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-500">Social & Code Profiles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="GitHub URL"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
                <div className="relative">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="LinkedIn URL"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
                <div className="relative">
                  <Twitter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="Twitter / X"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview */}
        <div className="lg:col-span-5">
          <div
            className={`rounded-3xl border shadow-lg overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Browser Header Bar */}
            <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs block mx-auto">
                  https://resumebuilderai.com/p/{slug}
                </span>
              </div>
            </div>

            {/* Mock Site Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF5A4E]/10 text-[#FF5A4E] text-[10px] font-mono font-bold">
                  Available for Senior & Staff Roles
                </div>
                <h2
                  className={`font-serif text-2xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {activeResume.personalInfo.fullName}
                </h2>
                <div className="text-xs font-semibold text-[#FF5A4E]">{headline}</div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">{bio}</p>
              </div>

              {/* Skills badges */}
              <div className="pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Core Technologies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeResume.skills.slice(0, 8).map((skill, i) => (
                    <span
                      key={skill.id || i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience Snippet */}
              <div className="pt-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Featured Experience
                </div>
                <div className="space-y-3">
                  {activeResume.experience.slice(0, 2).map((exp, i) => (
                    <div
                      key={exp.id || i}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {exp.role} · {exp.company}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {exp.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
