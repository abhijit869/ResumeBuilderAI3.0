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
    const newResume = createResume("My Professional Resume");
    router.push(`/editor/resume/${newResume.id}`);
  };

  const handleLoadSample = () => {
    const sample = loadSampleResume();
    router.push(`/editor/resume/${sample.id}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-900/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Pro Career Suite Activated
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Unlimited PDF Downloads & AI Writing
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Candidate"}! 👋
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Manage your resumes, match them against job postings with the ATS scanner, and let AI tailor bullet points to help you land interviews faster.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={handleCreateNew}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 text-sm h-10 px-5"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              Create New Resume
            </Button>
            <Button
              variant="outline"
              onClick={handleLoadSample}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-medium text-sm h-10"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Load Demo Resume
            </Button>
            <Link href="/templates/resume">
              <Button
                variant="ghost"
                className="text-slate-200 hover:text-white hover:bg-white/10 text-sm h-10"
              >
                Browse 35+ Templates
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Resume Builder",
            desc: "Craft an ATS-optimized resume",
            icon: FileText,
            color: "emerald",
            action: handleCreateNew,
          },
          {
            title: "Cover Letter Builder",
            desc: "Matching letter for applications",
            icon: PenTool,
            color: "blue",
            href: "/dashboard/cover-letters",
          },
          {
            title: "AI Resume Writer",
            desc: "Generate bullet points with GPT",
            icon: Sparkles,
            color: "purple",
            href: "/ai-writer",
          },
          {
            title: "ATS Resume Checker",
            desc: "Score and optimize keywords",
            icon: BarChart3,
            color: "amber",
            href: "/ats-checker",
          },
        ].map((action, i) => (
          <div
            key={i}
            onClick={action.action ? action.action : () => action.href && router.push(action.href)}
            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                action.color === "emerald"
                  ? "bg-emerald-50 text-emerald-600"
                  : action.color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : action.color === "purple"
                  ? "bg-purple-50 text-purple-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{action.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resume Strength & ATS Readiness Widget */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black text-emerald-600">94</span>
              <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">Career Readiness & ATS Score</h3>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none text-[10px]">
                  High Match
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Your primary resume is well-structured with quantifiable bullet points and clear section headers that parse seamlessly through Workday, Taleo, and Greenhouse.
              </p>
            </div>
          </div>

          <Link href="/ats-checker">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 whitespace-nowrap">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
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
            <span>Contact info & LinkedIn profile linked</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Quantified outcomes and percentage metrics</span>
          </div>
        </div>
      </div>

      {/* Resumes Library Grid */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Resumes</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage, duplicate, customize, and export your resumes
            </p>
          </div>
          <Link
            href="/dashboard/resumes"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Resume Card placeholder */}
          <div
            onClick={handleCreateNew}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group bg-slate-50/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <p className="font-bold text-gray-900 group-hover:text-emerald-700 text-base">
              Create New Resume
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-[180px]">
              Start from scratch or use an ATS template
            </p>
          </div>

          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Visual Thumbnail Representation */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-44 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                      {resume.personalInfo?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="h-1.5 w-16 bg-gray-900 rounded"></div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                  <div className="pt-1 flex gap-1">
                    <div className="h-1.5 w-6 bg-emerald-100 rounded"></div>
                    <div className="h-1.5 w-8 bg-emerald-100 rounded"></div>
                  </div>
                </div>

                {/* Template Tag */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-sm bg-white/90 text-gray-700">
                    {resume.templateId}
                  </Badge>
                </div>

                {/* Score badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full shadow-sm">
                    94% ATS
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

                <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
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
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8.5 gap-1.5"
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
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Action Verb Optimization</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Leading recruiters look for active verbs like "Spearheaded", "Engineered", and "Optimized" rather than passive duties.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Quantifiable Achievements</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Quantify impact with percentage growth, revenue numbers, team sizes, and time saved to stand out in the top 5% of candidates.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-100">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">ATS Formatting Standards</h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            All our templates are verified against Applicant Tracking Systems to guarantee accurate extraction of your contact details and skills.
          </p>
        </div>
      </div>
    </div>
  );
}
