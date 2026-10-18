"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function CoverLetterTemplatesPage() {
  const { createCoverLetter, updateCoverLetter } = useResumeStore();
  const router = useRouter();

  const templates = [
    {
      id: "professional",
      name: "Corporate Standard",
      description: "Clean, elegant layout suitable for traditional corporate positions.",
      isPremium: false,
    },
    {
      id: "modern",
      name: "Modern Minimal",
      description: "Contemporary design with clean spacing and subtle accents.",
      isPremium: false,
    },
    {
      id: "creative",
      name: "Bold Creative",
      description: "Eye-catching color header ideal for design and creative applications.",
      isPremium: true,
    },
    {
      id: "executive",
      name: "Executive Brief",
      description: "Distinguished typography and layout tailored for senior leadership.",
      isPremium: true,
    },
  ];

  const handleUseTemplate = (templateId: string) => {
    const cl = createCoverLetter(`My Cover Letter`);
    updateCoverLetter(cl.id, { templateId });
    router.push(`/editor/cover-letter/${cl.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Matching Cover Letter Templates
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Pair your resume with a beautiful, synchronized cover letter that recruiters will actually read.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-gray-100 p-4 border-b border-gray-100 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div className="space-y-1">
                        <div className="h-2 w-16 bg-gray-800 rounded"></div>
                        <div className="h-1.5 w-10 bg-emerald-600 rounded"></div>
                      </div>
                      <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="space-y-1 pt-2">
                      <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                      <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                      <div className="h-1.5 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-1 pt-2">
                      <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                      <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                      <div className="h-1.5 w-5/6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="pt-4 space-y-1">
                      <div className="h-1.5 w-12 bg-gray-400 rounded"></div>
                      <div className="h-2 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    {template.isPremium ? (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                        PRO
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full mt-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Create Cover Letter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
