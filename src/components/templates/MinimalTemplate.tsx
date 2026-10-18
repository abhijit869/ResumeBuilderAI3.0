import React from "react";
import { ResumeData } from "@/types/resume";

export function MinimalTemplate({
  data,
  accentColor = "#111827",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects } = data;

  return (
    <div className="w-full bg-white text-gray-900 p-10 min-h-[1050px] font-serif shadow-md border border-gray-100">
      {/* Centered Minimal Header */}
      <div className="text-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-normal tracking-wide uppercase">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-sm font-sans tracking-widest text-gray-500 uppercase mt-1">
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 font-sans text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-6 text-center max-w-xl mx-auto">
          <p className="text-xs font-sans leading-relaxed text-gray-600 italic">
            &ldquo;{personalInfo.summary}&rdquo;
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <div className="mt-8 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-1 border-b border-gray-200">
            Experience
          </h2>
          <div className="space-y-5">
            {workExperience.map((job) => (
              <div key={job.id} className="text-xs">
                <div className="flex justify-between font-bold text-gray-900">
                  <span className="text-sm font-serif">{job.position}</span>
                  <span className="text-gray-400 font-normal">
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <p className="text-gray-500 font-medium mb-1">
                  {job.company} {job.location && `— ${job.location}`}
                </p>
                {job.highlights && (
                  <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                    {job.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mt-8 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pb-1 border-b border-gray-200">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-gray-900">
                  <span className="text-sm font-serif">{edu.degree} in {edu.field}</span>
                  <span className="text-gray-400 font-normal">
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                <p className="text-gray-500">{edu.institution} {edu.location && `— ${edu.location}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-8 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-700">
            {skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name}{index < skills.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
