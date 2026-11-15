'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  FileText,
  Plus,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface DashboardHeaderProps {
  user: { name: string; email: string; plan: string };
  uiTheme: 'light' | 'dark';
  onToggleUiTheme: () => void;
  resumes: ResumeDocument[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateResume: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  onBackToLanding: () => void;
}

export function DashboardHeader({
  user,
  uiTheme,
  onToggleUiTheme,
  resumes,
  activeResumeId,
  onSelectResume,
  onCreateResume,
  onOpenSettings,
  onSignOut,
  onBackToLanding,
}: DashboardHeaderProps) {
  const isDark = uiTheme === 'dark';
  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const docDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        docDropdownRef.current &&
        !docDropdownRef.current.contains(event.target as Node)
      ) {
        setDocDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-slate-800'
          : 'bg-white/90 border-slate-200/80'
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-2.5 group focus:outline-none"
            title="Return to ResumeBuilderAi 3.0 Home"
          >
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 group-hover:scale-105 transition-transform bg-white">
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt="ResumeBuilderAi 3.0 Logo"
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                <span>ResumeBuilderAi</span>
                <span className="text-[#FF5A4E]">3.0</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                Career Studio
              </div>
            </div>
          </button>

          <span className="hidden md:inline text-slate-300 dark:text-slate-700">/</span>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Workspace Cloud</span>
          </div>
        </div>

        {/* Center: Contextual Active Document Selector */}
        <div className="relative hidden sm:block" ref={docDropdownRef}>
          <button
            type="button"
            onClick={() => setDocDropdownOpen(!docDropdownOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition max-w-xs ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#FF5A4E]" />
            <span className="truncate max-w-[160px]">
              {activeResume?.title || 'Active Resume'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
              ATS {activeResume?.atsScore || 85}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Document Switching Dropdown */}
          {docDropdownOpen && (
            <div
              className={`absolute left-0 mt-2 w-72 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold px-2.5 py-1">
                Switch Active Document ({resumes.length})
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {resumes.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      onSelectResume(doc.id);
                      setDocDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition ${
                      doc.id === activeResumeId
                        ? 'bg-[#FF5A4E]/10 text-[#FF5A4E] font-bold'
                        : isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{doc.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {doc.templateId} · {doc.updatedAt}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">
                      {doc.atsScore}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onCreateResume();
                    setDocDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#FF5A4E] hover:bg-[#FF5A4E]/10 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Resume</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions, Theme, and Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* New Resume Quick CTA */}
          <button
            type="button"
            onClick={onCreateResume}
            className="px-3 py-1.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Resume</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleUiTheme}
            aria-label="Toggle visual theme"
            className={`p-2 rounded-xl border transition ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`p-1.5 pr-2.5 rounded-xl border flex items-center gap-2 transition ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5A4E] to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Dropdown Box */}
            {profileDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {user.email}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-mono font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Free Community Access</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                      isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account & Security</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBackToLanding();
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                      isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Landing Page</span>
                  </button>

                  <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
