"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, PenTool, Plus, Sparkles } from "lucide-react";
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
  action: () => void;
};

export function DocumentStarter() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { createCoverLetter, createResume } = useResumeStore();

  const startResume = () => {
    const resume = createResume("Untitled Resume");
    setOpen(false);
    router.push(`/editor/resume/${resume.id}`);
  };

  const startCoverLetter = () => {
    const coverLetter = createCoverLetter("Untitled Cover Letter");
    setOpen(false);
    router.push(`/editor/cover-letter/${coverLetter.id}`);
  };

  const startWithAi = () => {
    setOpen(false);
    router.push("/ai-writer");
  };

  const options: StarterOption[] = [
    {
      title: "Resume",
      description: "Start a polished resume with an editable live preview.",
      icon: FileText,
      accentClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      action: startResume,
    },
    {
      title: "Cover letter",
      description: "Write a targeted letter to pair with your application.",
      icon: PenTool,
      accentClass: "bg-sky-50 text-sky-700 ring-sky-100",
      action: startCoverLetter,
    },
    {
      title: "Draft with AI",
      description: "Generate role-specific experience bullets before editing.",
      icon: Sparkles,
      accentClass: "bg-violet-50 text-violet-700 ring-violet-100",
      action: startWithAi,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 font-semibold hover:bg-emerald-700">
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">New document</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl text-slate-950">What would you like to create?</DialogTitle>
          <DialogDescription className="leading-6">
            Choose a starting point. Everything remains editable after you begin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.title}
                onClick={option.action}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className={`mb-4 inline-flex rounded-xl p-2.5 ring-1 ${option.accentClass}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="block font-bold text-slate-900 group-hover:text-emerald-700">{option.title}</span>
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">{option.description}</span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
