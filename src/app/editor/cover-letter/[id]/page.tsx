"use client";

import React, { useRef, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Sparkles,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { CoverLetterData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { downloadElementAsPdf } from "@/lib/pdf";

function CoverLetterEditorInner() {
  const params = useParams();
  const clId = params?.id as string;

  const { coverLetters, updateCoverLetter } = useResumeStore();
  const cl = coverLetters.find((letter) => letter.id === clId);
  const [generating, setGenerating] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const letterRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (updatedData: Partial<CoverLetterData>) => {
    if (!cl) return;
    updateCoverLetter(cl.id, updatedData);
  };

  const handleGenerateAI = async () => {
    if (!cl) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover-letter",
          jobTitle: jobTitle,
          company: cl.companyName || "your company",
        }),
      });
      const data = await res.json();
      if (data.result) {
        handleUpdate({ openingParagraph: data.result });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cl || !letterRef.current) return;

    setExportingPdf(true);
    try {
      await downloadElementAsPdf(letterRef.current, cl.title);
    } catch (error) {
      console.error(error);
    } finally {
      setExportingPdf(false);
    }
  };

  if (!cl) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Cover letter not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Create or select a cover letter from your document library to start editing.</p>
          <Link href="/dashboard/cover-letters" className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Back to cover letters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between no-print shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cover-letters"
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={cl.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="font-bold text-gray-900 text-base sm:text-lg bg-transparent px-2 py-0.5 rounded border border-transparent hover:border-gray-300 outline-none"
          />
        </div>

        <Button
          onClick={handleDownloadPdf}
          disabled={exportingPdf}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{exportingPdf ? "Preparing PDF..." : "Download PDF"}</span>
        </Button>
      </header>

      {/* Split view */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Form */}
        <div className="w-full lg:w-1/2 bg-white border-r border-gray-200 overflow-y-auto p-6 space-y-6 no-print max-h-[calc(100vh-65px)]">
          {/* AI Generator banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Cover Letter Writer
              </span>
              <Button
                onClick={handleGenerateAI}
                disabled={generating}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                {generating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Target Job Title (e.g. Product Manager)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="text-xs h-8 bg-white"
              />
              <Input
                placeholder="Target Company (e.g. Apple)"
                value={cl.companyName}
                onChange={(e) => handleUpdate({ companyName: e.target.value })}
                className="text-xs h-8 bg-white"
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Your Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Your Name</Label>
                <Input
                  value={cl.senderName}
                  onChange={(e) => handleUpdate({ senderName: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input
                  value={cl.senderEmail}
                  onChange={(e) => handleUpdate({ senderEmail: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Recipient Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Recipient Name</Label>
                <Input
                  value={cl.recipientName}
                  onChange={(e) => handleUpdate({ recipientName: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Company Name</Label>
                <Input
                  value={cl.companyName}
                  onChange={(e) => handleUpdate({ companyName: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Letter Content</h3>
            <div>
              <Label className="text-xs">Salutation</Label>
              <Input
                value={cl.greeting}
                onChange={(e) => handleUpdate({ greeting: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Opening & Main Content</Label>
              <Textarea
                rows={8}
                value={cl.openingParagraph}
                onChange={(e) => handleUpdate({ openingParagraph: e.target.value })}
                className="mt-1 text-xs leading-relaxed"
              />
            </div>
            <div>
              <Label className="text-xs">Closing Paragraph</Label>
              <Textarea
                rows={3}
                value={cl.closingParagraph}
                onChange={(e) => handleUpdate({ closingParagraph: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-1/2 bg-gray-200/70 p-8 flex items-center justify-center overflow-y-auto max-h-[calc(100vh-65px)]">
          <div ref={letterRef} className="w-full max-w-[650px] bg-white p-10 rounded-2xl shadow-xl min-h-[900px] text-gray-800 text-sm flex flex-col justify-between">
            <div className="space-y-6">
              {/* Letterhead */}
              <div className="border-b-2 border-emerald-600 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{cl.senderName}</h1>
                <p className="text-xs text-gray-500 mt-1">
                  {cl.senderEmail} {cl.senderPhone && `• ${cl.senderPhone}`} {cl.senderAddress && `• ${cl.senderAddress}`}
                </p>
              </div>

              {/* Date & Recipient */}
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-semibold">{cl.date}</p>
                <p className="font-bold text-gray-900 mt-3">{cl.recipientName}</p>
                <p>{cl.recipientTitle}</p>
                <p className="font-medium text-emerald-700">{cl.companyName}</p>
                <p>{cl.companyAddress}</p>
              </div>

              {/* Salutation */}
              <p className="font-semibold text-gray-900 pt-2">{cl.greeting}</p>

              {/* Paragraphs */}
              <div className="space-y-4 text-xs leading-relaxed text-gray-700 whitespace-pre-line">
                <p>{cl.openingParagraph}</p>
                {cl.bodyParagraphs && cl.bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p>{cl.closingParagraph}</p>
              </div>

              {/* Signoff */}
              <div className="pt-4 text-xs">
                <p className="text-gray-600">{cl.signoff}</p>
                <p className="font-bold text-gray-900 mt-6 text-sm">{cl.senderName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoverLetterEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
      <CoverLetterEditorInner />
    </Suspense>
  );
}
