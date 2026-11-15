'use client';

import React from 'react';
import { FileUp, ShieldCheck, Check, ArrowRight, Lock, Eye, AlertCircle } from 'lucide-react';

interface LinkedInWorkflowSectionProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function LinkedInWorkflowSection({ isDark, onCtaClick }: LinkedInWorkflowSectionProps) {
  const steps = [
    {
      step: '01',
      title: 'Upload Official Export or Paste Text',
      desc: 'Download your official LinkedIn profile archive or export PDF and drop it into ResumeBuilderAI. We never ask for your account password or session cookies.',
      badge: 'Zero Scraping Risk',
    },
    {
      step: '02',
      title: 'Review Structured Provenance & Confidence',
      desc: 'Our parser extracts your employment chronology, education, skills, and certifications into an editable pre-flight screen. Uncertain fields are clearly flagged.',
      badge: '100% Transparent Review',
    },
    {
      step: '03',
      title: 'Synchronize Across 18 ATS Templates',
      desc: 'Your factual career history instantly populates all 18 code-rendered templates with zero loss of company tenure, degree details, or bullet metrics.',
      badge: 'Multi-Template Synthesis',
    },
  ];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0077B5]/10 border border-[#0077B5]/20 text-[#0077B5] text-xs font-mono font-semibold mb-3">
          <FileUp className="w-3.5 h-3.5" />
          <span>Authorized LinkedIn &amp; Document Ingestion</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Turn your LinkedIn profile into a recruiter-ready resume in seconds.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          No tedious manual copy-pasting. Seamlessly import your verified career history while maintaining total ownership and data privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.map((st) => (
          <div
            key={st.step}
            className={`p-6 sm:p-7 rounded-3xl border shadow-2xs flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-extrabold text-[#0077B5]">{st.step}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {st.badge}
                </span>
              </div>
              <h3 className={`font-bold text-base sm:text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {st.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {st.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-[#0077B5]">
              <Check className="w-4 h-4" />
              <span>Verified Data Integrity</span>
            </div>
          </div>
        ))}
      </div>

      {/* Security Statement Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#0077B5] shrink-0" />
          <span>
            <strong>Zero Password Storage:</strong> ResumeBuilderAI complies with LinkedIn Terms of Service. We never use credential interceptors or scraping bots.
          </span>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          className="px-4 py-2 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-semibold text-xs transition whitespace-nowrap shrink-0 shadow-2xs"
        >
          Try LinkedIn Import Now
        </button>
      </div>
    </section>
  );
}
