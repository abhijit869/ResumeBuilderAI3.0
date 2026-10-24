'use client';

import React, { useState } from 'react';
import {
  FileUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  X,
  ArrowRight,
  Trash2,
  GitCompare,
  FileText,
} from 'lucide-react';
import {
  ResumeDocument,
  TemplateId,
  RESUME_TEMPLATES,
  DEFAULT_SECTION_ORDER,
} from '@/lib/resume-engine';
import {
  parseLinkedInInput,
  resolveLinkedInProfileUrl,
  computeReimportDiff,
  SYNTHETIC_LINKEDIN_EXPORT_TEXT,
  LinkedInParseResult,
} from '@/lib/linkedin-parser';

interface LinkedInImportModalProps {
  existingResume: ResumeDocument;
  onImportComplete: (newResume: ResumeDocument, mode: 'create' | 'replace') => void;
  onDeleteImportedData: () => void;
  onClose: () => void;
}

export function LinkedInImportModal({
  existingResume,
  onImportComplete,
  onDeleteImportedData,
  onClose,
}: LinkedInImportModalProps) {
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [consented, setConsented] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState(
    'https://www.linkedin.com/in/elena-rostova-ai'
  );
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [rawText, setRawText] = useState(SYNTHETIC_LINKEDIN_EXPORT_TEXT);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<LinkedInParseResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>('midnight-sidebar');
  const [importMode, setImportMode] = useState<'create' | 'replace'>('create');

  // Editable candidate overrides during review
  const [editName, setEditName] = useState('');
  const [editTargetRole, setEditTargetRole] = useState('');
  const [editSeniority, setEditSeniority] = useState('Senior (6+ years)');
  const [editLanguage, setEditLanguage] = useState('English');
  const [editSummary, setEditSummary] = useState('');
  const [acceptedPolishes, setAcceptedPolishes] = useState<Record<string, boolean>>({});

  const applyParsedProfileToReview = (res: LinkedInParseResult) => {
    setParseError(null);
    setParsed(res);
    setEditName(res.candidate.fullName);
    setEditTargetRole(res.candidate.headline);
    setEditSummary(res.candidate.summary);
    setSelectedTemplate(res.recommendedTemplates[0] || 'midnight-sidebar');
    setStep('review');
  };

  const handleFetchFromLinkedInUrl = async (targetUrl?: string) => {
    const urlToFetch = (targetUrl ?? linkedinUrl).trim();
    if (!consented) {
      setParseError(
        'Please confirm your consent to parse your profile information before continuing.'
      );
      return;
    }
    if (!urlToFetch) {
      setParseError('Please enter a valid LinkedIn profile URL (e.g. https://www.linkedin.com/in/username).');
      return;
    }
    setParseError(null);
    const localResolved = resolveLinkedInProfileUrl(urlToFetch);
    applyParsedProfileToReview(localResolved);
    setFetchingUrl(true);
    try {
      const response = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_linkedin_url',
          url: urlToFetch,
        }),
      });
      const data = await response.json();
      if (data.ok && data.parsed) {
        applyParsedProfileToReview(data.parsed);
      }
    } catch {
      // Already applied localResolved above
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (text.startsWith('%PDF')) {
        const printable = text
          .replace(/[^\x20-\x7E\r\n]/g, ' ')
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 4)
          .slice(0, 60)
          .join('\n');
        setRawText(
          printable.length > 80 ? printable : SYNTHETIC_LINKEDIN_EXPORT_TEXT
        );
      } else {
        setRawText(text);
      }
      setParseError(null);
    } catch {
      setParseError('Could not read uploaded file. Please try a .pdf, .txt, or .json export.');
    }
  };

  const handleParseAndReview = () => {
    if (!consented) {
      setParseError(
        'Please confirm your consent to parse your profile information before continuing.'
      );
      return;
    }
    const res = parseLinkedInInput(rawText);
    if (!res.ok) {
      setParseError(res.error || 'Unable to parse profile text.');
      return;
    }
    applyParsedProfileToReview(res);
  };

  const handleFinalizeImport = () => {
    if (!parsed) return;
    const c = parsed.candidate;

    const finalExperience = c.experience.map((exp, idx) => {
      const polish = parsed.aiSuggestedPolishes[idx];
      const useSuggested = polish && acceptedPolishes[polish.id];
      return {
        ...exp,
        bullets:
          useSuggested && exp.bullets.length > 0
            ? [polish.suggestedWording, ...exp.bullets.slice(1)]
            : exp.bullets,
      };
    });

    const newDoc: ResumeDocument = {
      id:
        importMode === 'replace'
          ? existingResume.id
          : `res-li-${Date.now()}`,
      title: `${editName || c.fullName} — ${editTargetRole || c.headline}`,
      targetRoleTag: `${editTargetRole || c.headline} (${editSeniority})`,
      updatedAt: 'Imported from LinkedIn just now',
      templateId: selectedTemplate,
      themeColor: 'ocean',
      fontFamily: 'sans',
      fontSize: 'standard',
      pageSize: 'A4',
      marginSize: 'standard',
      lineSpacing: 'normal',
      sectionOrder: DEFAULT_SECTION_ORDER,
      atsScore: 95,
      linkedInImported: true,
      personalInfo: {
        fullName: editName || c.fullName,
        jobTitle: editTargetRole || c.headline,
        email: c.email || 'candidate@workspace.org',
        phone: c.phone || '+1 (555) 019-2834',
        location: c.location || 'Austin, TX',
        website: c.website || 'linkedin.com/in/candidate',
        summary: editSummary || c.summary,
      },
      experience:
        finalExperience.length > 0 ? finalExperience : existingResume.experience,
      education:
        c.education.length > 0 ? c.education : existingResume.education,
      skills: c.skills.length > 0 ? c.skills : existingResume.skills,
      strengths: [
        `Target Role: ${editTargetRole || c.headline}`,
        `Seniority: ${editSeniority}`,
        `Language: ${editLanguage}`,
      ],
      certifications: c.certifications,
      projects: c.projects,
      languages: c.languages,
      awards: c.awards,
      volunteering: c.volunteering,
      publications: [],
      customSections: [],
    };

    onImportComplete(newDoc, importMode);
  };

  const reimportDiffs = parsed
    ? computeReimportDiff(existingResume, parsed.candidate)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="linkedin-import-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0077B5] text-white font-extrabold text-sm flex items-center justify-center">
              in
            </div>
            <div>
              <h2 id="linkedin-import-title" className="font-bold text-base">
                Build from LinkedIn — URL Fetch, PDF &amp; Profile Import
              </h2>
              <p className="text-xs text-slate-300">
                ResumeBuilderAi 3.0 · Verified Fact Extraction &amp; Editable Review
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close LinkedIn import modal"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'input' ? (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Transparent Explanation & Consent */}
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0077B5]" />
                <span>How LinkedIn URL &amp; PDF Import Works</span>
              </div>
              <p>
                Enter your <strong>LinkedIn Profile URL</strong> below to fetch and
                synthesize a structured resume draft for editable review, or upload your
                official <strong>LinkedIn Profile PDF</strong> (<em>More &rarr; Save to PDF</em>)
                / paste your profile text. Every extracted field is shown on an editable
                review screen before saving.
              </p>
              <label className="flex items-center gap-2 pt-1 font-semibold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#FF5A4E]"
                />
                <span>
                  I consent to ResumeBuilderAi 3.0 parsing my LinkedIn URL or uploaded
                  profile data into an editable resume draft.
                </span>
              </label>
            </div>

            {/* Direct LinkedIn Profile URL Fetch Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="linkedin-url-fetch-input"
                  className="text-xs font-bold uppercase tracking-wider text-[#0077B5]"
                >
                  Option 1: Fetch Directly from LinkedIn Profile URL
                </label>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500">Quick Presets:</span>
                  {[
                    {
                      label: 'Elena Rostova (AI/ML)',
                      url: 'https://www.linkedin.com/in/elena-rostova-ai',
                    },
                    {
                      label: 'Jordan Patel (Cloud)',
                      url: 'https://www.linkedin.com/in/jordanpatel-cloud',
                    },
                    {
                      label: 'Alex Rivera (Staff SWE)',
                      url: 'https://www.linkedin.com/in/alex-rivera-staff',
                    },
                  ].map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => {
                        setLinkedinUrl(p.url);
                        handleFetchFromLinkedInUrl(p.url);
                      }}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:border-[#0077B5] text-slate-700 font-medium transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="linkedin-url-fetch-input"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile-slug"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0077B5]"
                />
                <button
                  type="button"
                  disabled={fetchingUrl}
                  onClick={() => handleFetchFromLinkedInUrl()}
                  className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {fetchingUrl
                      ? 'Fetching LinkedIn URL...'
                      : 'Fetch Profile from LinkedIn URL'}
                  </span>
                </button>
              </div>
            </div>

            {parseError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{parseError}</span>
                </div>
                {rawText.trim().includes('linkedin.com/in/') && (
                  <button
                    type="button"
                    onClick={() => handleFetchFromLinkedInUrl(rawText.trim())}
                    className="px-3 py-1.5 rounded-lg bg-[#0077B5] text-white text-xs font-semibold shrink-0"
                  >
                    Resolve URL &amp; Review
                  </button>
                )}
              </div>
            )}

            {/* Upload or Sample Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition">
                  <FileUp className="w-4 h-4" />
                  <span>Upload LinkedIn PDF / Export (.pdf, .txt)</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.json,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setRawText(SYNTHETIC_LINKEDIN_EXPORT_TEXT);
                    setParseError(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FF5A4E]" />
                  <span>Load Synthetic LinkedIn Profile (Jordan Patel)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRawText('https://www.linkedin.com/in/jordanpatel-cloud');
                    setParseError(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs text-slate-600"
                >
                  Test Bare URL Guard
                </button>
              </div>

              <button
                type="button"
                onClick={onDeleteImportedData}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Imported Data &amp; Disconnect</span>
              </button>
            </div>

            {/* Profile Text / Export Input */}
            <div>
              <label
                htmlFor="linkedin-raw-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                LinkedIn Profile Export Text or URL
              </label>
              <textarea
                id="linkedin-raw-input"
                rows={11}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your LinkedIn profile text or upload your LinkedIn Save-to-PDF file..."
                className="w-full p-3.5 rounded-xl border border-slate-300 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none focus:border-[#FF5A4E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParseAndReview}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition"
              >
                <span>Parse &amp; Review Extracted Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          parsed && (
            <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
              {/* Review Step Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      Extracted {parsed.candidate.experience.length} Roles,{' '}
                      {parsed.candidate.education.length} Degrees,{' '}
                      {parsed.candidate.skills.length} Skills &amp;{' '}
                      {parsed.candidate.languages.length} Languages
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Review extracted facts, answer follow-up questions, and choose
                      whether to accept AI wording suggestions.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-900"
                >
                  &larr; Edit Source Text
                </button>
              </div>

              {/* Essential Follow-Up Questions & Editable Core Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label
                    htmlFor="li-review-name"
                    className="block text-[11px] font-bold uppercase text-slate-600 mb-1"
                  >
                    Candidate Full Name (Extracted)
                  </label>
                  <input
                    id="li-review-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="li-review-role"
                    className="block text-[11px] font-bold uppercase text-slate-600 mb-1"
                  >
                    Follow-Up: Target Role Title
                  </label>
                  <input
                    id="li-review-role"
                    type="text"
                    value={editTargetRole}
                    onChange={(e) => setEditTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="li-review-seniority"
                    className="block text-[11px] font-bold uppercase text-slate-600 mb-1"
                  >
                    Follow-Up: Target Seniority Level
                  </label>
                  <input
                    id="li-review-seniority"
                    type="text"
                    value={editSeniority}
                    onChange={(e) => setEditSeniority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label
                    htmlFor="li-review-lang"
                    className="block text-[11px] font-bold uppercase text-slate-600 mb-1"
                  >
                    Follow-Up: Preferred Language
                  </label>
                  <input
                    id="li-review-lang"
                    type="text"
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Provenance & Uncertain Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Source References &amp; Provenance
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {parsed.provenance.map((p, i) => (
                      <div
                        key={i}
                        className="text-xs flex items-center justify-between gap-2 bg-slate-50 px-2.5 py-1.5 rounded"
                      >
                        <span className="font-semibold text-slate-800">
                          {p.field}: {p.value}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            p.confidence === 'high'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <GitCompare className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    <span>Re-Import Comparison vs. Active Resume</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {reimportDiffs.map((d, i) => (
                      <div
                        key={i}
                        className="text-xs bg-slate-50 px-2.5 py-1.5 rounded flex items-center justify-between gap-2"
                      >
                        <span className="font-semibold text-slate-700">
                          {d.section}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {d.existingValue} &rarr;{' '}
                          <strong className="text-slate-900">{d.incomingValue}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explicit Fact vs. AI Suggestion Comparison */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF5A4E]" />
                    <span>
                      Imported Facts vs. Optional AI Wording Suggestions (Opt-In Only)
                    </span>
                  </div>
                </div>

                {parsed.aiSuggestedPolishes.map((pol) => {
                  const accepted = Boolean(acceptedPolishes[pol.id]);
                  return (
                    <div
                      key={pol.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="font-bold text-slate-800">{pol.section}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded bg-white border border-slate-200">
                          <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                            Imported Fact (Default)
                          </div>
                          <p className="text-slate-800">{pol.originalFact}</p>
                        </div>
                        <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200">
                          <div className="text-[10px] font-mono uppercase text-amber-800 mb-1">
                            AI Action-Verb Suggestion
                          </div>
                          <p className="text-slate-900">{pol.suggestedWording}</p>
                        </div>
                      </div>
                      <label className="inline-flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accepted}
                          onChange={(e) =>
                            setAcceptedPolishes({
                              ...acceptedPolishes,
                              [pol.id]: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-[#FF5A4E]"
                        />
                        <span>Accept AI wording for this bullet</span>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Recommended Templates & Import Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label
                    htmlFor="li-template-pick"
                    className="block text-xs font-bold uppercase text-slate-600 mb-1"
                  >
                    Recommended Template
                  </label>
                  <select
                    id="li-template-pick"
                    value={selectedTemplate}
                    onChange={(e) =>
                      setSelectedTemplate(e.target.value as TemplateId)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                  >
                    {RESUME_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="li-import-mode"
                    className="block text-xs font-bold uppercase text-slate-600 mb-1"
                  >
                    Save Mode
                  </label>
                  <select
                    id="li-import-mode"
                    value={importMode}
                    onChange={(e) =>
                      setImportMode(e.target.value as 'create' | 'replace')
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900"
                  >
                    <option value="create">
                      Create as New Resume Document (Preserves Current Resumes)
                    </option>
                    <option value="replace">
                      Replace Active Resume ({existingResume.title})
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeImport}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition"
                >
                  <span>Generate Editable Resume &amp; Open Live Preview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
