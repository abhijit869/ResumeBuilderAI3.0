"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  PenTool,
  BarChart3,
  Settings,
  LogOut,
  Compass,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DocumentStarter } from "@/components/dashboard/DocumentStarter";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Compass },
  { name: "My Resumes", href: "/dashboard/resumes", icon: FileText },
  { name: "Cover Letters", href: "/dashboard/cover-letters", icon: PenTool },
  { name: "ATS Checker", href: "/ats-checker", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                Resume<span className="text-emerald-600">Builder</span>AI
              </span>
            </Link>

            {/* Nav Tabs */}
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <DocumentStarter />

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-gray-900 leading-tight">
                  {user?.name || "Job Seeker"}
                </p>
                <p className="text-emerald-600 font-medium capitalize">
                  {user?.plan || "Premium"} Plan
                </p>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
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
