import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

export function ExecutiveTemplate({
  data,
  accentColor = "#1e293b",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="w-full bg-white text-gray-900 min-h-[1050px] p-10 font-serif shadow-lg border border-gray-200">
      {/* Header */}
      <header className="text-center pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-sm font-medium tracking-widest uppercase text-gray-600 mt-1 font-sans">
            {personalInfo.title}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-600 font-sans">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              {personalInfo.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mt-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest font-sans pb-1 mb-2 border-b"
            style={{ color: accentColor, borderColor: "#e2e8f0" }}
          >
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-gray-700 font-sans text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mt-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest font-sans pb-1 mb-3 border-b"
            style={{ color: accentColor, borderColor: "#e2e8f0" }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="font-sans">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-gray-900 font-serif">
                    {job.position}
                  </h3>
                  <span className="text-xs text-gray-500 font-sans">
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-gray-700 font-medium">
                  <span>{job.company}</span>
                  {job.location && <span className="text-gray-500">{job.location}</span>}
                </div>
                {job.description && (
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {job.description}
                  </p>
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mt-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest font-sans pb-1 mb-3 border-b"
            style={{ color: accentColor, borderColor: "#e2e8f0" }}
          >
            Education & Credentials
          </h2>
          <div className="space-y-3 font-sans">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 font-serif">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{edu.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mt-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest font-sans pb-1 mb-3 border-b"
            style={{ color: accentColor, borderColor: "#e2e8f0" }}
          >
            Key Projects & Initiatives
          </h2>
          <div className="space-y-2.5 font-sans">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-gray-900 font-serif">
                    {proj.name}
                  </h3>
                  {proj.startDate && (
                    <span className="text-xs text-gray-500">
                      {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ""}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Certifications bottom grid */}
      <div className="mt-6 grid grid-cols-2 gap-6 pt-2 border-t border-gray-200 font-sans">
        {skills && skills.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2"
              style={{ color: accentColor }}
            >
              Core Competencies
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">
              {skills.map((s) => s.name).join(" • ")}
            </p>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2"
              style={{ color: accentColor }}
            >
              Certifications
            </h2>
            <div className="space-y-1 text-xs text-gray-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold">{c.name}</span> – {c.issuer} ({c.date})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {languages && languages.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-100 text-xs font-sans text-gray-600">
          <span className="font-semibold text-gray-900">Languages: </span>
          {languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
        </div>
      )}
    </div>
  );
}
