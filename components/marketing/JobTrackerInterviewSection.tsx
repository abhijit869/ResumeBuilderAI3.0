'use client';

import React, { useState } from 'react';
import { Compass, Briefcase, MessageSquare, Check, Sparkles, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

interface JobTrackerInterviewSectionProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function JobTrackerInterviewSection({ isDark, onCtaClick }: JobTrackerInterviewSectionProps) {
  const [activeTab, setActiveTab] = useState<'tracker' | 'interview'>('tracker');

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-mono font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Complete Career Lifecycle Suite</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Track every application and ace your interviews.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          A resume is only the first step. Organize your job search from application to offer letter, and prepare for behavioral STAR questions generated directly from your resume history.
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'tracker'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Job Application Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'interview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            AI Interview Preparation (STAR)
          </button>
        </div>
      </div>

      {activeTab === 'tracker' ? (
        /* Visual Kanban Pipeline */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: Wishlist */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Wishlist (2)</span>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
              <div className="space-y-2.5">
                <div className={`p-3 rounded-xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold text-xs">Anthropic</div>
                  <div className="text-[11px] text-slate-500">Systems Reliability Engineer</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">$210k - $260k · Remote</div>
                </div>
                <div className={`p-3 rounded-xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold text-xs">OpenAI</div>
                  <div className="text-[11px] text-slate-500">Inference Runtime Lead</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">$240k - $310k · SF</div>
                </div>
              </div>
            </div>

            {/* Column 2: Applied */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-sky-600">Applied (3)</span>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </div>
              <div className="space-y-2.5">
                <div className={`p-3 rounded-xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold text-xs">Datadog</div>
                  <div className="text-[11px] text-slate-500">Staff Distributed Systems</div>
                  <div className="mt-2 text-[10px] font-mono text-sky-600">Applied with Tailored Resume</div>
                </div>
                <div className={`p-3 rounded-xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold text-xs">Snowflake</div>
                  <div className="text-[11px] text-slate-500">Cloud Storage Architect</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">Application submitted 2d ago</div>
                </div>
              </div>
            </div>

            {/* Column 3: Interviewing */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-600">Interviewing (2)</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <div className="space-y-2.5">
                <div className={`p-3 rounded-xl border-2 border-amber-500/50 shadow-xs ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="font-bold text-xs text-amber-600">Stripe</div>
                  <div className="text-[11px] text-slate-500">Staff Platform Engineer</div>
                  <div className="mt-2 text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>System Design Round: Nov 18</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl border shadow-2xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="font-bold text-xs">Cloudflare</div>
                  <div className="text-[11px] text-slate-500">Core Edge Architect</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">Technical screen passed</div>
                </div>
              </div>
            </div>

            {/* Column 4: Offers */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-600">Offers (1)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 shadow-sm">
                  <div className="font-extrabold text-xs text-emerald-800 dark:text-emerald-300">Google Cloud</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">L6 Staff Infrastructure</div>
                  <div className="mt-2 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    $385k Total Comp · Decision Pending
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI Interview Preparation Preview */
        <div className="max-w-4xl mx-auto space-y-4">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF5A4E]" />
                <span className="font-bold text-sm">Behavioral Question Generated for Staff Engineer</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                STAR Framework
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              &ldquo;Tell me about a high-severity production outage where you disagreed with another principal engineer on root cause. How did you resolve the deadlock under customer SLA pressure?&rdquo;
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <div className="font-bold text-slate-500 uppercase text-[10px] mb-1">Situation &amp; Task</div>
                <p className="text-slate-700 dark:text-slate-300">During a 30% traffic surge on CloudGrid, memory leaks degraded API response times by 3.2x with $80k/hr downtime SLA exposure.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <div className="font-bold text-slate-500 uppercase text-[10px] mb-1">Action &amp; Result</div>
                <p className="text-slate-700 dark:text-slate-300">Set up reproducible canary profiling in staging, isolated connection pool saturation, rolled out a patched mutex in 45 minutes, saving the SLA.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <button
          type="button"
          onClick={onCtaClick}
          className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition"
        >
          <span>Open Full Career Hub in Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
