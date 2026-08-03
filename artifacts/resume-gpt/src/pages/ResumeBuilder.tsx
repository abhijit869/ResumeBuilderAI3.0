import React, { useState } from 'react';
import { saveWorkspaceProfile } from '@workspace/api-client-react';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Eye, LayoutTemplate, Briefcase, User, Wrench, Sparkles } from 'lucide-react';

function ResumePreview() {
  const { resumeData, selectedTemplate, templateColor } = useAppStore();

  if (selectedTemplate.id === 'editorial-profile') {
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

  return (
    <div className="bg-white text-black p-8 shadow-2xl rounded-sm w-full max-w-[800px] min-h-[1050px] origin-top scale-[0.6] sm:scale-[0.8] xl:scale-100 transition-transform font-serif leading-relaxed h-max">
      <header className="mb-6 border-b-2 border-black/10 pb-4">
        <h1 className="text-4xl font-bold text-black mb-1 font-sans">{resumeData.name}</h1>
        <div className="text-xl text-black/70 mb-2 font-sans">{resumeData.title}</div>
        <div className="flex gap-4 text-xs text-black/60 font-sans">
          <span>{resumeData.contact.email}</span>
          <span>•</span>
          <span>{resumeData.contact.phone}</span>
          <span>•</span>
          <span>{resumeData.contact.location}</span>
        </div>
      </header>

      <section className="mb-6">
        <p className="text-sm text-black/80">{resumeData.summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 font-sans uppercase tracking-widest border-b border-black/10 pb-1">Experience</h2>
        <div className="space-y-5">
          {resumeData.experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-black font-sans">{exp.role}</h3>
                <span className="text-xs font-sans text-black/60">{exp.dates}</span>
              </div>
              <div className="text-sm font-sans text-black/80 mb-2 italic">{exp.company}</div>
              <ul className="list-disc pl-4 space-y-1 text-sm text-black/80">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-black mb-3 font-sans uppercase tracking-widest border-b border-black/10 pb-1">Skills</h2>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-black/80">
          {resumeData.skills.map((skill, i) => (
            <React.Fragment key={i}>
              <span>{skill}</span>
              {i < resumeData.skills.length - 1 && <span className="text-black/30">•</span>}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
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
    selectedTemplate,
    templateColor,
    setTemplateColor,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState("basics");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="flex h-full animate-in fade-in duration-500">
      {/* Editor Panel */}
      <div className="w-1/2 flex flex-col border-r border-border bg-background/50 backdrop-blur-sm z-10 shadow-xl">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Editor</h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="sr-only">Template accent color</span>
              <input
                aria-label="Template accent color"
                type="color"
                value={templateColor}
                onChange={(event) => setTemplateColor(event.target.value)}
                className="h-7 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
              />
            </label>
            <span className="hidden text-xs text-muted-foreground lg:inline">{selectedTemplate.name}</span>
            <Badge variant="outline" className="border-success/30 text-success bg-success/10 font-mono">
              ATS: {atsScore}
            </Badge>
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border border-border">
              <TabsTrigger value="basics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><User className="w-4 h-4 mr-2" /> Basics</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Briefcase className="w-4 h-4 mr-2" /> Experience</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Wrench className="w-4 h-4 mr-2" /> Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <Input value={resumeData.name} onChange={(e) => updateProfile({ name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Title</label>
                    <Input value={resumeData.title} onChange={(e) => updateProfile({ title: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                    Professional Summary
                    <span className="text-primary normal-case font-normal flex items-center gap-1 cursor-pointer hover:underline"><Sparkles className="w-3 h-3" /> Enhance with AI</span>
                  </label>
                  <Textarea 
                    value={resumeData.summary} 
                    onChange={(e) => updateSummary(e.target.value)}
                    className="min-h-[150px] leading-relaxed resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                    <Input value={resumeData.contact.email} onChange={(e) => updateContact({ email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                    <Input value={resumeData.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                    <Input value={resumeData.contact.location} onChange={(e) => updateContact({ location: e.target.value })} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              {resumeData.experience.map((exp, expIdx) => (
                <Card key={exp.id} className="p-5 border-border/60 bg-card/30">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Role</label>
                      <Input value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Company</label>
                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">Dates</label>
                      <Input value={exp.dates} onChange={(e) => updateExperience(exp.id, { dates: e.target.value })} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-muted-foreground flex justify-between">
                      Impact Bullets
                      <span className="text-primary flex items-center gap-1 cursor-pointer hover:underline"><Sparkles className="w-3 h-3" /> Optimize metrics</span>
                    </label>
                    {exp.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-3 shrink-0" />
                        <Textarea 
                          value={bullet} 
                          onChange={(e) => handleBulletChange(exp.id, idx, e.target.value)}
                          className="min-h-[60px] text-sm"
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
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Technical & Core Skills</label>
                <p className="text-sm text-muted-foreground mb-2">Comma separated list of skills.</p>
                <Textarea 
                  defaultValue={resumeData.skills.join(', ')} 
                  onChange={handleSkillChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                  {['React Native', 'Figma Variables', 'A/B Testing'].map(s => (
                    <Badge key={s} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-primary/30">
                      + {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-muted/30 relative flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between absolute top-0 w-full z-10 bg-background/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>
          <Button variant="default" size="sm" onClick={() => window.print()} className="gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 pt-24 flex justify-center pb-24 items-start">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
}
