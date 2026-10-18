"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, FileText, PenTool, Sparkles, BarChart3, ArrowRight } from "lucide-react";

const navFeatures = [
  {
    title: "Resume Builder",
    desc: "Create your best resume yet. Recruiter approved.",
    href: "/dashboard/resumes",
    icon: FileText,
  },
  {
    title: "Cover Letter Builder",
    desc: "Write matching letters that stand out.",
    href: "/dashboard/cover-letters",
    icon: PenTool,
  },
  {
    title: "ATS Resume Checker",
    desc: "Scan and optimize resume for ATS systems.",
    href: "/ats-checker",
    icon: BarChart3,
  },
  {
    title: "AI Resume Writer",
    desc: "Generate bullet points with GPT & AI.",
    href: "/ai-writer",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs" style={{ backgroundColor: "#ff5e59" }}>
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Kick<span className="text-[#ff5e59]">resume</span>
              <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                AI 3.0
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("features")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#ff5e59] rounded-lg transition-colors cursor-pointer">
                <span>Features</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {activeDropdown === "features" && (
                <div className="absolute top-full left-0 w-[540px] bg-white border border-gray-200 rounded-2xl shadow-xl p-3 grid grid-cols-2 gap-2">
                  {navFeatures.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-9 h-9 bg-[#ff5e59]/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4.5 h-4.5 text-[#ff5e59]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resume Link */}
            <Link
              href="/templates/resume"
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#ff5e59] rounded-lg transition-colors"
            >
              Templates
            </Link>

            {/* ATS Checker */}
            <Link
              href="/ats-checker"
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#ff5e59] rounded-lg transition-colors flex items-center gap-1"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#ff5e59]" />
              <span>ATS Checker</span>
            </Link>

            {/* AI Writer */}
            <Link
              href="/ai-writer"
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#5345ff] rounded-lg transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5345ff]" />
              <span>AI Writer</span>
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#ff5e59] rounded-lg transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard/resumes"
              className="btn-kr-primary px-4 py-2 text-xs font-bold rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>My Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/dashboard/resumes"
              className="btn-kr-primary px-3 py-1.5 text-xs font-bold rounded-lg"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/dashboard/resumes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            My Resumes
          </Link>
          <Link
            href="/dashboard/cover-letters"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            Cover Letters
          </Link>
          <Link
            href="/ats-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            ATS Resume Checker
          </Link>
          <Link
            href="/ai-writer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            AI Resume Writer
          </Link>
          <Link
            href="/templates/resume"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            Pricing
          </Link>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg"
            >
              Log In
            </Link>
            <Link
              href="/dashboard/resumes"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center btn-kr-primary py-2 text-sm font-bold rounded-lg shadow-sm"
            >
              Create My Resume
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
