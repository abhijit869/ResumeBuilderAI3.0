'use client';

import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Sparkles,
  Copy,
  Trash2,
  Printer,
  Download,
  Search,
  Check,
  Building,
  Briefcase,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { CoverLetterDocument, ResumeDocument } from '@/lib/resume-engine';
import { escapeHtml } from '@/lib/security-utils';

interface CoverLettersTabProps {
  coverLetters: CoverLetterDocument[];
  activeResume: ResumeDocument;
  onCreateCoverLetter: (cl: CoverLetterDocument) => void;
  onDeleteCoverLetter: (id: string) => void;
  isDark?: boolean;
}

export function CoverLettersTab({
  coverLetters,
  activeResume,
  onCreateCoverLetter,
  onDeleteCoverLetter,
  isDark,
}: CoverLettersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCl, setSelectedCl] = useState<CoverLetterDocument | null>(
    coverLetters[0] || null
  );

  // New letter modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState(activeResume.personalInfo.jobTitle || 'Senior Software Engineer');
  const [newTone, setNewTone] = useState<'confident' | 'enthusiastic' | 'concise' | 'executive'>('confident');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Copy indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete modal state
  const [deletingCl, setDeletingCl] = useState<CoverLetterDocument | null>(null);

  // Active editor draft state
  const [activeDraft, setActiveDraft] = useState<string>(
    selectedCl ? selectedCl.content : ''
  );

  const handleSelectCoverLetter = (cl: CoverLetterDocument) => {
    setSelectedCl(cl);
    setActiveDraft(cl.content);
  };

  const handleCopyContent = (cl: CoverLetterDocument) => {
    navigator.clipboard.writeText(cl.content);
    setCopiedId(cl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    setIsGenerating(true);

    try {
      // Generate cover letter via server-side API or fallback grounded template
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cover_letter',
          jobTitle: newRole,
          targetCompany: newCompany,
          resumeContext: {
            fullName: activeResume.personalInfo.fullName,
            jobTitle: activeResume.personalInfo.jobTitle,
            skills: activeResume.skills,
            experience: activeResume.experience.slice(0, 2),
            summary: activeResume.personalInfo.summary,
          },
          jobDescription: newJobDescription,
        }),
      });

      let letterBody = '';
      if (res.ok) {
        const data = await res.json();
        letterBody = data.coverLetter || data.content || '';
      }

      if (!letterBody) {
        letterBody = `Dear Hiring Team at ${newCompany},\n\nI am writing to express my strong enthusiasm for the ${newRole} position. With proven experience delivering high-impact initiatives as ${activeResume.personalInfo.jobTitle}, I have specialized in architecting scalable solutions, leading cross-functional teams, and driving measurable engineering velocity.\n\nThroughout my background at ${activeResume.experience[0]?.company || 'technology leaders'}, I spearheaded critical systems with rigorous performance standards, consistently exceeding core KPIs. What excites me most about ${newCompany} is your unwavering dedication to product excellence and technological innovation.\n\nI welcome the opportunity to discuss how my technical acumen and strategic execution can contribute directly to your team's objectives. Thank you for your time and consideration.\n\nSincerely,\n${activeResume.personalInfo.fullName}\n${activeResume.personalInfo.email} | ${activeResume.personalInfo.phone}`;
      }

      const newCl: CoverLetterDocument = {
        id: `cl-${Date.now()}`,
        title: `${newRole} - ${newCompany}`,
        companyName: newCompany,
        roleTitle: newRole,
        recipientName: 'Hiring Team & Talent Acquisition',
        templateId: activeResume.templateId || 'coral-modern',
        themeColor: activeResume.themeColor || 'coral',
        linkedResumeId: activeResume.id,
        updatedAt: new Date().toISOString().split('T')[0],
        content: letterBody,
      };

      onCreateCoverLetter(newCl);
      setSelectedCl(newCl);
      setActiveDraft(newCl.content);
      setShowNewModal(false);
      setNewCompany('');
      setNewJobDescription('');
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintSelectablePdf = () => {
    if (!selectedCl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const safeTitle = escapeHtml(selectedCl.title);
    const safeFullName = escapeHtml(activeResume.personalInfo.fullName);
    const safeJobTitle = escapeHtml(activeResume.personalInfo.jobTitle);
    const safeEmail = escapeHtml(activeResume.personalInfo.email);
    const safePhone = escapeHtml(activeResume.personalInfo.phone);
    const safeLocation = escapeHtml(activeResume.personalInfo.location);
    const safeCompany = escapeHtml(selectedCl.companyName);
    const safeRole = escapeHtml(selectedCl.roleTitle);
    const safeContent = escapeHtml(activeDraft || selectedCl.content);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeTitle} - Cover Letter</title>
          <style>
            @page { size: A4 portrait; margin: 25mm 20mm 20mm 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; font-size: 11pt; }
            .header { border-bottom: 2px solid #FF5A4E; padding-bottom: 12px; margin-bottom: 24px; }
            .name { font-size: 20pt; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
            .contact { font-size: 9.5pt; color: #64748b; }
            .date { margin-top: 16px; margin-bottom: 20px; font-size: 10pt; color: #475569; }
            .recipient { margin-bottom: 24px; font-weight: 600; color: #334155; }
            .content { white-space: pre-wrap; font-size: 10.5pt; color: #1e293b; text-align: justify; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${safeFullName}</div>
            <div class="contact">
              ${safeJobTitle} • ${safeEmail} • ${safePhone} • ${safeLocation}
            </div>
          </div>
          <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div class="recipient">
            Hiring Manager & Talent Acquisition Team<br />
            <strong>${safeCompany}</strong><br />
            Position: ${safeRole}
          </div>
          <div class="content">${safeContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const filteredLetters = coverLetters.filter((cl) => {
    const q = searchQuery.toLowerCase();
    return (
      cl.title.toLowerCase().includes(q) ||
      cl.companyName.toLowerCase().includes(q) ||
      cl.roleTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            ResumeBuilderAi 3.0 · Cover Letter Studio
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Cover Letters ({coverLetters.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tailor high-converting, professional letters matching your active resume layout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Cover Letter</span>
        </button>
      </div>

      {/* Main Dual-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Letter Selector List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              aria-label="Search cover letters"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or role..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-[#FF5A4E] transition ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="space-y-3">
            {filteredLetters.map((cl) => {
              const isSelected = selectedCl?.id === cl.id;
              return (
                <div
                  key={cl.id}
                  onClick={() => handleSelectCoverLetter(cl)}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#FF5A4E] ring-1 ring-[#FF5A4E]/30 bg-[#FF5A4E]/5'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {cl.companyName}
                      </span>
                      <span>{cl.updatedAt}</span>
                    </div>
                    <h3
                      className={`font-bold text-sm truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {cl.roleTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {cl.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400">
                      {cl.content.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyContent(cl);
                        }}
                        aria-label={`Copy letter for ${cl.companyName}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Copy to clipboard"
                      >
                        {copiedId === cl.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {coverLetters.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingCl(cl);
                          }}
                          aria-label={`Delete letter for ${cl.companyName}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                          title="Delete cover letter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Letterhead Preview & Editor */}
        <div className="lg:col-span-8">
          {selectedCl ? (
            <div
              className={`rounded-3xl border shadow-xs overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Studio Toolbar */}
              <div
                className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                  isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Editing: {selectedCl.companyName}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {activeDraft.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyContent(selectedCl)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition inline-flex items-center gap-1.5"
                  >
                    {copiedId === selectedCl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintSelectablePdf}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Letterhead Preview Container */}
              <div className="p-6 sm:p-10 space-y-6">
                {/* Formal Letterhead Matching Resume Candidate Profile */}
                <div className="pb-5 border-b-2 border-[#FF5A4E]">
                  <h2
                    className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {activeResume.personalInfo.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1 font-medium">
                    <span>{activeResume.personalInfo.jobTitle}</span>
                    <span>•</span>
                    <span>{activeResume.personalInfo.email}</span>
                    <span>•</span>
                    <span>{activeResume.personalInfo.phone}</span>
                    <span>•</span>
                    <span>{activeResume.personalInfo.location}</span>
                  </div>
                </div>

                {/* Recipient & Date Meta */}
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-mono text-slate-400">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="pt-2 font-semibold text-slate-800 dark:text-slate-200">
                    Hiring Team & Engineering Leadership
                  </div>
                  <div className="font-medium text-slate-600 dark:text-slate-400">
                    {selectedCl.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Role Application: {selectedCl.roleTitle}
                  </div>
                </div>

                {/* Editable Letter Body */}
                <div>
                  <textarea
                    value={activeDraft}
                    onChange={(e) => setActiveDraft(e.target.value)}
                    rows={16}
                    className={`w-full p-4 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed border focus:outline-none focus:border-[#FF5A4E] transition resize-y ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700 text-slate-200'
                        : 'bg-slate-50/60 border-slate-200 text-slate-800'
                    }`}
                    placeholder="Compose or polish your cover letter body here..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-16 text-center rounded-3xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <Mail className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg font-semibold text-slate-800 dark:text-white">
                No cover letter selected
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select an existing letter from the left column or create a new one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Cover Letter Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF5A4E]/10 flex items-center justify-center text-[#FF5A4E]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3
                  className={`font-serif text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Generate Grounded Cover Letter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, OpenAI, Google, Netflix"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Staff Full-Stack Engineer"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Tone of Voice
                </label>
                <select
                  aria-label="Tone of voice"
                  value={newTone}
                  onChange={(e) => setNewTone(e.target.value as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="confident">Confident & Impact-Driven (Recommended)</option>
                  <option value="executive">Executive & Strategic</option>
                  <option value="concise">Concise & Direct (1 Page)</option>
                  <option value="enthusiastic">High Energy & Mission-Focused</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Job Description / Requirements (Optional)
                </label>
                <textarea
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  placeholder="Paste snippet of the job requirements or target responsibilities to align keywords..."
                  rows={3}
                  className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Letter</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif text-lg font-bold text-red-600">
                Delete Cover Letter
              </h3>
              <button
                type="button"
                onClick={() => setDeletingCl(null)}
                aria-label="Close delete modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Are you sure you want to delete your cover letter for{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {deletingCl.companyName} ({deletingCl.roleTitle})
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setDeletingCl(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCoverLetter(deletingCl.id);
                  if (selectedCl?.id === deletingCl.id) {
                    setSelectedCl(null);
                  }
                  setDeletingCl(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
