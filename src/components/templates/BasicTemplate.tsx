import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/ui/social-icons';

interface TemplateProps {
  data: ResumeData;
}

export const BasicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, awards, customization } = data;
  const accentColor = customization?.accentColor || '#ff5e59'; // Kickresume Coral default

  return (
    <div className="w-full bg-white text-gray-900 min-h-[1100px] p-10 flex flex-col justify-between shadow-lg print:shadow-none print:min-h-0 text-sm">
      <div className="space-y-6">
        {/* Header: Centered or Left-aligned with subtle divider */}
        <div className="text-center pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p 
            className="text-base font-semibold mt-1 tracking-wider uppercase"
            style={{ color: accentColor }}
          >
            {personalInfo.title}
          </p>

          {/* Contact Pills */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinIcon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <GithubIcon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </span>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        {personalInfo.summary && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ borderColor: accentColor, color: '#111827' }}
            >
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ borderColor: accentColor, color: '#111827' }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="space-y-1">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-xs text-gray-900">{job.position}</span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {job.startDate} — {job.current ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-600">
                    {job.company} {job.location && `• ${job.location}`}
                  </div>
                  {job.description && (
                    <p className="text-xs text-gray-700 leading-relaxed">{job.description}</p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-700">
                      {job.highlights.map((h, i) => (
                        <li key={i} className="leading-snug">{h}</li>
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
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ borderColor: accentColor, color: '#111827' }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="font-bold text-xs text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
              style={{ borderColor: accentColor, color: '#111827' }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {skill.name}
                  {skill.level && <span className="text-[10px] text-gray-500 ml-1.5 capitalize">({skill.level})</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ borderColor: accentColor, color: '#111827' }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-0.5">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{proj.name}</span>
                    {proj.startDate && (
                      <span className="text-[11px] font-normal text-gray-500">
                        {proj.startDate} {proj.endDate && `— ${proj.endDate}`}
                      </span>
                    )}
                  </div>
                  {proj.url && <div className="text-[11px] text-blue-600">{proj.url}</div>}
                  <p className="text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages, Certifications & Awards */}
        <div className="grid grid-cols-2 gap-4">
          {languages && languages.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
                style={{ borderColor: accentColor, color: '#111827' }}
              >
                Languages
              </h2>
              <ul className="space-y-1 text-xs">
                {languages.map((l) => (
                  <li key={l.id} className="flex justify-between text-gray-700">
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-gray-500 capitalize">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(certifications?.length || awards?.length) ? (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
                style={{ borderColor: accentColor, color: '#111827' }}
              >
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications?.map((c) => (
                  <div key={c.id} className="text-gray-700">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-gray-500 text-[11px]"> ({c.issuer})</span>
                  </div>
                ))}
                {awards?.map((a) => (
                  <div key={a.id} className="text-gray-700">
                    <span className="font-semibold">{a.title}</span>
                    <span className="text-gray-500 text-[11px]"> ({a.issuer})</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <div className="text-center pt-8 border-t border-gray-100 text-[10px] text-gray-400">
        ATS Friendly CV • Created with ResumeBuilderAI
      </div>
    </div>
  );
};
