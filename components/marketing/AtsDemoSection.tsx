'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, FileCheck, Layers } from 'lucide-react';

interface AtsDemoSectionProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function AtsDemoSection({ isDark, onCtaClick }: AtsDemoSectionProps) {
  const [selectedJd, setSelectedJd] = useState<'senior-swe' | 'product-mgr' | 'data-eng'>('senior-swe');

  const scenarios = {
    'senior-swe': {
      title: 'Senior Distributed Systems Engineer (Tier-1 Cloud Provider)',
      score: 94,
      density: '88%',
      consistency: '100%',
      keywordsFound: ['Kubernetes', 'Go', 'gRPC', 'Distributed Tracing', 'CI/CD Pipelines', 'Kafka'],
      keywordsMissing: ['Terraform Cloud', 'Prometheus AlertManager'],
      tip: 'Adding 1 bullet detailing your Terraform automation will raise match density to 98%.',
    },
    'product-mgr': {
      title: 'Lead Technical Product Manager (FinTech Core Banking)',
      score: 91,
      density: '84%',
      consistency: '96%',
      keywordsFound: ['B2B SaaS', 'PLG Flywheel', 'Revenue Recognition', 'API Integrations', 'Roadmap'],
      keywordsMissing: ['SOC-2 Compliance', 'SQL Querying'],
      tip: 'Highlighting regulatory compliance or audit experience will solidify your candidacy.',
    },
    'data-eng': {
      title: 'Lead Data Infrastructure Engineer (Streaming Platform)',
      score: 89,
      density: '82%',
      consistency: '95%',
      keywordsFound: ['Apache Spark', 'Snowflake', 'Python', 'ETL/ELT', 'Data Warehousing'],
      keywordsMissing: ['Apache Flink', 'dbt Core'],
      tip: 'Add dbt testing workflows in your latest project bullets for an immediate boost.',
    },
  };

  const active = scenarios[selectedJd];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Explainable Heuristic ATS Engine</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Know your ATS match rate before hitting apply.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Over 75% of resumes are filtered out by automated Application Tracking Systems due to parsing glitches, weak keywords, or missing dates. Our heuristic engine tests your document against standard ATS parsers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Scenario Switcher & Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Target Job Description Role
          </div>
          <div className="space-y-2.5">
            {[
              { id: 'senior-swe', label: 'Senior Distributed Systems Engineer', tag: 'High Match (94%)' },
              { id: 'product-mgr', label: 'Lead Technical Product Manager', tag: 'Strong Match (91%)' },
              { id: 'data-eng', label: 'Lead Data Infrastructure Engineer', tag: 'Good Match (89%)' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedJd(s.id as any)}
                className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between ${
                  selectedJd === s.id
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm">{s.label}</div>
                  <div className="text-[11px] font-mono text-emerald-600 font-medium mt-0.5">{s.tag}</div>
                </div>
                {selectedJd === s.id && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Audit Your Resume Against Any Job URL</span>
            </button>
          </div>
        </div>

        {/* Right Live Gauge & Diagnostic Report Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
            {/* Header Score Gauge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Heuristic Readiness Score
                </span>
                <h3 className="font-extrabold text-3xl sm:text-4xl text-slate-950 dark:text-white tabular-nums mt-1">
                  {active.score}<span className="text-base text-slate-400 font-normal"> / 100</span>
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-center">
                  <div className="text-slate-400 text-[10px]">Impact Density</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums">{active.density}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-center">
                  <div className="text-slate-400 text-[10px]">Date Hygiene</div>
                  <div className="font-bold text-emerald-600 tabular-nums">{active.consistency}</div>
                </div>
              </div>
            </div>

            {/* Keyword Match Strip */}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Found Competency Keywords ({active.keywordsFound.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.keywordsFound.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords Opportunity */}
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Missing High-Impact Skills for This Opening</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.keywordsMissing.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-medium"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Actionable Tip */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#FF5A4E] shrink-0 mt-0.5" />
              <div>
                <strong>Actionable ATS Recommendation:</strong> {active.tip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
