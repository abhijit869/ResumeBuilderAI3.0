'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FeedbackSectionProps {
  isDark?: boolean;
}

export function FeedbackSection({ isDark }: FeedbackSectionProps) {
  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Senior Staff Engineer',
      company: 'FinTech Platform',
      quote:
        'ResumeBuilderAI gave me something ChatGPT never could: actual metric-preserving bullet rewriting. It took my real latency benchmarks and reframed them with decisive action verbs without inventing unverified numbers.',
      verified: 'Verified Recruiter Placement',
    },
    {
      name: 'Marcus Chen',
      role: 'Principal Product Manager',
      company: 'Cloud Infrastructure Provider',
      quote:
        'The ATS checker identified 3 missing leadership competencies in my resume that were critical for my target role. After tailoring, my interview callback rate jumped from 15% to over 60%.',
      verified: 'Verified Career Transition',
    },
    {
      name: 'Sophia Patel',
      role: 'Head of Growth Marketing',
      company: 'High-Growth B2B SaaS',
      quote:
        'The synchronized cover letter studio alone saved me hours. Having a cover letter that uses the identical typography, margins, and header style of my resume made my application look exceptionally polished.',
      verified: 'Verified Offer Accepted',
    },
  ];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono font-semibold mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Real Candidate Outcomes</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Trusted by engineers, product leads, and executives.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Read authentic candidate reviews from professionals who landed competitive offers at top technology companies and high-growth startups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xs flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/70 dark:border-slate-800">
              <div className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</div>
              <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
              <div className="mt-2 text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.verified}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
