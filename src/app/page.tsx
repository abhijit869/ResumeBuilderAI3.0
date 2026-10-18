"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText,
  PenTool,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Star,
  ArrowRight,
  Download,
  Award,
  ChevronDown,
  Zap,
  Shield,
  Layout,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";

const stats = [
  { number: "5M+", label: "Resumes Created" },
  { number: "180+", label: "Countries" },
  { number: "35+", label: "Recruiter Templates" },
  { number: "96%", label: "Interview Rate Boost" },
];

const flagshipTemplates = [
  {
    id: "hoth",
    name: "Hoth",
    badge: "Most Popular",
    color: "#1e293b",
    description: "Kickresume's signature two-column template with dark sidebar, photo, and skill rating bars.",
    atsScore: 97,
  },
  {
    id: "europe",
    name: "Europe",
    badge: "Executive Standard",
    color: "#0f766e",
    description: "Clean European format with crisp section dividers and prominent contact header.",
    atsScore: 95,
  },
  {
    id: "vegan",
    name: "Vegan",
    badge: "Modern Minimal",
    color: "#166534",
    description: "Spacious eco-friendly typography layout with high visual readability and clean hierarchy.",
    atsScore: 94,
  },
  {
    id: "basic",
    name: "Basic",
    badge: "100% ATS Safe",
    color: "#2563eb",
    description: "Single-column traditional format optimized specifically for high-volume automated ATS parsers.",
    atsScore: 98,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Writer",
    badge: "GPT-Powered",
    description:
      "Generate role-specific bullet points packed with active verbs and quantifiable results in seconds with 5 free AI credits.",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    text: "text-[#5345ff]",
  },
  {
    icon: BarChart3,
    title: "Kickresume ATS Checker",
    badge: "Instant Score",
    description:
      "Paste your target job description to get instant keyword matching, format validation, and actionable scoring advice.",
    color: "from-orange-500 to-rose-600",
    bg: "bg-orange-50",
    text: "text-[#ff5e59]",
  },
  {
    icon: Layout,
    title: "Signature Designer Templates",
    badge: "35+ Designs",
    description:
      "Choose from Kickresume's legendary templates including Hoth, Europe, and Vegan, custom tailored by professional typographers.",
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    text: "text-[#00b5b8]",
  },
  {
    icon: PenTool,
    title: "Matching Cover Letters",
    badge: "Synchronized",
    description:
      "Build matching cover letters that perfectly align with your resume's aesthetic and formatting for a unified application.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Software Engineer at Google",
    company: "Google",
    content:
      "I switched my resume layout to Kickresume's Hoth template and ran it through the ATS checker. Within 2 weeks I had interviews with Google, Meta, and Stripe.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Vance",
    role: "Product Marketing Lead at Apple",
    company: "Apple",
    content:
      "The AI bullet point generator is incredible. It turned my generic job responsibilities into punchy, metric-driven achievements that recruiters noticed immediately.",
    rating: 5,
    avatar: "MV",
  },
  {
    name: "Elena Rostova",
    role: "Operations Manager at Amazon",
    company: "Amazon",
    content:
      "The instant PDF download and ATS score breakdown gave me the confidence that my resume would actually reach human hiring managers.",
    rating: 5,
    avatar: "ER",
  },
];

const faqItems = [
  {
    question: "Is this resume builder really free to get started?",
    answer:
      "Yes! You can choose from our flagship templates, edit your complete experience, use 5 AI credits to generate tailored achievements, and export ATS-compliant PDFs without paying anything.",
  },
  {
    question: "How does the Kickresume Hoth template improve interview chances?",
    answer:
      "Hoth is Kickresume's most successful template. Its dark sidebar gives visual prominence to key contact info and technical proficiencies, while the main column delivers clean, high-contrast timeline blocks that both human eyes and automated ATS software love.",
  },
  {
    question: "Are all templates verified against ATS (Applicant Tracking Systems)?",
    answer:
      "Yes. Every template in our catalog is engineered to preserve semantic reading order, clean font hierarchies, standard section headers, and parseable date formats tested against Workday, Greenhouse, Lever, and Taleo.",
  },
  {
    question: "How do AI credits work?",
    answer:
      "Each user starts with 5 free AI credits. You can spend a credit to generate compelling job bullet points, craft professional career summaries, or write tailored cover letter introductions.",
  },
  {
    question: "Can I download my resume as a PDF instantly?",
    answer:
      "Yes. With one click, your resume compiles to a sharp, high-resolution PDF ready to be attached to your job applications or emailed directly to recruiters.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200/80 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-xs">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/60 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ff5e59]" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { createResume, updateResume } = useResumeStore();

  const handleStartWithTemplate = (templateId: string) => {
    const resume = createResume(`My ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume`);
    updateResume(resume.id, { templateId });
    router.push(`/editor/resume/${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#fff7f5] via-white to-[#f8fafc]">
        {/* Ambient glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-rose-100 text-[#ee4e34] border border-orange-200/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-current text-[#ff5e59]" />
                <span>The #1 AI Resume & Cover Letter Builder</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                Your dream job begins with your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5e59] via-[#ee4e34] to-[#5345ff]">
                  best resume.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join over <strong className="font-bold text-gray-900">5,000,000</strong> job seekers who got hired at companies like Google, Apple, Nike, Tesla, and Amazon. Create recruiter-approved resumes with Kickresume&apos;s signature templates and GPT-powered writer.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link
                  href="/dashboard/resumes"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#ff5e59] hover:bg-[#ee4e34] rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create My Resume Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/templates/resume"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-bold text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl transition-all shadow-xs"
                >
                  Browse 35+ Templates
                </Link>
                <Link
                  href="/ats-checker"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-bold text-[#5345ff] bg-indigo-50/70 border border-indigo-100 hover:bg-indigo-100/70 rounded-2xl transition-all"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  ATS Checker
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2 overflow-hidden">
                  {["#ff5e59", "#5345ff", "#00b5b8", "#1e293b", "#f59e0b"].map((bg, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[11px] font-bold shadow-xs"
                      style={{ backgroundColor: bg }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-gray-900 ml-1.5">4.8 / 5</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Loved by 5M+ candidates on Trustpilot & Product Hunt
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Kickresume Hoth Template Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl bg-white p-5 shadow-2xl shadow-gray-300/60 border border-gray-200/80 transition-all hover:shadow-orange-500/10">
                {/* Floating Badges */}
                <div className="absolute -top-3.5 -right-3.5 bg-[#5345ff] text-white px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-500/30 text-xs font-bold flex items-center gap-1.5 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>97% ATS Passed</span>
                </div>

                <div className="absolute -bottom-3 -left-3 bg-white text-gray-900 border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Template: Hoth (Default)</span>
                </div>

                {/* Miniature Kickresume Hoth Layout Preview */}
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white text-[10px] leading-snug">
                  {/* Top Banner */}
                  <div className="bg-[#1e293b] text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#ff5e59] flex items-center justify-center text-white font-extrabold text-sm ring-2 ring-white/30">
                        AJ
                      </div>
                      <div>
                        <h2 className="text-xs font-black tracking-tight text-white m-0">Alex Johnson</h2>
                        <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider mt-0.5">
                          Senior Full Stack Engineer
                        </p>
                        <p className="text-[9px] text-gray-300">San Francisco, CA • alex@example.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Body Columns */}
                  <div className="grid grid-cols-12 min-h-[220px]">
                    {/* Left Sidebar */}
                    <div className="col-span-4 bg-[#f8fafc] border-r border-gray-200/80 p-3 space-y-3">
                      <div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                          Skills
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <div className="flex justify-between text-[8px] font-bold text-gray-700">
                              <span>React / Next</span>
                              <span>95%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full mt-0.5">
                              <div className="h-1 bg-[#ff5e59] rounded-full w-[95%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[8px] font-bold text-gray-700">
                              <span>TypeScript</span>
                              <span>90%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full mt-0.5">
                              <div className="h-1 bg-[#ff5e59] rounded-full w-[90%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[8px] font-bold text-gray-700">
                              <span>Python & AI</span>
                              <span>85%</span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded-full mt-0.5">
                              <div className="h-1 bg-[#5345ff] rounded-full w-[85%]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">
                          Education
                        </div>
                        <p className="font-bold text-gray-800 text-[9px]">B.S. Computer Science</p>
                        <p className="text-gray-500 text-[8px]">Stanford University</p>
                      </div>
                    </div>

                    {/* Right Main Column */}
                    <div className="col-span-8 p-3 space-y-3">
                      <div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">
                          Work Experience
                        </div>
                        <div className="border-l-2 border-[#ff5e59] pl-2 space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-[9px]">Tech Lead</span>
                              <span className="text-[8px] text-gray-400">2022 - Pres</span>
                            </div>
                            <p className="text-[8px] text-gray-500">CloudScale Systems</p>
                            <p className="text-[8px] text-gray-600 mt-0.5 line-clamp-2">
                              • Architected microservices boosting throughput by 42%.
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-[9px]">Software Engineer</span>
                              <span className="text-[8px] text-gray-400">2019 - 2022</span>
                            </div>
                            <p className="text-[8px] text-gray-500">StartupForge</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action footer */}
                  <div className="p-3 bg-gray-50/80 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-600">Want this exact format?</span>
                    <button
                      onClick={() => handleStartWithTemplate("hoth")}
                      className="px-3 py-1 bg-[#ff5e59] hover:bg-[#ee4e34] text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      Use Hoth Template &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Trust Banner */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            Our users were hired by recruiters at top companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            {["Google", "Apple", "Tesla", "Amazon", "Nike", "Microsoft", "Meta"].map((company) => (
              <span key={company} className="text-xl sm:text-2xl font-black text-gray-700 tracking-tighter">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-[#ff5e59] mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Templates Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
                Recruiter-Approved Designs
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                Kickresume Flagship Templates
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl">
                Every layout is rigorously tested with leading ATS parsers and HR managers.
              </p>
            </div>
            <Link
              href="/templates/resume"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-[#ff5e59] hover:underline"
            >
              View all 35+ templates <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flagshipTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-[#f8fafc] rounded-3xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header badge */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">{template.name}</h3>
                    <span className="text-[10px] font-bold text-[#ff5e59] uppercase tracking-wider">
                      {template.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    {template.atsScore}% ATS
                  </span>
                </div>

                {/* Preview Thumbnail */}
                <div className="relative aspect-[3/4] p-5 flex items-center justify-center bg-gray-50 overflow-hidden group-hover:bg-orange-50/20 transition-colors">
                  <div className="w-full h-full bg-white rounded-xl shadow-md p-3 flex flex-col space-y-2 border border-gray-200/70 group-hover:scale-105 transition-transform duration-300">
                    {/* Fake Header */}
                    <div className="h-4 rounded flex items-center px-1.5 text-[8px] font-bold text-white" style={{ backgroundColor: template.color }}>
                      {template.name}
                    </div>
                    {/* Fake lines */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-1/3 bg-gray-300 rounded" />
                      <div className="h-1 w-full bg-gray-200 rounded" />
                      <div className="h-1 w-4/5 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="h-1.5 w-1/4 bg-gray-300 rounded" />
                      <div className="h-1 w-full bg-gray-200 rounded" />
                      <div className="h-1 w-3/4 bg-gray-200 rounded" />
                    </div>
                    <div className="mt-auto pt-2 flex gap-1">
                      <div className="h-2 w-8 rounded bg-gray-200" />
                      <div className="h-2 w-10 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>

                {/* Description & Action */}
                <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  <button
                    onClick={() => handleStartWithTemplate(template.id)}
                    className="w-full py-2 bg-gray-900 hover:bg-[#ff5e59] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Use {template.name} Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5345ff]">
              Powerhouse Toolset
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              Everything you need to beat the applicant pool
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3">
              Automated AI suggestions, keyword optimization, and verified formats designed to land you interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.text}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {feature.badge}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900 mt-2 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 Easy Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Build your resume in 3 simple steps
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              No complicated setups. Ready in under 10 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Template",
                desc: "Select Hoth, Europe, Vegan, or Basic. Change colors, fonts, and layouts anytime.",
              },
              {
                step: "02",
                title: "Add Details or Use AI",
                desc: "Type your experiences or let our AI generate impactful, quantified bullet points for your role.",
              },
              {
                step: "03",
                title: "Download & Get Hired",
                desc: "Export an ATS-approved PDF or share an online link directly with recruiters.",
              },
            ].map((s) => (
              <div key={s.step} className="p-8 rounded-3xl bg-[#f8fafc] border border-gray-200/70 text-center relative group">
                <div className="w-12 h-12 rounded-2xl bg-[#ff5e59] text-white flex items-center justify-center font-black text-lg mx-auto mb-5 shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f8fafc] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
              Real Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
              Join 5M+ hired professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic mb-6">
                    &quot;{t.content}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Everything you need to know about Kickresume AI 3.0
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#ff5e59] via-[#ee4e34] to-[#ff7b54] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-base sm:text-lg text-orange-100 max-w-xl mx-auto mb-8">
            Create an interview-winning resume in under 10 minutes with Kickresume. Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/resumes"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-black text-[#ff5e59] bg-white rounded-2xl shadow-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5"
            >
              Build My Resume Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
