'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  Target,
  GraduationCap,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface CareerMapTabProps {
  activeResume: ResumeDocument;
  isDark?: boolean;
}

export function CareerMapTab({ activeResume, isDark }: CareerMapTabProps) {
  const [currentRole, setCurrentRole] = useState(
    activeResume.personalInfo.jobTitle || 'Senior Software Engineer'
  );
  const [targetRole, setTargetRole] = useState('Staff Systems Architect & VP of Engineering');

  const roadmapSteps = [
    {
      level: 'Current Level',
      role: currentRole,
      status: 'completed',
      milestones: [
        'Lead independent feature pods and critical service boundaries',
        'Demonstrated high code review velocity and mentor junior developers',
        'Maintain high unit and contract test coverage in CI/CD',
      ],
    },
    {
      level: 'Intermediate Milestone (6-12 Months)',
      role: 'Staff Engineer / Technical Lead',
      status: 'active',
      milestones: [
        'Author cross-team engineering RFCs and architectural blueprints',
        'Lead migration to zero-trust service mesh or distributed event streaming',
        'Directly influence quarterly product roadmap and tech debt allocation',
      ],
    },
    {
      level: 'Target Executive Role (18-24 Months)',
      role: targetRole,
      status: 'target',
      milestones: [
        'Set multi-year architectural vision across entire engineering organization',
        'Partner with C-suite leadership on technology strategy, budget, and hiring',
        'Represent company engineering at international conferences and standards bodies',
      ],
    },
  ];

  const demonstratedSkills = activeResume.skills.map((s) => s.name);
  const requiredTargetSkills = [
    'System Design at Planetary Scale',
    'Cross-Functional Engineering Strategy',
    'Cost Optimization & Cloud FinOps',
    'Executive Communication & Board Presentations',
    'Zero-Trust Architecture & SOC2 Compliance',
    'LLM Agent Orchestration & Distributed AI',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Executive Planning Studio</span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Structured Career Map & Trajectory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Plan your progression from your current role to your dream executive position with concrete milestones, skill gap analysis, and high-ROI projects.
          </p>
        </div>
      </div>

      {/* Target Role Selector Strip */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-xs font-bold text-slate-500">Trajectory:</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">
              {currentRole}
            </span>
            <ArrowRight className="w-4 h-4 text-[#FF5A4E]" />
            <span className="font-semibold text-[#FF5A4E]">{targetRole}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Role:</span>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* 3-Step Milestone Trajectory Roadmap */}
      <div className="space-y-4">
        <h2
          className={`font-serif text-lg font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Career Milestones Progression
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between ${
                step.status === 'target'
                  ? 'border-[#FF5A4E] ring-1 ring-[#FF5A4E]/30 bg-[#FF5A4E]/5'
                  : isDark
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Step 0{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : step.status === 'active'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-[#FF5A4E]/10 text-[#FF5A4E]'
                    }`}
                  >
                    {step.level}
                  </span>
                </div>

                <h3
                  className={`font-serif text-base sm:text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {step.role}
                </h3>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  {step.milestones.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A4E] shrink-0 mt-1.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Gap Analysis & Learning Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demonstrated vs Gap */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#FF5A4E]" />
            <h3
              className={`font-serif text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Skills Gap Analysis for {targetRole}
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="text-xs font-bold text-emerald-600 mb-1.5">
                Demonstrated in Active Resume ({demonstratedSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {demonstratedSkills.slice(0, 8).map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-amber-600 mb-1.5">
                Competencies to Acquire ({requiredTargetSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {requiredTargetSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-mono"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested High-Impact Projects */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <h3
              className={`font-serif text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Recommended Architectural Projects
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                Multi-Region Zero-Downtime Migration RFC
              </div>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Rationale: Demonstrates organization-wide architectural planning and consensus-building required for Staff/Principal band.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                Enterprise LLM Agent Pipeline with Guardrails
              </div>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Rationale: Positions candidate at the frontier of commercial AI systems, directly aligning with modern executive engineering priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
