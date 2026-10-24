'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9F6] text-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            ResumeBuilderAi 3.0 Recovery
          </h2>
          <p className="text-sm text-slate-600">
            {error?.message || 'A root-level error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#FF5A4E] text-white text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
