'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  CheckCircle2,
  Sparkles,
  Link2,
  Play,
  FileText,
  User,
} from 'lucide-react';
import { ResumeDocument } from '@/lib/resume-engine';

interface MediaLibraryTabProps {
  activeResume: ResumeDocument;
  onUpdateResume: (resume: ResumeDocument) => void;
  isDark?: boolean;
}

export function MediaLibraryTab({
  activeResume,
  onUpdateResume,
  isDark,
}: MediaLibraryTabProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    '/assets/aistudio/image_663e4373.png'
  );
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  const [videoCaptions, setVideoCaptions] = useState<string>(
    'Hi, I am Alex Rivera. As a Staff Software Architect, I specialize in building fault-tolerant Next.js SaaS platforms, scalable microservices, and AI-powered workflow automation. Watch this 90-second overview to learn more about my impact.'
  );

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
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
            ResumeBuilderAi 3.0 · Asset Studio
          </div>
          <h1
            className={`font-serif text-2xl sm:text-3xl mt-1 tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Media & Introduction Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your professional headshots, portfolio cover banners, and 60-second video elevator pitch.
          </p>
        </div>

        {savedNotice && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold inline-flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Media preferences saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headshot & Profile Image */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5A4E]/10 flex items-center justify-center text-[#FF5A4E]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-serif text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Profile Photo / Avatar
              </h3>
              <p className="text-[11px] text-slate-500">
                Used in modern photo templates and web portfolio profile headers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 pt-2">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#FF5A4E] bg-slate-100 dark:bg-slate-800 shrink-0 shadow-xs">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Image URL (e.g. /assets/avatar.jpg or https://...)"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarUrl('/assets/aistudio/image_663e4373.png')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Use Default Logo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAvatarUrl(
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sample Headshot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Introduction Pitch */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`font-serif text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Video Elevator Pitch
              </h3>
              <p className="text-[11px] text-slate-500">
                Embed a 60-second video intro from Loom, YouTube, or Vimeo for recruiters.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Video Share URL
              </label>
              <div className="relative">
                <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.loom.com/share/... or YouTube link"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Transcript & Summary Captions
              </label>
              <textarea
                value={videoCaptions}
                onChange={(e) => setVideoCaptions(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
