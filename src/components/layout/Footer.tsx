import React from "react";
import Link from "next/link";
import { FileText, Mail, Globe, Share2 } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Resume Builder", href: "/dashboard/resumes" },
    { name: "Cover Letter Builder", href: "/dashboard/cover-letters" },
    { name: "AI Resume Writer", href: "/ai-writer" },
    { name: "ATS Resume Checker", href: "/ats-checker" },
    { name: "Resume Templates", href: "/templates/resume" },
    { name: "Cover Letter Templates", href: "/templates/cover-letter" },
  ],
  Templates: [
    { name: "Hoth Template", href: "/templates/resume" },
    { name: "Europe Template", href: "/templates/resume" },
    { name: "Vegan Template", href: "/templates/resume" },
    { name: "Basic Template", href: "/templates/resume" },
    { name: "ATS Safe Templates", href: "/templates/resume" },
  ],
  Account: [
    { name: "Sign In", href: "/login" },
    { name: "Register Free", href: "/signup" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Resumes", href: "/dashboard/resumes" },
    { name: "Settings", href: "/dashboard/settings" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 font-sans border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#ff5e59]">
                <FileText className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Kick<span className="text-[#ff5e59]">resume</span>
                <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  AI 3.0
                </span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
              The world&apos;s leading AI resume and cover letter builder. Used by over 5 million candidates who got hired at Google, Apple, Nike, Tesla, and Amazon.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.kickresume.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-[#ff5e59] rounded-xl flex items-center justify-center transition-colors text-white"
                aria-label="Kickresume Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-[#ff5e59] rounded-xl flex items-center justify-center transition-colors text-white"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@kickresume.com"
                className="w-9 h-9 bg-gray-800 hover:bg-[#ff5e59] rounded-xl flex items-center justify-center transition-colors text-white"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-[#ff5e59] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500">
            © 2026 Kickresume clone in ResumeBuilderAI3.0. Official test account: sodopel885@juicehour.com
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
