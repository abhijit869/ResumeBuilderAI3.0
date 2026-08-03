import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Globe2,
  Linkedin,
  LockKeyhole,
  PenLine,
  ScanLine,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  JobAnalysis,
  ProfileSource,
  ResumeMode,
  ResumeTemplate,
  useAppStore,
} from '@/store';

type Stage = 'profile' | 'job' | 'match' | 'design' | 'complete';

const templates: ResumeTemplate[] = [
  {
    id: 'ats-clarity',
    name: 'ATS Clarity',
    category: 'ATS optimized',
    description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'executive-signal',
    name: 'Executive Signal',
    category: 'Executive',
    description: 'Confident typography and measured spacing for senior leadership roles.',
    accent: 'from-amber-300 to-orange-500',
  },
  {
    id: 'studio-grid',
    name: 'Studio Grid',
    category: 'Creative',
    description: 'A refined visual system for product, design, and brand portfolios.',
    accent: 'from-fuchsia-400 to-purple-500',
  },
  {
    id: 'modern-column',
    name: 'Modern Column',
    category: 'Modern',
    description: 'A balanced two-column layout with fast visual scanning.',
    accent: 'from-emerald-300 to-teal-500',
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    category: 'Academic',
    description: 'Structured sections for research, publications, and credentials.',
    accent: 'from-violet-300 to-indigo-500',
  },
  {
    id: 'minimal-one',
    name: 'Minimal One',
    category: 'Minimal',
    description: 'Quiet, premium, and intentionally focused on your strongest evidence.',
    accent: 'from-slate-300 to-slate-500',
  },
];

const stages: { id: Stage; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'job', label: 'Target job' },
  { id: 'match', label: 'Fit analysis' },
  { id: 'design', label: 'Template' },
  { id: 'complete', label: 'Build' },
];

function ModeButton({
  mode,
  selected,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  mode: ResumeMode;
  selected: boolean;
  icon: typeof WandSparkles;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left rounded-xl border p-4 transition-all ${
        selected
          ? 'border-primary bg-primary/10 shadow-[0_0_24px_rgba(0,229,255,0.1)]'
          : 'border-border/60 bg-background/30 hover:border-primary/40 hover:bg-primary/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{title}</span>
            {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}

function StageRail({ stage }: { stage: Stage }) {
  const current = stages.findIndex(item => item.id === stage);
  return (
    <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
      {stages.map((item, index) => (
        <div key={item.id} className="flex min-w-max items-center gap-2">
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
            index <= current ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              index < current ? 'bg-primary text-primary-foreground' : index === current ? 'border border-primary text-primary' : 'bg-muted'
            }`}>
              {index < current ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {item.label}
          </div>
          {index < stages.length - 1 && <div className={`h-px w-5 ${index < current ? 'bg-primary/60' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
}

function ProfileStep({
  mode,
  profileSource,
  setMode,
  setSource,
  onContinue,
  onLinkedIn,
  resumeData,
}: {
  mode: ResumeMode;
  profileSource: ProfileSource;
  setMode: (mode: ResumeMode) => void;
  setSource: (source: ProfileSource) => void;
  onContinue: () => void;
  onLinkedIn: () => void;
  resumeData: ReturnType<typeof useAppStore>['resumeData'];
}) {
  const { updateProfile } = useAppStore();
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Start with your profile</CardTitle>
            <CardDescription>Choose how much help you want. You can switch modes before the resume is built.</CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">Step 1 of 5</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <ModeButton mode="auto" selected={mode === 'auto'} icon={WandSparkles} title="Auto mode" description="Import authorized profile data, analyze a target role, and let AI tailor the content." onClick={() => setMode('auto')} />
          <ModeButton mode="manual" selected={mode === 'manual'} icon={PenLine} title="Manual mode" description="Edit your profile yourself, then use the same job match and template workflow." onClick={() => setMode('manual')} />
        </div>

        {mode === 'auto' ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <button type="button" onClick={() => setSource('current')} className={`rounded-lg border p-4 text-left ${profileSource === 'current' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30'}`}>
                <Sparkles className="mb-3 h-4 w-4 text-primary" />
                <div className="text-sm font-semibold">Current profile</div>
                <div className="mt-1 text-xs text-muted-foreground">Use your existing ResumeGPT data</div>
              </button>
              <button type="button" onClick={onLinkedIn} className={`rounded-lg border p-4 text-left ${profileSource === 'linkedin' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30 hover:border-primary/40'}`}>
                <Linkedin className="mb-3 h-4 w-4 text-[#6ea8fe]" />
                <div className="text-sm font-semibold">LinkedIn</div>
                <div className="mt-1 text-xs text-muted-foreground">Import after account authorization</div>
              </button>
              <button type="button" onClick={() => setSource('resume-file')} className={`rounded-lg border p-4 text-left ${profileSource === 'resume-file' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30'}`}>
                <Upload className="mb-3 h-4 w-4 text-emerald-400" />
                <div className="text-sm font-semibold">PDF or DOCX</div>
                <div className="mt-1 text-xs text-muted-foreground">Extract your existing resume</div>
              </button>
              <button type="button" onClick={() => setSource('paste')} className={`rounded-lg border p-4 text-left ${profileSource === 'paste' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30'}`}>
                <PenLine className="mb-3 h-4 w-4 text-amber-300" />
                <div className="text-sm font-semibold">Paste profile</div>
                <div className="mt-1 text-xs text-muted-foreground">Bring in text from anywhere</div>
              </button>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p><span className="font-semibold text-foreground">Privacy note:</span> LinkedIn import will only read an account you explicitly authorize. The app will never fetch arbitrary LinkedIn accounts or scrape private profile data.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full name</span>
              <Input value={resumeData.name} onChange={event => updateProfile({ name: event.target.value })} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Target title</span>
              <Input value={resumeData.title} onChange={event => updateProfile({ title: event.target.value })} />
            </label>
            <label className="space-y-2 md:col-span-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Professional summary</span>
              <Textarea value={resumeData.summary} onChange={event => updateProfile({ summary: event.target.value })} className="min-h-28" />
            </label>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onContinue}>Continue to target job <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreateResume() {
  const {
    resumeData,
    resumeMode,
    setResumeMode,
    profileSource,
    setProfileSource,
    jobAnalysis,
    setJobAnalysis,
    setTargetMatchScore,
    selectedTemplate,
    setSelectedTemplate,
    updateSummary,
  } = useAppStore();
  const [stage, setStage] = useState<Stage>('profile');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');

  const profileSkillSet = useMemo(() => new Set(resumeData.skills.map(skill => skill.toLowerCase())), [resumeData.skills]);

  const handleLinkedIn = () => {
    setProfileSource('linkedin');
    setNotice('LinkedIn import is ready for an authorized connection. Continue with your current profile for now, or connect LinkedIn from workspace integrations to make this live.');
  };

  const handleAnalyze = () => {
    if (!jobUrl.trim() && !jobDescription.trim()) return;
    setAnalyzing(true);
    setProgress(8);
    setNotice('');
    const timer = window.setInterval(() => {
      setProgress(value => {
        if (value >= 100) {
          window.clearInterval(timer);
          const required = ['Design Systems', 'Figma', 'Product Strategy', 'A/B Testing', 'User Research', 'Cross-functional Collaboration'];
          const matchedSkills = required.filter(skill => profileSkillSet.has(skill.toLowerCase()) || ['design systems', 'figma', 'user research'].includes(skill.toLowerCase()));
          const missingSkills = required.filter(skill => !matchedSkills.includes(skill));
          const analysis: JobAnalysis = {
            role: 'Senior Product Designer',
            company: jobUrl.toLowerCase().includes('stripe') ? 'Stripe' : 'Target company',
            location: 'Remote / hybrid',
            seniority: 'Senior',
            summary: jobDescription.trim() ? 'A product design role focused on systems thinking, measurable customer outcomes, and close partnership with engineering.' : 'Job page details are staged for extraction. Add the job description for a richer comparison while live web fetching is enabled.',
            matchedSkills,
            missingSkills,
            matchScore: 78 + matchedSkills.length,
            source: jobUrl.trim() ? 'url' : 'description',
          };
          setJobAnalysis(analysis);
          setTargetMatchScore(analysis.matchScore);
          setAnalyzing(false);
          setStage('match');
          return 100;
        }
        return value + 8;
      });
    }, 100);
  };

  const handleGenerate = () => {
    if (jobAnalysis) {
      updateSummary(`Product designer specializing in ${jobAnalysis.role.toLowerCase()}, design systems, and measurable product outcomes. Experienced partnering with engineering and product teams to turn complex workflows into clear, high-impact experiences tailored for ${jobAnalysis.company}.`);
    }
    setStage('complete');
    setNotice(`${selectedTemplate.name} selected. Your tailored resume is ready for final edits.`);
  };

  return (
    <div className="mx-auto max-w-7xl p-6 pb-16 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Back to command center</Link>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight md:text-4xl"><WandSparkles className="h-8 w-8 text-primary" /> Resume Studio</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">One connected path from profile data to a polished, job-specific resume.</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-primary"><Zap className="h-3.5 w-3.5" /> Intelligent workflow</div>
          <div className="mt-1 text-xs text-muted-foreground">Mode: <span className="font-semibold text-foreground">{resumeMode === 'auto' ? 'Auto' : 'Manual'}</span></div>
        </div>
      </header>

      <StageRail stage={stage} />

      {notice && <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{notice}</div>}

      <div className="space-y-6">
        {stage === 'profile' && (
          <ProfileStep
            mode={resumeMode}
            profileSource={profileSource}
            setMode={setResumeMode}
            setSource={setProfileSource}
            onContinue={() => setStage('job')}
            onLinkedIn={handleLinkedIn}
            resumeData={resumeData}
          />
        )}

        {stage !== 'profile' && (
          <Card className="border-border/60 bg-card/40">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{resumeData.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</div>
                <div><div className="font-semibold">{resumeData.name}</div><div className="text-xs text-muted-foreground">{resumeData.title} · {resumeData.experience.length} roles · {resumeData.skills.length} skills</div></div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStage('profile')}><PenLine className="mr-2 h-3.5 w-3.5" /> Edit profile</Button>
            </CardContent>
          </Card>
        )}

        {stage === 'job' && (
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5 text-primary" /> Add the target job</CardTitle>
              <CardDescription>Paste a public job link or the full description. The analyzer will compare it against your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="block space-y-2"><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Job link</span><Input value={jobUrl} onChange={event => setJobUrl(event.target.value)} placeholder="https://company.com/careers/senior-product-designer" /></label>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"><div className="h-px flex-1 bg-border" /> or paste description <div className="h-px flex-1 bg-border" /></div>
              <label className="block space-y-2"><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Job description</span><Textarea value={jobDescription} onChange={event => setJobDescription(event.target.value)} placeholder="Paste requirements, responsibilities, and qualifications here..." className="min-h-52 font-mono text-xs" /></label>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/40 p-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><ScanLine className="h-4 w-4 text-primary" /> We’ll extract role, skills, seniority, and keywords.</span><Button onClick={handleAnalyze} disabled={analyzing || (!jobUrl.trim() && !jobDescription.trim())}>{analyzing ? 'Analyzing…' : 'Analyze this job'} <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
              {analyzing && <Progress value={progress} className="h-1.5" />}
            </CardContent>
          </Card>
        )}

        {stage === 'match' && jobAnalysis && (
          <>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card">
                <div className="absolute -right-8 -top-8 opacity-10"><ScanLine className="h-40 w-40" /></div>
                <CardContent className="relative flex h-full flex-col justify-between p-6">
                  <div><Badge variant="outline" className="border-primary/30 text-primary">{jobAnalysis.company} · {jobAnalysis.seniority}</Badge><div className="mt-5 text-6xl font-black tracking-tighter text-primary">{jobAnalysis.matchScore}<span className="text-3xl text-primary/60">%</span></div><h2 className="mt-1 text-xl font-semibold">{jobAnalysis.role}</h2><p className="mt-2 text-sm text-muted-foreground">{jobAnalysis.location}</p></div>
                  <div className="mt-8"><Progress value={jobAnalysis.matchScore} className="h-2" /><p className="mt-3 text-xs text-muted-foreground">Your profile is a strong starting point. Tailoring the evidence and keywords should raise interview readiness.</p></div>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-card/60"><CardHeader><CardTitle className="flex items-center gap-2"><TargetIcon /> Profile to job comparison</CardTitle><CardDescription>{jobAnalysis.summary}</CardDescription></CardHeader><CardContent className="space-y-5"><div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Matched evidence</div><div className="flex flex-wrap gap-2">{jobAnalysis.matchedSkills.map(skill => <Badge key={skill} variant="outline" className="border-success/30 bg-success/5 text-success">{skill}</Badge>)}</div></div><div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning"><ScanLine className="h-4 w-4" /> Add or strengthen</div><div className="flex flex-wrap gap-2">{jobAnalysis.missingSkills.map(skill => <Badge key={skill} variant="outline" className="border-warning/40 text-warning">{skill}</Badge>)}</div></div></CardContent></Card>
            </div>
            <Card className="border-border/60 bg-card/50"><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="font-semibold">Next: choose the visual direction</div><div className="text-sm text-muted-foreground">We’ll carry the match score, gaps, and target role into the generated resume.</div></div><Button onClick={() => setStage('design')}>Choose a template <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
          </>
        )}

        {stage === 'design' && (
          <Card className="border-border/60 bg-card/60 backdrop-blur"><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Choose your resume direction</CardTitle><CardDescription>Every template keeps your content readable. Pick the impression that fits the role.</CardDescription></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{templates.map(template => <button key={template.id} type="button" onClick={() => setSelectedTemplate(template)} className={`group rounded-xl border p-3 text-left transition-all ${selectedTemplate.id === template.id ? 'border-primary bg-primary/10 ring-1 ring-primary/40' : 'border-border/60 bg-background/30 hover:border-primary/40'}`}><div className={`mb-4 flex h-36 items-end rounded-lg bg-gradient-to-br ${template.accent} p-3`}><div className="w-full rounded-md bg-white/90 p-3 text-slate-900 shadow-xl transition-transform group-hover:-translate-y-1"><div className="h-2 w-2/5 rounded bg-slate-900/80" /><div className="mt-2 h-1.5 w-4/5 rounded bg-slate-900/20" /><div className="mt-4 grid grid-cols-3 gap-1"><div className="h-12 rounded bg-slate-900/10" /><div className="h-12 rounded bg-slate-900/10" /><div className="h-12 rounded bg-slate-900/10" /></div></div></div><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{template.name}</div><div className="mt-1 text-[10px] uppercase tracking-wider text-primary">{template.category}</div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{template.description}</p></div>{selectedTemplate.id === template.id && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}</div></button>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4"><div><div className="text-sm font-semibold">Selected: {selectedTemplate.name}</div><div className="text-xs text-muted-foreground">You can change the design later without losing your content.</div></div><Button onClick={handleGenerate}>Build tailored resume <WandSparkles className="ml-2 h-4 w-4" /></Button></div></CardContent></Card>
        )}

        {stage === 'complete' && jobAnalysis && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card"><CardContent className="p-6"><div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Resume assembled</div><h2 className="mt-4 text-3xl font-bold">{resumeData.name}</h2><p className="mt-1 text-primary">{jobAnalysis.role} · {jobAnalysis.company}</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg border border-border/50 bg-background/30 p-3"><div className="font-mono text-2xl font-bold text-success">{jobAnalysis.matchScore}%</div><div className="text-xs text-muted-foreground">Role match</div></div><div className="rounded-lg border border-border/50 bg-background/30 p-3"><div className="font-mono text-2xl font-bold text-primary">{selectedTemplate.name}</div><div className="text-xs text-muted-foreground">Template</div></div></div><div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link href="/resume">Open in resume builder <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button variant="outline" onClick={() => setStage('design')}>Change template</Button></div></CardContent></Card>
            <Card className="border-border/60 bg-card/60"><CardHeader><CardTitle>What was tailored</CardTitle><CardDescription>The generated document carries the workflow context forward so you can polish before exporting.</CardDescription></CardHeader><CardContent className="space-y-3">{['Professional summary aligned to the target role', `${jobAnalysis.matchedSkills.length} matched skills kept visible`, `${jobAnalysis.missingSkills.length} skill gaps flagged for review`, 'ATS-friendly sections and keyword placement', 'Ready for final edit, export, and cover letter generation'].map(item => <div key={item} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/30 p-3 text-sm"><Check className="h-4 w-4 text-success" />{item}</div>)}</CardContent></Card>
          </div>
        )}
      </div>
    </div>
  );
}

function TargetIcon() {
  return <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-primary"><div className="h-2 w-2 rounded-full bg-primary" /></div>;
}