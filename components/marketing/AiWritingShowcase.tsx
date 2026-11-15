'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

interface AiWritingShowcaseProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function AiWritingShowcase({ isDark, onCtaClick }: AiWritingShowcaseProps) {
  const [selectedTone, setSelectedTone] = useState<'executive' | 'technical' | 'impact'>('impact');

  const bulletExamples = {
    impact: {
      original: 'Responsible for leading software team and improving web performance.',
      rewritten:
        'Spearheaded an engineering squad of 8 across 3 quarters, optimizing Core Web Vitals to slash page latency by 42% and elevate conversion by 14%.',
      verb: 'Spearheaded',
      highlight: '42% latency reduction · 14% conversion uplift',
    },
    technical: {
      original: 'Worked on database queries and fixed some cloud deployment bugs.',
      rewritten:
        'Architected PostgreSQL connection pooling and containerized microservices via Docker/Kubernetes, achieving 99.98% service uptime under peak loads.',
      verb: 'Architected',
      highlight: 'PostgreSQL pooling · 99.98% uptime SLA',
    },
    executive: {
      original: 'Helped plan the product roadmap and talked to enterprise clients.',
      rewritten:
        'Steered multi-year enterprise product roadmap across 14 enterprise stakeholders, driving $1.8M ARR expansion and 28% renewal velocity.',
      verb: 'Steered',
      highlight: '$1.8M ARR expansion · 28% renewal velocity',
    },
  };

  const active = bulletExamples[selectedTone];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A4E]/10 border border-[#FF5A4E]/20 text-[#FF5A4E] text-xs font-mono font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grounded Gemini AI Writing Studio</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Upgrade passive bullet points into high-impact accomplishments.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Unlike generic chatbots that hallucinate false statistics, ResumeBuilderAI strictly preserves your true metrics while elevating action verbs, clarity, and industry tone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Controls & Tone Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Select Tone Framing
          </div>
          <div className="space-y-2.5">
            {[
              { id: 'impact', label: 'Impact & Results', desc: 'Active verbs, quantifiable outcomes, concise delivery' },
              { id: 'technical', label: 'Technical & Engineering', desc: 'Architecture, technical stack, systems scalability' },
              { id: 'executive', label: 'Executive & Strategic', desc: 'Leadership, revenue velocity, organizational steering' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id as any)}
                className={`w-full p-4 rounded-2xl text-left border transition ${
                  selectedTone === t.id
                    ? 'border-[#FF5A4E] bg-[#FF5A4E]/5 shadow-xs'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{t.label}</span>
                  {selectedTone === t.id && <Check className="w-4 h-4 text-[#FF5A4E]" />}
                </div>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>Test AI Rewriter in Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Interactive Before & After Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">Live AI Transformation</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                Factuality Guaranteed
              </span>
            </div>

            {/* Before */}
            <div className="space-y-1.5 mb-5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Original Passive Draft (Before)</span>
              </div>
              <div className={`p-3.5 rounded-xl border text-xs sm:text-sm line-through opacity-70 ${isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                {active.original}
              </div>
            </div>

            {/* After */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Grounded AI Revision ({selectedTone.toUpperCase()} TONE)</span>
              </div>
              <div className="p-4 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-white font-medium">
                <span className="font-extrabold text-[#FF5A4E]">{active.verb} </span>
                {active.rewritten.replace(active.verb + ' ', '')}
              </div>
            </div>

            {/* Key Enhancements Pill */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">Extracted Metric Anchor:</span>
              <span className="font-mono font-semibold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                {active.highlight}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
