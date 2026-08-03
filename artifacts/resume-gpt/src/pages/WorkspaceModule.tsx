import { Link } from 'wouter';
import { ArrowRight, BarChart3, BriefcaseBusiness, FileCode2, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';

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
    description: 'Use the saved profile and target job as the source of truth for a focused application letter.',
    icon: FileCode2,
    eyebrow: 'Application companion',
    actions: [{ label: 'Start from a job', href: '/create' }, { label: 'Open resume builder', href: '/resume' }],
  },
  interview: {
    title: 'Interview Prep',
    description: 'Turn the target role’s requirements into a practical preparation checklist and talking points.',
    icon: BriefcaseBusiness,
    eyebrow: 'Role preparation',
    actions: [{ label: 'Review target job', href: '/analyzer' }, { label: 'Edit profile evidence', href: '/resume' }],
  },
  analytics: {
    title: 'Resume Analytics',
    description: 'Track the signals currently available in your workspace and identify what to strengthen next.',
    icon: BarChart3,
    eyebrow: 'Workspace insights',
    actions: [{ label: 'Open resume builder', href: '/resume' }, { label: 'Run a new analysis', href: '/analyzer' }],
  },
};

export default function WorkspaceModule({ kind }: { kind: ModuleKind }) {
  const { resumeData, jobAnalysis, targetMatchScore } = useAppStore();
  const item = content[kind];
  const Icon = item.icon;

  return (
    <div className="mx-auto min-h-full max-w-6xl p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="h-3.5 w-3.5" /> {item.eyebrow}</div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight"><Icon className="h-8 w-8 text-primary" /> {item.title}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{item.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Current workspace signal</CardTitle>
            <CardDescription>These values come from the profile and job analysis currently saved in this browser workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-background/40 p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Profile</div><div className="mt-2 font-semibold">{resumeData.name || 'No profile imported'}</div><div className="mt-1 text-sm text-muted-foreground">{resumeData.skills.length} saved skills · {resumeData.experience.length} roles</div></div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Target match</div><div className="mt-2 font-mono text-3xl font-bold text-primary">{jobAnalysis ? `${targetMatchScore}%` : '—'}</div><div className="mt-1 text-sm text-muted-foreground">{jobAnalysis?.role || 'Analyze a job to create a match'}</div></div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-4 sm:col-span-2"><div className="text-xs uppercase tracking-wider text-muted-foreground">Next best action</div><div className="mt-2 font-semibold">{jobAnalysis ? `Continue with ${jobAnalysis.role}` : 'Import your profile and analyze a live job URL'}</div><div className="mt-1 text-sm text-muted-foreground">The app keeps the workflow connected so you can return to the same evidence without re-entering it.</div></div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader><CardTitle>Continue workflow</CardTitle><CardDescription>Jump to the step that creates the source data for this module.</CardDescription></CardHeader>
          <CardContent className="space-y-3">{item.actions.map(action => <Button key={action.href} asChild className="w-full justify-between"><Link href={action.href}>{action.label}<ArrowRight className="h-4 w-4" /></Link></Button>)}</CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">{resumeData.skills.slice(0, 8).map(skill => <Badge key={skill} variant="outline" className="border-primary/20">{skill}</Badge>)}</div>
    </div>
  );
}