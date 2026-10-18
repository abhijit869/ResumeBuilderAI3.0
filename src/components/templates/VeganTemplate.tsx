import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/ui/social-icons';

interface TemplateProps {
  data: ResumeData;
}

export const VeganTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, awards, customization } = data;
  const accentColor = customization?.accentColor || '#10b981'; // Fresh Mint / Emerald default for Vegan

  return (
    <div className="w-full bg-[#fcfcfc] text-stone-800 min-h-[1100px] p-10 flex flex-col justify-between shadow-lg print:shadow-none print:min-h-0 text-sm font-sans">
      <div className="space-y-7">
        {/* Header: Clean minimal header with light border */}
        <div className="border-b border-stone-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-stone-900 tracking-wide">
                {personalInfo.firstName} <span className="font-semibold">{personalInfo.lastName}</span>
              </h1>
              <p className="text-sm font-medium tracking-wider mt-1 uppercase" style={{ color: accentColor }}>
                {personalInfo.title}
              </p>
            </div>
            {personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-stone-200"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-stone-500">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
            {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><LinkedinIcon className="w-3 h-3" />{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
          </div>
        </div>

        {/* Profile */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
              About
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-stone-900 text-xs">{job.position}</span>
                    <span className="text-[11px] text-stone-400">{job.startDate} — {job.current ? 'Present' : job.endDate}</span>
                  </div>
                  <div className="text-xs text-stone-500 font-medium">
                    {job.company} {job.location && `• ${job.location}`}
                  </div>
                  {job.description && (
                    <p className="text-xs text-stone-600 leading-relaxed">{job.description}</p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-stone-600">
                      {job.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
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
            <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-stone-900 text-xs">{edu.degree} in {edu.field}</span>
                    <span className="text-[11px] text-stone-400">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
                  </div>
                  <div className="text-xs text-stone-500">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span 
                  key={skill.id}
                  className="px-2.5 py-1 text-xs rounded border border-stone-200 text-stone-700 bg-white"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        <div className="grid grid-cols-2 gap-4">
          {languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
                Languages
              </h2>
              <div className="space-y-1 text-xs text-stone-600">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-stone-400 capitalize">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">
                Certifications
              </h2>
              <div className="space-y-1 text-xs text-stone-600">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-medium text-stone-800">{c.name}</span>
                    <span className="text-stone-400 text-[11px]"> ({c.issuer})</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="text-center pt-8 border-t border-stone-200 text-[10px] text-stone-400">
        Minimalist Clean Style • Designed with ResumeBuilderAI
      </div>
    </div>
  );
};
