import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";

export function CreativeTemplate({
  data,
  accentColor = "#7c3aed",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="w-full bg-white text-gray-800 min-h-[1050px] font-sans shadow-lg border border-gray-100 flex flex-col">
      {/* Top Banner */}
      <div
        className="p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Portfolio
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-sm font-medium text-white/90 mt-1">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="text-xs space-y-1.5 text-white/90 sm:text-right">
            {personalInfo.email && (
              <div className="flex sm:justify-end items-center gap-1.5">
                <span>{personalInfo.email}</span>
                <Mail className="w-3.5 h-3.5" />
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex sm:justify-end items-center gap-1.5">
                <span>{personalInfo.phone}</span>
                <Phone className="w-3.5 h-3.5" />
              </div>
            )}
            {personalInfo.location && (
              <div className="flex sm:justify-end items-center gap-1.5">
                <span>{personalInfo.location}</span>
                <MapPin className="w-3.5 h-3.5" />
              </div>
            )}
            {personalInfo.website && (
              <div className="flex sm:justify-end items-center gap-1.5">
                <span>{personalInfo.website}</span>
                <Globe className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="p-8 space-y-6 flex-1">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: accentColor }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              About Me
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience with timeline accent */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-4 border-b flex items-center gap-2"
              style={{ color: accentColor, borderColor: "#f3e8ff" }}
            >
              <Briefcase className="w-4 h-4" />
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="relative pl-5 border-l-2 border-purple-200">
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">{job.position}</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-purple-700 mt-0.5">
                    {job.company} {job.location && <span className="text-gray-400 font-normal">• {job.location}</span>}
                  </p>
                  {job.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{job.description}</p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-disc list-inside text-xs text-gray-700">
                      {job.highlights.map((hl, i) => (
                        <li key={i} className="leading-relaxed">
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-2"
              style={{ color: accentColor, borderColor: "#f3e8ff" }}
            >
              <FolderGit2 className="w-4 h-4" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom 2-col: Education & Skills */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          {education && education.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-2"
                style={{ color: accentColor, borderColor: "#f3e8ff" }}
              >
                <GraduationCap className="w-4 h-4" />
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-gray-900">{edu.degree}</p>
                    <p className="text-gray-600">{edu.field} • {edu.institution}</p>
                    <p className="text-gray-400 text-[11px]">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-2"
                style={{ color: accentColor, borderColor: "#f3e8ff" }}
              >
                <Sparkles className="w-4 h-4" />
                Skills & Strengths
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-medium border border-purple-200"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
