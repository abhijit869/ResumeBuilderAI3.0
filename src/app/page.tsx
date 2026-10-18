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
  Star,
  ArrowRight,
  Download,
  ChevronDown,
  Zap,
  Layout,
  ChevronRight,
  TrendingUp,
  Check,
  Target,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";

const stats = [
  { number: "5M+", label: "Resumes Created Globally", icon: FileText, change: "+120k this month" },
  { number: "96%", label: "Interview Rate Boost", icon: TrendingUp, change: "Based on 40k+ reviews" },
  { number: "35+", label: "Recruiter-Tested Templates", icon: Layout, change: "100% ATS Verified" },
  { number: "180+", label: "Countries Represented", icon: Target, change: "Global hiring formats" },
];

const flagshipTemplates = [
  {
    id: "hoth",
    name: "Hoth",
    badge: "Most Popular",
    color: "#1e293b",
    accent: "#ff5e59",
    category: "Modern 2-Column",
    description: "Kickresume's signature layout. Features a dark sidebar for skills and contact info with high-contrast timeline blocks.",
    atsScore: 98,
    tags: ["Tech", "Engineering", "Startups"],
  },
  {
    id: "europe",
    name: "Europe",
    badge: "Executive Standard",
    color: "#0f766e",
    accent: "#0d9488",
    category: "Professional CV",
    description: "Strict European standard format with crisp section dividers, prominent contact header, and structured chronology.",
    atsScore: 96,
    tags: ["Corporate", "Finance", "Management"],
  },
  {
    id: "vegan",
    name: "Vegan",
    badge: "Modern Minimal",
    color: "#166534",
    accent: "#10b981",
    category: "Eco-Minimalist",
    description: "Spacious typography layout with generous margins and clear visual hierarchy favored by design and product leads.",
    atsScore: 95,
    tags: ["Design", "Product", "Creative"],
  },
  {
    id: "basic",
    name: "Basic",
    badge: "100% ATS Safe",
    color: "#2563eb",
    accent: "#3b82f6",
    category: "ATS Universal",
    description: "Single-column traditional format optimized for high-volume automated parsers like Workday, Taleo, and Greenhouse.",
    atsScore: 99,
    tags: ["Healthcare", "Government", "Enterprise"],
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Writer",
    badge: "GPT-Powered",
    description:
      "Generate role-specific bullet points packed with active verbs and quantifiable metrics in seconds with 5 free AI credits.",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    text: "text-[#5345ff]",
    bullets: ["Active impact verbs", "Role-specific achievements", "Instant summary generation"],
  },
  {
    icon: BarChart3,
    title: "Kickresume ATS Checker",
    badge: "Instant Analysis",
    description:
      "Scan your resume against any target job description to pinpoint missing keywords, formatting errors, and recruiter readiness.",
    color: "from-orange-500 to-rose-600",
    bg: "bg-orange-50",
    text: "text-[#ff5e59]",
    bullets: ["Real-time keyword matching", "Format & parse validation", "Actionable scoring feedback"],
  },
  {
    icon: Layout,
    title: "Signature Designer Templates",
    badge: "35+ Verified Designs",
    description:
      "Choose from Kickresume's legendary templates including Hoth, Europe, and Vegan, custom tailored by professional typographers.",
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    text: "text-[#00b5b8]",
    bullets: ["Custom colors & fonts", "Compact or relaxed spacing", "A4 & US Letter sizes"],
  },
  {
    icon: PenTool,
    title: "Matching Cover Letters",
    badge: "Synchronized Aesthetics",
    description:
      "Create matching cover letters that perfectly align with your resume's aesthetic and typography for a cohesive job application.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    bullets: ["Identical header branding", "AI-assisted opening hooks", "One-click synchronized PDF"],
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    content:
      "I switched my resume layout to Kickresume's Hoth template and ran it through the ATS checker. Within 2 weeks I had interviews with Google, Meta, and Stripe.",
    rating: 5,
    avatar: "SC",
    color: "#ff5e59",
  },
  {
    name: "Marcus Vance",
    role: "Product Marketing Lead",
    company: "Apple",
    content:
      "The AI bullet point generator is incredible. It turned my generic job responsibilities into punchy, metric-driven achievements that recruiters noticed immediately.",
    rating: 5,
    avatar: "MV",
    color: "#5345ff",
  },
  {
    name: "Elena Rostova",
    role: "Operations Manager",
    company: "Amazon",
    content:
      "The instant PDF download and ATS score breakdown gave me the confidence that my resume would actually reach human hiring managers.",
    rating: 5,
    avatar: "ER",
    color: "#00b5b8",
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
    <div className="border border-gray-200/90 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-xs hover:border-gray-300">
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-bold text-gray-900 pr-4 leading-snug">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-orange-50 text-[#ff5e59]" : "bg-gray-100 text-gray-400"}`}>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-gray-100">
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
    <div className="min-h-screen bg-[#fafbfc] font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-[#fff6f4] via-[#fcfbf9] to-[#fafbfc] border-b border-gray-200/60">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-24 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                {/* Product Badge */}
                <div className="inline-flex items-center gap-2 bg-white text-[#ee4e34] border border-orange-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs hover:border-orange-300 transition-colors">
                  <span className="flex h-2 w-2 rounded-full bg-[#ff5e59] animate-pulse" />
                  <Sparkles className="w-3.5 h-3.5 text-[#ff5e59]" />
                  <span>The #1 AI Resume & Cover Letter Builder 2026</span>
                </div>

                {/* Primary Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-gray-900 tracking-tight leading-[1.08]">
                  Land your dream job with a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5e59] via-[#ee4e34] to-[#5345ff]">
                    recruiter-approved resume.
                  </span>
                </h1>

                {/* Value Proposition Description */}
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Join over <strong className="font-bold text-gray-900">5,000,000</strong> candidates who got hired at companies like Google, Apple, Nike, Tesla, and Amazon. Build high-converting, ATS-tested resumes with Kickresume&apos;s signature templates and GPT-powered writer.
                </p>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                  <button
                    onClick={() => handleStartWithTemplate("hoth")}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#ff5e59] hover:bg-[#ee4e34] rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Create My Resume Now</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  <Link
                    href="/templates/resume"
                    className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-bold text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    <Layout className="w-4 h-4 mr-2 text-gray-600" />
                    Browse 35+ Templates
                  </Link>

                  <Link
                    href="/ats-checker"
                    className="inline-flex items-center justify-center px-5 py-3.5 text-sm sm:text-base font-bold text-[#5345ff] bg-indigo-50/80 border border-indigo-100 hover:bg-indigo-100/80 rounded-2xl transition-all hover:-translate-y-0.5"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    ATS Checker
                  </Link>
                </div>

                {/* Micro Guarantees */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> No credit card required
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> 5 Free AI Credits
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Instant PDF download
                  </span>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start border-t border-gray-200/70">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[
                      { bg: "#ff5e59", label: "AJ" },
                      { bg: "#5345ff", label: "SC" },
                      { bg: "#00b5b8", label: "MV" },
                      { bg: "#1e293b", label: "ER" },
                      { bg: "#f59e0b", label: "KL" },
                    ].map((user, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold shadow-xs"
                        style={{ backgroundColor: user.bg }}
                      >
                        {user.label}
                      </div>
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-gray-900 ml-1.5">4.9 / 5</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Rated excellent by 5M+ candidates on Product Hunt & Trustpilot
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Kickresume Hoth Template Preview */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl shadow-gray-300/60 border border-gray-200/80 transition-all hover:shadow-orange-500/10">
                  {/* Floating Badges */}
                  <div className="absolute -top-3.5 -right-3.5 bg-[#5345ff] text-white px-3.5 py-1.5 rounded-xl shadow-lg shadow-indigo-500/25 text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>98% ATS Score</span>
                  </div>

                  <div className="absolute -bottom-3 -left-3 bg-white text-gray-900 border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Kickresume Flagship: Hoth</span>
                  </div>

                  {/* Miniature Kickresume Hoth Layout Preview */}
                  <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white text-[10px] leading-snug shadow-sm">
                    {/* Top Banner */}
                    <div className="bg-[#1e293b] text-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#ff5e59] flex items-center justify-center text-white font-extrabold text-sm ring-2 ring-white/30 shrink-0">
                          AJ
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xs sm:text-sm font-black tracking-tight text-white m-0 truncate">
                            Alex Johnson
                          </h2>
                          <p className="text-[10px] text-teal-300 font-bold uppercase tracking-wider mt-0.5 truncate">
                            Lead Full Stack Engineer
                          </p>
                          <p className="text-[9px] text-gray-300 truncate">San Francisco, CA • alex@example.com</p>
                        </div>
                      </div>
                    </div>

                    {/* Body Columns */}
                    <div className="grid grid-cols-12 min-h-[230px]">
                      {/* Left Sidebar */}
                      <div className="col-span-5 bg-[#f8fafc] border-r border-gray-200/80 p-3.5 space-y-3.5">
                        <div>
                          <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-2">
                            Technical Skills
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[8px] font-bold text-gray-700">
                                <span>React & Next.js</span>
                                <span>96%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1">
                                <div className="h-1.5 bg-[#ff5e59] rounded-full w-[96%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[8px] font-bold text-gray-700">
                                <span>TypeScript</span>
                                <span>92%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1">
                                <div className="h-1.5 bg-[#ff5e59] rounded-full w-[92%]" />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[8px] font-bold text-gray-700">
                                <span>AI / OpenAI API</span>
                                <span>88%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1">
                                <div className="h-1.5 bg-[#5345ff] rounded-full w-[88%]" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">
                            Education
                          </div>
                          <p className="font-bold text-gray-800 text-[9px]">B.S. Computer Science</p>
                          <p className="text-gray-500 text-[8px]">Stanford University • 3.9 GPA</p>
                        </div>
                      </div>

                      {/* Right Main Column */}
                      <div className="col-span-7 p-3.5 space-y-3">
                        <div>
                          <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1.5">
                            Work Experience
                          </div>
                          <div className="border-l-2 border-[#ff5e59] pl-2.5 space-y-2.5">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 text-[9px]">Senior Tech Lead</span>
                                <span className="text-[8px] text-gray-400">2022 - Present</span>
                              </div>
                              <p className="text-[8px] text-gray-500">CloudScale Systems • SF</p>
                              <p className="text-[8px] text-gray-700 mt-1 line-clamp-2">
                                • Spearheaded Next.js microservices architecture, boosting transaction throughput by 42%.
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 text-[9px]">Software Engineer</span>
                                <span className="text-[8px] text-gray-400">2019 - 2022</span>
                              </div>
                              <p className="text-[8px] text-gray-500">StartupForge Inc.</p>
                              <p className="text-[8px] text-gray-700 mt-0.5 line-clamp-2">
                                • Mentored 6 junior engineers and shipped real-time telemetry pipelines.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Action footer */}
                    <div className="p-3 bg-gray-50/90 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-700">Want this exact format?</span>
                      <button
                        onClick={() => handleStartWithTemplate("hoth")}
                        className="px-3.5 py-1.5 bg-[#ff5e59] hover:bg-[#ee4e34] text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer transition-colors inline-flex items-center gap-1"
                      >
                        <span>Use Hoth Template</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Launchpad / Document Starter Grid */}
        <section className="py-8 bg-white border-b border-gray-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleStartWithTemplate("hoth")}
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-[#ff5e59] bg-[#fafbfc] hover:bg-orange-50/30 transition-all text-left group shadow-xs cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-100/70 text-[#ff5e59] flex items-center justify-center mr-3.5 shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#ff5e59] transition-colors">
                    Build New Resume
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Start with Hoth or blank canvas</p>
                </div>
              </button>

              <Link
                href="/dashboard/cover-letters"
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-blue-500 bg-[#fafbfc] hover:bg-blue-50/30 transition-all text-left group shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center mr-3.5 shrink-0 group-hover:scale-105 transition-transform">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Cover Letter Builder
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Matching aesthetic in seconds</p>
                </div>
              </Link>

              <Link
                href="/ats-checker"
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-teal-500 bg-[#fafbfc] hover:bg-teal-50/30 transition-all text-left group shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-100/70 text-teal-600 flex items-center justify-center mr-3.5 shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                    Scan with ATS Checker
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Score vs job description</p>
                </div>
              </Link>

              <Link
                href="/ai-writer"
                className="flex items-center p-4 rounded-2xl border border-gray-200 hover:border-indigo-500 bg-[#fafbfc] hover:bg-indigo-50/30 transition-all text-left group shadow-xs"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-100/70 text-[#5345ff] flex items-center justify-center mr-3.5 shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#5345ff] transition-colors">
                    AI Bullet Generator
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Active verbs with metrics</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Companies Trust Banner */}
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Kickresume candidates were hired by recruiters at top employers
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              {["Google", "Apple", "Tesla", "Amazon", "Nike", "Microsoft", "Meta", "Spotify"].map((company) => (
                <span
                  key={company}
                  className="text-lg sm:text-2xl font-black text-gray-800 tracking-tight hover:text-[#ff5e59] transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="py-14 bg-[#f8fafc] border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff5e59] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      {stat.label}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Flagship Templates Showcase */}
        <section className="py-20 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
                  Recruiter-Approved Designs
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 tracking-tight">
                  Kickresume Flagship Templates
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl">
                  Every layout is tested with leading ATS parsers (Workday, Taleo, Greenhouse) and human recruiters.
                </p>
              </div>
              <Link
                href="/templates/resume"
                className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-[#ff5e59] hover:underline"
              >
                <span>Browse all 35+ templates</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flagshipTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group relative bg-[#fafbfc] rounded-3xl border border-gray-200/90 overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base">{template.name}</h3>
                      <span className="text-[10px] font-bold text-[#ff5e59] uppercase tracking-wider">
                        {template.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {template.atsScore}% ATS
                    </span>
                  </div>

                  {/* Visual Template Representation */}
                  <div className="relative aspect-[3/4] p-5 flex items-center justify-center bg-gray-50/70 group-hover:bg-orange-50/20 transition-colors">
                    <div className="w-full h-full bg-white rounded-xl shadow-md p-3.5 flex flex-col border border-gray-200/80 group-hover:scale-105 transition-transform duration-300 overflow-hidden text-[8px]">
                      {/* Stylized Miniature Layout */}
                      <div className="h-6 rounded flex items-center justify-between px-2 text-white font-bold mb-2 shrink-0" style={{ backgroundColor: template.color }}>
                        <span>{template.name} Format</span>
                        <span className="opacity-80 text-[7px]">{template.category}</span>
                      </div>

                      {template.id === "hoth" ? (
                        <div className="grid grid-cols-12 gap-1.5 flex-1">
                          <div className="col-span-4 bg-slate-50 p-1.5 rounded space-y-1.5 border border-slate-100">
                            <div className="h-2 w-full bg-slate-300 rounded" />
                            <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
                            <div className="h-1 w-full bg-orange-400 rounded" />
                            <div className="h-1 w-4/5 bg-slate-200 rounded" />
                          </div>
                          <div className="col-span-8 p-1.5 space-y-1.5">
                            <div className="h-2 w-1/2 bg-slate-400 rounded" />
                            <div className="h-1 w-full bg-slate-200 rounded" />
                            <div className="h-1 w-5/6 bg-slate-200 rounded" />
                            <div className="h-1.5 w-2/3 bg-slate-300 rounded mt-2" />
                            <div className="h-1 w-full bg-slate-200 rounded" />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 flex-1 pt-1">
                          <div className="h-2 w-1/3 bg-slate-400 rounded" />
                          <div className="h-1 w-full bg-slate-200 rounded" />
                          <div className="h-1 w-4/5 bg-slate-200 rounded" />
                          <div className="h-2 w-1/4 bg-slate-400 rounded pt-1" />
                          <div className="h-1 w-full bg-slate-200 rounded" />
                          <div className="h-1 w-3/4 bg-slate-200 rounded" />
                        </div>
                      )}

                      {/* Tags */}
                      <div className="mt-auto pt-2 flex flex-wrap gap-1 border-t border-gray-100">
                        {template.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[7px] font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Description & Action */}
                  <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                    <button
                      onClick={() => handleStartWithTemplate(template.id)}
                      className="w-full py-2.5 bg-gray-900 hover:bg-[#ff5e59] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Use {template.name} Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="py-20 bg-[#f8fafc] border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5345ff]">
                Engineered for Results
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 tracking-tight">
                Everything you need to beat the applicant pool
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-3">
                Automated AI suggestions, keyword optimization, and recruiter-approved formats designed to land you top interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/90 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
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
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-1.5">
                      {feature.bullets.map((b) => (
                        <div key={b} className="flex items-center text-xs text-gray-600 gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3 Simple Steps */}
        <section className="py-20 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
                Quick & Intuitive
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 tracking-tight">
                Build your resume in 3 simple steps
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                No complex formatting hassles. Ready to send in under 10 minutes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose a Flagship Template",
                  desc: "Select Hoth, Europe, Vegan, or Basic. Customize colors, fonts, margins, and density anytime.",
                  icon: Layout,
                },
                {
                  step: "02",
                  title: "Add Details or Use AI Writer",
                  desc: "Type your career history or click to generate impactful, metric-driven achievements tailored to your job title.",
                  icon: Sparkles,
                },
                {
                  step: "03",
                  title: "Export ATS PDF & Get Hired",
                  desc: "Download an ATS-tested PDF ready for immediate job application submission or email to recruiters.",
                  icon: Download,
                },
              ].map((s) => {
                const StepIcon = s.icon;
                return (
                  <div key={s.step} className="p-8 rounded-3xl bg-[#fafbfc] border border-gray-200/80 text-center relative group hover:bg-white hover:shadow-lg transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-[#ff5e59] text-white flex items-center justify-center mx-auto mb-5 shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                      <StepIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100/70 text-[#ff5e59] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                      Step {s.step}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Real Candidate Testimonials */}
        <section className="py-20 bg-[#f8fafc] border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
                Verified Career Success
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1 tracking-tight">
                Join 5M+ hired professionals
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 flex flex-col justify-between"
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
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                      <p className="text-[11px] text-gray-500">{t.role} • <strong className="text-gray-700">{t.company}</strong></p>
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
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Everything you need to know about Kickresume AI 3.0
              </p>
            </div>
            <div className="space-y-3.5">
              {faqItems.map((item) => (
                <FAQItem key={item.question} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Call to Action Banner */}
        <section className="py-20 bg-gradient-to-r from-[#ff5e59] via-[#ee4e34] to-[#ff7b54] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Zap className="w-3.5 h-3.5" />
              <span>Boost your interviews today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              Ready to land your dream job?
            </h2>
            <p className="text-base sm:text-lg text-orange-100 max-w-xl mx-auto leading-relaxed">
              Create an interview-winning resume in under 10 minutes with Kickresume. Start for free today with 5 AI credits included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => handleStartWithTemplate("hoth")}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-black text-[#ff5e59] bg-white rounded-2xl shadow-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Build My Resume Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/templates/resume"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-black/20 hover:bg-black/30 border border-white/30 rounded-2xl transition-all hover:-translate-y-0.5"
              >
                Browse All Templates
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
