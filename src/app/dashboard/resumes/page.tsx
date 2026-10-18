"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Download,
  Edit3,
  Clock,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Share2,
  ExternalLink,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportResumeToPdf } from "@/lib/pdf";

export default function ResumesDashboardPage() {
  const { resumes, createResume, duplicateResume, deleteResume, loadSampleResume } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "title">("updated");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateNew = () => {
    const newResume = createResume("My Resume");
    router.push(`/editor/resume/${newResume.id}`);
  };

  const handleLoadSample = () => {
    const sample = loadSampleResume();
    router.push(`/editor/resume/${sample.id}`);
  };

  const handleDownload = async (resume: typeof resumes[0]) => {
    try {
      setDownloadingId(resume.id);
      await exportResumeToPdf(resume);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to export PDF. Please open the editor to download.");
    } finally {
      setDownloadingId(null);
    }
  };

  const templateOptions = ["all", "hoth", "europe", "vegan", "basic", "modern", "creative", "executive", "tech"];

  const filteredResumes = resumes
    .filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.personalInfo?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.personalInfo?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.personalInfo?.lastName || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTemplate =
        selectedTemplateFilter === "all" || (r.templateId || "").toLowerCase() === selectedTemplateFilter.toLowerCase();

      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5e59]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5e59]">
              Documents
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Resumes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create, duplicate, and download your recruiter-approved resumes.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleLoadSample}
            className="text-xs sm:text-sm font-semibold h-9.5 border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-[#00b5b8]" />
            Load Sample CV
          </Button>

          <Link href="/ai-writer">
            <Button className="btn-kr-ai text-xs sm:text-sm font-semibold h-9.5 px-3.5 cursor-pointer shadow-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Write with AI
            </Button>
          </Link>

          <Button
            onClick={handleCreateNew}
            className="btn-kr-primary text-xs sm:text-sm font-semibold h-9.5 px-4 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            New Resume
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 kr-card p-3.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          <Input
            placeholder="Search resumes by title, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9.5 text-xs sm:text-sm rounded-lg border-gray-200 focus-visible:ring-[#ff5e59]"
          />
        </div>

        {/* Template Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          {templateOptions.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTemplateFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                selectedTemplateFilter === t
                  ? "bg-[#ff5e59] text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
              }`}
            >
              {t === "all" ? "All Templates" : t}
            </button>
          ))}
        </div>

        {/* View Toggle (Grid vs List) & Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSortBy(sortBy === "updated" ? "title" : "updated")}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sortBy === "updated" ? "Recent First" : "Alphabetical"}</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Resume Card */}
          <div
            onClick={handleCreateNew}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[310px] text-center hover:border-[#ff5e59] hover:bg-[#ff5e59]/5 transition-all cursor-pointer group bg-white shadow-2xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff5e59]/10 text-[#ff5e59] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-gray-900 text-base group-hover:text-[#ff5e59] transition-colors">
              Create New Resume
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
              Start with Hoth, Europe, Vegan, or Basic template
            </p>
          </div>

          {/* Resume Cards */}
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              className="kr-card overflow-hidden flex flex-col justify-between group"
            >
              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-48 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-gray-100">
                    <div className="w-4 h-4 rounded-full bg-[#ff5e59] text-white text-[8px] flex items-center justify-center font-bold">
                      {resume.personalInfo?.firstName?.charAt(0) || "J"}
                    </div>
                    <div className="h-1.5 w-16 bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                  <div className="pt-1 flex gap-1">
                    <div className="h-1.5 w-6 bg-red-100 rounded"></div>
                    <div className="h-1.5 w-8 bg-red-100 rounded"></div>
                  </div>
                </div>

                {/* Template Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-xs bg-white/95 text-gray-800">
                    {resume.templateId || "Hoth"}
                  </Badge>
                </div>

                {/* ATS Score badge */}
                <div className="absolute top-3 right-12">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/95 px-2 py-0.5 rounded-full shadow-xs">
                    {resume.atsScore || 94}% ATS
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-7 h-7 rounded-full bg-white/95 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs bg-white shadow-xl border border-gray-200">
                      <DropdownMenuItem
                        onClick={() => router.push(`/editor/resume/${resume.id}`)}
                        className="cursor-pointer font-medium py-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Edit Resume
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDownload(resume)}
                        className="cursor-pointer font-medium py-2"
                      >
                        <Download className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => duplicateResume(resume.id)}
                        className="cursor-pointer font-medium py-2"
                      >
                        <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          if (confirm("Delete this resume permanently?")) {
                            deleteResume(resume.id);
                          }
                        }}
                        className="text-red-600 cursor-pointer font-medium py-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Content & Details */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    Edited {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-500 text-[11px] font-medium capitalize">
                    {resume.templateId || "hoth"}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base group-hover:text-[#ff5e59] transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {resume.personalInfo?.title || "Senior Software Engineer"} • {resume.personalInfo?.location || "San Francisco, CA"}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <Button
                    onClick={() => router.push(`/editor/resume/${resume.id}`)}
                    className="flex-1 btn-kr-primary text-white text-xs font-semibold h-9 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit Resume
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDownload(resume)}
                    disabled={downloadingId === resume.id}
                    className="h-9 px-3 text-xs border-gray-200 hover:bg-gray-100 cursor-pointer text-gray-700"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="kr-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-6">Resume Title</th>
                <th className="py-3.5 px-6 hidden sm:table-cell">Template</th>
                <th className="py-3.5 px-6 hidden md:table-cell">Last Modified</th>
                <th className="py-3.5 px-6">ATS Score</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900 text-sm line-clamp-1">
                      {resume.title}
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      {resume.personalInfo?.title || "Untitled Role"}
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <Badge variant="secondary" className="capitalize text-[10px] font-bold">
                      {resume.templateId || "Hoth"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {resume.atsScore || 94}% ATS
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/editor/resume/${resume.id}`)}
                        className="btn-kr-primary text-white text-xs h-8 px-3 cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(resume)}
                        className="text-xs h-8 px-2.5 cursor-pointer text-gray-600"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <button
                        onClick={() => duplicateResume(resume.id)}
                        title="Duplicate"
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this resume permanently?")) {
                            deleteResume(resume.id);
                          }
                        }}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
