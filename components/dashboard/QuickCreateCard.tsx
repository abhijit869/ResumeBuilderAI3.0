'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface QuickCreateCardProps {
  title: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
  isDark?: boolean;
}

export function QuickCreateCard({
  title,
  description,
  badge,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
  isDark,
}: QuickCreateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-all card-hover-lift group focus:outline-none focus:ring-2 focus:ring-[#FF5A4E]/30 ${
        isDark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>

          {badge && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              {badge}
            </span>
          )}
        </div>

        <h3
          className={`font-serif text-sm sm:text-base font-bold tracking-tight group-hover:text-[#FF5A4E] transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {title}
        </h3>

        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#FF5A4E] transition-colors">
        <span>Launch Tool</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
