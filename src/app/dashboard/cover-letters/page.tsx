"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
} from "lucide-react";
import { useResumeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CoverLettersDashboardPage() {
  const { coverLetters, createCoverLetter, deleteCoverLetter } = useResumeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCreateNew = () => {
    const cl = createCoverLetter("My Cover Letter");
    router.push(`/editor/cover-letter/${cl.id}`);
  };

  const filtered = coverLetters.filter((cl) =>
    cl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cl.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Cover Letters
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Write compelling, tailored letters that complement your resume.
          </p>
        </div>

        <Button
          onClick={handleCreateNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm h-9"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
          New Cover Letter
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search cover letters..."
            className="h-10 pl-9 text-xs sm:text-sm rounded-xl"
          />
        </div>
        <p className="text-xs font-medium text-gray-500">
          Showing {filtered.length} {filtered.length === 1 ? "letter" : "letters"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={handleCreateNew}
          className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[280px] text-center hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group bg-white shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
            New Cover Letter
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
            Generate with AI or draft tailored paragraphs
          </p>
        </div>

        {filtered.map((cl) => (
          <div
            key={cl.id}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
              <div className="w-44 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-100">
                <div className="h-2 w-20 bg-emerald-700/80 rounded mb-1"></div>
                <div className="h-1 w-full bg-gray-200 rounded"></div>
                <div className="h-1 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-1 w-full bg-gray-200 rounded"></div>
                <div className="h-1 w-4/6 bg-gray-200 rounded"></div>
                <div className="pt-2 flex justify-end">
                  <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Template Badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-sm bg-white/95 text-gray-800">
                  {cl.templateId}
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
                  <DropdownMenuContent align="end" className="w-36 rounded-xl">
                    <DropdownMenuItem
                      onClick={() => router.push(`/editor/cover-letter/${cl.id}`)}
                      className="cursor-pointer text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (confirm("Delete this cover letter?")) {
                          deleteCoverLetter(cl.id);
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

            {/* Content Details */}
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(cl.updatedAt).toLocaleDateString()}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  Letter Ready
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                {cl.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {cl.companyName ? `Target: ${cl.companyName}` : "General Application"}
              </p>

              <div className="mt-5">
                <Button
                  onClick={() => router.push(`/editor/cover-letter/${cl.id}`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  Edit Letter
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
