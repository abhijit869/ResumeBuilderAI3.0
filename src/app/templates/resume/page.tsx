"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { resumeTemplates } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ResumeTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { createResume, updateResume } = useResumeStore();
  const router = useRouter();

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "professional", name: "Professional" },
    { id: "modern", name: "Modern" },
    { id: "creative", name: "Creative" },
    { id: "minimal", name: "Minimal" },
  ];

  const filteredTemplates = selectedCategory === "all"
    ? resumeTemplates
    : resumeTemplates.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    const resume = createResume(`My ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume`);
    updateResume(resume.id, { templateId });
    router.push(`/editor/resume/${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Recruiter-Approved Resume Templates
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Tested with leading ATS software and approved by HR recruiters from Fortune 500 companies.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Visual Preview Card */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 p-4 overflow-hidden border-b border-gray-100 flex flex-col items-center justify-center">
                  {/* Miniature Resume Mockup */}
                  <div className="w-full h-full bg-white rounded-lg shadow-md p-3 flex flex-col space-y-2 border border-gray-100 group-hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                        {template.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-16 bg-gray-900 rounded"></div>
                        <div className="h-1.5 w-10 bg-emerald-600 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-12 bg-gray-400 rounded"></div>
                      <div className="h-1 w-full bg-gray-200 rounded"></div>
                      <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-14 bg-gray-400 rounded"></div>
                      <div className="h-1 w-full bg-gray-200 rounded"></div>
                      <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-1 pt-1 flex flex-wrap gap-1">
                      <div className="h-2 w-6 bg-emerald-100 rounded"></div>
                      <div className="h-2 w-8 bg-emerald-100 rounded"></div>
                      <div className="h-2 w-7 bg-emerald-100 rounded"></div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    {template.isPremium ? (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                        PRO
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg text-xs"
                      size="sm"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                    <Badge variant="outline" className="capitalize text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    variant="outline"
                    className="w-full mt-4 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
