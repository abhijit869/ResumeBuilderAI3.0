'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Building,
  Filter,
  DollarSign,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { JobApplicationItem, ResumeDocument } from '@/lib/resume-engine';

interface JobTrackerTabProps {
  applications: JobApplicationItem[];
  resumes: ResumeDocument[];
  onUpdateApplications: (apps: JobApplicationItem[]) => void;
  isDark?: boolean;
}

const STAGES: Array<{ id: JobApplicationItem['stage']; label: string; color: string; badge: string }> = [
  { id: 'Saved', label: 'Wishlist / Saved', color: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'Applied', label: 'Applied', color: 'border-blue-300 dark:border-blue-900', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
  { id: 'Interviewing', label: 'Interviewing', color: 'border-amber-300 dark:border-amber-900', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
  { id: 'Offer', label: 'Offer Received', color: 'border-emerald-300 dark:border-emerald-900', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { id: 'Archived', label: 'Archived / Rejected', color: 'border-rose-300 dark:border-rose-900', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
];

export function JobTrackerTab({
  applications,
  resumes,
  onUpdateApplications,
  isDark,
}: JobTrackerTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<JobApplicationItem | null>(null);

  // Form fields
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStage, setFormStage] = useState<JobApplicationItem['stage']>('Saved');
  const [formDeadline, setFormDeadline] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formLinkedResumeId, setFormLinkedResumeId] = useState(resumes[0]?.id || '');

  const openAddModal = () => {
    setEditingItem(null);
    setFormCompany('');
    setFormRole('');
    setFormStage('Saved');
    setFormDeadline(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setFormNotes('');
    setFormLinkedResumeId(resumes[0]?.id || '');
    setShowAddModal(true);
  };

  const openEditModal = (item: JobApplicationItem) => {
    setEditingItem(item);
    setFormCompany(item.company);
    setFormRole(item.role);
    setFormStage(item.stage);
    setFormDeadline(item.deadline);
    setFormNotes(item.notes);
    setFormLinkedResumeId(item.linkedResumeId || resumes[0]?.id || '');
    setShowAddModal(true);
  };

  const handleSaveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) return;

    if (editingItem) {
      const updated = applications.map((app) =>
        app.id === editingItem.id
          ? {
              ...app,
              company: formCompany.trim(),
              role: formRole.trim(),
              stage: formStage,
              deadline: formDeadline,
              notes: formNotes.trim(),
              linkedResumeId: formLinkedResumeId,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : app
      );
      onUpdateApplications(updated);
    } else {
      const newItem: JobApplicationItem = {
        id: `job-${Date.now()}`,
        company: formCompany.trim(),
        role: formRole.trim(),
        stage: formStage,
        deadline: formDeadline,
        notes: formNotes.trim(),
        linkedResumeId: formLinkedResumeId,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateApplications([newItem, ...applications]);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    onUpdateApplications(applications.filter((a) => a.id !== id));
  };

  const handleMoveStage = (id: string, newStage: JobApplicationItem['stage']) => {
    const updated = applications.map((app) =>
      app.id === id
        ? { ...app, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
        : app
    );
    onUpdateApplications(updated);
  };

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      app.notes.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalApps = applications.length;
  const interviewingCount = applications.filter((a) => a.stage === 'Interviewing').length;
  const offerCount = applications.filter((a) => a.stage === 'Offer').length;
  const responseRate =
    totalApps > 0
      ? Math.round(
          ((interviewingCount + offerCount) /
            applications.filter((a) => a.stage !== 'Saved').length || 0) * 100
        )
      : 0;

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
            ResumeBuilderAi 3.0 · Application Pipeline
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Job Applications Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track job listings, interview stages, deadlines, and offer negotiations in one visual board.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Tracked
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {totalApps}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-500 uppercase tracking-wider">
            Active Interviews
          </div>
          <div className="text-2xl font-bold font-mono mt-1 text-amber-500">
            {interviewingCount}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-500 uppercase tracking-wider">
            Offers
          </div>
          <div className="text-2xl font-bold font-mono mt-1 text-emerald-500">
            {offerCount}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-medium text-[#FF5A4E] uppercase tracking-wider">
            Interview Rate
          </div>
          <div className="text-2xl font-bold font-mono mt-1 text-[#FF5A4E]">
            {responseRate}%
          </div>
        </div>
      </div>

      {/* Filter and View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            aria-label="Search applications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, position, or notes..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-[#FF5A4E] transition ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div
          className={`flex items-center p-1 rounded-2xl border self-start sm:self-auto ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === 'kanban'
                ? 'bg-[#FF5A4E] text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === 'table'
                ? 'bg-[#FF5A4E] text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Main View: Kanban or Table */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {STAGES.map((col) => {
            const colApps = filteredApps.filter((a) => a.stage === col.id);
            return (
              <div
                key={col.id}
                className={`rounded-2xl border p-3 flex flex-col gap-3 min-h-[420px] ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {col.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badge}`}
                  >
                    {colApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colApps.map((app) => {
                    const linkedResume = resumes.find((r) => r.id === app.linkedResumeId);
                    return (
                      <div
                        key={app.id}
                        className={`p-3.5 rounded-2xl border shadow-2xs transition group hover:shadow-xs ${
                          isDark
                            ? 'bg-slate-800 border-slate-700'
                            : 'bg-white border-slate-200/90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {app.company}
                            </div>
                            <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                              {app.role}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => openEditModal(app)}
                              aria-label={`Edit application for ${app.company}`}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(app.id)}
                              aria-label={`Delete application for ${app.company}`}
                              className="text-slate-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {app.notes && (
                          <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg">
                            {app.notes}
                          </p>
                        )}

                        {linkedResume && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                            <FileText className="w-3 h-3 text-[#FF5A4E]" />
                            <span className="truncate">{linkedResume.title}</span>
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {app.deadline || 'No date'}
                          </span>

                          {/* Quick Stage Move Dropdown */}
                          <select
                            aria-label="Move application stage"
                            value={app.stage}
                            onChange={(e) => handleMoveStage(app.id, e.target.value as any)}
                            className="bg-transparent text-slate-500 dark:text-slate-400 hover:text-[#FF5A4E] focus:outline-none cursor-pointer text-[10px]"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                → {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  {colApps.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div
          className={`rounded-3xl border overflow-x-auto shadow-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[11px] font-mono uppercase tracking-wider text-slate-400 ${
                isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Deadline / Next Action</th>
                <th className="py-3 px-4">Linked Resume</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => {
                const stageMeta = STAGES.find((s) => s.id === app.stage) || STAGES[0];
                const linkedResume = resumes.find((r) => r.id === app.linkedResumeId);

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {app.company}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {app.role}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${stageMeta.badge}`}
                      >
                        {stageMeta.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {app.deadline || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">
                      {linkedResume ? linkedResume.title : 'Default Resume'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3
                className={`font-serif text-lg font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {editingItem ? 'Edit Job Application' : 'Track New Application'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApplication} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Stripe, Figma"
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
                    Position / Role
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    aria-label="Application pipeline stage"
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Deadline / Interview Date
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Tailored Resume Used
                </label>
                <select
                  aria-label="Tailored resume used"
                  value={formLinkedResumeId}
                  onChange={(e) => setFormLinkedResumeId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.templateId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Notes, Referral Contact or Salary Range
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Referred by Sarah; Expected base $180k-$210k; Next round: System Design on Thursday."
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF5A4E] hover:bg-[#e8483c] text-white text-xs font-semibold shadow-xs"
                >
                  {editingItem ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
