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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Tested by Recruiters
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3">
              Kickresume Designer Templates
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Tested with leading ATS software and approved by HR recruiters from Google, Tesla, and Amazon.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#ff5e59] text-white shadow-md shadow-orange-500/20"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Visual Preview Card */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-hidden border-b border-gray-100 flex flex-col items-center justify-center">
                  {/* Miniature Resume Mockup */}
                  <div className="w-full h-full bg-white rounded-xl shadow-md p-3 flex flex-col space-y-2 border border-gray-200/70 group-hover:scale-[1.03] transition-transform duration-300">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                        {template.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-16 bg-gray-900 rounded"></div>
                        <div className="h-1.5 w-10 bg-[#ff5e59] rounded"></div>
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
                    <div className="space-y-1 pt-1 flex flex-wrap gap-1 mt-auto">
                      <div className="h-2 w-8 bg-orange-100 rounded"></div>
                      <div className="h-2 w-10 bg-indigo-100 rounded"></div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 right-3">
                    {template.id === "hoth" ? (
                      <span className="bg-[#ff5e59] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                        #1 CHOICE
                      </span>
                    ) : template.isPremium ? (
                      <span className="bg-[#5345ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                        PRO
                      </span>
                    ) : (
                      <span className="bg-[#00b5b8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-[#ff5e59] hover:bg-[#ee4e34] text-white shadow-lg text-xs font-bold rounded-xl"
                      size="sm"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-extrabold text-gray-900 text-base">{template.name}</h3>
                    <Badge variant="outline" className="capitalize text-[10px] font-bold">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    variant="outline"
                    className="w-full mt-4 text-xs font-bold rounded-xl hover:bg-orange-50 hover:text-[#ff5e59] hover:border-[#ff5e59] transition-colors"
                  >
                    Customize This Template
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
