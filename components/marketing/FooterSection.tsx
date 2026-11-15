'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Heart, Github, Linkedin, Twitter } from 'lucide-react';

interface FooterSectionProps {
  isDark?: boolean;
  onNavigateTab?: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export function FooterSection({ isDark, onNavigateTab, onOpenAuth }: FooterSectionProps) {
  return (
    <footer className={`border-t transition-colors ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Identity (Strictly preserved name & logo) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt="ResumeBuilderAi Logo"
                width={36}
                height={36}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200/70 shrink-0"
              />
              <span className="font-extrabold text-lg tracking-tight text-slate-950 dark:text-white">
                ResumeBuilderAi <span className="text-[#FF5A4E]">3.0</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              The complete AI Career Studio. Build recruiter-ready, ATS-compliant resumes, synchronized cover letters, and live portfolio websites with grounded Gemini AI intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Grade Security &amp; Data Privacy</span>
            </div>
          </div>

          {/* Col 2: Studio Products */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Core Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('editor')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  AI Resume Builder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('cover-letters')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  Cover Letter Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('ats-checker')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  ATS Readiness Checker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('templates')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  18 ATS Templates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('career-map')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  Job Tracker &amp; Pipeline
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Career Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Career Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('career-map')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  Interview Prep (STAR)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('ats-checker')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  Job Description Tailoring
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('rea-blueprint')}
                  className="hover:text-[#FF5A4E] transition text-left"
                >
                  REA &amp; System Insights
                </button>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="hover:text-[#FF5A4E] transition text-left block"
                >
                  100% Free Access
                </a>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="hover:text-[#FF5A4E] transition text-left block"
                >
                  Product FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Strict Data Privacy</span>
              </li>
              <li>
                <span className="text-slate-400">Zero Unverified Scraping</span>
              </li>
              <li>
                <span className="text-slate-400">SOC-2 &amp; OWASP Hardened</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">Cookie &amp; Security Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © 2026 <strong>ResumeBuilderAi 3.0</strong>. All rights reserved. Built with precision for top career candidates worldwide.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-[#FF5A4E] transition cursor-pointer">Security Protocol v3.0</span>
            <span>·</span>
            <span className="hover:text-[#FF5A4E] transition cursor-pointer">Status: Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
