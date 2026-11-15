'use client';

import React, { useState } from 'react';
import { Globe, Video, Play, Pause, ExternalLink, Image as ImageIcon, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PortfolioShowcaseSectionProps {
  isDark?: boolean;
  onCtaClick?: () => void;
}

export function PortfolioShowcaseSection({ isDark, onCtaClick }: PortfolioShowcaseSectionProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section className={`py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 text-xs font-mono font-semibold mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Personal Portfolio &amp; Rich Media Website</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-5xl tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Turn your resume into a live personal portfolio website.
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Stand out from a pile of flat PDFs. Publish a responsive personal portfolio with project screenshots, verified case studies, and an optional 60-second video elevator pitch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Features List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            {[
              {
                title: 'Custom Slug URL (resumebuilder.ai/p/alex-morgan)',
                desc: 'A permanent, recruiter-friendly personal link to place in your email signature or LinkedIn bio.',
              },
              {
                title: 'Interactive Project Case Studies & Media',
                desc: 'Attach high-resolution architecture diagrams, GitHub repositories, and live product demos.',
              },
              {
                title: 'Video Elevator Pitch (60-sec intro)',
                desc: 'Optional video introduction with closed captions, poster fallback, and zero intrusive autoplay.',
              },
              {
                title: 'Revocable Access & Privacy Controls',
                desc: 'Toggle your website public or private anytime, with password protection or instant expiration.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  <Check className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>{f.title}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-6">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>Publish Your Personal Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Live Portfolio Web Preview Mockup (7 cols) */}
        <div className="lg:col-span-7">
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
            {/* Browser Mockup Top Bar */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="px-4 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 max-w-xs truncate">
                <span className="text-emerald-500">https://</span>resumebuilder.ai/p/alex-morgan
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Portfolio Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-[#FF5A4E] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
                    AM
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-950 dark:text-white">
                      Alex Morgan
                    </h3>
                    <p className="text-xs text-violet-600 font-semibold">
                      Staff Infrastructure &amp; Systems Engineer
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      San Francisco, CA · Available for Staff / Principal Roles
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                    ● Ready to Interview
                  </span>
                </div>
              </div>

              {/* Video Pitch Card with Play/Pause Controls & Captions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Video className="w-4 h-4 text-violet-600" />
                    <span>60-Second Video Introduction (Optional)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">0:58 · HD 1080p</span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white">
                  <div className="text-center space-y-2 p-4">
                    <button
                      type="button"
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      aria-label={isPlayingVideo ? 'Pause Video' : 'Play Video'}
                      className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white mx-auto transition"
                    >
                      {isPlayingVideo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <p className="text-xs text-slate-300">
                      {isPlayingVideo
                        ? 'Simulating playback with accessibility captions...'
                        : 'Click to preview candidate elevator pitch'}
                    </p>
                    <div className="inline-block bg-black/60 px-2.5 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                      [Captions Active: &quot;Hi! I am Alex. Over the last 7 years I built high-scale cloud platforms...&quot;]
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlight Project Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white">Multi-Region Envoy Mesh</div>
                  <p className="text-slate-500 text-[11px] mt-1">Cross-cloud service mesh routing 250M daily calls at &lt;4ms latency.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="font-bold text-slate-900 dark:text-white">Zero-Downtime DB Migration</div>
                  <p className="text-slate-500 text-[11px] mt-1">Migrated 4TB PostgreSQL dataset without dropping a single active customer query.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
