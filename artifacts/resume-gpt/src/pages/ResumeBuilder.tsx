import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Eye, LayoutTemplate, Briefcase, User, Wrench, Sparkles } from 'lucide-react';

function ResumePreview() {
  const { resumeData } = useAppStore();

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

export default function ResumeBuilder() {
  const { resumeData, updateSummary, updateExperience, updateContact, updateSkills, atsScore } = useAppStore();
  const [activeTab, setActiveTab] = useState("basics");

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
            <Badge variant="outline" className="border-success/30 text-success bg-success/10 font-mono">
              ATS: {atsScore}
            </Badge>
            <Button size="sm" variant="secondary" className="gap-2">
              <Save className="w-4 h-4" /> Save
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
                    <Input value={resumeData.name} onChange={(e) => updateContact({ ...resumeData.contact, /* Note: Name is root level, ignoring root update for brevity in demo */ })} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Title</label>
                    <Input value={resumeData.title} readOnly className="bg-muted/50" />
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
              <Button variant="outline" className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5">
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
          <Button variant="default" size="sm" className="gap-2 shadow-lg shadow-primary/20">
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
