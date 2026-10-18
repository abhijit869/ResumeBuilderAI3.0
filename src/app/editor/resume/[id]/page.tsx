"use client";

import React, { useState, useRef, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Sparkles,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  ZoomIn,
  ZoomOut,
  FolderGit2,
  Award,
  Globe,
  Palette,
  Layout,
  RefreshCw,
  Type,
  Maximize2,
  FileCheck,
  Check,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { ResumeData, ResumeCustomization, WorkExperience, Education, Skill, Project, Certification, Language } from "@/types/resume";
import { sampleResume } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { TechTemplate } from "@/components/templates/TechTemplate";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";
import { downloadElementAsPdf } from "@/lib/pdf";

const COLOR_OPTIONS = [
  { name: "Emerald", value: "#059669" },
  { name: "Teal", value: "#0d9488" },
  { name: "Navy", value: "#1e293b" },
  { name: "Sapphire", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#d97706" },
  { name: "Forest", value: "#15803d" },
  { name: "Crimson", value: "#be123c" },
  { name: "Slate", value: "#475569" },
  { name: "Midnight", value: "#0f172a" },
];

const TEMPLATES = [
  { id: "professional", name: "Professional", desc: "Corporate standard, clean header" },
  { id: "modern", name: "Modern", desc: "Two-column sidebar, balanced design" },
  { id: "executive", name: "Executive", desc: "Harvard / Wall Street serif layout" },
  { id: "tech", name: "Tech / Code", desc: "Developer-centric with code badges" },
  { id: "creative", name: "Creative", desc: "Vibrant header with timeline" },
  { id: "minimal", name: "Minimal", desc: "Distraction-free, typographic focus" },
];

const FONT_OPTIONS = [
  { id: "sans", name: "Inter (Modern Sans)", desc: "Clean, ATS-friendly, universally compatible" },
  { id: "serif", name: "Merriweather (Classic Serif)", desc: "Formal, authoritative, executive standard" },
  { id: "mono", name: "JetBrains Mono (Tech)", desc: "Monospaced, technical, developer profile" },
];

const SPACING_OPTIONS = [
  { id: "compact", name: "Compact (Single Page)", desc: "Tight line-height & margins to fit dense resumes" },
  { id: "normal", name: "Standard (Balanced)", desc: "Optimized readability and balanced whitespace" },
  { id: "spacious", name: "Spacious (Relaxed)", desc: "Generous breathing room for concise careers" },
];

const FONT_SIZE_OPTIONS = [
  { id: "sm", name: "Small (0.9x)", desc: "Fits 10-15% more text" },
  { id: "md", name: "Medium (1.0x)", desc: "Standard recommended size" },
  { id: "lg", name: "Large (1.08x)", desc: "High legibility" },
];

function ResumeEditorInner() {
  const params = useParams();
  const resumeId = params?.id as string;

  const { resumes, updateResume } = useResumeStore();
  const resume = resumes.find((item) => item.id === resumeId);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeSection, setActiveSection] = useState<string>("style");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatingBulletsIndex, setGeneratingBulletsIndex] = useState<number | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const printRef = useRef<HTMLDivElement>(null);

  const customization = resume?.customization || {};
  const currentAccent = customization.accentColor || "#059669";
  const currentFont = customization.fontFamily || "sans";
  const currentFontSize = customization.fontSize || "md";
  const currentSpacing = customization.spacing || "normal";
  const currentPaper = customization.paperSize || "a4";

  const handleUpdate = (updatedData: Partial<ResumeData>) => {
    if (!resume) return;
    updateResume(resume.id, updatedData);
    setSaveStatus("Saving...");
    setTimeout(() => setSaveStatus("Saved"), 500);
  };

  const handleUpdateCustomization = (customUpdates: Partial<ResumeCustomization>) => {
    if (!resume) return;
    const merged = { ...(resume.customization || {}), ...customUpdates };
    handleUpdate({ customization: merged });
  };

  const handleLoadSampleData = () => {
    if (!resume) return;
    if (confirm("Replace current content with pre-filled sample portfolio data?")) {
      handleUpdate({
        personalInfo: sampleResume.personalInfo,
        workExperience: sampleResume.workExperience,
        education: sampleResume.education,
        skills: sampleResume.skills,
        projects: sampleResume.projects,
        certifications: sampleResume.certifications,
        languages: sampleResume.languages,
      });
    }
  };

  const handleGenerateSummary = async () => {
    if (!resume) return;
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          jobTitle: resume.personalInfo.title || "Software Engineer",
        }),
      });
      const data = await res.json();
      if (data.result) {
        handleUpdate({
          personalInfo: { ...resume.personalInfo, summary: data.result },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleGenerateExperienceBullets = async (index: number) => {
    if (!resume) return;
    const job = resume.workExperience[index];
    if (!job) return;

    setGeneratingBulletsIndex(index);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bullets",
          jobTitle: job.position || "Professional",
          company: job.company || "Company",
        }),
      });
      const data = await res.json();
      if (data.result && Array.isArray(data.result)) {
        const updated = [...resume.workExperience];
        updated[index].highlights = [...(updated[index].highlights || []), ...data.result];
        handleUpdate({ workExperience: updated });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingBulletsIndex(null);
    }
  };

  const handleAddExperience = () => {
    if (!resume) return;
    const newJob: WorkExperience = {
      id: "we-" + Date.now(),
      company: "Company Name",
      position: "Position Title",
      location: "City, Country",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "Spearheaded key product initiatives and optimized workflows.",
      highlights: ["Achieved measurable improvements in team efficiency", "Mentored colleagues and drove excellence"],
    };
    handleUpdate({ workExperience: [newJob, ...(resume.workExperience || [])] });
  };

  const handleAddEducation = () => {
    if (!resume) return;
    const newEdu: Education = {
      id: "edu-" + Date.now(),
      institution: "University / College",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "City, State",
      startDate: "2018",
      endDate: "2022",
      current: false,
      description: "Graduated with honors",
    };
    handleUpdate({ education: [newEdu, ...(resume.education || [])] });
  };

  const handleAddSkill = () => {
    if (!resume) return;
    const newSkill: Skill = {
      id: "sk-" + Date.now(),
      name: "New Skill",
      level: "advanced",
      category: "Technical",
    };
    handleUpdate({ skills: [...(resume.skills || []), newSkill] });
  };

  const handleAddProject = () => {
    if (!resume) return;
    const newProj: Project = {
      id: "proj-" + Date.now(),
      name: "Portfolio / Tool Name",
      description: "Architected and delivered an end-to-end application solving user pain points.",
      url: "https://github.com",
      startDate: "2023",
      highlights: ["Used modern tech stack", "Optimized performance and UX"],
    };
    handleUpdate({ projects: [newProj, ...(resume.projects || [])] });
  };

  const handleAddCertification = () => {
    if (!resume) return;
    const newCert: Certification = {
      id: "cert-" + Date.now(),
      name: "Professional Certificate",
      issuer: "Issuing Organization",
      date: "2023",
    };
    handleUpdate({ certifications: [newCert, ...(resume.certifications || [])] });
  };

  const handleAddLanguage = () => {
    if (!resume) return;
    const newLang: Language = {
      id: "lang-" + Date.now(),
      name: "English",
      proficiency: "fluent",
    };
    handleUpdate({ languages: [...(resume.languages || []), newLang] });
  };

  const handleDownloadPdf = async () => {
    if (!resume || !printRef.current) return;

    setExportingPdf(true);
    try {
      await downloadElementAsPdf(printRef.current, resume.title);
    } catch (error) {
      console.error(error);
      setSaveStatus("PDF export failed");
    } finally {
      setExportingPdf(false);
    }
  };

  if (!resume) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Resume not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create or select a resume from your document library to start editing.
          </p>
          <Link
            href="/dashboard/resumes"
            className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between no-print shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resumes"
            className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            title="Back to Resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="font-bold text-gray-900 text-sm sm:text-base bg-transparent hover:bg-gray-50 focus:bg-white px-2 py-0.5 rounded-lg border border-transparent hover:border-gray-300 focus:border-emerald-500 outline-none max-w-[200px] sm:max-w-xs"
            />
            <span className="text-[11px] text-gray-400 block px-2">
              Status: <span className="text-emerald-600 font-medium">{saveStatus}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Quick Design Mode Switcher button */}
          <button
            onClick={() => setActiveSection("style")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === "style"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Style</span>
          </button>

          {/* Quick Template Picker */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <Layout className="w-3.5 h-3.5 text-gray-500 ml-1.5" />
            <select
              value={resume.templateId}
              onChange={(e) => handleUpdate({ templateId: e.target.value })}
              className="bg-transparent text-xs font-semibold text-gray-800 outline-none px-2 py-1 rounded cursor-pointer capitalize"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Pre-fill Sample */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSampleData}
            className="text-xs h-8 text-gray-700 hidden md:flex items-center gap-1"
            title="Populate with complete sample data"
          >
            <RefreshCw className="w-3 h-3 text-emerald-600" />
            Pre-fill Demo
          </Button>

          {/* Download PDF button */}
          <Button
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-8 sm:h-9 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{exportingPdf ? "Generating..." : "Download PDF"}</span>
          </Button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Form Editor & Customizer Pane */}
        <div className="w-full lg:w-[48%] bg-white border-r border-gray-200 overflow-y-auto p-5 sm:p-6 space-y-6 no-print max-h-[calc(100vh-62px)]">
          {/* Section Selector Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none">
            {[
              { id: "style", label: "Design & Style", icon: Palette, highlight: true },
              { id: "personal", label: "Personal", icon: User },
              { id: "summary", label: "Summary", icon: Sparkles },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Wrench },
              { id: "projects", label: "Projects", icon: FolderGit2 },
              { id: "certifications", label: "Certs", icon: Award },
              { id: "languages", label: "Languages", icon: Globe },
            ].map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSection === sec.id
                      ? sec.highlight
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* SECTION: DESIGN & STYLE CUSTOMIZER */}
          {activeSection === "style" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Resume Customizer & Themes</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tailor your template layout, typography, colors, and line spacing.
                </p>
              </div>

              {/* 1. Template Layout Switcher */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-emerald-600" />
                  1. Choose Layout Template
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => handleUpdate({ templateId: tmpl.id })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        resume.templateId === tmpl.id
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">{tmpl.name}</span>
                        {resume.templateId === tmpl.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{tmpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Color Themes & Custom HEX Picker */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                    2. Accent Color Palette
                  </Label>
                  <span className="text-xs font-mono text-gray-500">{currentAccent}</span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleUpdateCustomization({ accentColor: c.value })}
                      style={{ backgroundColor: c.value }}
                      className={`h-9 rounded-xl transition-all relative flex items-center justify-center ${
                        currentAccent === c.value
                          ? "ring-2 ring-offset-2 ring-slate-900 scale-105 shadow-md"
                          : "hover:scale-105"
                      }`}
                      title={c.name}
                    >
                      {currentAccent === c.value && (
                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Hex Picker Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={currentAccent}
                    onChange={(e) => handleUpdateCustomization({ accentColor: e.target.value })}
                    className="w-9 h-9 rounded-xl border border-gray-300 cursor-pointer p-0.5 bg-white"
                    title="Choose custom HEX color"
                  />
                  <div className="flex-1">
                    <Input
                      value={currentAccent}
                      placeholder="#059669"
                      onChange={(e) => handleUpdateCustomization({ accentColor: e.target.value })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500">Custom Brand Color</span>
                </div>
              </div>

              {/* 3. Typography Fonts */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-emerald-600" />
                  3. Typography & Font Family
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {FONT_OPTIONS.map((font) => (
                    <div
                      key={font.id}
                      onClick={() => handleUpdateCustomization({ fontFamily: font.id as any })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        currentFont === font.id
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-gray-900 text-xs ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                          {font.name}
                        </span>
                        {currentFont === font.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{font.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Spacing & Density */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                  4. Layout Spacing & Page Density
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SPACING_OPTIONS.map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => handleUpdateCustomization({ spacing: sp.id as any })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        currentSpacing === sp.id
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">{sp.name}</span>
                        {currentSpacing === sp.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{sp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Font Size & Paper Format */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 block">
                    Font Scale
                  </Label>
                  <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                    {FONT_SIZE_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleUpdateCustomization({ fontSize: f.id as any })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          currentFontSize === f.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {f.id.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 block">
                    Paper Format
                  </Label>
                  <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
                    {[
                      { id: "a4", label: "A4 (Global)" },
                      { id: "letter", label: "US Letter" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleUpdateCustomization({ paperSize: p.id as any })}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          currentPaper === p.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Personal Info */}
          {activeSection === "personal" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={resume.personalInfo.firstName}
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, firstName: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={resume.personalInfo.lastName}
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, lastName: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Professional Title</Label>
                <Input
                  value={resume.personalInfo.title}
                  placeholder="e.g. Senior Software Engineer"
                  onChange={(e) =>
                    handleUpdate({
                      personalInfo: { ...resume.personalInfo, title: e.target.value },
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, email: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={resume.personalInfo.phone}
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, phone: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={resume.personalInfo.location}
                  placeholder="City, State / Country"
                  onChange={(e) =>
                    handleUpdate({
                      personalInfo: { ...resume.personalInfo, location: e.target.value },
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Website / Portfolio</Label>
                  <Input
                    value={resume.personalInfo.website || ""}
                    placeholder="portfolio.com"
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, website: e.target.value },
                      })
                    }
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={resume.personalInfo.linkedin || ""}
                    placeholder="linkedin.com/in/..."
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, linkedin: e.target.value },
                      })
                    }
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label>GitHub</Label>
                  <Input
                    value={resume.personalInfo.github || ""}
                    placeholder="github.com/..."
                    onChange={(e) =>
                      handleUpdate({
                        personalInfo: { ...resume.personalInfo, github: e.target.value },
                      })
                    }
                    className="mt-1 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Summary */}
          {activeSection === "summary" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Professional Summary</h3>
                  <p className="text-xs text-gray-500">Hook the recruiter with a concise 3-4 sentence overview.</p>
                </div>
                <Button
                  onClick={handleGenerateSummary}
                  disabled={generatingAI}
                  size="sm"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {generatingAI ? "AI Generating..." : "Write with AI"}
                </Button>
              </div>

              <Textarea
                rows={6}
                value={resume.personalInfo.summary}
                onChange={(e) =>
                  handleUpdate({
                    personalInfo: { ...resume.personalInfo, summary: e.target.value },
                  })
                }
                placeholder="Brief summary of your professional background, top skills, and major achievements..."
                className="text-sm leading-relaxed"
              />
            </div>
          )}

          {/* Section: Work Experience */}
          {activeSection === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Work Experience</h3>
                  <p className="text-xs text-gray-500">List your professional employment history.</p>
                </div>
                <Button
                  onClick={handleAddExperience}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Position
                </Button>
              </div>

              <div className="space-y-6">
                {(resume.workExperience || []).map((job, index) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group">
                    <button
                      onClick={() => {
                        const updated = resume.workExperience.filter((_, i) => i !== index);
                        handleUpdate({ workExperience: updated });
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1 rounded-md"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <Label className="text-xs">Position Title</Label>
                        <Input
                          value={job.position}
                          onChange={(e) => {
                            const updated = [...resume.workExperience];
                            updated[index].position = e.target.value;
                            handleUpdate({ workExperience: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Company</Label>
                        <Input
                          value={job.company}
                          onChange={(e) => {
                            const updated = [...resume.workExperience];
                            updated[index].company = e.target.value;
                            handleUpdate({ workExperience: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          value={job.startDate}
                          onChange={(e) => {
                            const updated = [...resume.workExperience];
                            updated[index].startDate = e.target.value;
                            handleUpdate({ workExperience: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Date</Label>
                        <Input
                          value={job.endDate}
                          disabled={job.current}
                          onChange={(e) => {
                            const updated = [...resume.workExperience];
                            updated[index].endDate = e.target.value;
                            handleUpdate({ workExperience: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={job.current}
                            onChange={(e) => {
                              const updated = [...resume.workExperience];
                              updated[index].current = e.target.checked;
                              handleUpdate({ workExperience: updated });
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Present</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Role Description</Label>
                      <Textarea
                        rows={2}
                        value={job.description}
                        onChange={(e) => {
                          const updated = [...resume.workExperience];
                          updated[index].description = e.target.value;
                          handleUpdate({ workExperience: updated });
                        }}
                        className="mt-1 text-xs"
                      />
                    </div>

                    {/* AI Highlights Generator for this job */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-semibold text-gray-700">Key Achievements / Bullets</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={generatingBulletsIndex === index}
                          onClick={() => handleGenerateExperienceBullets(index)}
                          className="text-[11px] h-7 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                          {generatingBulletsIndex === index ? "Generating..." : "AI Generate Bullets"}
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        {(job.highlights || []).map((hl, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2">
                            <Input
                              value={hl}
                              onChange={(e) => {
                                const updated = [...resume.workExperience];
                                updated[index].highlights[hIdx] = e.target.value;
                                handleUpdate({ workExperience: updated });
                              }}
                              className="h-8 text-xs bg-white"
                            />
                            <button
                              onClick={() => {
                                const updated = [...resume.workExperience];
                                updated[index].highlights = updated[index].highlights.filter((_, i) => i !== hIdx);
                                handleUpdate({ workExperience: updated });
                              }}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = [...resume.workExperience];
                            updated[index].highlights = [...(updated[index].highlights || []), "New achievement bullet"];
                            handleUpdate({ workExperience: updated });
                          }}
                          className="text-[11px] h-7 text-gray-600"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Bullet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Education */}
          {activeSection === "education" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Education</h3>
                  <p className="text-xs text-gray-500">Degrees, academic background, and honors.</p>
                </div>
                <Button
                  onClick={handleAddEducation}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Education
                </Button>
              </div>

              <div className="space-y-4">
                {(resume.education || []).map((edu, index) => (
                  <div key={edu.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative">
                    <button
                      onClick={() => {
                        const updated = resume.education.filter((_, i) => i !== index);
                        handleUpdate({ education: updated });
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <Label className="text-xs">Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[index].degree = e.target.value;
                            handleUpdate({ education: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[index].field = e.target.value;
                            handleUpdate({ education: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[index].institution = e.target.value;
                            handleUpdate({ education: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Years (e.g. 2018 - 2022)</Label>
                        <Input
                          value={edu.startDate ? `${edu.startDate} - ${edu.endDate || "Present"}` : ""}
                          onChange={(e) => {
                            const updated = [...resume.education];
                            updated[index].startDate = e.target.value;
                            handleUpdate({ education: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Skills */}
          {activeSection === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Key Skills</h3>
                  <p className="text-xs text-gray-500">Add technical proficiencies, frameworks, or leadership skills.</p>
                </div>
                <Button
                  onClick={handleAddSkill}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(resume.skills || []).map((skill, index) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...resume.skills];
                        updated[index].name = e.target.value;
                        handleUpdate({ skills: updated });
                      }}
                      className="h-8 text-xs bg-white flex-1"
                    />
                    <button
                      onClick={() => {
                        const updated = resume.skills.filter((_, i) => i !== index);
                        handleUpdate({ skills: updated });
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Projects */}
          {activeSection === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Projects</h3>
                  <p className="text-xs text-gray-500">Showcase open source, side projects, or client deliverables.</p>
                </div>
                <Button
                  onClick={handleAddProject}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Project
                </Button>
              </div>

              <div className="space-y-4">
                {(resume.projects || []).map((proj, index) => (
                  <div key={proj.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative">
                    <button
                      onClick={() => {
                        const updated = resume.projects.filter((_, i) => i !== index);
                        handleUpdate({ projects: updated });
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <Label className="text-xs">Project Name</Label>
                        <Input
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[index].name = e.target.value;
                            handleUpdate({ projects: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Link / URL</Label>
                        <Input
                          value={proj.url || ""}
                          placeholder="https://..."
                          onChange={(e) => {
                            const updated = [...resume.projects];
                            updated[index].url = e.target.value;
                            handleUpdate({ projects: updated });
                          }}
                          className="mt-1 h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...resume.projects];
                          updated[index].description = e.target.value;
                          handleUpdate({ projects: updated });
                        }}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Certifications */}
          {activeSection === "certifications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Certifications</h3>
                  <p className="text-xs text-gray-500">Licenses and industry credentials.</p>
                </div>
                <Button
                  onClick={handleAddCertification}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Certification
                </Button>
              </div>

              <div className="space-y-3">
                {(resume.certifications || []).map((cert, index) => (
                  <div key={cert.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <Input
                      placeholder="Certification name"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...resume.certifications];
                        updated[index].name = e.target.value;
                        handleUpdate({ certifications: updated });
                      }}
                      className="h-8 text-xs flex-1 bg-white"
                    />
                    <Input
                      placeholder="Issuer"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...resume.certifications];
                        updated[index].issuer = e.target.value;
                        handleUpdate({ certifications: updated });
                      }}
                      className="h-8 text-xs w-32 bg-white"
                    />
                    <Input
                      placeholder="Year"
                      value={cert.date}
                      onChange={(e) => {
                        const updated = [...resume.certifications];
                        updated[index].date = e.target.value;
                        handleUpdate({ certifications: updated });
                      }}
                      className="h-8 text-xs w-20 bg-white"
                    />
                    <button
                      onClick={() => {
                        const updated = resume.certifications.filter((_, i) => i !== index);
                        handleUpdate({ certifications: updated });
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Languages */}
          {activeSection === "languages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Languages</h3>
                  <p className="text-xs text-gray-500">Add spoken and written languages with fluency level.</p>
                </div>
                <Button
                  onClick={handleAddLanguage}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Language
                </Button>
              </div>

              <div className="space-y-2">
                {(resume.languages || []).map((lang, index) => (
                  <div key={lang.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <Input
                      placeholder="Language name"
                      value={lang.name}
                      onChange={(e) => {
                        const updated = [...resume.languages];
                        updated[index].name = e.target.value;
                        handleUpdate({ languages: updated });
                      }}
                      className="h-8 text-xs flex-1 bg-white"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => {
                        const updated = [...resume.languages];
                        updated[index].proficiency = e.target.value as any;
                        handleUpdate({ languages: updated });
                      }}
                      className="h-8 text-xs bg-white border border-gray-300 rounded px-2"
                    >
                      <option value="basic">Basic</option>
                      <option value="conversational">Conversational</option>
                      <option value="proficient">Proficient</option>
                      <option value="fluent">Fluent</option>
                      <option value="native">Native</option>
                    </select>
                    <button
                      onClick={() => {
                        const updated = resume.languages.filter((_, i) => i !== index);
                        handleUpdate({ languages: updated });
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Live Preview Pane */}
        <div className="w-full lg:w-[52%] bg-slate-200/80 p-4 sm:p-6 flex flex-col items-center overflow-y-auto max-h-[calc(100vh-62px)]">
          {/* Zoom & View Controls */}
          <div className="w-full max-w-[760px] flex items-center justify-between mb-4 no-print text-xs text-gray-600 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 capitalize">
                {resume.templateId}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-mono text-[11px] uppercase">
                {currentPaper} Format
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs w-12 text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actual Printable Page Wrapper with Customizer classes */}
          <div
            ref={printRef}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
            className={`w-full ${
              currentPaper === "letter" ? "max-w-[780px]" : "max-w-[760px]"
            } transition-all duration-150 mb-12 shadow-2xl rounded-sm overflow-hidden bg-white resume-font-${currentFont} resume-size-${currentFontSize} resume-spacing-${currentSpacing}`}
          >
            {resume.templateId === "modern" ? (
              <ModernTemplate data={resume} accentColor={currentAccent} />
            ) : resume.templateId === "minimal" ? (
              <MinimalTemplate data={resume} accentColor={currentAccent} />
            ) : resume.templateId === "executive" ? (
              <ExecutiveTemplate data={resume} accentColor={currentAccent} />
            ) : resume.templateId === "tech" ? (
              <TechTemplate data={resume} accentColor={currentAccent} />
            ) : resume.templateId === "creative" ? (
              <CreativeTemplate data={resume} accentColor={currentAccent} />
            ) : (
              <ProfessionalTemplate data={resume} accentColor={currentAccent} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
      <ResumeEditorInner />
    </Suspense>
  );
}
