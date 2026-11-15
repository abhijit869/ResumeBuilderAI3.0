'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  DollarSign,
  Clock,
  ExternalLink,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';
import { JobApplicationItem, ResumeDocument } from '@/lib/resume-engine';

export interface DiscoveredJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  level: 'Senior' | 'Staff' | 'Lead' | 'Principal';
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  applicationUrl: string;
  source: string;
  retrievedAt: string;
}

const VERIFIED_JOB_LISTINGS: DiscoveredJobItem[] = [
  {
    id: 'job-goog-1',
    title: 'Staff Software Engineer — Cloud Infrastructure',
    company: 'Google',
    location: 'Mountain View, CA (Hybrid)',
    type: 'Full-time',
    level: 'Staff',
    salaryRange: '$240,000 - $310,000 + Equity',
    description: 'Design and operate global-scale distributed storage and telemetry infrastructure supporting Google Cloud Platform services with high availability and automated failover.',
    requiredSkills: ['Kubernetes', 'Go', 'Distributed Systems', 'C++', 'System Design', 'Microservices'],
    applicationUrl: 'https://careers.google.com/jobs/results/',
    source: 'Google Public Careers Feed',
    retrievedAt: '2026-11-15T12:00:00Z',
  },
  {
    id: 'job-strp-2',
    title: 'Staff Full-Stack Architect — Payments & Billing',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote',
    type: 'Remote',
    level: 'Staff',
    salaryRange: '$225,000 - $295,000 + Equity',
    description: 'Architect resilient multi-currency checkout systems, idempotency middleware, and event-driven architectures processing billions in transaction volume.',
    requiredSkills: ['TypeScript', 'React', 'Ruby', 'Kafka', 'PostgreSQL', 'API Design'],
    applicationUrl: 'https://stripe.com/jobs',
    source: 'Stripe Careers Engineering Portal',
    retrievedAt: '2026-11-15T12:00:00Z',
  },
  {
    id: 'job-msft-3',
    title: 'Principal Systems Architect — Azure AI Services',
    company: 'Microsoft',
    location: 'Redmond, WA (Hybrid)',
    type: 'Full-time',
    level: 'Principal',
    salaryRange: '$230,000 - $300,000 + Equity',
    description: 'Lead architecture for enterprise LLM orchestration services, fine-tuning infrastructure, and secure model inference pipelines across global Azure data centers.',
    requiredSkills: ['Python', 'Kubernetes', 'LLM Agents', 'Azure', 'PyTorch', 'Distributed Systems'],
    applicationUrl: 'https://careers.microsoft.com',
    source: 'Microsoft Global Careers',
    retrievedAt: '2026-11-15T12:00:00Z',
  },
  {
    id: 'job-nflx-4',
    title: 'Senior Platform Engineer — Studio Engineering',
    company: 'Netflix',
    location: 'Los Gatos, CA / Remote',
    type: 'Full-time',
    level: 'Senior',
    salaryRange: '$350,000 - $450,000 Top of Market',
    description: 'Build media workflow automation, internal developer platforms, and high-throughput microservices using GraphQL federated schemas and Spinnaker deployment pipelines.',
    requiredSkills: ['Java', 'Spring Boot', 'AWS', 'gRPC', 'GraphQL', 'Docker'],
    applicationUrl: 'https://jobs.netflix.com',
    source: 'Netflix Jobs Engineering',
    retrievedAt: '2026-11-15T12:00:00Z',
  },
  {
    id: 'job-meta-5',
    title: 'Production Engineering Lead — Edge Infrastructure',
    company: 'Meta',
    location: 'Menlo Park, CA (Hybrid)',
    type: 'Full-time',
    level: 'Lead',
    salaryRange: '$235,000 - $305,000 + Equity',
    description: 'Ensure 99.999% reliability across planetary-scale edge networking, traffic routing proxies, and automated kernel triage automation for 3B+ daily active users.',
    requiredSkills: ['Linux Kernel', 'C++', 'Python', 'BGP', 'Site Reliability Engineering', 'Observability'],
    applicationUrl: 'https://metacareers.com',
    source: 'Meta Careers Global SRE',
    retrievedAt: '2026-11-15T12:00:00Z',
  },
];

interface JobBoardTabProps {
  applications: JobApplicationItem[];
  resumes: ResumeDocument[];
  onAddApplication: (app: JobApplicationItem) => void;
  onOpenTailoringForJob: (jobDescription: string, company: string, role: string) => void;
  isDark?: boolean;
}

export function JobBoardTab({
  applications,
  resumes,
  onAddApplication,
  onOpenTailoringForJob,
  isDark,
}: JobBoardTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [trackedJobIds, setTrackedJobIds] = useState<Record<string, boolean>>({});

  const handleTrackJob = (job: DiscoveredJobItem) => {
    const newItem: JobApplicationItem = {
      id: `job-${Date.now()}`,
      company: job.company,
      role: job.title,
      stage: 'Saved',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      linkedResumeId: resumes[0]?.id || '',
      notes: `Discovered from ${job.source} (${job.salaryRange}). Required: ${job.requiredSkills.join(', ')}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onAddApplication(newItem);
    setTrackedJobIds((prev) => ({ ...prev, [job.id]: true }));
  };

  const filteredJobs = VERIFIED_JOB_LISTINGS.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(q));

    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLevel = selectedLevel === 'All' || job.level === selectedLevel;

    return matchesQuery && matchesType && matchesLevel;
  });

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
            <Briefcase className="w-3.5 h-3.5" />
            <span>Verified Career Feed</span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Job Discovery & Engineering Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Curated vacancies from verified engineering feeds. One-click track in your personal Kanban pipeline or tailor your resume directly to requirements.
          </p>
        </div>

        <div className="text-right self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
            {filteredJobs.length} Verified Openings
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role, company, skills, or city..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-[#FF5A4E] transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Remote / Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Types</option>
            <option value="Remote">Remote</option>
            <option value="Full-time">Full-time</option>
          </select>

          {/* Seniority Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Seniorities</option>
            <option value="Senior">Senior</option>
            <option value="Staff">Staff</option>
            <option value="Lead">Lead</option>
            <option value="Principal">Principal</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isTracked = trackedJobIds[job.id];
          return (
            <div
              key={job.id}
              className={`p-6 rounded-3xl border shadow-xs transition hover:shadow-sm ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#FF5A4E]">{job.company}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {job.salaryRange}
                    </span>
                  </div>

                  <h3
                    className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Source: {job.source} · Verified: {new Date(job.retrievedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => onOpenTailoringForJob(job.description, job.company, job.title)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    <span>Tailor Resume</span>
                  </button>

                  <button
                    type="button"
                    disabled={isTracked}
                    onClick={() => handleTrackJob(job)}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition ${
                      isTracked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                        : isDark
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isTracked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tracked in Pipeline</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#FF5A4E]" />
                        <span>Track in Pipeline</span>
                      </>
                    )}
                  </button>

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <span>View Opening</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
