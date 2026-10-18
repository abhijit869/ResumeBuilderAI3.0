"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Free",
      description: "Basic features for simple job applications",
      price: "$0",
      period: "forever",
      badge: null,
      cta: "Get Started Free",
      href: "/signup",
      highlight: false,
      features: [
        "1 Resume & 1 Cover Letter",
        "4 basic resume templates",
        "Export to PDF (with watermark)",
        "Pre-written resume phrases",
        "Basic email support",
      ],
      notIncluded: [
        "AI Resume & Cover Letter Writer",
        "ATS resume checker",
        "All 35+ premium templates",
        "Unlimited PDF downloads",
        "Personal website builder",
        "Priority 24/7 customer support",
      ],
    },
    {
      name: "Pro Premium",
      description: "Complete career toolkit to land your dream job faster",
      price: billingCycle === "yearly" ? "$7" : "$19",
      period: billingCycle === "yearly" ? "per month, billed annually ($84/yr)" : "per month, billed monthly",
      badge: "MOST POPULAR — SAVE 60%",
      cta: "Upgrade to Pro",
      href: "/signup",
      highlight: true,
      features: [
        "Unlimited Resumes & Cover Letters",
        "All 35+ premium templates & color palettes",
        "AI Resume Writer (GPT-4.1 powered)",
        "AI Cover Letter Generator",
        "ATS Resume Score & Optimizer",
        "High-resolution PDF export (no watermark)",
        "Turn resume into a personal portfolio website",
        "Grammar & spell checker",
        "Job application tracker",
        "Priority 24/7 customer support",
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4 px-3 py-1 text-sm bg-emerald-100 text-emerald-800">
              Transparent, simple pricing
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Invest in your career. Get hired <span className="text-emerald-600">3x faster</span>.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Start with our free plan or unlock all AI superpowers and premium templates with Pro.
            </p>

            {/* Billing Toggle */}
            <div className="mt-10 inline-flex items-center p-1.5 bg-gray-200/80 rounded-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billingCycle === "yearly"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Yearly billing</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Save 60%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? "bg-white border-2 border-emerald-500 shadow-2xl ring-4 ring-emerald-500/10"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                    </div>
                    {plan.highlight && (
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      / {plan.period}
                    </span>
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
                      What&apos;s included:
                    </h4>
                    <ul className="space-y-3.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-400 line-through">
                          <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            ×
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10">
                  <Link href={plan.href} className="w-full block">
                    <Button
                      variant={plan.highlight ? "default" : "outline"}
                      className={`w-full h-12 text-base font-semibold ${
                        plan.highlight
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                          : ""
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {plan.highlight && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>14-day 100% money-back guarantee</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Money Back Banner */}
          <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">14-Day Money-Back Guarantee</h3>
              <p className="mt-1 text-emerald-100 text-sm leading-relaxed">
                If you aren’t 100% satisfied with ResumeBuilderAI Pro within 14 days, just let us know and we’ll refund your entire purchase. No hassle, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
