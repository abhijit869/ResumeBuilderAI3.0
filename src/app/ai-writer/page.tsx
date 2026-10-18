"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/lib/store";
import { Sparkles, ArrowRight, Copy, Check } from "lucide-react";

export default function AIWriterPage() {
  const [jobTitle, setJobTitle] = useState("Product Manager");
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState<string[]>([
    "Defined product vision and roadmap for flagship SaaS product, growing ARR by $4.2M in 18 months.",
    "Led cross-functional team of 14 engineers and designers through bi-weekly agile development cycles.",
    "Conducted 50+ user interviews to identify high-value workflow automations, reducing user churn by 22%.",
    "Partnered with Sales and Marketing to execute go-to-market strategies across 4 enterprise product tiers.",
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { createResume, updateResume } = useResumeStore();
  const router = useRouter();

  const handleGenerate = async () => {
    if (!jobTitle) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bullets", jobTitle }),
      });
      const data = await res.json();
      if (data.result && Array.isArray(data.result)) {
        setBullets(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleStartResume = () => {
    const normalizedTitle = jobTitle.trim() || "Professional";
    const resume = createResume(`${normalizedTitle} Resume`);
    updateResume(resume.id, {
      personalInfo: { ...resume.personalInfo, title: normalizedTitle },
      workExperience: [
        {
          id: `ai-experience-${Date.now()}`,
          company: "Target Company",
          position: normalizedTitle,
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "AI-assisted draft. Edit these achievements to reflect your experience.",
          highlights: bullets,
        },
      ],
    });
    router.push(`/editor/resume/${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="bg-emerald-100 text-emerald-800 mb-3 px-3 py-1">
            ✨ GPT-Powered AI Writer
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Let AI Write Your Resume in Seconds
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Never struggle with blank pages or writer&apos;s block again. Generate recruiter-ready bullet points tailored to your role.
          </p>

          {/* Interactive Generator Box */}
          <div className="mt-10 p-2 sm:p-3 bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter your job title (e.g. Data Scientist, UX Designer)..."
              className="border-0 shadow-none text-sm sm:text-base h-12 focus-visible:ring-0"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-6 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Generate Bullets"}
            </Button>
          </div>
        </div>

        {/* Generated Results Area */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-gray-900 text-base">
              Recommended Bullet Points for <span className="text-emerald-600 font-semibold">{jobTitle}</span>
            </h3>
            <span className="text-xs text-gray-400">Click to copy</span>
          </div>

          <div className="space-y-3">
            {bullets.map((bullet, i) => (
              <div
                key={i}
                onClick={() => handleCopy(bullet, i)}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-2 text-sm text-gray-800">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{bullet}</span>
                </div>
                <button className="text-gray-400 group-hover:text-emerald-600 flex-shrink-0 p-1">
                  {copiedIndex === i ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleStartResume}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Create Resume With These Bullets
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
