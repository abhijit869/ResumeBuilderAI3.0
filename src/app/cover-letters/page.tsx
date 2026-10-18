"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenTool, Sparkles, CheckCircle2 } from "lucide-react";

export default function CoverLettersLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Cover Letter Builder
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Write a Persuasive Cover Letter in Minutes
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Complement your resume with a tailored letter that catches recruiters&apos; attention and explains why you&apos;re the right fit.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/templates/cover-letter">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-8 text-base shadow-lg shadow-emerald-600/20">
                Browse Letter Templates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
