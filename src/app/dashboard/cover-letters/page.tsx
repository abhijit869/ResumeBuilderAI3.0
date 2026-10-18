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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            My Cover Letters
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Write compelling, tailored letters that complement your Kickresume resumes.
          </p>
        </div>

        <Button
          onClick={handleCreateNew}
          className="bg-[#ff5e59] hover:bg-[#ee4e34] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 h-10 px-5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
          New Cover Letter
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search cover letters..."
            className="h-10 pl-9 text-xs sm:text-sm rounded-xl border-gray-200"
          />
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Showing {filtered.length} {filtered.length === 1 ? "letter" : "letters"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={handleCreateNew}
          className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[280px] text-center hover:border-[#ff5e59] hover:bg-orange-50/30 transition-all cursor-pointer group bg-white shadow-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#ff5e59] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-[#ff5e59] transition-colors">
            New Cover Letter
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
            Generate with AI or draft tailored paragraphs
          </p>
        </div>

        {filtered.map((cl) => (
          <div
            key={cl.id}
            className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 p-4 border-b border-gray-100 flex items-center justify-center overflow-hidden">
              <div className="w-44 h-full bg-white rounded-t-lg shadow-md p-3 flex flex-col space-y-1.5 transition-transform duration-300 group-hover:scale-105 border border-gray-200/60">
                <div className="h-2 w-20 bg-[#ff5e59]/80 rounded mb-1"></div>
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
                <Badge variant="secondary" className="capitalize text-[10px] font-bold shadow-xs bg-white text-gray-800 border border-gray-200">
                  {cl.templateId}
                </Badge>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer border border-gray-200">
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
            <div className="p-5">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(cl.updatedAt).toLocaleDateString()}
                </span>
                <span className="text-[#00b5b8] font-bold bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-100">
                  Ready
                </span>
              </div>

              <h3 className="font-extrabold text-gray-900 text-base group-hover:text-[#ff5e59] transition-colors line-clamp-1">
                {cl.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {cl.companyName ? `Target: ${cl.companyName}` : "General Application"}
              </p>

              <div className="mt-5">
                <Button
                  onClick={() => router.push(`/editor/cover-letter/${cl.id}`)}
                  className="w-full bg-[#1e293b] hover:bg-[#ff5e59] text-white text-xs font-bold h-9 rounded-xl transition-colors cursor-pointer"
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
