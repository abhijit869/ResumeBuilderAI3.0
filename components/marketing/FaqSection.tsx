'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  isDark?: boolean;
}

export function FaqSection({ isDark }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ResumeBuilderAI prevent AI hallucinations and false facts?',
      a: 'We use strict delimiter grounding (<untrusted_data>) and system constraints on our server-side Gemini integration. The AI is engineered to only upgrade vocabulary, grammar, and active phrasing from your verified inputs. If a metric or timeframe is missing, it asks you a clarifying question rather than inventing numbers.',
    },
    {
      q: 'Are these resume templates genuinely ATS-friendly?',
      a: 'Yes. All 18 templates are programmatic, code-rendered HTML/CSS layouts that compile to selectable text with zero nested canvas rasterization or inaccessible graphics. We benchmark them against leading applicant tracking systems (Workday, Greenhouse, Lever, Taleo) to guarantee clean character-stream parsing.',
    },
    {
      q: 'How does LinkedIn import work without asking for my password?',
      a: 'ResumeBuilderAI does not scrape or store LinkedIn credentials. You simply upload your official LinkedIn profile archive or export PDF, or paste your profile export. Our parser extracts experience, degrees, skills, and languages into an editable pre-flight confirmation screen.',
    },
    {
      q: 'Can I export my resume to selectable PDF and Microsoft Word (DOCX)?',
      a: 'Yes. You can export selectable vector PDFs that adhere to ISO PDF 1.4 standards, as well as Microsoft Word (.docx) HTML packages, plain text, and complete JSON backups for permanent offline preservation.',
    },
    {
      q: 'How does the Cover Letter generator match my resume?',
      a: 'Every cover letter is paired with your chosen resume template family. It automatically inherits the identical typography, header geometry, accent colors, and contact layout, ensuring a unified visual presentation.',
    },
    {
      q: 'Is my personal information and resume data secure?',
      a: 'Absolutely. We enforce Firebase Authentication and strict Cloud Firestore security rules with per-user document isolation (request.auth.uid == userId). Passwords use salted PBKDF2-SHA256 digests. We never sell or share candidate data with third-party advertisers.',
    },
    {
      q: 'Does ResumeBuilderAI support international formats (A4 vs US Letter)?',
      a: 'Yes. You can toggle between A4 (210 × 297 mm, standard in Europe, UK, Asia, and Latin America) and US Letter (8.5 × 11 in, standard in the United States and Canada) with automatic page-break recomputation.',
    },
    {
      q: 'Is ResumeBuilderAI 3.0 really 100% free with no hidden paywalls?',
      a: 'Yes. ResumeBuilderAI 3.0 is a 100% free career studio. You have full access to all 18 ATS-compliant templates, unlimited resumes, cover letters, personal portfolio publishing, and AI writing tools with zero subscriptions, paywalls, or credit card requirements.',
    },
  ];

  return (
    <section
      id="faq-section"
      className={`py-16 px-4 sm:px-8 max-w-4xl mx-auto rounded-3xl border transition-colors my-12 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF5A4E]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2
          className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
          style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
        >
          Everything you need to know about ResumeBuilderAI 3.0.
        </h2>
        <p
          className="text-xs sm:text-sm max-w-xl mx-auto"
          style={{ color: isDark ? '#94A3B8' : '#475569' }}
        >
          Frequently asked questions about our 100% free AI career studio, ATS algorithms, and security guarantees.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDark
                  ? isOpen
                    ? 'border-[#FF5A4E]/40 bg-slate-800/90'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70'
                  : isOpen
                  ? 'border-[#FF5A4E]/30 bg-slate-50/90 shadow-xs'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base focus:outline-none"
                style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#FF5A4E]' : 'text-slate-400'
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700/60"
                  style={{ color: isDark ? '#CBD5E1' : '#334155' }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
