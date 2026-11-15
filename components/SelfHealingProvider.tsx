'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  EnvironmentDiagnosis,
  AdaptiveStyleTokens,
  diagnoseClientEnvironment,
  computeAdaptiveStyleTokens,
  applySelfHealingToDOM,
} from '@/lib/self-healing-engine';
import { ShieldCheck, Monitor, Smartphone, Tablet, Laptop, Sparkles, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface SelfHealingContextType {
  diagnosis: EnvironmentDiagnosis;
  tokens: AdaptiveStyleTokens;
  selfHealingActive: boolean;
  toggleSelfHealing: () => void;
  runAudit: () => void;
}

const SelfHealingContext = createContext<SelfHealingContextType | null>(null);

export function useSelfHealing() {
  const ctx = useContext(SelfHealingContext);
  if (!ctx) {
    throw new Error('useSelfHealing must be used within a SelfHealingProvider');
  }
  return ctx;
}

interface SelfHealingProviderProps {
  children: ReactNode;
  uiTheme?: 'light' | 'dark';
}

export function SelfHealingProvider({
  children,
  uiTheme = 'light',
}: SelfHealingProviderProps) {
  const [selfHealingActive, setSelfHealingActive] = useState(true);
  const [diagnosis, setDiagnosis] = useState<EnvironmentDiagnosis>(() =>
    diagnoseClientEnvironment()
  );
  const [tokens, setTokens] = useState<AdaptiveStyleTokens>(() =>
    computeAdaptiveStyleTokens(diagnosis.deviceType, uiTheme)
  );
  const [isBadgeExpanded, setIsBadgeExpanded] = useState(false);

  const runAudit = useCallback(() => {
    if (!selfHealingActive) return;
    const diag = applySelfHealingToDOM(uiTheme);
    setDiagnosis(diag);
    setTokens(
      computeAdaptiveStyleTokens(
        diag.deviceType,
        uiTheme,
        diag.prefersHighContrast
      )
    );
  }, [uiTheme, selfHealingActive]);

  useEffect(() => {
    runAudit();

    // Listen for resize / orientation change
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(runAudit, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, {
      passive: true,
    });

    // Listen for contrast changes
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    const handleContrastChange = () => runAudit();
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, [runAudit]);

  const toggleSelfHealing = () => {
    setSelfHealingActive((prev) => !prev);
  };

  const DeviceIcon =
    diagnosis.deviceType === 'mobile'
      ? Smartphone
      : diagnosis.deviceType === 'tablet'
      ? Tablet
      : diagnosis.deviceType === 'laptop'
      ? Laptop
      : Monitor;

  return (
    <SelfHealingContext.Provider
      value={{
        diagnosis,
        tokens,
        selfHealingActive,
        toggleSelfHealing,
        runAudit,
      }}
    >
      {children}

      {/* Floating Ambient Self-Healing & Visual Diagnostics Indicator */}
      <aside
        aria-label="Display Diagnostics & Environment Self-Healing"
        className="fixed bottom-4 right-4 z-40 print:hidden select-none"
      >
        <div
          className={`rounded-2xl border transition-all duration-200 shadow-card ${
            uiTheme === 'dark'
              ? 'bg-slate-900/95 border-slate-700/80 text-white'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          {/* Collapsed Pill */}
          <button
            type="button"
            onClick={() => setIsBadgeExpanded(!isBadgeExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold hover:text-[#FF5A4E] transition-colors focus:outline-none"
            title="Click to view environment adaptation diagnostics"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <DeviceIcon className="w-3.5 h-3.5 text-[#FF5A4E]" />
            <span className="capitalize font-mono text-[11px]">
              {diagnosis.deviceType} ({diagnosis.viewportWidth}px)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold hidden sm:inline">
              WCAG AAA
            </span>
            {isBadgeExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Expanded Diagnostic Details */}
          {isBadgeExpanded && (
            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 max-w-xs text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Environment Adapter
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-bold">
                  <Check className="w-3 h-3" />
                  Self-Healing Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px]">Pixel Density</div>
                  <div className="font-bold">{diagnosis.devicePixelRatio}x HiDPI</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <div className="text-slate-400 text-[10px]">Contrast Mode</div>
                  <div className="font-bold text-emerald-600">Optimal Crisp</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Active Self-Healing Defenses:
                </div>
                {diagnosis.healingApplied.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A4E]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Auto-Adjusts Every Device
                </span>
                <button
                  type="button"
                  onClick={runAudit}
                  className="text-[11px] font-semibold text-[#FF5A4E] hover:underline"
                >
                  Re-calibrate
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </SelfHealingContext.Provider>
  );
}
