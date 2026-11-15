'use client';

import React, { useState } from 'react';
import { Wand2, Target, ArrowRight, Check, Sparkles, Layers } from 'lucide-react';

interface TailoringDemoSectionProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function TailoringDemoSection({ isDark, onCtaClick }: TailoringDemoSectionProps) {
  const [selectedMnc, setSelectedMnc] = useState<'google' | 'amazon' | 'stripe'>('google');

  const targets = {
    google: {
      company: 'Google Cloud Engine',
      role: 'Staff Infrastructure Architect',
      requiredKeywords: ['High Availability', 'Kubernetes', 'SLO/SLA Monitoring', 'Golang'],
      tailoredSummary:
        'Staff Infrastructure Architect with 8+ years designing fault-tolerant, high-concurrency cloud systems. Engineered distributed Kubernetes clusters maintaining 99.99% SLO across 12 global regions.',
      tailoredBullet:
        'Architected multi-tenant Kubernetes platform serving 12M daily queries, improving pod scheduling latency by 35% through custom Go controllers.',
    },
    amazon: {
      company: 'Amazon Web Services',
      role: 'Principal Solutions Architect',
      requiredKeywords: ['Customer Obsession', 'High-Scale Distributed DB', 'Cost Optimization', 'AWS CDK'],
      tailoredSummary:
        'Customer-obsessed Principal Solutions Architect who has guided 25+ Fortune 500 migrations to cloud-native microservices. Delivered $3.4M in annual compute savings through DynamoDB auto-scaling.',
      tailoredBullet:
        'Led cloud modernization initiative for tier-1 retail client, optimizing DynamoDB provisioning to slash operating costs by $3.4M annually while handling 40,000 TPS.',
    },
    stripe: {
      company: 'Stripe Payments',
      role: 'Staff Product Software Engineer',
      requiredKeywords: ['Financial Ledger Reliability', 'Idempotency', 'API Ergonomics', 'PostgreSQL'],
      tailoredSummary:
        'Staff Product Software Engineer specialized in mission-critical financial ledgers, idempotency controls, and developer-first API design. Scaled transaction processing pipelines handling $2.2B in annualized volume.',
      tailoredBullet:
        'Built idempotent payment webhooks and asynchronous retry pipelines, eliminating 99.9% of duplicate ledger writes and safeguarding $2.2B in transaction flow.',
    },
  };

  const active = targets[selectedMnc];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-mono font-semibold mb-3">
          <Target className="w-3.5 h-3.5" />
          <span>Job-Specific Resume Tailoring</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Tailor your experience for top employers in one click.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Never submit a generic one-size-fits-all resume. ResumeBuilderAI analyzes the specific keywords and leadership principles of your target role to reposition your verified career accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left MNC Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Choose Target Company Profile
          </div>
          {[
            { id: 'google', name: 'Google Cloud', role: 'Staff Infrastructure Architect' },
            { id: 'amazon', name: 'Amazon (AWS)', role: 'Principal Solutions Architect' },
            { id: 'stripe', name: 'Stripe', role: 'Staff Product Software Engineer' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedMnc(c.id as any)}
              className={`w-full p-4 rounded-2xl text-left border transition ${
                selectedMnc === c.id
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-xs'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="font-bold text-sm">{c.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.role}</div>
            </button>
          ))}

          <div className="pt-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Wand2 className="w-4 h-4 text-indigo-200" />
              <span>Tailor My Resume for a Custom Opening</span>
            </button>
          </div>
        </div>

        {/* Right Dynamic Match Card (8 cols) */}
        <div className="lg:col-span-8">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase">
                  Target Opening
                </span>
                <h3 className="font-extrabold text-xl text-slate-950 dark:text-white">
                  {active.role} · {active.company}
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-700 font-semibold">
                Instant Keyword Re-indexing
              </span>
            </div>

            {/* Target Keywords Matched */}
            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Priority Competencies Targeted:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.requiredKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800/60"
                  >
                    ★ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Tailored Summary */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                Tailored Executive Summary
              </div>
              <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {active.tailoredSummary}
              </p>
            </div>

            {/* Tailored Bullet */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                Tailored Experience Bullet (Impact Highlight)
              </div>
              <p className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs sm:text-sm leading-relaxed text-emerald-950 dark:text-emerald-200 font-medium">
                • {active.tailoredBullet}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
