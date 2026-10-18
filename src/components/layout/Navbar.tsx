"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, FileText, PenTool, Globe, Sparkles, BarChart3, Bot, Crown } from "lucide-react";

const navFeatures = [
  {
    title: "Resume Builder",
    desc: "Create your best resume yet. Get hired.",
    href: "/resumes",
    icon: FileText,
  },
  {
    title: "Cover Letter Builder",
    desc: "Attach a matching cover letter.",
    href: "/cover-letters",
    icon: PenTool,
  },
  {
    title: "Website Builder",
    desc: "Let employers find you online.",
    href: "/website",
    icon: Globe,
  },
  {
    title: "AI Resume Writer",
    desc: "Let AI write your resume.",
    href: "/ai-writer",
    icon: Sparkles,
  },
  {
    title: "ATS Resume Checker",
    desc: "Get instant feedback for your resume.",
    href: "/ats-checker",
    icon: BarChart3,
  },
  {
    title: "AI Cover Letter Writer",
    desc: "AI-powered cover letter writer.",
    href: "/ai-cover-letter",
    icon: Bot,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Resume<span className="text-emerald-600">Builder</span>AI
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
              <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-lg transition-colors">
                <span>Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "features" && (
                <div className="absolute top-full left-0 w-[600px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 grid grid-cols-2 gap-2">
                  {navFeatures.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
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
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-lg transition-colors"
            >
              Resume Templates
            </Link>

            {/* Cover Letter Link */}
            <Link
              href="/templates/cover-letter"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-lg transition-colors"
            >
              Cover Letters
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-lg transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
            >
              Create Resume
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {navFeatures.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-900">
                  {item.title}
                </span>
              </Link>
            ))}
            <hr className="border-gray-200" />
            <Link
              href="/pricing"
              className="block p-3 text-sm font-medium text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex space-x-3 pt-2">
              <Link
                href="/login"
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
