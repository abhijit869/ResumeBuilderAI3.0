"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, PenTool, Plus, Sparkles, Layout, RefreshCw } from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StarterOption = {
  title: string;
  description: string;
  icon: typeof FileText;
  accentClass: string;
  badge?: string;
  action: () => void;
};

export function DocumentStarter() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { createCoverLetter, createResume, loadSampleResume } = useResumeStore();

  const startResume = () => {
    const resume = createResume("My Resume");
    setOpen(false);
    router.push(`/editor/resume/${resume.id}`);
  };

  const startCoverLetter = () => {
    const coverLetter = createCoverLetter("My Cover Letter");
    setOpen(false);
    router.push(`/editor/cover-letter/${coverLetter.id}`);
  };

  const startWithAi = () => {
    setOpen(false);
    router.push("/ai-writer");
  };

  const startWithSample = () => {
    const sample = loadSampleResume();
    setOpen(false);
    router.push(`/editor/resume/${sample.id}`);
  };

  const startWithTemplate = () => {
    setOpen(false);
    router.push("/templates/resume");
  };

  const options: StarterOption[] = [
    {
      title: "New Resume",
      description: "Start from scratch with Kickresume's iconic Hoth or Basic template.",
      icon: FileText,
      accentClass: "bg-[#ff5e59]/10 text-[#ff5e59] ring-[#ff5e59]/30",
      action: startResume,
    },
    {
      title: "Write with AI",
      description: "Generate tailored resume bullet points and summary with AI.",
      icon: Sparkles,
      accentClass: "bg-[#5345ff]/10 text-[#5345ff] ring-[#5345ff]/30",
      badge: "AI Powered",
      action: startWithAi,
    },
    {
      title: "Matching Cover Letter",
      description: "Create an attention-grabbing cover letter matching your resume style.",
      icon: PenTool,
      accentClass: "bg-sky-50 text-sky-600 ring-sky-200",
      action: startCoverLetter,
    },
    {
      title: "Browse Templates",
      description: "Select from Hoth, Europe, Vegan, Basic, Creative, and more.",
      icon: Layout,
      accentClass: "bg-amber-50 text-amber-600 ring-amber-200",
      action: startWithTemplate,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="btn-kr-primary h-9 font-semibold px-3.5 shadow-xs cursor-pointer">
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">New Document</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8 bg-white border border-gray-200 shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5e59]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
              Create New Document
            </span>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-gray-900">
            What would you like to create?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-500">
            Choose your starting point. All templates and content are fully customizable.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-3 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.title}
                onClick={option.action}
                className="group relative rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ff5e59]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5e59]"
              >
                {option.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f3f0ff] text-[#5345ff] border border-[#e0d7fe]">
                    {option.badge}
                  </span>
                )}
                <span className={`mb-3 inline-flex rounded-lg p-2.5 ring-1 ${option.accentClass}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="block font-bold text-sm text-gray-900 group-hover:text-[#ff5e59] transition-colors">
                  {option.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Already have a resume?</span>
          <button
            onClick={startWithSample}
            className="flex items-center gap-1.5 font-semibold text-[#00b5b8] hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Load Sample Tech CV
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
