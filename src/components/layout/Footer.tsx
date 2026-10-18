import React from "react";
import Link from "next/link";
import { FileText, Mail, Globe, Share2 } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Resume Builder", href: "/resumes" },
    { name: "Cover Letter Builder", href: "/cover-letters" },
    { name: "AI Resume Writer", href: "/ai-writer" },
    { name: "ATS Resume Checker", href: "/ats-checker" },
    { name: "Resume Templates", href: "/templates/resume" },
    { name: "Cover Letter Templates", href: "/templates/cover-letter" },
  ],
  Resources: [
    { name: "Resume Examples", href: "/templates/resume" },
    { name: "Cover Letter Examples", href: "/templates/cover-letter" },
    { name: "Pricing", href: "/pricing" },
    { name: "ATS Checker", href: "/ats-checker" },
  ],
  Company: [
    { name: "About Us", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/" },
    { name: "Privacy Policy", href: "/" },
    { name: "Terms of Service", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Resume<span className="text-emerald-400">Builder</span>AI
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Create your best resume yet. Online resume and cover letter builder
              used by millions of job seekers worldwide. Professional templates
              approved by recruiters.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors text-white"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
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
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            © 2026 ResumeBuilderAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
