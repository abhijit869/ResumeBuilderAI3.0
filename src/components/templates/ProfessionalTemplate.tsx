import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function ProfessionalTemplate({
  data,
  accentColor = "#059669",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="w-full bg-white text-gray-800 p-8 min-h-[1050px] font-sans shadow-md border border-gray-100">
      {/* Header */}
      <div className="border-b-2 pb-6" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg font-semibold mt-1" style={{ color: accentColor }}>
          {personalInfo.title}
        </p>

        {/* Contact items */}
        <div className="flex flex-wrap gap-y-1 gap-x-4 mt-3 text-xs text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: "#e5e7eb" }}
          >
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <div className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: "#e5e7eb" }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className="text-sm">{job.position}</span>
                  <span className="text-gray-500 font-medium">
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-semibold mb-1">
                  {job.company} {job.location && `• ${job.location}`}
                </div>
                {job.description && <p className="text-gray-700 mb-1">{job.description}</p>}
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-gray-700 pl-1">
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
        <div className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
            style={{ color: accentColor, borderColor: "#e5e7eb" }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className="text-sm">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
                <div className="text-gray-600 font-medium">
                  {edu.institution} {edu.location && `• ${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
                {edu.description && <p className="text-gray-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: "#e5e7eb" }}
          >
            Key Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 bg-gray-100 rounded text-xs text-gray-800 font-medium border border-gray-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: "#e5e7eb" }}
          >
            Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="font-bold text-gray-900 flex justify-between">
                  <span>{proj.name}</span>
                  {proj.url && (
                    <span className="text-emerald-700 underline font-normal">{proj.url}</span>
                  )}
                </div>
                <p className="text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages Grid */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {certifications && certifications.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#e5e7eb" }}
            >
              Certifications
            </h2>
            <div className="space-y-1.5 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-bold text-gray-900">{c.name}</p>
                  <p className="text-gray-500 text-[11px]">{c.issuer} • {c.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: "#e5e7eb" }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {languages.map((l) => (
                <span key={l.id} className="text-gray-700">
                  <strong className="text-gray-900">{l.name}:</strong>{" "}
                  <span className="capitalize text-gray-500">{l.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
