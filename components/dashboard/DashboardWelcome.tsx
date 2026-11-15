'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PenTool,
  Plus,
  MoreHorizontal,
  FileUp,
  ShieldCheck,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface DashboardWelcomeProps {
  userName: string;
  activeResume: ResumeDocument;
  onOpenEditor: () => void;
  onCreateResume: () => void;
  onOpenLinkedInImport: () => void;
  onOpenAtsChecker: () => void;
  onDownloadPdf: () => void;
  isDark?: boolean;
}

export function DashboardWelcome({
  userName,
  activeResume,
  onOpenEditor,
  onCreateResume,
  onOpenLinkedInImport,
  onOpenAtsChecker,
  onDownloadPdf,
  isDark,
}: DashboardWelcomeProps) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = userName.split(' ')[0] || 'there';

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border shadow-xs relative overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Area: Welcome & Status */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>AI Career Studio Active</span>
          </div>

          <h1
            className={`font-serif text-2xl sm:text-4xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Welcome back, {firstName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Active document:{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeResume.title}
            </span>{' '}
            ({activeResume.templateId}) · ATS Score:{' '}
            <span className="font-mono font-bold text-emerald-600">
              {activeResume.atsScore || 85}/100
            </span>
          </p>
        </div>

        {/* Right Area: Structured Button Hierarchy */}
        <div className="flex items-center gap-2.5 self-start lg:self-center">
          {/* 1. Primary Dominant Action */}
          <button
            type="button"
            onClick={onOpenEditor}
            className="px-5 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-2xs transition"
          >
            <PenTool className="w-4 h-4" />
            <span>Continue Editing</span>
          </button>

          {/* 2. Secondary Action */}
          <button
            type="button"
            onClick={onCreateResume}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </button>

          {/* 3. Compact More Menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              aria-label="More actions"
              className={`p-2.5 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {moreMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onOpenLinkedInImport();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileUp className="w-3.5 h-3.5 text-[#0077B5]" />
                  <span>Import LinkedIn / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onOpenAtsChecker();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ATS Match Check</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onDownloadPdf();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5A4E]" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
