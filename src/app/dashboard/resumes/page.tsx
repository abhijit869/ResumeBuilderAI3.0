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

export default function ResumesDashboardPage() {
  const { resumes, createResume, duplicateResume, deleteResume, loadSampleResume } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "title">("updated");
  const router = useRouter();

  const handleCreateNew = () => {
    const newResume = createResume("My New Resume");
    router.push(`/editor/resume/${newResume.id}`);
  };

  const handleLoadSample = () => {
    const sample = loadSampleResume();
    router.push(`/editor/resume/${sample.id}`);
  };

  const filteredResumes = resumes
    .filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.personalInfo?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.personalInfo?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTemplate =
        selectedTemplateFilter === "all" || r.templateId === selectedTemplateFilter;

      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Resumes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create, customize, duplicate, and export your job application resumes.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleLoadSample}
            className="text-xs sm:text-sm font-semibold h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Load Sample
          </Button>

          <Link href="/templates/resume">
            <Button variant="outline" className="text-xs sm:text-sm font-semibold h-9">
              Browse Templates
            </Button>
          </Link>

          <Button
            onClick={handleCreateNew}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-9 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            New Resume
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          <Input
            placeholder="Search resumes by title, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm rounded-xl"
          />
        </div>

        {/* Template Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {["all", "professional", "modern", "executive", "tech", "creative"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTemplateFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedTemplateFilter === t
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* View Toggle (Grid vs List) & Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSortBy(sortBy === "updated" ? "title" : "updated")}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort: {sortBy === "updated" ? "Recent" : "Title"}</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Card */}
          <div
            onClick={handleCreateNew}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group bg-white shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
              Create from Scratch
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
              Start with our intelligent step-by-step editor
            </p>
          </div>

          {/* Resume Cards */}
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-48 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-gray-100">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                      {resume.personalInfo?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="h-1.5 w-16 bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded"></div>
                  <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                  <div className="pt-1 flex gap-1">
                    <div className="h-1.5 w-6 bg-emerald-100 rounded"></div>
                    <div className="h-1.5 w-8 bg-emerald-100 rounded"></div>
                  </div>
                </div>

                {/* Template Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-sm bg-white/95 text-gray-800">
                    {resume.templateId}
                  </Badge>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 flex items-center justify-center shadow-sm">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem
                        onClick={() => router.push(`/editor/resume/${resume.id}`)}
                        className="cursor-pointer text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => duplicateResume(resume.id)}
                        className="cursor-pointer text-xs"
                      >
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          if (confirm("Delete this resume permanently?")) {
                            deleteResume(resume.id);
                          }
                        }}
                        className="text-red-600 cursor-pointer text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Card Content & Details */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    95% ATS
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {resume.personalInfo?.title || "Professional Role"} • {resume.personalInfo?.location || "Remote"}
                </p>

                {/* Buttons */}
                <div className="mt-5 flex gap-2">
                  <Button
                    onClick={() => router.push(`/editor/resume/${resume.id}`)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit Resume
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-6">Resume Title</th>
                <th className="py-3.5 px-6 hidden sm:table-cell">Template</th>
                <th className="py-3.5 px-6 hidden md:table-cell">Last Modified</th>
                <th className="py-3.5 px-6">ATS Readiness</th>
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
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {resume.templateId}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      95% High
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/editor/resume/${resume.id}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => duplicateResume(resume.id)}
                        title="Duplicate"
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
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
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
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
