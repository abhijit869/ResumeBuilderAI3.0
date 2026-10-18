"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

type AtsResults = {
  score: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  matchedAgainstJobDescription: boolean;
};

const FALLBACK_KEYWORDS = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Collaboration",
  "Project Management",
  "Results",
];

const STOP_WORDS = new Set([
  "about", "across", "after", "again", "also", "among", "and", "are", "as", "at", "be", "because", "been", "being", "by", "can", "company", "create", "day", "deliver", "department", "do", "each", "for", "from", "have", "help", "high", "how", "in", "including", "into", "is", "its", "job", "join", "looking", "more", "new", "of", "on", "or", "our", "out", "per", "role", "skills", "support", "team", "that", "the", "their", "this", "through", "to", "using", "we", "will", "with", "work", "working", "you", "your",
]);

const ACTION_VERB_PATTERN = /\b(achieved|built|created|delivered|designed|developed|drove|improved|increased|launched|led|managed|optimized|reduced|scaled)\b/i;
const METRIC_PATTERN = /\b\d+(?:[.,]\d+)?(?:%|\+|x|k|m|\s+(?:users|customers|clients|projects|people|days|hours))\b/i;

function toDisplayKeyword(keyword: string) {
  return keyword
    .split(/[-/]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("/");
}

function extractKeywords(jobDescription: string) {
  const matches = jobDescription.toLowerCase().match(/[a-z][a-z0-9+.#/-]*/g) || [];
  const frequency = new Map<string, number>();

  matches.forEach((word) => {
    if (word.length < 3 || STOP_WORDS.has(word)) return;
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 12)
    .map(([word]) => toDisplayKeyword(word));
}

export default function ATSCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AtsResults | null>(null);

  const handleAnalyze = () => {
    if (!resumeText) return;
    setAnalyzing(true);

    setTimeout(() => {
      const targetKeywords = jobDescription.trim()
        ? extractKeywords(jobDescription)
        : FALLBACK_KEYWORDS;
      const normalizedResume = resumeText.toLowerCase();
      const found = targetKeywords.filter((keyword) => normalizedResume.includes(keyword.toLowerCase()));
      const missing = targetKeywords.filter((keyword) => !normalizedResume.includes(keyword.toLowerCase()));
      const keywordCoverage = targetKeywords.length ? found.length / targetKeywords.length : 0;
      const hasActionVerbs = ACTION_VERB_PATTERN.test(resumeText);
      const hasMetrics = METRIC_PATTERN.test(resumeText);
      const hasCoreSections = /\b(experience|education|skills|summary)\b/i.test(resumeText);
      const score = Math.min(
        98,
        Math.max(35, Math.round(38 + keywordCoverage * 45 + (hasActionVerbs ? 7 : 0) + (hasMetrics ? 7 : 0) + (hasCoreSections ? 3 : 0)))
      );
      const suggestions = [
        missing.length
          ? `Add relevant evidence for: ${missing.slice(0, 3).join(", ")}.`
          : "Your resume covers the strongest keywords from the target role.",
        hasMetrics
          ? "Keep your quantified outcomes near the top of each experience entry."
          : "Add measurable outcomes, such as time saved, revenue influenced, or percentage growth.",
        hasActionVerbs
          ? "Your bullets use action verbs; make sure each one also names a clear result."
          : "Begin experience bullets with a strong action verb, then explain the outcome.",
        jobDescription.trim()
          ? "Use exact role terminology only where it accurately reflects your experience."
          : "Paste a target job description for role-specific keyword matching.",
      ];

      setResults({
        score,
        foundKeywords: found,
        missingKeywords: missing.slice(0, 6),
        suggestions,
        matchedAgainstJobDescription: Boolean(jobDescription.trim()),
      });
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-orange-50 text-[#ff5e59] border border-orange-200 mb-3 px-3 py-1 font-bold text-xs uppercase tracking-wider">
            Kickresume ATS Diagnostic Engine
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            ATS Resume Checker & Keyword Scanner
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            See how well your resume matches Applicant Tracking Systems. Get instant feedback on formatting, keyword density, and overall score.
          </p>
        </div>

        {/* Input Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5">
            <div>
              <Label className="text-xs font-bold text-gray-900">Your Resume Content</Label>
              <p className="text-xs text-gray-500 mb-2">Paste your resume text here</p>
              <Textarea
                rows={10}
                placeholder="Paste the text of your resume here (Summary, Experience, Skills, Education)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="text-xs font-mono leading-relaxed rounded-xl border-gray-200 focus:border-[#ff5e59]"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-gray-900">Target Job Description (Optional)</Label>
              <p className="text-xs text-gray-500 mb-2">Paste the job ad to match specific requirements</p>
              <Textarea
                rows={5}
                placeholder="Paste the job description from LinkedIn, Indeed, etc..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="text-xs rounded-xl border-gray-200 focus:border-[#ff5e59]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText}
              className="w-full bg-[#ff5e59] hover:bg-[#ee4e34] text-white font-bold h-11 text-sm shadow-md shadow-orange-500/20 rounded-xl cursor-pointer transition-all"
            >
              {analyzing ? "Analyzing ATS Readiness..." : "Check Resume ATS Score"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Results Box */}
          <div className="space-y-6">
            {results ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6 animate-fade-in">
                {/* Score Header */}
                <div className="flex items-center justify-between border-b pb-6">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-xl">Overall ATS Score</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {results.matchedAgainstJobDescription
                        ? "Matched against the target job description"
                        : "Based on formatting, readability & baseline keywords"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-50 border-2 border-[#ff5e59] text-[#ff5e59] font-black text-3xl shadow-inner">
                    {results.score}%
                  </div>
                </div>

                {/* Found Keywords */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00b5b8]" />
                    Keywords Detected ({results.foundKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {results.foundKeywords.length ? results.foundKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-lg"
                      >
                        ✓ {kw}
                      </span>
                    )) : <p className="text-xs text-gray-500">No target keywords found yet.</p>}
                  </div>
                </div>

                {/* Missing Keywords */}
                {results.missingKeywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#ff5e59]" />
                      Recommended Keywords to Add
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {results.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-[#ee4e34] text-xs font-bold rounded-lg"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                    Actionable Improvements
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {results.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#ff5e59] font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs text-center min-h-[380px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-orange-50 text-[#ff5e59] rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">Instant ATS Optimization</h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                  Paste your resume text on the left to see your real-time score, discover missing keywords, and verify ATS compatibility.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
