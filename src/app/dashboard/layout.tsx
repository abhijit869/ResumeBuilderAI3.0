"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  PenTool,
  BarChart3,
  Settings,
  LogOut,
  Compass,
  Sparkles,
  Globe,
  ChevronDown,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DocumentStarter } from "@/components/dashboard/DocumentStarter";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Compass },
  { name: "My Resumes", href: "/dashboard/resumes", icon: FileText },
  { name: "Cover Letters", href: "/dashboard/cover-letters", icon: PenTool },
  { name: "ATS Checker", href: "/ats-checker", icon: BarChart3 },
  { name: "AI Writer", href: "/ai-writer", icon: Sparkles },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs" style={{ backgroundColor: "#ff5e59" }}>
                <FileText className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Kick<span className="text-[#ff5e59]">resume</span>
                <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                  AI 3.0
                </span>
              </span>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden md:flex space-x-1 overflow-x-auto py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-[#ff5e59]/10 text-[#ff5e59] shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff5e59]" : "text-gray-500"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile, credits & creation actions */}
          <div className="flex items-center gap-3">
            {/* AI Credits Pill */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f3f0ff] border border-[#e0d7fe] text-[#5345ff] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5345ff]" />
              <span>{user?.aiCredits ?? 5} AI Credits</span>
            </div>

            <DocumentStarter />

            {/* Profile Dropdown */}
            <div className="relative pl-2 border-l border-gray-200">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#ff5e59]/15 text-[#ff5e59] border border-[#ff5e59]/30 flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <p className="font-semibold text-gray-900 leading-tight">
                    {user?.name || "sodopel885"}
                  </p>
                  <p className="text-gray-500 text-[10px] truncate max-w-[120px]">
                    {user?.email || "sodopel885@juicehour.com"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="font-bold text-gray-900 text-sm">{user?.name || "sodopel885"}</p>
                    <p className="text-gray-500 text-[11px] break-all">{user?.email || "sodopel885@juicehour.com"}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff5e59]/10 text-[#ff5e59] uppercase tracking-wider">
                        <Zap className="w-3 h-3 mr-1" />
                        {user?.plan || "Premium"} Account
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/resumes"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>My Resumes</span>
                    </Link>
                    <Link
                      href="/dashboard/cover-letters"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <PenTool className="w-4 h-4 text-gray-400" />
                      <span>Cover Letters</span>
                    </Link>
                    <Link
                      href="/ats-checker"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                      <span>ATS Resume Checker</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
