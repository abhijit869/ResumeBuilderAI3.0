import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  FlaskConical,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Github,
  Linkedin,
  Twitter,
  Download,
} from 'lucide-react';
import { INITIAL_RESUMES } from '@/lib/resume-engine';

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${name} — Professional Portfolio | ResumeBuilderAi 3.0`,
    description: `View ${name}'s verified career history, executive achievements, and technical portfolio on ResumeBuilderAi 3.0.`,
  };
}

export default async function PublicPortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const demoResume = INITIAL_RESUMES[0];

  // Derive candidate name from slug or fallback
  const displayName =
    slug && slug !== 'default'
      ? slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : demoResume.personalInfo.fullName;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-[#FF5A4E]/20">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt="ResumeBuilderAi 3.0 Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="font-serif font-bold text-sm tracking-tight text-slate-900">
              ResumeBuilderAi <span className="text-[#FF5A4E]">3.0</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              Published Career Portfolio
            </span>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1 shadow-2xs transition"
            >
              <span>Build Your Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portfolio Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Staff & Principal Roles</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
                {displayName}
              </h1>
              <p className="text-base sm:text-lg font-medium text-[#FF5A4E]">
                {demoResume.personalInfo.jobTitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {demoResume.personalInfo.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {demoResume.personalInfo.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {demoResume.personalInfo.website}
                </span>
              </div>
            </div>

            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-[#FF5A4E] shadow-md shrink-0 bg-slate-50">
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt={displayName}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
            {demoResume.personalInfo.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${demoResume.personalInfo.email}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 transition shadow-2xs"
            >
              <Mail className="w-4 h-4 text-[#FF5A4E]" />
              <span>Contact via Email</span>
            </a>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download ATS Resume</span>
            </Link>
          </div>
        </div>

        {/* Core Technologies & Skills */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#FF5A4E]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Core Technical Competencies
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {demoResume.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{skill.name}</span>
                  <span className="font-mono text-[10px] text-emerald-600">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#FF5A4E]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Work Experience & Impact
            </h2>
          </div>
          <div className="space-y-6 divide-y divide-slate-100">
            {demoResume.experience.map((exp, idx) => (
              <div key={exp.id || idx} className={idx > 0 ? 'pt-6' : ''}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <div className="text-xs font-semibold text-[#FF5A4E] mt-0.5">
                      {exp.company} · {exp.location}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 list-disc pl-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Academic Credentials */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#FF5A4E]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Education & Credentials
            </h2>
          </div>
          <div className="space-y-4">
            {demoResume.education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">{edu.degree}</div>
                  <div className="text-xs text-slate-600">{edu.school}</div>
                </div>
                <div className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                  {edu.period}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {displayName}. Published with ResumeBuilderAi 3.0 Studio.</p>
          <Link
            href="/"
            className="text-slate-600 hover:text-[#FF5A4E] font-semibold transition"
          >
            Create Your Free Career Studio →
          </Link>
        </div>
      </footer>
    </div>
  );
}
