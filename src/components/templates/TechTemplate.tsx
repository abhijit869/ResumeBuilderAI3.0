import React from "react";
import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, ExternalLink, Terminal, Code2, Award } from "lucide-react";

export function TechTemplate({
  data,
  accentColor = "#2563eb",
}: {
  data: ResumeData;
  accentColor?: string;
}) {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages } = data;

  return (
    <div className="w-full bg-white text-slate-800 min-h-[1050px] font-sans shadow-lg border border-slate-200 flex">
      {/* Left Sidebar */}
      <div className="w-[34%] bg-slate-900 text-slate-200 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Info */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase mb-3 text-white"
              style={{ backgroundColor: accentColor }}
            >
              <Terminal className="w-3 h-3" />
              Dev Profile
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {personalInfo.firstName}
              <br />
              {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1 mb-2.5">
              {"// Contact Info"}
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              {personalInfo.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2 break-all">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-[11px]">{personalInfo.github}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2 break-all">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-[11px]">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1 mb-2.5">
                {"// Skills & Tech"}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono border border-slate-700/60"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1 mb-2.5">
                {"// Education"}
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-white">{edu.degree}</p>
                    <p className="text-slate-400">{edu.field}</p>
                    <p className="text-slate-500 text-[11px]">{edu.institution}</p>
                    <p className="text-slate-500 font-mono text-[10px]">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1 mb-2.5">
                {"// Languages"}
              </h2>
              <div className="space-y-1 text-xs text-slate-300">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-400 font-mono text-[10px] capitalize">
                      {l.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-[66%] p-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider pb-1 mb-2 border-b flex items-center gap-1.5"
              style={{ color: accentColor, borderColor: "#e2e8f0" }}
            >
              <Code2 className="w-3.5 h-3.5" />
              Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
              style={{ color: accentColor, borderColor: "#e2e8f0" }}
            >
              <Terminal className="w-3.5 h-3.5" />
              Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {job.position}
                    </h3>
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium text-xs mt-0.5">
                    {job.company} {job.location && <span className="text-slate-400">• {job.location}</span>}
                  </p>
                  {job.description && (
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-disc list-inside text-slate-700">
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
              className="text-xs font-mono font-bold uppercase tracking-wider pb-1 mb-3 border-b flex items-center gap-1.5"
              style={{ color: accentColor, borderColor: "#e2e8f0" }}
            >
              <Code2 className="w-3.5 h-3.5" />
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-mono font-bold uppercase tracking-wider pb-1 mb-2.5 border-b flex items-center gap-1.5"
              style={{ color: accentColor, borderColor: "#e2e8f0" }}
            >
              <Award className="w-3.5 h-3.5" />
              Certifications
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-slate-500 text-[11px]">{c.issuer} ({c.date})</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
