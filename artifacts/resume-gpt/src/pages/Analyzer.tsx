import { useState } from 'react';
import { Link } from 'wouter';
import { analyzeWorkspaceJob } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ScanLine, ArrowRight, Target, AlertTriangle, CheckCircle2, Briefcase } from 'lucide-react';
import { useAppStore } from '@/store';

type AnalysisResult = {
  id: number;
  role: string;
  company: string;
  location: string;
  seniority: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
};

export default function Analyzer() {
  const { setTargetMatchScore, setJobAnalysis } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim() && !jobUrl.trim()) return;
    setAnalyzing(true);
    setProgress(35);
    setError('');
    try {
      const response = await analyzeWorkspaceJob({
        jobUrl: jobUrl.trim() || null,
        jobDescription: jobDescription.trim() || null,
      });
      const job = response.job as Record<string, unknown>;
      const comparison = response.comparison as Record<string, unknown>;
      const next: AnalysisResult = {
        id: response.id,
        role: String(job.title ?? 'Target role'),
        company: String(job.company ?? 'Target company'),
        location: String(job.location ?? 'See job listing'),
        seniority: String(job.seniority ?? 'Not specified'),
        summary: String(job.summary ?? ''),
        matchedSkills: Array.isArray(comparison.matchedSkills) ? comparison.matchedSkills.map(String) : [],
        missingSkills: Array.isArray(comparison.missingSkills) ? comparison.missingSkills.map(String) : [],
        matchScore: Number(comparison.matchScore ?? 0),
      };
      setResult(next);
      setJobAnalysis({
        ...next,
        source: response.source,
      });
      setTargetMatchScore(next.matchScore);
      setProgress(100);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The job could not be analyzed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col p-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight"><ScanLine className="h-8 w-8 text-primary" /> Role Analyzer</h1>
        <p className="mt-2 text-lg text-muted-foreground">Fetch a live job page or paste its description, then compare it with your saved profile.</p>
      </header>

      {!result && !analyzing && (
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="flex h-full flex-col p-8">
            <div className="flex-1 space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Job URL</span>
                <Input placeholder="https://company.com/careers/role" value={jobUrl} onChange={event => setJobUrl(event.target.value)} />
              </label>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground"><div className="h-px flex-1 bg-border" />or paste<div className="h-px flex-1 bg-border" /></div>
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Job description</span>
                <Textarea placeholder="Paste responsibilities, qualifications, and requirements..." value={jobDescription} onChange={event => setJobDescription(event.target.value)} className="min-h-[260px] font-mono text-sm" />
              </label>
            </div>
            {error && <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <div className="mt-8 flex justify-end"><Button size="lg" onClick={handleAnalyze} disabled={!jobDescription.trim() && !jobUrl.trim()}><Sparkles className="mr-2 h-4 w-4" /> Analyze live job</Button></div>
          </CardContent>
        </Card>
      )}

      {analyzing && (
        <Card className="flex flex-1 items-center justify-center border-primary/20 bg-card/50">
          <div className="w-full max-w-md space-y-6 p-8 text-center">
            <div className="relative mx-auto h-24 w-24"><div className="absolute inset-0 rounded-full border-4 border-primary/20" /><div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" /><Sparkles className="absolute inset-0 m-auto h-8 w-8 animate-pulse text-primary" /></div>
            <div><h3 className="mb-2 text-xl font-bold">Reading and comparing evidence</h3><p className="text-sm text-muted-foreground">The server is fetching the source and matching it against your saved profile.</p></div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {result && !analyzing && (
        <div className="flex-1 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card to-card/50">
              <Target className="absolute right-5 top-5 h-24 w-24 opacity-5" />
              <CardContent className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl font-black text-primary">{result.matchScore}<span className="text-3xl text-primary/60">%</span></div>
                <h3 className="mt-2 text-lg font-semibold">{result.role}</h3><p className="text-sm text-muted-foreground">{result.company} · {result.seniority}</p>
                <Button asChild variant="outline" className="mt-6 w-full border-primary/20"><Link href="/create">Build tailored resume <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link></Button>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 border-border/50 bg-card/50">
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5 text-muted-foreground" /> Extracted requirements</CardTitle><CardDescription>{result.summary || result.location}</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Matched evidence</div><div className="flex flex-wrap gap-2">{result.matchedSkills.length ? result.matchedSkills.map(skill => <Badge key={skill} variant="success">{skill}</Badge>) : <span className="text-sm text-muted-foreground">No matching skills were found in the saved profile.</span>}</div></div>
                <div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-warning"><AlertTriangle className="h-4 w-4" /> Missing or weak evidence</div><div className="flex flex-wrap gap-2">{result.missingSkills.length ? result.missingSkills.map(skill => <Badge key={skill} variant="outline" className="border-warning/50 text-warning">{skill}</Badge>) : <span className="text-sm text-muted-foreground">No extracted gaps.</span>}</div></div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center"><Button variant="ghost" onClick={() => { setResult(null); setProgress(0); }}>Analyze another job</Button></div>
        </div>
      )}
    </div>
  );
}