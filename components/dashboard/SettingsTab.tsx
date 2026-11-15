'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Download,
  Trash2,
  RefreshCw,
  KeyRound,
  Database,
  CheckCircle2,
  AlertTriangle,
  User,
  X,
} from 'lucide-react';
import {
  ResumeDocument,
  CoverLetterDocument,
  JobApplicationItem,
} from '@/lib/resume-engine';

interface SettingsTabProps {
  user: { name: string; email: string; plan: string };
  resumes: ResumeDocument[];
  coverLetters: CoverLetterDocument[];
  jobApplications: JobApplicationItem[];
  onDeleteAllUserData: () => void;
  onSignOut: () => void;
  isDark?: boolean;
}

export function SettingsTab({
  user,
  resumes,
  coverLetters,
  jobApplications,
  onDeleteAllUserData,
  onSignOut,
  isDark,
}: SettingsTabProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [cacheClearedNotice, setCacheClearedNotice] = useState(false);

  // Full GDPR / CCPA data export as JSON
  const handleExportAllData = () => {
    const backupPayload = {
      exportTimestamp: new Date().toISOString(),
      generator: 'ResumeBuilderAi 3.0 Cloud Studio',
      account: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      documents: {
        resumes,
        coverLetters,
        jobApplications,
      },
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumebuilderai-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      setCacheClearedNotice(true);
      setTimeout(() => setCacheClearedNotice(false), 2500);
    }
  };

  const handleConfirmAccountDelete = () => {
    if (deleteConfirmInput !== 'DELETE') return;
    onDeleteAllUserData();
    setShowDeleteModal(false);
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
            ResumeBuilderAi 3.0 · Workspace Admin
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Account & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your profile, Firestore synchronization, GDPR data portability, and security keys.
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Profile Card */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-serif text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Profile & Subscription
              </h3>
              <p className="text-[11px] text-slate-500">
                Your authenticated session and active subscription tier.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Account Name
              </label>
              <input
                type="text"
                readOnly
                value={user.name}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user.email}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  Active Tier
                </div>
                <div className="text-[11px] text-slate-500">{user.plan || 'AI Studio Pro'}</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-mono font-bold">
                Active Lifetime
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Persistence & Security */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-serif text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Security & Cloud Sync
              </h3>
              <p className="text-[11px] text-slate-500">
                End-to-end PBKDF2 encryption and Google Cloud Firestore isolation.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Firestore Synchronization
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ONLINE & SYNCHRONIZED</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Resumes: {resumes.length} • Cover Letters: {coverLetters.length} • Tracked Jobs: {jobApplications.length}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Local Password Security
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  PBKDF2 · 100,000 Iterations
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Offline accounts utilize cryptographic salting preventing unauthorized exposure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Portability & Danger Zone */}
      <div
        className={`p-6 rounded-3xl border shadow-xs space-y-6 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`font-serif text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Data Portability & GDPR Controls
            </h3>
            <p className="text-[11px] text-slate-500">
              Export your complete structured data bundle or permanently purge your workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                Export All Data (JSON)
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Download a complete JSON export of all resumes, cover letters, and tracking data.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportAllData}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* Clear Cache */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                Clear Browser Cache
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Clears cached session tokens and temporary AI buffers without deleting saved documents.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{cacheClearedNotice ? 'Cache Cleared!' : 'Flush Cache'}</span>
            </button>
          </div>

          {/* Delete All Data */}
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs text-red-600 dark:text-red-400">
                Purge All Account Data
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Permanently wipes all documents, resumes, and user accounts from cloud storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif text-lg font-bold text-red-600">
                Irreversible Account Deletion
              </h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close delete modal"
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              This action cannot be undone. All your resumes ({resumes.length}), cover letters ({coverLetters.length}), and job applications ({jobApplications.length}) will be permanently wiped from Firestore.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder="DELETE"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmInput !== 'DELETE'}
                onClick={handleConfirmAccountDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
