'use client';

import React, { useState } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Sliders,
  Type,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface CoverPageDesignerProps {
  activeResume: ResumeDocument;
  isDark?: boolean;
}

export function CoverPageDesigner({ activeResume, isDark }: CoverPageDesignerProps) {
  const [includeCoverPage, setIncludeCoverPage] = useState(false);
  const [presetTheme, setPresetTheme] = useState<'midnight' | 'emerald' | 'coral' | 'slate'>('coral');
  const [introStatement, setIntroStatement] = useState(
    'Executive portfolio & technical dossier presenting enterprise architectures, distributed platforms, and engineering leadership.'
  );

  const presets = [
    { id: 'coral', name: 'Coral Modern', bg: 'from-[#FF5A4E] to-rose-700', text: 'text-white' },
    { id: 'midnight', name: 'Midnight Tech', bg: 'from-slate-900 via-slate-800 to-indigo-950', text: 'text-white' },
    { id: 'emerald', name: 'Emerald Executive', bg: 'from-emerald-800 to-teal-950', text: 'text-white' },
    { id: 'slate', name: 'Minimalist Slate', bg: 'from-slate-100 to-slate-200', text: 'text-slate-900' },
  ];

  const currentPreset = presets.find((p) => p.id === presetTheme) || presets[0];

  const handlePrintCoverPage = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeResume.personalInfo.fullName} - Executive Cover Sheet</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; justify-content: space-between; height: 100vh; padding: 60px 48px; box-sizing: border-box; background: ${presetTheme === 'slate' ? '#f8fafc' : '#0f172a'}; color: ${presetTheme === 'slate' ? '#0f172a' : '#ffffff'}; }
            .badge { font-size: 11pt; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; color: #FF5A4E; font-weight: bold; }
            .name { font-size: 38pt; font-weight: bold; margin-top: 16px; margin-bottom: 8px; line-height: 1.1; }
            .title { font-size: 18pt; opacity: 0.85; margin-bottom: 24px; font-weight: 500; }
            .intro { font-size: 14pt; max-width: 600px; line-height: 1.6; opacity: 0.9; }
            .footer { border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px; font-size: 11pt; display: flex; gap: 24px; }
          </style>
        </head>
        <body>
          <div>
            <div class="badge">Executive Dossier & Application</div>
            <div class="name">${activeResume.personalInfo.fullName}</div>
            <div class="title">${activeResume.personalInfo.jobTitle}</div>
            <div class="intro">${introStatement}</div>
          </div>
          <div class="footer">
            <span>${activeResume.personalInfo.email}</span>
            <span>${activeResume.personalInfo.phone}</span>
            <span>${activeResume.personalInfo.location}</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 350);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF5A4E] uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Document Presentation Studio</span>
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Visual Executive Cover Page Designer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Create an optional visual title page for executive presentations.
            <span className="block mt-0.5 text-[11px] text-emerald-600 font-medium">
              * ATS Invariant: ATS-focused resume templates remain text-first. Cover pages are generated as separate presentation sheets and never impede parser readability.
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintCoverPage}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-[#FF5A4E]" />
          <span>Print Cover Sheet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
            }`}
          >
            <h3
              className={`font-serif text-base font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Cover Preset Theme
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresetTheme(p.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    presetTheme === p.id
                      ? 'ring-2 ring-[#FF5A4E] border-[#FF5A4E]'
                      : 'hover:border-slate-300 dark:hover:border-slate-700'
                  } ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div
                    className={`h-4 rounded-md bg-gradient-to-r ${p.bg} mb-2 shadow-2xs`}
                  />
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Executive Dossier Introduction
              </label>
              <textarea
                value={introStatement}
                onChange={(e) => setIntroStatement(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-[#FF5A4E] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Live A4 Preview Canvas */}
        <div className="lg:col-span-7">
          <div
            className={`aspect-[1/1.414] max-w-md mx-auto rounded-3xl shadow-xl overflow-hidden p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br ${currentPreset.bg} ${currentPreset.text}`}
          >
            <div className="space-y-4">
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80">
                Executive Dossier & Brief
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                {activeResume.personalInfo.fullName}
              </h2>
              <div className="text-xs sm:text-sm font-semibold opacity-85">
                {activeResume.personalInfo.jobTitle}
              </div>
              <p className="text-xs leading-relaxed opacity-90 max-w-xs pt-4 border-t border-white/20">
                {introStatement}
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono opacity-80">
              <span>{activeResume.personalInfo.email}</span>
              <span>{activeResume.personalInfo.phone}</span>
              <span>{activeResume.personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
