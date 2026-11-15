'use client';

import React from 'react';
import {
  FileUp,
  Sparkles,
  Mail,
  ShieldCheck,
  Briefcase,
  LayoutGrid,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { QuickCreateCard } from './QuickCreateCard';

interface QuickCreateSectionProps {
  onOpenLinkedInImport: () => void;
  onOpenAiGenerator: () => void;
  onOpenCoverLetters: () => void;
  onOpenAtsChecker: () => void;
  onOpenJobTracker: () => void;
  onOpenTemplates: () => void;
  onOpenPortfolios: () => void;
  onOpenInterviewPrep: () => void;
  isDark?: boolean;
}

export function QuickCreateSection({
  onOpenLinkedInImport,
  onOpenAiGenerator,
  onOpenCoverLetters,
  onOpenAtsChecker,
  onOpenJobTracker,
  onOpenTemplates,
  onOpenPortfolios,
  onOpenInterviewPrep,
  isDark,
}: QuickCreateSectionProps) {
  const tools = [
    {
      title: 'Import Profile / PDF',
      description: 'Ingest genuine text from LinkedIn exports, selectable PDFs, or Word DOCX files.',
      badge: 'Zero Scraping',
      icon: FileUp,
      iconBg: 'bg-[#0077B5]/10',
      iconColor: 'text-[#0077B5]',
      onClick: onOpenLinkedInImport,
    },
    {
      title: 'AI Resume Draft',
      description: 'Generate a structured first draft using Gemini server-side processing.',
      badge: 'Grounded AI',
      icon: Sparkles,
      iconBg: 'bg-[#FF5A4E]/10',
      iconColor: 'text-[#FF5A4E]',
      onClick: onOpenAiGenerator,
    },
    {
      title: 'ATS Resume Checker',
      description: 'Audit your resume against Fortune 500 ATS algorithms and keyword benchmarks.',
      badge: 'Heuristic',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      onClick: onOpenAtsChecker,
    },
    {
      title: 'Job Board & Tracker',
      description: 'Track job applications across Kanban stages with deadline alerts.',
      badge: '8 Stages',
      icon: Briefcase,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      onClick: onOpenJobTracker,
    },
    {
      title: 'Matching Cover Letter',
      description: 'Generate high-converting cover letters synchronized with your resume styling.',
      badge: 'Print Ready',
      icon: Mail,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      onClick: onOpenCoverLetters,
    },
    {
      title: '18 ATS Templates',
      description: 'Explore original code-rendered templates across 7 industry categories.',
      badge: '18 Original',
      icon: LayoutGrid,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      onClick: onOpenTemplates,
    },
    {
      title: 'Portfolio Website',
      description: 'Publish your personal web portfolio instantly at a custom public slug.',
      badge: '/p/slug',
      icon: Globe,
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600',
      onClick: onOpenPortfolios,
    },
    {
      title: 'STAR Interview Prep',
      description: 'Practice behavioral and system architecture questions with tailored answers.',
      badge: 'STAR Method',
      icon: MessageSquare,
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-600',
      onClick: onOpenInterviewPrep,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Studio Tool Suite
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly launch specialized career acceleration tools.
          </p>
        </div>
      </div>

      {/* 4/2/1 Responsive Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <QuickCreateCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            badge={tool.badge}
            icon={tool.icon}
            iconBg={tool.iconBg}
            iconColor={tool.iconColor}
            onClick={tool.onClick}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
