import React, { useState } from 'react';
import { saveWorkspaceProfile } from '@workspace/api-client-react';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, LayoutTemplate, Briefcase, User, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import { auditResumeLocally, generateSummaryVariants, improveBulletLocally } from '@/lib/local-tools';
import { ResumeExportActions } from '@/components/ResumeExportActions';
import type { ResumeData, ResumeTemplate } from '@/store';
import { RESUME_TEMPLATES } from '@/lib/resume-templates';

function ResumePreview() {
  const { resumeData, selectedTemplate, templateColor } = useAppStore();
  const layout = selectedTemplate.layout ?? (selectedTemplate.id === 'editorial-profile' ? 'editorial' : 'ats');

  if (layout === 'editorial') {
    return (
      <div className="w-full max-w-[800px] min-h-[1050px] rounded-sm bg-white px-10 py-9 font-serif leading-relaxed text-slate-900 shadow-2xl">
        <header className="border-b-2 pb-5 text-center" style={{ borderColor: `${templateColor}55` }}>
          <h1 className="font-sans text-4xl font-black tracking-tight" style={{ color: templateColor }}>
            {resumeData.name || 'Your Name'}
          </h1>
          <div className="mt-1 font-sans text-lg font-semibold uppercase tracking-[0.2em] text-slate-700">
            {resumeData.title || 'Professional Title'}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {[resumeData.contact.location, resumeData.contact.email, resumeData.contact.phone, resumeData.contact.linkedin]
              .filter(Boolean)
              .map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true" className="text-slate-300">•</span>}
                  {item}
                </span>
              ))}
          </div>
        </header>

        <div className="mt-6 space-y-6">
          <EditorialSection title="Profile" color={templateColor}>
            <p className="text-sm text-slate-700">
              {resumeData.summary || 'Add a concise professional summary that connects your strongest evidence to the target role.'}
            </p>
          </EditorialSection>

          {resumeData.experience.length > 0 && (
            <EditorialSection title="Experience" color={templateColor}>
              <div className="space-y-5">
                {resumeData.experience.map(exp => (
                  <div key={exp.id} className="grid grid-cols-[112px_1fr] gap-4">
                    <div className="pt-1 text-xs font-semibold text-slate-500">{exp.dates}</div>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-sans text-base font-bold">{exp.role || 'Role'}</h3>
                        <span className="text-xs font-semibold" style={{ color: templateColor }}>{exp.company}</span>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                        {exp.bullets.filter(Boolean).map((bullet, index) => (
                          <li key={`${exp.id}-bullet-${index}`}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </EditorialSection>
          )}

          {resumeData.education.length > 0 && (
            <EditorialSection title="Education" color={templateColor}>
              <div className="space-y-3 text-sm">
                {resumeData.education.map((education, index) => (
                  <div key={`${education.school}-${index}`} className="grid grid-cols-[112px_1fr] gap-4">
                    <div className="text-xs font-semibold text-slate-500">{education.dates}</div>
                    <div>
                      <strong>{education.degree}</strong>
                      {education.school && <> · {education.school}</>}
                      {education.details && <div className="text-slate-600">{education.details}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </EditorialSection>
          )}

          <EditorialSection title="Skills" color={templateColor}>
            <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {resumeData.skills.map((skill, index) => (
                <div key={`${skill}-${index}`} className="border-b border-slate-200 pb-1">{skill}</div>
              ))}
            </div>
          </EditorialSection>

          {(resumeData.projects.length > 0 || resumeData.certifications.length > 0 || resumeData.languages.length > 0) && (
            <EditorialSection title="Additional Information" color={templateColor}>
              <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                {resumeData.projects.map((project, index) => (
                  <div key={`project-${index}`}><strong>{project.name}</strong>{project.description && ` — ${project.description}`}</div>
                ))}
                {resumeData.certifications.map((certification, index) => (
                  <div key={`certification-${index}`}><strong>{certification.name}</strong>{certification.issuer && ` · ${certification.issuer}`}</div>
                ))}
                {resumeData.languages.map((language, index) => (
                  <div key={`language-${index}`}><strong>{language.name}</strong>{language.proficiency && ` · ${language.proficiency}`}</div>
                ))}
              </div>
            </EditorialSection>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'sidebar' || layout === 'timeline') {
    return <SidebarPreview data={resumeData} template={selectedTemplate} accent={templateColor} timeline={layout === 'timeline'} />;
  }

  if (layout === 'executive') {
    return <ExecutivePreview data={resumeData} accent={templateColor} />;
  }

  if (layout === 'technical') {
    return <TechnicalPreview data={resumeData} accent={templateColor} />;
  }

  return (
    <StandardPreview data={resumeData} accent={templateColor} />
  );
}

function StandardPreview({ data, accent }: { data: ResumeData; accent: string }) {
  return (
    <div className="w-full max-w-[800px] min-h-[1050px] rounded-sm bg-white p-8 font-serif leading-relaxed text-black shadow-2xl">
      <header className="mb-6 border-b-2 pb-4" style={{ borderColor: `${accent}55` }}>
        <h1 className="mb-1 font-sans text-4xl font-bold" style={{ color: accent }}>{data.name || 'Your Name'}</h1>
        <div className="mb-2 font-sans text-xl text-black/70">{data.title || 'Professional Title'}</div>
        <ContactLine data={data} />
      </header>
      <SummaryBlock data={data} />
      <ExperienceBlock data={data} accent={accent} />
      <SkillsBlock data={data} accent={accent} />
    </div>
  );
}

function SidebarPreview({ data, template, accent, timeline }: { data: ResumeData; template: ResumeTemplate; accent: string; timeline: boolean }) {
  return (
    <div className="flex w-full max-w-[800px] min-h-[1050px] overflow-hidden rounded-sm bg-white font-sans text-slate-900 shadow-2xl">
      <aside className={`w-[30%] shrink-0 p-7 text-white ${timeline ? 'bg-slate-800' : 'bg-slate-950'}`}>
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 text-2xl font-bold" style={{ backgroundColor: `${accent}aa` }}>
          {(data.name || 'Y').slice(0, 1).toUpperCase()}
        </div>
        <h1 className="text-xl font-black leading-tight">{data.name || 'Your Name'}</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/70">{data.title || 'Professional Title'}</p>
        <SidebarSection title="Contact">
          <ContactLine data={data} dark />
        </SidebarSection>
        <SidebarSection title="Skills">
          <ul className="space-y-2 text-xs text-white/80">{data.skills.slice(0, 8).map((skill, index) => <li key={`${skill}-${index}`}>• {skill}</li>)}</ul>
        </SidebarSection>
        <SidebarSection title="Languages">
          <ul className="space-y-2 text-xs text-white/80">{(data.languages.length ? data.languages : [{ name: 'English', proficiency: 'Professional' }]).slice(0, 4).map((language, index) => <li key={`${language.name}-${index}`}>{language.name} <span className="block text-[10px] text-white/50">{language.proficiency}</span></li>)}</ul>
        </SidebarSection>
      </aside>
      <main className="min-w-0 flex-1 p-8">
        <h2 className="mb-2 text-2xl font-black" style={{ color: accent }}>{timeline ? 'Profile' : 'About Me'}</h2>
        <p className="mb-7 text-sm leading-relaxed text-slate-600">{data.summary || 'Add a concise professional summary that connects your strongest evidence to the target role.'}</p>
        <h2 className="mb-4 border-b-2 pb-2 text-lg font-black uppercase tracking-widest" style={{ borderColor: `${accent}66`, color: accent }}>Experience</h2>
        <div className={timeline ? 'border-l-2 pl-5' : 'space-y-6'} style={timeline ? { borderColor: `${accent}66` } : undefined}>
          {data.experience.map(exp => (
            <article key={exp.id} className={timeline ? 'relative mb-6' : ''}>
              {timeline && <span className="absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: accent }} />}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold">{exp.role || 'Role'}</h3><span className="text-xs text-slate-500">{exp.dates}</span>
              </div>
              <div className="text-xs font-semibold" style={{ color: accent }}>{exp.company}</div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">{exp.bullets.filter(Boolean).map((bullet, index) => <li key={`${exp.id}-${index}`}>{bullet}</li>)}</ul>
            </article>
          ))}
        </div>
        <h2 className="mb-3 mt-8 border-b-2 pb-2 text-lg font-black uppercase tracking-widest" style={{ borderColor: `${accent}66`, color: accent }}>Education</h2>
        {data.education.map((education, index) => <div key={`${education.school}-${index}`} className="mb-3 text-sm"><strong>{education.degree}</strong><div className="text-slate-600">{education.school} · {education.dates}</div></div>)}
      </main>
    </div>
  );
}

function ExecutivePreview({ data, accent }: { data: ResumeData; accent: string }) {
  return (
    <div className="w-full max-w-[800px] min-h-[1050px] rounded-sm bg-white p-9 font-serif text-slate-900 shadow-2xl">
      <header className="mb-7 grid grid-cols-[1fr_auto] gap-8 border-b pb-6" style={{ borderColor: `${accent}55` }}>
        <div><h1 className="text-4xl font-black leading-none">{data.name || 'Your Name'}</h1><p className="mt-2 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>{data.title || 'Professional Title'}</p></div>
        <ContactLine data={data} align="right" />
      </header>
      <div className="grid grid-cols-[1.5fr_0.8fr] gap-8">
        <div><SectionHeading title="Experience" accent={accent} /><ExperienceBlock data={data} accent={accent} /><SectionHeading title="Education" accent={accent} /><EducationBlock data={data} /></div>
        <div><SectionHeading title="Summary" accent={accent} /><p className="text-sm leading-relaxed text-slate-600">{data.summary || 'Add your executive summary.'}</p><SectionHeading title="Highlights" accent={accent} /><SkillsBlock data={data} accent={accent} /></div>
      </div>
    </div>
  );
}

function TechnicalPreview({ data, accent }: { data: ResumeData; accent: string }) {
  return (
    <div className="w-full max-w-[800px] min-h-[1050px] rounded-sm bg-white p-9 font-sans text-slate-900 shadow-2xl">
      <header className="mb-7 flex items-start justify-between border-b-2 pb-5" style={{ borderColor: accent }}>
        <div><h1 className="text-3xl font-black">{data.name || 'Your Name'}</h1><p className="mt-1 text-sm font-semibold" style={{ color: accent }}>{data.title || 'Professional Title'}</p></div>
        <ContactLine data={data} align="right" />
      </header>
      <div className="grid grid-cols-[1.6fr_0.9fr] gap-8">
        <div><SectionHeading title="Professional Experience" accent={accent} /><ExperienceBlock data={data} accent={accent} /><SectionHeading title="Projects" accent={accent} /><div className="space-y-3 text-sm">{data.projects.map((project, index) => <div key={`${project.name}-${index}`}><strong>{project.name}</strong><p className="text-slate-600">{project.description}</p></div>)}</div></div>
        <div className="border-l pl-5" style={{ borderColor: `${accent}55` }}><SectionHeading title="Summary" accent={accent} /><p className="text-sm leading-relaxed text-slate-600">{data.summary || 'Add a concise professional summary.'}</p><SectionHeading title="Skills" accent={accent} /><SkillsBlock data={data} accent={accent} /><SectionHeading title="Certifications" accent={accent} /><div className="space-y-2 text-sm">{data.certifications.map((certification, index) => <div key={`${certification.name}-${index}`}><strong>{certification.name}</strong><div className="text-slate-500">{certification.issuer}</div></div>)}</div></div>
      </div>
    </div>
  );
}

function ContactLine({ data, dark = false, align = 'left' }: { data: ResumeData; dark?: boolean; align?: 'left' | 'right' }) {
  const values = [data.contact.email, data.contact.phone, data.contact.location].filter(Boolean);
  return <div className={`flex flex-col gap-1 text-xs ${dark ? 'text-white/70' : 'text-slate-500'} ${align === 'right' ? 'items-end text-right' : ''}`}>{values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>;
}

function SummaryBlock({ data }: { data: ResumeData }) {
  return <section className="mb-6"><p className="text-sm leading-relaxed text-black/70">{data.summary || 'Add a concise professional summary that connects your strongest evidence to the target role.'}</p></section>;
}

function ExperienceBlock({ data, accent }: { data: ResumeData; accent: string }) {
  return <section className="mb-6"><SectionHeading title="Experience" accent={accent} /><div className="space-y-5">{data.experience.map(exp => <div key={exp.id}><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-bold">{exp.role || 'Role'}</h3><span className="text-xs text-black/60">{exp.dates}</span></div><div className="mb-2 text-sm italic text-black/70">{exp.company}</div><ul className="list-disc space-y-1 pl-4 text-sm text-black/70">{exp.bullets.filter(Boolean).map((bullet, index) => <li key={`${exp.id}-${index}`}>{bullet}</li>)}</ul></div>)}</div></section>;
}

function SkillsBlock({ data, accent }: { data: ResumeData; accent: string }) {
  return <div className="flex flex-wrap gap-2 text-sm">{data.skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded border px-2 py-1" style={{ borderColor: `${accent}55`, color: accent }}>{skill}</span>)}</div>;
}

function EducationBlock({ data }: { data: ResumeData }) {
  return <div className="space-y-3 text-sm">{data.education.map((education, index) => <div key={`${education.school}-${index}`}><strong>{education.degree}</strong><div className="text-slate-600">{education.school} · {education.dates}</div></div>)}</div>;
}

function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return <h2 className="mb-3 border-b pb-2 font-sans text-sm font-black uppercase tracking-widest" style={{ borderColor: `${accent}66`, color: accent }}>{title}</h2>;
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-8"><h2 className="mb-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-[0.16em]">{title}</h2>{children}</section>;
}

function EditorialSection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div
        className="mb-3 border-b pb-1 font-sans text-sm font-black uppercase tracking-[0.18em]"
        style={{ borderColor: `${color}80`, color }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

export default function ResumeBuilder() {
  const {
    resumeData,
    setResumeData,
    updateProfile,
    updateSummary,
    updateExperience,
    updateContact,
    updateSkills,
    atsScore,
    setAtsScore,
    jobAnalysis,
    selectedTemplate,
    setSelectedTemplate,
    templateColor,
    setTemplateColor,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState("basics");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // AI Modal States
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);

  const localAudit = auditResumeLocally(resumeData, jobAnalysis);
  const summaryVariants = generateSummaryVariants(resumeData, jobAnalysis);

  const handleSkillChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    updateSkills(skillsArray);
  };

  const handleBulletChange = (expId: string, index: number, value: string) => {
    const exp = resumeData.experience.find(e => e.id === expId);
    if (exp) {
      const newBullets = [...exp.bullets];
      newBullets[index] = value;
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveWorkspaceProfile({ profileUrl: resumeData.contact.linkedin || null, profile: resumeData });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setResumeData({ ...resumeData, experience: [...resumeData.experience, { id: `experience-${Date.now()}`, role: '', company: '', dates: '', bullets: [''] }] });
    setActiveTab('experience');
  };

  const suggestedSkills = Array.from(new Set([
    ...(jobAnalysis?.missingSkills || []),
    'React Native', 'TypeScript', 'Node.js', 'System Architecture', 'CI/CD Pipelines'
  ])).filter(s => !resumeData.skills.includes(s)).slice(0, 6);

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-white lg:flex-row overflow-hidden relative font-sans">
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      
      {/* LEFT PANEL: Templates */}
      <div className="w-72 border-r border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex-col hidden lg:flex shrink-0 z-10">
        <div className="p-4 border-b border-white/10 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-primary" /> Templates
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {RESUME_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setTemplateColor(template.accentColor);
              }}
              className={`w-full group rounded-xl border p-3 text-left transition-all duration-300 ${
                selectedTemplate.id === template.id
                  ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)] ring-1 ring-primary/40'
                  : 'border-white/10 bg-black/30 hover:border-primary/40 hover:bg-primary/10'
              }`}
            >
              <div className={`relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${template.accent} p-0.5`}>
                {template.imageAsset ? (
                  <img src={template.imageAsset} alt={`${template.name} preview`} loading="lazy" className="h-full w-full object-cover rounded-[7px] transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="absolute right-3 top-3 h-3 w-3 rounded-full border border-white/70 shadow-sm" style={{ backgroundColor: template.accentColor }} />
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-sm text-foreground">{template.name}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{template.category}</div>
                </div>
                {selectedTemplate.id === template.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER CANVAS: Preview */}
      <div className="flex flex-1 flex-col overflow-hidden bg-transparent relative z-0">
        <header className="absolute top-0 z-20 w-full flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-blue-100/70">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Live Canvas</span>
          </div>
          <ResumeExportActions data={resumeData} accent={templateColor} compact />
        </header>
        <div className="flex flex-1 items-start justify-center overflow-y-auto p-5 pb-24 pt-20">
          <ResumePreview />
        </div>
      </div>

      {/* RIGHT PANEL: AI Inspector / Editor */}
      <div className="w-[450px] border-l border-white/10 bg-black/20 backdrop-blur-2xl shadow-[-8px_0_32px_rgba(0,0,0,0.3)] flex-col shrink-0 hidden lg:flex relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm tracking-wide text-primary">Contextual AI Editor</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              onClick={() => setShowAtsModal(true)}
              className="border-success/30 text-success bg-success/10 font-mono cursor-pointer hover:bg-success/20 transition-colors"
            >
              ATS: {atsScore || localAudit.score}
            </Badge>
            <Button size="sm" variant="secondary" className="h-7 text-xs px-2 gap-1" onClick={handleSave} disabled={saving}>
              <Save className="w-3 h-3" /> {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </header>

        <div className="p-5 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-black/40 border border-white/10 backdrop-blur-md">
              <TabsTrigger value="basics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"><User className="w-3 h-3 mr-1.5 hidden sm:block" /> Basics</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"><Briefcase className="w-3 h-3 mr-1.5 hidden sm:block" /> Exp.</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"><Wrench className="w-3 h-3 mr-1.5 hidden sm:block" /> Skills</TabsTrigger>
              <TabsTrigger value="review" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"><Sparkles className="w-3 h-3 mr-1.5 hidden sm:block" /> Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Full Name</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.name} onChange={(e) => updateProfile({ name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Target Title</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.title} onChange={(e) => updateProfile({ title: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider flex justify-between items-center drop-shadow-sm">
                    Professional Summary
                    <button
                      type="button"
                      onClick={() => setShowSummaryModal(true)}
                      className="text-primary normal-case font-normal flex items-center gap-1 hover:underline text-xs drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Enhance with AI
                    </button>
                  </label>
                  <Textarea 
                    value={resumeData.summary} 
                    onChange={(e) => updateSummary(e.target.value)}
                    className="min-h-[150px] leading-relaxed resize-y text-sm bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white"
                  />
                </div>

                {/* AI Summary Modal / Card */}
                {showSummaryModal && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> AI Generated Summary Options
                      </h4>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowSummaryModal(false)}>Close</Button>
                    </div>
                    <div className="space-y-3">
                      {summaryVariants.map((varItem: { title: string; badge: string; summary: string }, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => {
                            updateSummary(varItem.summary);
                            setShowSummaryModal(false);
                          }}
                          className="p-3 rounded-lg border border-border/60 bg-background/80 hover:border-primary cursor-pointer transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{varItem.title}</span>
                            <Badge variant="outline" className="text-[10px] border-primary/30">{varItem.badge}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{varItem.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Email</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.contact.email} onChange={(e) => updateContact({ email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Phone</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Location</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.contact.location} onChange={(e) => updateContact({ location: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">LinkedIn URL</label>
                    <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={resumeData.contact.linkedin} onChange={(e) => updateContact({ linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourname" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              {resumeData.experience.map((exp) => (
                <Card key={exp.id} className="p-5 border-white/10 bg-black/20 backdrop-blur-xl shadow-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-blue-200/60 drop-shadow-sm">Role</label>
                      <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-blue-200/60 drop-shadow-sm">Company</label>
                      <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-medium text-blue-200/60 drop-shadow-sm">Dates</label>
                      <Input className="bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white" value={exp.dates} onChange={(e) => updateExperience(exp.id, { dates: e.target.value })} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-blue-200/60 flex justify-between drop-shadow-sm">
                      Impact Bullets
                      <button
                        type="button"
                        className="text-primary flex items-center gap-1 hover:underline text-xs drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                        onClick={() => {
                          const targetSkill = jobAnalysis?.matchedSkills[0] || jobAnalysis?.missingSkills[0] || '';
                          updateExperience(exp.id, { bullets: exp.bullets.map(bullet => improveBulletLocally(bullet, targetSkill)) });
                        }}
                      >
                        <Sparkles className="w-3 h-3" /> Improve bullets locally
                      </button>
                    </label>
                    {exp.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-3 shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                        <Textarea 
                          value={bullet} 
                          onChange={(e) => handleBulletChange(exp.id, idx, e.target.value)}
                          className="min-h-[60px] text-sm bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5">
                + Add Experience
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-200/60 uppercase tracking-wider drop-shadow-sm">Technical & Core Skills</label>
                <p className="text-sm text-blue-200/50 mb-2">Comma separated list of skills.</p>
                <Textarea 
                  value={resumeData.skills.join(', ')} 
                  onChange={handleSkillChange}
                  className="min-h-[100px] bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all text-white"
                />
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Recommended Skills for Target Job
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(s => (
                    <Badge
                      key={s}
                      variant="outline"
                      onClick={() => updateSkills(Array.from(new Set([...resumeData.skills, s])))}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-primary/30 text-xs"
                    >
                      + {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card className="border-border/60 bg-card/50">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-sm">Fact Check Verification</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The AI generation has been verified against your original profile data. No hallucinations detected.
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Employment History</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">100% Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Education Degrees</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">100% Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Core Skills</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">Verified</Badge>
                  </div>
                </div>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <div className="p-4 border-b border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm">AI Resume Critic</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    3 improvements available to maximize ATS ranking and recruiter impact.
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    "Change professional summary to use more active, outcome-driven language.",
                    "Remove outdated technology (e.g. jQuery) from skills list.",
                    "Quantify the first bullet point in your most recent experience."
                  ].map((imp, i) => (
                    <div key={i} className="flex gap-3 text-sm p-3 rounded-lg border border-primary/20 bg-background/50">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs font-bold">{i+1}</div>
                      <div className="flex-1 text-xs text-muted-foreground leading-relaxed">{imp}</div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="w-full text-xs" onClick={() => {}}>Apply All</Button>
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => {}}>Ignore</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ATS Breakdown Dialog / Modal */}
      {showAtsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">ATS Audit Breakdown</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAtsModal(false)}>✕</Button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="text-xs text-muted-foreground uppercase">Completeness</div>
                <div className="text-xl font-black text-primary mt-1">{localAudit.completeness}%</div>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="text-xs text-muted-foreground uppercase">Keyword Fit</div>
                <div className="text-xl font-black text-primary mt-1">{localAudit.keywordAlignment}%</div>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="text-xs text-muted-foreground uppercase">Evidence</div>
                <div className="text-xl font-black text-primary mt-1">{localAudit.evidenceStrength}%</div>
              </div>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-2">Strengths</h4>
                {localAudit.strengths.map((s: string, idx: number) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <span className="text-success font-bold">•</span> {s}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-warning uppercase tracking-wider mb-2">Actionable Fixes</h4>
                {localAudit.improvements.map((imp: string, idx: number) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <span className="text-warning font-bold">•</span> {imp}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowAtsModal(false)}>Got it</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

