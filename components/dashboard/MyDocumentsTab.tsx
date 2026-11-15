'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Sparkles,
  Copy,
  Trash2,
  Printer,
  FileUp,
  LayoutGrid,
  List,
  ArrowUpDown,
  Edit2,
  Download,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ResumeDocument,
  cloneResumeDocument,
  THEME_COLORS,
} from '@/lib/resume-engine';

interface MyDocumentsTabProps {
  resumes: ResumeDocument[];
  activeResumeId: string;
  onSelectResume: (id: string) => void;
  onOpenEditor: () => void;
  onCreateResume: (resume: ResumeDocument) => void;
  onDeleteResume: (id: string) => void;
  onUpdateResume: (resume: ResumeDocument) => void;
  onOpenLinkedInImport: () => void;
  onOpenAiGenerator: () => void;
  onDownloadPdf: (resume: ResumeDocument) => void;
  isDark?: boolean;
}

export function MyDocumentsTab({
  resumes,
  activeResumeId,
  onSelectResume,
  onOpenEditor,
  onCreateResume,
  onDeleteResume,
  onUpdateResume,
  onOpenLinkedInImport,
  onOpenAiGenerator,
  onDownloadPdf,
  isDark,
}: MyDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'ats'>('date');

  // Rename modal state
  const [renamingDoc, setRenamingDoc] = useState<ResumeDocument | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete modal state
  const [deletingDoc, setDeletingDoc] = useState<ResumeDocument | null>(null);

  // Filter & sort logic
  const filteredResumes = resumes
    .filter((doc) => {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.personalInfo.fullName.toLowerCase().includes(q) ||
        doc.personalInfo.jobTitle.toLowerCase().includes(q) ||
        doc.templateId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'ats') return (b.atsScore || 0) - (a.atsScore || 0);
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });

  const handleStartRename = (doc: ResumeDocument) => {
    setRenamingDoc(doc);
    setNewTitle(doc.title);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingDoc || !newTitle.trim()) return;
    onUpdateResume({
      ...renamingDoc,
      title: newTitle.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setRenamingDoc(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingDoc) return;
    onDeleteResume(deletingDoc.id);
    setDeletingDoc(null);
  };

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
            ResumeBuilderAi 3.0 · Document Hub
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            My Resumes ({resumes.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build, duplicate, and tailor versions for specific job postings and MNC benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenLinkedInImport}
            className="px-4 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
          >
            <FileUp className="w-4 h-4" />
            <span>Import Profile</span>
          </button>
          <button
            type="button"
            onClick={onOpenAiGenerator}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
          >
            <Sparkles className="w-4 h-4 text-[#FF5A4E]" />
            <span>AI Draft Generator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const active = resumes.find((r) => r.id === activeResumeId) || resumes[0];
              const cloned = cloneResumeDocument(
                active,
                `Role-Tailored Resume #${resumes.length + 1}`
              );
              onCreateResume(cloned);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            aria-label="Search resumes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, role, skills, or template..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-[#FF5A4E] transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sorting */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-[11px] text-slate-400">Sort:</span>
            <select
              aria-label="Sort resumes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="date" className={isDark ? 'bg-slate-900' : 'bg-white'}>
                Recently Updated
              </option>
              <option value="name" className={isDark ? 'bg-slate-900' : 'bg-white'}>
                Document Name
              </option>
              <option value="ats" className={isDark ? 'bg-slate-900' : 'bg-white'}>
                ATS Score
              </option>
            </select>
          </div>

          {/* Grid/List View Toggle */}
          <div
            className={`flex items-center p-1 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'grid'
                  ? 'bg-[#FF5A4E] text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-xl transition ${
                viewMode === 'list'
                  ? 'bg-[#FF5A4E] text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Resumes Grid/List View */}
      {filteredResumes.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-3xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className={`font-serif text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            No resumes found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No documents matched "${searchQuery}". Clear your search query or create a new resume.`
              : 'Create your first professional ATS-optimized resume to get started.'}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const active = resumes[0];
                  const cloned = cloneResumeDocument(active, 'My First Resume');
                  onCreateResume(cloned);
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5A4E] text-white text-xs font-semibold"
              >
                Create Resume
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((doc) => {
            const pal = THEME_COLORS[doc.themeColor] || THEME_COLORS.green;
            const isCurrentActive = doc.id === activeResumeId;

            return (
              <div
                key={doc.id}
                className={`rounded-3xl border transition shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md ${
                  isCurrentActive
                    ? 'border-[#FF5A4E] ring-1 ring-[#FF5A4E]/30'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                } ${isDark ? 'bg-slate-900' : 'bg-white'}`}
              >
                <div>
                  {/* Card Header Preview Mock */}
                  <div
                    style={{ backgroundColor: pal.headerBg }}
                    className="p-5 border-b border-slate-100 dark:border-slate-800 relative"
                  >
                    <div className="flex items-center justify-between mb-3 text-[11px] font-medium text-slate-800">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs font-mono text-[10px] text-slate-700 font-semibold">
                        {doc.templateId} · {doc.pageSize || 'A4'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-[10px]">
                        ATS {doc.atsScore || 85}/100
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-2xs space-y-1">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {doc.personalInfo.fullName || 'Candidate Name'}
                      </div>
                      <div className="text-xs font-medium text-slate-600 truncate">
                        {doc.personalInfo.jobTitle || 'Professional Title'}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                        {doc.personalInfo.summary || 'Summary statement ready for review...'}
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-bold text-sm truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {doc.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleStartRename(doc)}
                        aria-label={`Rename ${doc.title}`}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Updated {doc.updatedAt} · {doc.experience.length} roles ·{' '}
                      {doc.skills.length} skills
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div
                  className={`px-5 pb-5 pt-3 border-t flex items-center justify-between gap-2 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectResume(doc.id);
                        onOpenEditor();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-2xs transition"
                    >
                      Open Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadPdf(doc)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition inline-flex items-center gap-1.5"
                      title="Download selectable PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const cloned = cloneResumeDocument(doc);
                        onCreateResume(cloned);
                      }}
                      aria-label={`Duplicate ${doc.title}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Duplicate resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {resumes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDeletingDoc(doc)}
                        aria-label={`Delete ${doc.title}`}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        title="Delete resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div
          className={`rounded-3xl border overflow-hidden shadow-xs divide-y ${
            isDark
              ? 'bg-slate-900 border-slate-800 divide-slate-800'
              : 'bg-white border-slate-200/90 divide-slate-100'
          }`}
        >
          {filteredResumes.map((doc) => {
            const isCurrentActive = doc.id === activeResumeId;
            return (
              <div
                key={doc.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/50 ${
                  isCurrentActive ? 'bg-[#FF5A4E]/5' : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-coral-50 dark:bg-slate-800 border border-coral-200/60 dark:border-slate-700 flex items-center justify-center shrink-0 text-[#FF5A4E]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-sm ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {doc.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleStartRename(doc)}
                        aria-label={`Rename ${doc.title}`}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5A4E]/10 text-[#FF5A4E]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {doc.personalInfo.fullName} · {doc.personalInfo.jobTitle} ·{' '}
                      <span className="font-mono">{doc.templateId}</span> · Updated{' '}
                      {doc.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 font-mono font-bold text-xs">
                    ATS {doc.atsScore || 85}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectResume(doc.id);
                      onOpenEditor();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-2xs transition"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadPdf(doc)}
                    aria-label={`Download PDF of ${doc.title}`}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cloned = cloneResumeDocument(doc);
                      onCreateResume(cloned);
                    }}
                    aria-label={`Duplicate ${doc.title}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {resumes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDeletingDoc(doc)}
                      aria-label={`Delete ${doc.title}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Document Modal */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rename Document
              </h3>
              <button
                type="button"
                onClick={() => setRenamingDoc(null)}
                aria-label="Close rename modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRename} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRenamingDoc(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-xs"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif text-lg font-bold text-red-600">
                Confirm Deletion
              </h3>
              <button
                type="button"
                onClick={() => setDeletingDoc(null)}
                aria-label="Close delete modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                &quot;{deletingDoc.title}&quot;
              </span>
              ? This action will remove the document from your Firestore cloud storage and cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setDeletingDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
