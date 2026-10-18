import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/ui/social-icons';

interface TemplateProps {
  data: ResumeData;
}

export const HothTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, awards, customization } = data;
  const accentColor = customization?.accentColor || '#ff5e59'; // Kickresume Coral default

  return (
    <div className="w-full bg-white text-gray-800 min-h-[1100px] flex shadow-lg print:shadow-none print:min-h-0 text-sm">
      {/* Left Sidebar (Hoth iconic dark/accent layout) */}
      <div 
        className="w-1/3 p-6 text-white flex flex-col justify-between"
        style={{ backgroundColor: '#1e293b' }}
      >
        <div className="space-y-6">
          {/* Avatar / Initials */}
          <div className="flex flex-col items-center text-center">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 mb-3 shadow-md"
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white/20 mb-3 shadow-md"
                style={{ backgroundColor: accentColor }}
              >
                {personalInfo.firstName?.charAt(0) || 'J'}{personalInfo.lastName?.charAt(0) || 'S'}
              </div>
            )}
            <h1 className="text-xl font-bold text-white tracking-wide">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-xs font-medium text-gray-300 mt-1 uppercase tracking-wider">
              {personalInfo.title}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 pt-4 border-t border-gray-700/60 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Contact
            </h3>
            {personalInfo.email && (
              <div className="flex items-center space-x-2 text-gray-300 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center space-x-2 text-gray-300 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center space-x-2 text-gray-300 break-all">
                <LinkedinIcon className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center space-x-2 text-gray-300 break-all">
                <GithubIcon className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
              </div>
            )}
          </div>

          {/* Skills (with Kickresume bar ratings) */}
          {skills && skills.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-700/60">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Skills
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => {
                  const levelPct = 
                    skill.level === 'expert' ? 100 :
                    skill.level === 'advanced' ? 85 :
                    skill.level === 'intermediate' ? 65 : 45;

                  return (
                    <div key={skill.id} className="text-xs">
                      <div className="flex justify-between text-gray-200 mb-1">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-gray-400 capitalize">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${levelPct}%`, backgroundColor: accentColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-700/60">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Languages
              </h3>
              <div className="space-y-1.5 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-gray-300">
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-gray-400 capitalize text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kickresume Verified Badge footer */}
        <div className="pt-6 text-center text-[10px] text-gray-500">
          Created with ResumeBuilderAI • ATS Optimized
        </div>
      </div>

      {/* Main Right Content */}
      <div className="w-2/3 p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* Profile Summary */}
          {personalInfo.summary && (
            <section>
              <h2 
                className="text-sm font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b-2 flex items-center justify-between"
                style={{ borderColor: accentColor, color: '#1e293b' }}
              >
                <span>Profile</span>
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <section>
              <h2 
                className="text-sm font-bold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
                style={{ borderColor: accentColor, color: '#1e293b' }}
              >
                Employment History
              </h2>
              <div className="space-y-4">
                {workExperience.map((job) => (
                  <div key={job.id} className="relative pl-3 border-l-2 border-gray-200">
                    <div 
                      className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className="font-bold text-xs text-gray-900">{job.position}</h4>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {job.startDate} — {job.current ? 'Present' : job.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-600 mb-1">
                      {job.company} {job.location && `• ${job.location}`}
                    </div>
                    {job.description && (
                      <p className="text-xs text-gray-600 mb-1 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                    {job.highlights && job.highlights.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-600">
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
                className="text-sm font-bold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
                style={{ borderColor: accentColor, color: '#1e293b' }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-3 border-l-2 border-gray-200">
                    <div 
                      className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h4 className="font-bold text-xs text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h4>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-600">
                      {edu.institution} {edu.location && `• ${edu.location}`}
                    </div>
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
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
                className="text-sm font-bold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
                style={{ borderColor: accentColor, color: '#1e293b' }}
              >
                Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{proj.name}</span>
                      {proj.startDate && (
                        <span className="text-[11px] font-normal text-gray-500">
                          {proj.startDate} {proj.endDate && `— ${proj.endDate}`}
                        </span>
                      )}
                    </div>
                    {proj.url && (
                      <span className="text-[11px] text-blue-600 block mb-0.5">{proj.url}</span>
                    )}
                    <p className="text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Awards */}
          {(certifications?.length || awards?.length) ? (
            <section>
              <h2 
                className="text-sm font-bold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
                style={{ borderColor: accentColor, color: '#1e293b' }}
              >
                Certifications & Awards
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {certifications?.map((c) => (
                  <div key={c.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-[11px] text-gray-500">{c.issuer} • {c.date}</div>
                  </div>
                ))}
                {awards?.map((a) => (
                  <div key={a.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="font-bold text-gray-900">{a.title}</div>
                    <div className="text-[11px] text-gray-500">{a.issuer} • {a.date}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
};
