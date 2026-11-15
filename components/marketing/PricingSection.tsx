'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  isDark?: boolean;
  onSelectPlan?: (planId: string) => void;
}

export function PricingSection({ isDark, onSelectPlan }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for creating your first standard resume and checking ATS readiness.',
      badge: null,
      features: [
        '1 Active Resume Document',
        '3 Standard Code-Rendered ATS Templates',
        'Basic Heuristic ATS Readiness Audit',
        'LinkedIn Text/PDF Import (1-click)',
        'Selectable PDF & Plain-Text Export',
        'Local Encryption & Autosave',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      id: 'pro',
      name: 'ResumeBuilderAI Pro',
      price: billingPeriod === 'annual' ? '$6.50' : '$12',
      period: 'per month',
      description: 'Full AI writing, unlimited resumes, cover letters, and multi-format exports.',
      badge: billingPeriod === 'annual' ? 'Save 45%' : 'Most Popular',
      features: [
        'Unlimited Resumes & Cover Letters',
        'All 18 Code-Rendered ATS Templates',
        'Gemini Grounded AI Bullet Rewriter',
        'Job-Specific Keyword Tailoring',
        'Selectable PDF & Word (DOCX) Export',
        'A4 & US Letter Pagination Controls',
        'Multi-Version Document History',
        'Job Application Kanban Tracker',
      ],
      cta: 'Unlock Pro Studio',
      popular: true,
    },
    {
      id: 'career-pro',
      name: 'Career Studio Max',
      price: billingPeriod === 'annual' ? '$12.50' : '$24',
      period: 'per month',
      description: 'Complete career suite with personal website, video pitch, and interview prep.',
      badge: 'All-Inclusive',
      features: [
        'Everything in Pro Studio',
        'Published Personal Portfolio Website (/p/slug)',
        'Video Elevator Pitch Hosting & Captions',
        'AI Interview Prep Simulator (STAR Framework)',
        'Expiring / Password-Protected Share Links',
        'Priority Gemini Server Allocation',
        'Custom Domain Binding Support',
      ],
      cta: 'Get Career Max',
      popular: false,
    },
  ];

  return (
    <section id="pricing-section" className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FF5A4E] mb-2">
          Transparent, No-Surprise Pricing
        </p>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Invest in your career. Land the job you deserve.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Start for free, upgrade when you need advanced AI bullet tailoring or unlimited PDF/DOCX downloads. Cancel anytime in one click.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              billingPeriod === 'annual'
                ? 'bg-[#FF5A4E] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
              Save 45%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`p-7 sm:p-8 rounded-3xl border flex flex-col justify-between relative transition ${
              p.popular
                ? 'border-2 border-[#FF5A4E] bg-white dark:bg-slate-900 shadow-xl scale-[1.02]'
                : isDark
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200/90 shadow-2xs'
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-[#FF5A4E] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                {p.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xl text-slate-950 dark:text-white">{p.name}</h3>
              </div>
              <p className="text-xs text-slate-500 min-h-[32px] mb-5">{p.description}</p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <span className="font-serif font-extrabold text-4xl text-slate-950 dark:text-white tabular-nums">
                  {p.price}
                </span>
                <span className="text-xs text-slate-500 font-medium">/{p.period}</span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  What is included:
                </div>
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan?.(p.id)}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                p.popular
                  ? 'bg-[#FF5A4E] hover:bg-[#e8483c] text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900'
              }`}
            >
              <span>{p.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
