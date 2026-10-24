'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.warn('Application boundary recovered from error:', error?.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Workspace View Interrupted
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {error?.message || 'An unexpected rendering issue occurred.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e6483d] text-white text-sm font-semibold transition shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Workspace</span>
        </button>
      </div>
    </div>
  );
}
