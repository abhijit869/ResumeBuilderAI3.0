"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, Layout, ShieldCheck } from "lucide-react";

export default function ResumesLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Online Resume Builder
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            The Smartest Way to Build a Resume That Stands Out
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Approved by recruiters from Google, Apple, and Tesla. Create an ATS-ready resume in under 15 minutes.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/templates/resume">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-8 text-base shadow-lg shadow-emerald-600/20">
                Choose a Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">35+ Professional Templates</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Designed by typographers and HR recruiters. Easily customize colors, fonts, and section ordering.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI-Powered Content Generation</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Get intelligent bullet point recommendations tailored specifically to your target industry and job level.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">100% ATS-Friendly</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Never get filtered out by automated screening. Built-in compliance check ensures human recruiters see your resume.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
