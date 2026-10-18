import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/ui/social-icons';

interface TemplateProps {
  data: ResumeData;
}

export const EuropeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, awards, customization } = data;
  const accentColor = customization?.accentColor || '#00b5b8'; // Kickresume Teal accent

  return (
    <div className="w-full bg-white text-gray-900 min-h-[1100px] p-8 flex flex-col justify-between shadow-lg print:shadow-none print:min-h-0 text-sm">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b pb-6 border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-base font-semibold mt-1" style={{ color: accentColor }}>
              {personalInfo.title}
            </p>
            {personalInfo.summary && (
              <p className="text-xs text-gray-600 mt-2 max-w-xl leading-relaxed">
                {personalInfo.summary}
              </p>
            )}
          </div>

          <div className="text-right text-xs text-gray-600 space-y-1 shrink-0 pl-4">
            {personalInfo.email && <div className="flex items-center justify-end gap-1"><Mail className="w-3 h-3 text-gray-400" />{personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-1"><Phone className="w-3 h-3 text-gray-400" />{personalInfo.phone}</div>}
            {personalInfo.location && <div className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3 text-gray-400" />{personalInfo.location}</div>}
            {personalInfo.website && <div className="flex items-center justify-end gap-1"><Globe className="w-3 h-3 text-gray-400" />{personalInfo.website.replace(/^https?:\/\//, '')}</div>}
            {personalInfo.linkedin && <div className="flex items-center justify-end gap-1"><LinkedinIcon className="w-3 h-3 text-gray-400" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</div>}
            {personalInfo.github && <div className="flex items-center justify-end gap-1"><GithubIcon className="w-3 h-3 text-gray-400" />{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</div>}
          </div>
        </div>

        {/* Experience - Two column row (Date column | details column) */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-4 border-b text-gray-800"
              style={{ borderBottomColor: accentColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="grid grid-cols-4 gap-4 text-xs">
                  <div className="col-span-1 text-gray-500 font-medium">
                    {job.startDate} — {job.current ? 'Present' : job.endDate}
                    <div className="text-[11px] text-gray-400">{job.location}</div>
                  </div>
                  <div className="col-span-3 space-y-1">
                    <div className="font-bold text-gray-900">{job.position}</div>
                    <div className="font-semibold text-gray-600" style={{ color: accentColor }}>{job.company}</div>
                    {job.description && <p className="text-gray-600 leading-relaxed">{job.description}</p>}
                    {job.highlights && job.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-600">
                        {job.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education - Two column row */}
        {education && education.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-4 border-b text-gray-800"
              style={{ borderBottomColor: accentColor }}
            >
              Education & Training
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4 text-xs">
                  <div className="col-span-1 text-gray-500 font-medium">
                    {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                  </div>
                  <div className="col-span-3">
                    <div className="font-bold text-gray-900">{edu.degree} in {edu.field}</div>
                    <div className="text-gray-600">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                    {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Competences */}
        {skills && skills.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b text-gray-800"
              style={{ borderBottomColor: accentColor }}
            >
              Skills & Competences
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-800">{skill.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages & Additional Info */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b text-gray-800" style={{ borderBottomColor: accentColor }}>
                Languages
              </h2>
              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-gray-700">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-gray-500 capitalize">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certifications?.length || awards?.length) ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b text-gray-800" style={{ borderBottomColor: accentColor }}>
                Certifications & Achievements
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications?.map((c) => (
                  <div key={c.id} className="text-gray-700">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-gray-500 text-[11px]"> ({c.issuer})</span>
                  </div>
                ))}
                {awards?.map((a) => (
                  <div key={a.id} className="text-gray-700">
                    <span className="font-medium">{a.title}</span>
                    <span className="text-gray-500 text-[11px]"> ({a.issuer})</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <div className="text-center pt-8 border-t border-gray-100 text-[10px] text-gray-400">
        European Format • Verified by ResumeBuilderAI
      </div>
    </div>
  );
};
