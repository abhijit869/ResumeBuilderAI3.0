"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  PenTool,
  Sparkles,
  BarChart3,
  Plus,
  Clock,
  ChevronRight,
  Copy,
  Trash2,
  Edit,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  ExternalLink,
  RefreshCw,
  Globe,
  Compass,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { resumes, createResume, duplicateResume, deleteResume, loadSampleResume } = useResumeStore();
  const router = useRouter();

  const handleCreateNew = () => {
    const newResume = createResume("My Resume");
    router.push(`/editor/resume/${newResume.id}`);
  };

  const handleLoadSample = () => {
    const sample = loadSampleResume();
    router.push(`/editor/resume/${sample.id}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Welcome Banner - Kickresume Style */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e293b] rounded-2xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden border border-gray-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-[#ff5e59]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff5e59]/20 text-[#ff5e59] border border-[#ff5e59]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Kickresume Pro AI Suite
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              5 AI Credits • Unlimited PDF Downloads
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "sodopel885"}! 👋
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base leading-relaxed">
            Create recruiter-approved resumes, match them against job postings with the ATS checker, and let AI tailor bullet points to help you land interviews faster.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleCreateNew}
              className="btn-kr-primary h-10 px-5 text-sm font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              New Resume
            </Button>
            <Button
              variant="outline"
              onClick={handleLoadSample}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold text-sm h-10 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-[#00b5b8]" />
              Load Sample CV
            </Button>
            <Link href="/templates/resume">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 text-sm h-10"
              >
                Browse Templates
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards - Kickresume Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Resume Builder",
            desc: "Create and edit your resumes with AI help",
            icon: FileText,
            color: "coral",
            action: handleCreateNew,
          },
          {
            title: "Cover Letter Builder",
            desc: "Create matching cover letters in minutes",
            icon: PenTool,
            color: "blue",
            href: "/dashboard/cover-letters",
          },
          {
            title: "AI Resume Writer",
            desc: "Generate bullet points with GPT & AI",
            icon: Sparkles,
            color: "indigo",
            href: "/ai-writer",
          },
          {
            title: "ATS Resume Checker",
            desc: "Discover weak points and score ATS compatibility",
            icon: BarChart3,
            color: "teal",
            href: "/ats-checker",
          },
        ].map((action, i) => (
          <div
            key={i}
            onClick={action.action ? action.action : () => action.href && router.push(action.href)}
            className="kr-card p-5 cursor-pointer group flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                action.color === "coral"
                  ? "bg-[#ff5e59]/10 text-[#ff5e59]"
                  : action.color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : action.color === "indigo"
                  ? "bg-[#5345ff]/10 text-[#5345ff]"
                  : "bg-[#00b5b8]/10 text-[#00b5b8]"
              }`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#ff5e59] transition-colors text-sm">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{action.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resume Strength & ATS Readiness Widget */}
      <div className="kr-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-emerald-600">94</span>
              <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">ATS Readiness & Resume Strength</h3>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[10px]">
                  Top 5% Match
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Your primary resume is optimized with quantifiable achievements, active verbs, and standard headers that pass through ATS filters (Workday, Greenhouse, Lever).
              </p>
            </div>
          </div>

          <Link href="/ats-checker">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 whitespace-nowrap">
              <BarChart3 className="w-3.5 h-3.5 text-[#ff5e59]" />
              Run Full ATS Scan
            </Button>
          </Link>
        </div>

        {/* 3 Quick Checklist recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Action verbs in all experience entries</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Contact info & LinkedIn profile verified</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Quantified metrics and measurable results</span>
          </div>
        </div>
      </div>

      {/* Resumes Library Grid */}
      <div className="kr-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Resumes</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage, duplicate, customize, and export your resumes
            </p>
          </div>
          <Link
            href="/dashboard/resumes"
            className="text-xs sm:text-sm font-semibold text-[#ff5e59] hover:text-[#ee4e34] flex items-center gap-1"
          >
            <span>View All Resumes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Resume Card placeholder */}
          <div
            onClick={handleCreateNew}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center hover:border-[#ff5e59] hover:bg-[#ff5e59]/5 transition-all cursor-pointer group bg-gray-50/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff5e59]/10 text-[#ff5e59] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <p className="font-bold text-gray-900 group-hover:text-[#ff5e59] text-base">
              Create New Resume
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-[180px]">
              Start from scratch or use an ATS-approved template
            </p>
          </div>

          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="kr-card overflow-hidden flex flex-col justify-between group"
            >
              {/* Visual Thumbnail Representation */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-48 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                    <div className="w-4 h-4 rounded-full bg-[#ff5e59] text-white text-[8px] flex items-center justify-center font-bold">
                      {resume.personalInfo?.firstName?.charAt(0) || "J"}
                    </div>
                    <div className="h-1.5 w-16 bg-gray-900 rounded"></div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                  <div className="pt-1 flex gap-1">
                    <div className="h-1.5 w-6 bg-red-100 rounded"></div>
                    <div className="h-1.5 w-8 bg-red-100 rounded"></div>
                  </div>
                </div>

                {/* Template Tag */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-xs bg-white/95 text-gray-700">
                    {resume.templateId || "Hoth"}
                  </Badge>
                </div>

                {/* Score badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/95 px-2 py-0.5 rounded-full shadow-xs">
                    {resume.atsScore || 94}% ATS
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base group-hover:text-[#ff5e59] transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {resume.personalInfo?.title || "Professional Role"} • {resume.personalInfo?.location || "Remote"}
                </p>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <Link href={`/editor/resume/${resume.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full btn-kr-primary text-white font-semibold text-xs h-8.5 gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Resume
                    </Button>
                  </Link>

                  <button
                    onClick={() => duplicateResume(resume.id)}
                    title="Duplicate Resume"
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this resume?")) {
                        deleteResume(resume.id);
                      }
                    }}
                    title="Delete Resume"
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Career Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kr-card p-6 border-l-4 border-l-[#ff5e59]">
          <div className="w-10 h-10 rounded-xl bg-[#ff5e59]/10 text-[#ff5e59] flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Action Verb Optimization</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Leading recruiters look for active verbs like "Spearheaded", "Engineered", and "Optimized" rather than passive duties.
          </p>
        </div>

        <div className="kr-card p-6 border-l-4 border-l-[#5345ff]">
          <div className="w-10 h-10 rounded-xl bg-[#5345ff]/10 text-[#5345ff] flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Quantifiable Achievements</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Quantify impact with percentage growth, revenue numbers, team sizes, and time saved to stand out in the top 5% of candidates.
          </p>
        </div>

        <div className="kr-card p-6 border-l-4 border-l-[#00b5b8]">
          <div className="w-10 h-10 rounded-xl bg-[#00b5b8]/10 text-[#00b5b8] flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">ATS Formatting Standards</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            All Kickresume templates are verified against Applicant Tracking Systems to guarantee accurate extraction of your contact details and skills.
          </p>
        </div>
      </div>
    </div>
  );
}
