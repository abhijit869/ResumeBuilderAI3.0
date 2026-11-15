'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, FileText, Check, ArrowRight } from 'lucide-react';

interface CoverLetterShowcaseProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function CoverLetterShowcase({ isDark, onCtaClick }: CoverLetterShowcaseProps) {
  const [selectedRole, setSelectedRole] = useState<'swe' | 'pm' | 'marketing'>('swe');

  const coverLetters = {
    swe: {
      role: 'Staff Platform Engineer',
      company: 'Datadog / Cloud Scale',
      salutation: 'Dear Hiring Team at Datadog,',
      p1: 'I am writing to express my enthusiastic interest in the Staff Platform Engineer role. Having spent the past seven years architecting distributed microservices and event-driven data pipelines processing over 250M daily events, I have followed Datadog’s telemetry advancements with keen admiration.',
      p2: 'In my current role at CloudGrid, I spearheaded our migration to zero-trust multi-region Kubernetes clusters, reducing infrastructure provisioning overhead by 58% and eliminating recurring cross-zone latency bottlenecks.',
      cta: 'I would welcome the opportunity to discuss how my hands-on background in low-latency systems and developer tooling can accelerate Datadog’s core infrastructure roadmap.',
    },
    pm: {
      role: 'Principal Product Manager',
      company: 'Stripe / Core Billing',
      salutation: 'Dear Stripe Recruiting Committee,',
      p1: 'I am excited to submit my candidacy for the Principal Product Manager position within Core Billing. As a product leader who has scaled B2B monetization infrastructure from early traction to $45M ARR, I deeply resonate with Stripe’s relentless focus on developer ergonomics and payment reliability.',
      p2: 'At PayFlow, I led cross-functional discovery with 30+ enterprise finance teams to launch automated revenue recognition, shortening month-end close cycles by 12 days and achieving a 94% retention rate in our enterprise cohort.',
      cta: 'I look forward to discussing how my experience in usage-based pricing models and compliance workflows can contribute to Stripe’s continued platform expansion.',
    },
    marketing: {
      role: 'Head of Growth Marketing',
      company: 'Figma / Creative Suite',
      salutation: 'Dear Figma Hiring Team,',
      p1: 'I am thrilled to apply for the Head of Growth Marketing role. Having spent the last six years scaling self-serve and product-led growth flywheels across design-centric SaaS products, I have long admired Figma’s collaborative ethos and organic community adoption.',
      p2: 'Most recently, I led our cross-functional PLG experimentation squad, driving a 34% increase in activated workspace seats and unlocking an 8.4x return on organic content syndication.',
      cta: 'I would love to connect and share actionable insights on expanding collaborative design adoption across high-growth international enterprise teams.',
    },
  };

  const active = coverLetters[selectedRole];

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Cohesive Cover Letter Studio</span>
          </div>

          <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Generate tailored cover letters that perfectly mirror your resume.
          </h2>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Recruiters notice when a cover letter uses a completely mismatched font or header style. ResumeBuilderAI creates synchronized cover letters using the exact typography, color palette, and header geometry of your resume.
          </p>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              Try a targeted career scenario:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'swe', label: 'Platform Engineer' },
                { id: 'pm', label: 'Product Manager' },
                { id: 'marketing', label: 'Growth Marketing' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedRole === role.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onCtaClick}
              className="py-3 px-6 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Draft Your Cover Letter in Seconds</span>
            </button>
          </div>
        </div>

        {/* Right Live Letter Canvas Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className={`p-8 sm:p-10 rounded-3xl border shadow-md font-sans text-xs sm:text-sm leading-relaxed space-y-4 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'}`}>
            {/* Synchronized Header */}
            <div className="pb-4 border-b border-slate-200/80 flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-xl tracking-tight text-slate-950 dark:text-white">
                  Alex Morgan
                </h3>
                <p className="text-xs text-[#FF5A4E] font-semibold mt-0.5">
                  {active.role}
                </p>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  alex.morgan@career-studio.io · +1 (555) 019-2831 · San Francisco, CA
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                A4 · Synchronized
              </span>
            </div>

            {/* Recipient Details */}
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5 pt-2">
              <div className="font-bold text-slate-900 dark:text-white">{active.company}</div>
              <div>Attn: Talent Acquisition &amp; Hiring Committee</div>
              <div className="text-[11px] font-mono text-slate-400">November 15, 2026</div>
            </div>

            {/* Salutation & Body */}
            <p className="font-bold pt-2">{active.salutation}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{active.p1}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{active.p2}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{active.cta}</p>

            {/* Sign-off */}
            <div className="pt-3 text-xs">
              <div className="text-slate-500">Sincerely,</div>
              <div className="font-serif font-bold text-base text-slate-900 dark:text-white mt-1">
                Alex Morgan
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
