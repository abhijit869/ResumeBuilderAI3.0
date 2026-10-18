import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function ModernTemplate({
  data,
  accentColor = "#0f766e",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="w-full bg-white text-gray-800 min-h-[1050px] font-sans shadow-md border border-gray-100 flex">
      {/* Left Sidebar */}
      <div
        className="w-1/3 p-6 text-white flex flex-col justify-between"
        style={{ backgroundColor: accentColor }}
      >
        <div className="space-y-6 text-xs">
          {/* Avatar / Initials */}
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 mx-auto">
            {personalInfo.firstName?.charAt(0)}
            {personalInfo.lastName?.charAt(0)}
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1 mb-2">
              Contact
            </h3>
            <div className="space-y-2 text-[11px]">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5 break-all">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5 break-all">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5 break-all">
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1.5 break-all">
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-white/80" />
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education in Sidebar */}
          {education && education.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1 mb-2">
                Education
              </h3>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[11px]">
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-white/80">{edu.field}</p>
                    <p className="text-white/70">{edu.institution}</p>
                    <p className="text-white/60 text-[10px]">
                      {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1 mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-white/80 border-b border-white/20 pb-1 mb-2">
                Languages
              </h3>
              <div className="space-y-1 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-white/70 capitalize">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-lg font-medium mt-0.5" style={{ color: accentColor }}>
              {personalInfo.title}
            </p>
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                About Me
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {workExperience.map((job) => (
                  <div key={job.id} className="text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{job.position}</span>
                      <span className="text-gray-400 font-normal">
                        {job.startDate} – {job.current ? "Present" : job.endDate}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      {job.company} {job.location && `• ${job.location}`}
                    </p>
                    {job.description && <p className="text-gray-700 mb-1">{job.description}</p>}
                    {job.highlights && (
                      <ul className="list-disc list-inside space-y-0.5 text-gray-600">
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Projects
              </h2>
              <div className="space-y-2 text-xs">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <p className="font-bold text-gray-900">{proj.name}</p>
                    <p className="text-gray-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
