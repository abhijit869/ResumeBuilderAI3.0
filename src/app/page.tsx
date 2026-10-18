"use client";

import React from "react";
import Link from "next/link";
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
  Users,
  Download,
  Award,
  ChevronDown,
  Zap,
  Shield,
  Layout,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Build a professional resume in minutes with our intuitive drag-and-drop editor. Choose from 30+ ATS-friendly templates.",
    color: "emerald",
  },
  {
    icon: PenTool,
    title: "Cover Letter Builder",
    description:
      "Create a matching cover letter that complements your resume. Stand out from other applicants.",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "AI Resume Writer",
    description:
      "Let our AI write your resume content. Just provide your job title and our AI will generate tailored bullet points.",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "ATS Resume Checker",
    description:
      "Get instant feedback on your resume. Our ATS checker ensures your resume passes automated screening systems.",
    color: "orange",
  },
];

const stats = [
  { number: "8M+", label: "Resumes Created" },
  { number: "150+", label: "Countries" },
  { number: "35+", label: "Templates" },
  { number: "95%", label: "Success Rate" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "ResumeBuilderAI helped me land my dream job at Google. The AI-powered suggestions were incredibly helpful for tailoring my resume to specific job descriptions.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Director",
    content:
      "I was able to create a stunning resume in under 10 minutes. The templates are modern and professional. Highly recommended!",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at Apple",
    content:
      "The ATS checker feature is a game-changer. I finally understood why my resumes weren't getting through. After optimizing with this tool, I got 3x more interviews.",
    rating: 5,
    avatar: "ER",
  },
];

const faqItems = [
  {
    question: "Is ResumeBuilderAI free to use?",
    answer:
      "Yes! You can create a resume for free with our basic templates. Premium features like AI writing, ATS checking, and premium templates are available with our Pro plan.",
  },
  {
    question: "Are the resume templates ATS-friendly?",
    answer:
      "Absolutely. All of our templates are designed to be parsed correctly by Applicant Tracking Systems (ATS). We regularly test our templates against the most popular ATS software.",
  },
  {
    question: "Can I download my resume as a PDF?",
    answer:
      "Yes, you can download your resume as a high-quality PDF file. Free users can download with a watermark, while premium users get clean, watermark-free PDFs.",
  },
  {
    question: "How does the AI Resume Writer work?",
    answer:
      "Our AI Resume Writer uses advanced language models to generate professional resume content. Simply enter your job title and key responsibilities, and our AI will create tailored bullet points optimized for your target role.",
  },
  {
    question: "Can I create multiple resumes?",
    answer:
      "Yes! Free users can create up to 2 resumes. Premium users can create unlimited resumes and cover letters, perfect for applying to different types of positions.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-semibold text-gray-900">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Resume Builder</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Create a resume that{" "}
                <span className="gradient-text">gets you hired</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Professional resume and cover letter builder used by millions of
                job seekers worldwide. Choose from 35+ templates approved by
                recruiters and HR professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-200"
                >
                  Create Your Resume
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/templates/resume"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
                >
                  Browse Templates
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 ${color} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    )
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Loved by 8M+ job seekers
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Resume Preview */}
            <div className="relative animate-float hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-md mx-auto">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl">
                    AJ
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Alex Johnson
                    </h3>
                    <p className="text-sm text-emerald-600 font-medium">
                      Senior Software Engineer
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      San Francisco, CA • alex@email.com
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Experience
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Senior Software Engineer
                          </p>
                          <p className="text-xs text-gray-500">
                            TechCorp Inc.
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          2021 - Present
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Software Engineer
                          </p>
                          <p className="text-xs text-gray-500">StartupXYZ</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          2018 - 2020
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "TypeScript",
                        "React",
                        "Node.js",
                        "Python",
                        "AWS",
                        "Docker",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-semibold">
                ✨ ATS Score: 95%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools that help you create professional documents,
              optimize for ATS, and stand out from the competition.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : feature.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : feature.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-orange-100 text-orange-600"
                  } group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Create your resume in 3 easy steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No complicated forms. No confusing interfaces. Just a simple,
              streamlined process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Layout,
                title: "Pick a template",
                description:
                  "Choose from 35+ professionally designed resume templates. All templates are ATS-friendly and recruiter-approved.",
              },
              {
                step: "02",
                icon: Zap,
                title: "Fill in your details",
                description:
                  "Use our intuitive editor to add your experience, skills, and education. Let our AI suggest improvements.",
              },
              {
                step: "03",
                icon: Download,
                title: "Download & apply",
                description:
                  "Download your polished resume as PDF and start applying. Track your applications with our built-in tools.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <item.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why millions of job seekers choose us
            </h2>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              We&apos;ve helped over 8 million people create resumes that get
              noticed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "ATS-Optimized",
                description:
                  "All templates pass through Applicant Tracking Systems, ensuring your resume reaches human recruiters.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description:
                  "Our AI analyzes job descriptions and suggests tailored content to help your resume stand out.",
              },
              {
                icon: Award,
                title: "Recruiter-Approved",
                description:
                  "Templates designed with input from HR professionals at top companies like Google, Amazon, and Meta.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20"
              >
                <item.icon className="w-10 h-10 mb-4 text-emerald-200" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What our users say
            </h2>
            <p className="text-lg text-gray-600">
              Join millions of satisfied job seekers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about ResumeBuilderAI
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build your perfect resume?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join over 8 million job seekers who have already created their
            resumes with ResumeBuilderAI. It only takes a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-emerald-700 bg-white hover:bg-gray-100 rounded-xl shadow-lg transition-all"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
