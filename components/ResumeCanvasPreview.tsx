'use client';

import React from 'react';
import {
  Briefcase,
  FlaskConical,
  GraduationCap,
  Award,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  FolderGit2,
  Languages as LanguagesIcon,
  HeartHandshake,
  BookOpen,
  Layers,
  Scissors,
} from 'lucide-react';
import {
  ResumeDocument,
  THEME_COLORS,
  FONT_FAMILIES,
  RESUME_TEMPLATES,
  DEFAULT_SECTION_ORDER,
  ReorderableSectionKey,
  validateResumeExport,
} from '@/lib/resume-engine';

interface ResumeCanvasPreviewProps {
  resume: ResumeDocument;
  compact?: boolean;
  interactive?: boolean;
  zoomPercent?: number;
  isPrintTarget?: boolean;
  onSelectSection?: (
    section: 'personal' | 'experience' | 'education' | 'skills' | 'extended'
  ) => void;
}

export function ResumeCanvasPreview({
  resume,
  compact = false,
  interactive = false,
  zoomPercent = 100,
  isPrintTarget = false,
  onSelectSection,
}: ResumeCanvasPreviewProps) {
  const palette = THEME_COLORS[resume.themeColor] || THEME_COLORS.green;
  const fontSpec = FONT_FAMILIES[resume.fontFamily] || FONT_FAMILIES.ibm;
  const tplMeta =
    RESUME_TEMPLATES.find((t) => t.id === resume.templateId) ||
    RESUME_TEMPLATES[0];

  const sizeScale =
    resume.fontSize === 'compact'
      ? 'text-[12px]'
      : resume.fontSize === 'comfortable'
      ? 'text-[14px]'
      : 'text-[13px]';

  const spacingScale =
    resume.lineSpacing === 'tight'
      ? 'leading-snug'
      : resume.lineSpacing === 'relaxed'
      ? 'leading-relaxed'
      : 'leading-normal';

  const marginPad = compact
    ? 'p-4 text-[11px]'
    : resume.marginSize === 'compact'
    ? 'p-5 sm:p-6 print:p-6'
    : resume.marginSize === 'generous'
    ? 'p-8 sm:p-11 print:p-10'
    : 'p-6 sm:p-9 print:p-8';

  const pageDimensionClass =
    resume.pageSize === 'LETTER'
      ? 'max-w-[816px]' // US Letter 8.5in
      : 'max-w-[794px]'; // A4 210mm

  const sectionHoverClass = interactive
    ? 'cursor-pointer transition-all rounded-lg hover:ring-2 hover:ring-[#FF5A4E]/40'
    : '';

  const orderedSections: ReorderableSectionKey[] =
    resume.sectionOrder && resume.sectionOrder.length > 0
      ? resume.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const exportReport = validateResumeExport(resume);
  const canvasDomId =
    isPrintTarget || !compact ? 'resume-print-canvas' : undefined;

  // Reusable Section Renderer for any section key
  const renderSectionBlock = (
    key: ReorderableSectionKey,
    styleVariant: 'pill' | 'minimal' | 'dark' = 'minimal'
  ) => {
    const headerPillClass =
      styleVariant === 'pill'
        ? 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3'
        : 'flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider mb-3';

    const headerPillStyle =
      styleVariant === 'pill'
        ? { backgroundColor: palette.accentBg, color: palette.headerText }
        : { color: styleVariant === 'dark' ? palette.swatch : palette.accentText };

    if (key === 'experience' && resume.experience.length > 0) {
      return (
        <div
          key="sec-exp"
          onClick={() => onSelectSection?.('experience')}
          className={`p-1 -m-1 ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <Briefcase className="w-3.5 h-3.5" />
            <span>WORK EXPERIENCE</span>
          </div>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="space-y-1 print-avoid-break">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-bold text-slate-950 text-[14.5px]">
                    {exp.role}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wide text-slate-500 tabular-nums">
                    {exp.period} | {exp.location}
                  </span>
                </div>
                <div
                  style={{ color: palette.accentText }}
                  className="text-xs font-semibold"
                >
                  {exp.company}
                </div>
                <ul className="mt-1 space-y-1 text-slate-700 list-disc pl-4">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (key === 'education' && resume.education.length > 0) {
      return (
        <div
          key="sec-edu"
          onClick={() => onSelectSection?.('education')}
          className={`p-1 -m-1 ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <GraduationCap className="w-3.5 h-3.5" />
            <span>EDUCATION</span>
          </div>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="print-avoid-break">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {edu.period}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {edu.school} {edu.location ? `· ${edu.location}` : ''}
                </div>
                {edu.details && (
                  <p className="text-xs text-slate-600 mt-0.5">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (key === 'projects' && resume.projects && resume.projects.length > 0) {
      return (
        <div
          key="sec-proj"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PROJECTS</span>
          </div>
          <div className="space-y-2.5">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="print-avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {proj.period}
                  </span>
                </div>
                <div
                  style={{ color: palette.accentText }}
                  className="text-xs font-semibold"
                >
                  {proj.role}
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (key === 'skills' && resume.skills.length > 0) {
      return (
        <div
          key="sec-skills"
          onClick={() => onSelectSection?.('skills')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <FlaskConical className="w-3.5 h-3.5" />
            <span>SKILLS</span>
          </div>
          <div className="space-y-3">
            {resume.skills.map((skill) => (
              <div key={skill.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-800 font-semibold">
                    {skill.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {skill.level}%
                  </span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-slate-200 flex items-center">
                  <div
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: palette.swatch,
                    }}
                    className="h-full rounded-full"
                  />
                  <span
                    style={{ left: `calc(${skill.level}% - 5px)` }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-slate-900 border border-white shadow-2xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (
      key === 'languages' &&
      resume.languages &&
      resume.languages.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-lang"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <LanguagesIcon className="w-3.5 h-3.5" />
            <span>LANGUAGES</span>
          </div>
          {/* Circular Language Proficiency Gauges (Observed in Public Template Research) */}
          <div className="flex flex-wrap gap-4 pt-1">
            {resume.languages.map((lang) => (
              <div
                key={lang.id}
                className="flex flex-col items-center text-center"
              >
                <div
                  style={{ borderColor: palette.swatch }}
                  className="w-12 h-12 rounded-full border-3 flex items-center justify-center text-[11px] font-mono font-bold text-slate-900 tabular-nums"
                >
                  {lang.level}%
                </div>
                <span className="text-xs font-bold text-slate-900 mt-1">
                  {lang.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (
      key === 'certifications' &&
      resume.certifications &&
      resume.certifications.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-cert"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <Award className="w-3.5 h-3.5" />
            <span>CERTIFICATIONS</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
            {resume.certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (
      key === 'awards' &&
      resume.awards &&
      resume.awards.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-awards"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>HONORS &amp; AWARDS</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
            {resume.awards.map((aw, i) => (
              <li key={i}>{aw}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (
      key === 'volunteering' &&
      resume.volunteering &&
      resume.volunteering.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-vol"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>VOLUNTEERING</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
            {resume.volunteering.map((vol, i) => (
              <li key={i}>{vol}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (
      key === 'publications' &&
      resume.publications &&
      resume.publications.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-pub"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 print-avoid-break ${sectionHoverClass}`}
        >
          <div style={headerPillStyle} className={headerPillClass}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>PUBLICATIONS</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
            {resume.publications.map((pub) => (
              <li key={pub.id}>
                <strong>{pub.title}</strong> — <em>{pub.venue}</em> ({pub.year})
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (
      key === 'custom' &&
      resume.customSections &&
      resume.customSections.length > 0 &&
      !compact
    ) {
      return (
        <div
          key="sec-custom"
          onClick={() => onSelectSection?.('extended')}
          className={`p-1 -m-1 space-y-3 print-avoid-break ${sectionHoverClass}`}
        >
          {resume.customSections.map((cs) => (
            <div key={cs.id}>
              <div style={headerPillStyle} className={headerPillClass}>
                <Layers className="w-3.5 h-3.5" />
                <span>{cs.title.toUpperCase()}</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 list-disc pl-4">
                {cs.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const leftKeys = orderedSections.filter((k) =>
    ['experience', 'education', 'projects', 'publications', 'volunteering'].includes(
      k
    )
  );
  const rightKeys = orderedSections.filter((k) =>
    ['skills', 'languages', 'certifications', 'awards', 'custom'].includes(k)
  );

  const zoomStyle =
    zoomPercent !== 100
      ? {
          transform: `scale(${zoomPercent / 100})`,
          transformOrigin: 'top center',
        }
      : undefined;

  return (
    <div
      style={zoomStyle}
      className={`mx-auto ${pageDimensionClass} transition-transform print:!w-full print:!max-w-none print:!transform-none print:!scale-100`}
    >
      {/* Layout Family A: Banner Two-Column & Pill Grid (green-executive, metro-professional, coral-modern, amber-creative) */}
      {(tplMeta.layoutStyle === 'banner-two-col' ||
        tplMeta.layoutStyle === 'pill-grid') && (
        <div
          id={canvasDomId}
          className={`bg-white text-slate-900 shadow-sm border border-slate-200/80 rounded-xl overflow-hidden print:shadow-none print:border-none print:rounded-none ${fontSpec.cssClass} ${sizeScale} ${spacingScale} ${marginPad}`}
        >
          {/* Rounded Pastel or Pill Header Block */}
          <div
            onClick={() => onSelectSection?.('personal')}
            style={{
              backgroundColor: palette.headerBg,
              color: palette.headerText,
            }}
            className={`rounded-3xl px-6 py-7 text-center mb-7 print-avoid-break ${sectionHoverClass}`}
          >
            <h2
              className={`${
                compact ? 'text-xl' : 'text-3xl sm:text-[34px]'
              } font-extrabold tracking-tight text-slate-950 mb-1.5`}
            >
              {resume.personalInfo.fullName}
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-3">
              {resume.personalInfo.jobTitle}
            </p>
            <p
              className={`max-w-xl mx-auto ${
                compact
                  ? 'text-[11px] line-clamp-3'
                  : 'text-[13.5px] leading-relaxed'
              } text-slate-800`}
            >
              {resume.personalInfo.summary}
            </p>
            {!compact && (
              <div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11.5px] text-slate-700">
                {resume.personalInfo.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 opacity-70" />
                    {resume.personalInfo.location}
                  </span>
                )}
                {resume.personalInfo.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3 opacity-70" />
                    {resume.personalInfo.email}
                  </span>
                )}
                {resume.personalInfo.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 opacity-70" />
                    {resume.personalInfo.phone}
                  </span>
                )}
                {resume.personalInfo.website && (
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 opacity-70" />
                    {resume.personalInfo.website}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-7">
            <div className="md:col-span-7 print:col-span-7 space-y-6">
              {leftKeys.map((k) =>
                renderSectionBlock(
                  k,
                  tplMeta.layoutStyle === 'pill-grid' ? 'pill' : 'minimal'
                )
              )}
            </div>
            <div className="md:col-span-5 print:col-span-5 space-y-6">
              {rightKeys.map((k) =>
                renderSectionBlock(
                  k,
                  tplMeta.layoutStyle === 'pill-grid' ? 'pill' : 'minimal'
                )
              )}
              {resume.strengths.length > 0 && (
                <div className="print-avoid-break">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      STRENGTHS
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.strengths.map((str, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: palette.accentBg,
                          color: palette.headerText,
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium border border-black/5"
                      >
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Multipage Page-Break Indicator when content exceeds 1 page (hidden in print) */}
          {!compact && exportReport.estimatedPages > 1 && (
            <div className="no-print print:hidden mt-8 pt-4 border-t-2 border-dashed border-amber-400 flex items-center justify-between text-[11px] font-mono text-amber-800 bg-amber-50/70 px-3 py-1.5 rounded">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Scissors className="w-3.5 h-3.5" />
                <span>
                  Page 1 Break Indicator ({resume.pageSize || 'A4'}) — Content continues
                  on Page 2
                </span>
              </span>
              <span>Page 1 of {exportReport.estimatedPages}</span>
            </div>
          )}
        </div>
      )}

      {/* Layout Family B: Dark Sidebar Split (midnight-sidebar, silicon-tech) */}
      {tplMeta.layoutStyle === 'dark-sidebar' && (
        <div
          id={canvasDomId}
          className={`bg-white text-slate-900 shadow-sm border border-slate-200/80 rounded-xl overflow-hidden print:shadow-none print:border-none print:rounded-none grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 ${fontSpec.cssClass} ${sizeScale} ${spacingScale}`}
        >
          <div className="md:col-span-4 print:col-span-4 bg-slate-900 text-white p-6 space-y-6">
            <div
              onClick={() => onSelectSection?.('personal')}
              className={`print-avoid-break ${sectionHoverClass}`}
            >
              <div
                style={{ backgroundColor: palette.swatch }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-950 font-extrabold text-lg mb-3"
              >
                {resume.personalInfo.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {resume.personalInfo.fullName}
              </h2>
              <p
                style={{ color: palette.swatch }}
                className="text-xs font-semibold mt-1"
              >
                {resume.personalInfo.jobTitle}
              </p>
              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div>{resume.personalInfo.location}</div>
                <div>{resume.personalInfo.email}</div>
                <div>{resume.personalInfo.phone}</div>
                <div className="text-slate-400">{resume.personalInfo.website}</div>
              </div>
            </div>

            <div
              onClick={() => onSelectSection?.('skills')}
              className={`print-avoid-break ${sectionHoverClass}`}
            >
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Technical Skills
              </h3>
              <div className="space-y-2.5">
                {resume.skills.map((sk) => (
                  <div key={sk.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-100 font-medium">{sk.name}</span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        {sk.level}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${sk.level}%`,
                          backgroundColor: palette.swatch,
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {resume.languages && resume.languages.length > 0 && (
              <div className="print-avoid-break">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Languages
                </h3>
                <div className="space-y-1 text-xs text-slate-200">
                  {resume.languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span>{l.name}</span>
                      <span className="text-slate-400">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.certifications.length > 0 && (
              <div className="print-avoid-break">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Certifications
                </h3>
                <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                  {resume.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="md:col-span-8 print:col-span-8 p-6 sm:p-8 space-y-6">
            <div
              onClick={() => onSelectSection?.('personal')}
              className={`print-avoid-break ${sectionHoverClass}`}
            >
              <h3
                style={{ color: palette.accentText }}
                className="text-xs font-extrabold uppercase tracking-wider mb-1.5"
              >
                Executive Profile
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {resume.personalInfo.summary}
              </p>
            </div>

            {leftKeys.map((k) => renderSectionBlock(k, 'minimal'))}
          </div>
        </div>
      )}

      {/* Layout Family C: Single-Column Machine-Parsable, Editorial Serif & Academic CV */}
      {(tplMeta.layoutStyle === 'single-col-ats' ||
        tplMeta.layoutStyle === 'editorial-serif' ||
        tplMeta.layoutStyle === 'academic-cv') && (
        <div
          id={canvasDomId}
          className={`bg-white text-slate-900 shadow-sm border border-slate-200/80 rounded-xl overflow-hidden print:shadow-none print:border-none print:rounded-none ${
            tplMeta.layoutStyle === 'editorial-serif' ||
            tplMeta.layoutStyle === 'academic-cv'
              ? 'font-serif'
              : fontSpec.cssClass
          } ${sizeScale} ${spacingScale} ${marginPad}`}
        >
          <div
            onClick={() => onSelectSection?.('personal')}
            style={{ borderBottomColor: palette.swatch }}
            className={`border-b-2 pb-5 mb-6 text-center print-avoid-break ${sectionHoverClass}`}
          >
            <span className="no-print print:hidden inline-block px-2.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-2">
              {tplMeta.name} · {resume.pageSize || 'A4'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              {resume.personalInfo.fullName}
            </h2>
            <p
              style={{ color: palette.accentText }}
              className="text-sm font-semibold mt-0.5"
            >
              {resume.personalInfo.jobTitle}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600">
              <span>{resume.personalInfo.location}</span>
              <span>·</span>
              <span>{resume.personalInfo.email}</span>
              <span>·</span>
              <span>{resume.personalInfo.phone}</span>
              <span>·</span>
              <span>{resume.personalInfo.website}</span>
            </div>
          </div>

          <div
            onClick={() => onSelectSection?.('personal')}
            className={`mb-6 print-avoid-break ${sectionHoverClass}`}
          >
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Executive Summary
            </h3>
            <p className="text-slate-800 leading-relaxed">
              {resume.personalInfo.summary}
            </p>
          </div>

          <div className="space-y-6">
            {orderedSections.map((secKey) => renderSectionBlock(secKey, 'minimal'))}
          </div>
        </div>
      )}

      {/* Layout Family D: ATS Executive Grid (faang-swe-ats, mckinsey-consulting, stripe-product-lead) */}
      {tplMeta.layoutStyle === 'ats-executive-grid' && (
        <div
          id={canvasDomId}
          className={`bg-white text-slate-900 shadow-sm border border-slate-200/80 rounded-xl overflow-hidden print:shadow-none print:border-none print:rounded-none ${fontSpec.cssClass} ${sizeScale} ${spacingScale} ${marginPad}`}
        >
          <div
            onClick={() => onSelectSection?.('personal')}
            style={{ borderBottomColor: palette.swatch }}
            className={`border-b-2 pb-4 mb-5 print-avoid-break ${sectionHoverClass}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                  {resume.personalInfo.fullName}
                </h2>
                <p
                  style={{ color: palette.accentText }}
                  className="text-xs sm:text-sm font-bold tracking-wide mt-0.5"
                >
                  {resume.personalInfo.jobTitle}
                </p>
              </div>
              <div className="text-left sm:text-right text-[11px] font-mono text-slate-600 tabular-nums space-y-0.5">
                <div>
                  {resume.personalInfo.email} · {resume.personalInfo.phone}
                </div>
                <div>
                  {resume.personalInfo.location}
                  {resume.personalInfo.website
                    ? ` · ${resume.personalInfo.website}`
                    : ''}
                </div>
              </div>
            </div>
            {resume.personalInfo.summary && (
              <p className="mt-3 pt-2.5 border-t border-slate-200/80 text-slate-800 leading-relaxed">
                {resume.personalInfo.summary}
              </p>
            )}
          </div>

          {resume.strengths.length > 0 && !compact && (
            <div className="mb-5 pb-3 border-b border-slate-200/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 print-avoid-break">
              <span
                style={{ color: palette.accentText }}
                className="font-extrabold uppercase tracking-wider text-[11px]"
              >
                Core Competencies:
              </span>
              {resume.strengths.map((str, idx) => (
                <React.Fragment key={idx}>
                  <span className="font-medium text-slate-900">{str}</span>
                  {idx < resume.strengths.length - 1 && (
                    <span aria-hidden="true" className="text-slate-400">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="space-y-5">
            {orderedSections.map((secKey) => renderSectionBlock(secKey, 'minimal'))}
          </div>
        </div>
      )}
    </div>
  );
}
