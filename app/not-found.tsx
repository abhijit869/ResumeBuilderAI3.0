import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
          404 · Page Not Found
        </span>
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Route Not Found
        </h1>
        <p className="text-sm text-slate-600">
          The requested page does not exist in ResumeBuilderAi 3.0.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#FF5A4E] hover:bg-[#e6483d] text-white text-sm font-semibold transition"
        >
          Return to Studio
        </Link>
      </div>
    </div>
  );
}
