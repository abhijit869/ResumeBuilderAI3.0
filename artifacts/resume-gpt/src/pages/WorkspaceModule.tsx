import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Clipboard, FileCode2, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store';
import { auditResumeLocally, createCoverLetter, createInterviewKit } from '@/lib/local-tools';

type ModuleKind = 'match' | 'cover-letter' | 'interview' | 'analytics';

const content: Record<ModuleKind, {
  title: string;
  description: string;
  icon: typeof Target;
  eyebrow: string;
  actions: { label: string; href: string }[];
}> = {
  match: {
    title: 'Job Match',
    description: 'Review your saved job analysis and move directly into a tailored resume build.',
    icon: Target,
    eyebrow: 'Evidence-based matching',
    actions: [{ label: 'Analyze a job', href: '/analyzer' }, { label: 'Create tailored resume', href: '/create' }],
  },
  'cover-letter': {
    title: 'Cover Letter Studio',
    description: 'Create an editable, evidence-grounded cover letter without another API key.',
    icon: FileCode2,
    eyebrow: 'No-key application tool',
    actions: [{ label: 'Start from a job', href: '/create' }, { label: 'Open resume builder', href: '/resume' }],
  },
  interview: {
    title: 'Interview Prep',
    description: 'Turn the saved target role and your profile evidence into questions, stories, and a preparation checklist.',
    icon: BriefcaseBusiness,
    eyebrow: 'No-key preparation tool',
    actions: [{ label: 'Review target job', href: '/analyzer' }, { label: 'Edit profile evidence', href: '/resume' }],
  },
  analytics: {
    title: 'Resume Analytics',
    description: 'Run a local ATS and profile-quality audit using the same evidence as the resume workflow.',
    icon: BarChart3,
    eyebrow: 'Private local audit',
    actions: [{ label: 'Open resume builder', href: '/resume' }, { label: 'Run a new analysis', href: '/analyzer' }],
  },
};

export default function WorkspaceModule({ kind }: { kind: ModuleKind }) {
  const { resumeData, jobAnalysis, targetMatchScore } = useAppStore();
  const item = content[kind];
  const Icon = item.icon;
  const audit = useMemo(() => auditResumeLocally(resumeData, jobAnalysis), [resumeData, jobAnalysis]);
  const interviewKit = useMemo(() => createInterviewKit(resumeData, jobAnalysis), [resumeData, jobAnalysis]);
  const [letter, setLetter] = useState(() => createCoverLetter(resumeData, jobAnalysis));
  const [copied, setCopied] = useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto min-h-full max-w-6xl p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="h-3.5 w-3.5" /> {item.eyebrow}</div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight"><Icon className="h-8 w-8 text-primary" /> {item.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{item.description}</p>
      </header>

      {kind === 'cover-letter' && (
        <Card className="mb-6 border-primary/30 bg-card/60">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div><CardTitle>Grounded draft</CardTitle><CardDescription>Generated locally from your saved profile and target job. Edit anything before sending.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={() => setLetter(createCoverLetter(resumeData, jobAnalysis))}><Sparkles className="mr-2 h-4 w-4" /> Refresh draft</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea value={letter} onChange={event => setLetter(event.target.value)} className="min-h-[480px] bg-background/50 font-serif leading-relaxed" />
            <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => copyText(letter)}><Clipboard className="mr-2 h-4 w-4" />{copied ? 'Copied' : 'Copy letter'}</Button><Button asChild><Link href="/resume">Edit profile evidence <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
          </CardContent>
        </Card>
      )}

      {kind === 'interview' && (
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/60 lg:col-span-2"><CardHeader><CardTitle>Practice questions</CardTitle><CardDescription>{jobAnalysis ? `${jobAnalysis.role} · ${jobAnalysis.company}` : 'Analyze a role to personalize these prompts.'}</CardDescription></CardHeader><CardContent className="space-y-3">{interviewKit.questions.map((question, index) => <div key={question} className="flex gap-3 rounded-lg border border-border/50 bg-background/30 p-4"><span className="font-mono text-sm text-primary">{String(index + 1).padStart(2, '0')}</span><span className="text-sm">{question}</span></div>)}</CardContent></Card>
          <div className="space-y-6"><Card className="border-primary/20 bg-primary/5"><CardHeader><CardTitle>Evidence to use</CardTitle></CardHeader><CardContent className="space-y-3">{interviewKit.talkingPoints.length ? interviewKit.talkingPoints.map(point => <div key={point} className="text-sm text-muted-foreground">{point}</div>) : <div className="text-sm text-muted-foreground">Add experience bullets in the builder to create talking points.</div>}</CardContent></Card><Card><CardHeader><CardTitle>Before the interview</CardTitle></CardHeader><CardContent className="space-y-3">{interviewKit.checklist.map(item => <div key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</div>)}</CardContent></Card></div>
        </div>
      )}

      {kind === 'analytics' && (
        <div className="mb-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">{[['Overall ATS', audit.score], ['Completeness', audit.completeness], ['Keyword fit', audit.keywordAlignment], ['Evidence', audit.evidenceStrength]].map(([label, value]) => <Card key={String(label)} className="border-border/60 bg-card/60"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-2 text-3xl font-black text-primary">{value}%</div><Progress value={Number(value)} className="mt-3 h-1.5" /></CardContent></Card>)}</div>
          <div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle className="text-success">Working well</CardTitle></CardHeader><CardContent className="space-y-3">{audit.strengths.length ? audit.strengths.map(item => <div key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</div>) : <p className="text-sm text-muted-foreground">Complete your profile to see strengths.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Next improvements</CardTitle></CardHeader><CardContent className="space-y-3">{audit.improvements.map(item => <div key={item} className="flex gap-2 text-sm"><Target className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{item}</div>)}</CardContent></Card></div>
          <Card><CardHeader><CardTitle>Keyword map</CardTitle><CardDescription>Private, local extraction from profile and job text. Nothing is sent to another service.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{audit.keywords.map(keyword => <Badge key={keyword} variant="outline" className="border-primary/20">{keyword}</Badge>)}</CardContent></Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>Current workspace signal</CardTitle><CardDescription>These values come from the profile and job analysis currently saved in this browser workspace.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-background/40 p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Profile</div><div className="mt-2 font-semibold">{resumeData.name || 'No profile imported'}</div><div className="mt-1 text-sm text-muted-foreground">{resumeData.skills.length} saved skills · {resumeData.experience.length} roles</div></div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Target match</div><div className="mt-2 font-mono text-3xl font-bold text-primary">{jobAnalysis ? `${targetMatchScore}%` : '—'}</div><div className="mt-1 text-sm text-muted-foreground">{jobAnalysis?.role || 'Analyze a job to create a match'}</div></div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4 sm:col-span-2"><div className="text-xs uppercase tracking-wider text-muted-foreground">Next best action</div><div className="mt-2 font-semibold">{jobAnalysis ? `Continue with ${jobAnalysis.role}` : 'Import your profile and analyze a live job URL'}</div><div className="mt-1 text-sm text-muted-foreground">The app keeps the workflow connected so you can return to the same evidence without re-entering it.</div></div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5"><CardHeader><CardTitle>Continue workflow</CardTitle><CardDescription>Jump to the step that creates the source data for this module.</CardDescription></CardHeader><CardContent className="space-y-3">{item.actions.map(action => <Button key={action.href} asChild className="w-full justify-between"><Link href={action.href}>{action.label}<ArrowRight className="h-4 w-4" /></Link></Button>)}</CardContent></Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">{resumeData.skills.slice(0, 8).map(skill => <Badge key={skill} variant="outline" className="border-primary/20">{skill}</Badge>)}</div>
    </div>
  );
}