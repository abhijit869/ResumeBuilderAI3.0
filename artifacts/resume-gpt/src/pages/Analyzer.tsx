import { useState } from 'react';
import { Link } from 'wouter';
import { analyzeWorkspaceJob } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Sparkles, ScanLine, ArrowRight, Target, AlertTriangle,
  CheckCircle2, Briefcase, Globe, FileText, ChevronRight,
  RotateCcw, ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

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

/* ── Step progress item ─────────────────────────────────────────────── */
function AnalysisStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border shadow-inner',
        done ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
        : active ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/20'
        : 'bg-white/5 border-white/10 text-blue-200/30',
      )}>
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 drop-shadow-sm" />
        ) : active ? (
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-200/20" />
        )}
      </div>
      <span className={cn(
        'text-sm transition-colors duration-300 drop-shadow-sm',
        done ? 'text-white font-bold' :
        active ? 'text-blue-100 font-extrabold' :
        'text-blue-200/50 font-medium',
      )}>
        {label}
      </span>
    </div>
  );
}

/* ── Skill pill ─────────────────────────────────────────────────────── */
function SkillPill({ label, variant }: { label: string; variant: 'matched' | 'missing' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-sm border backdrop-blur-md transition-all hover:-translate-y-0.5',
      variant === 'matched' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20 hover:shadow-[0_4px_12px_rgba(52,211,153,0.2)]' : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/20 hover:shadow-[0_4px_12px_rgba(251,191,36,0.2)]',
    )}>
      {variant === 'matched'
        ? <CheckCircle2 className="h-3.5 w-3.5 drop-shadow-sm" />
        : <AlertTriangle className="h-3.5 w-3.5 drop-shadow-sm" />
      }
      {label}
    </span>
  );
}

export default function Analyzer() {
  const { setTargetMatchScore, setJobAnalysis } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  const analysisSteps = [
    'Fetching job source',
    'Extracting requirements',
    'Analyzing skills',
    'Matching your profile',
    'Building strategy',
  ];

  const handleAnalyze = async () => {
    if (!jobDescription.trim() && !jobUrl.trim()) return;
    setAnalyzing(true);
    setProgress(0);
    setActiveStep(0);
    setError('');

    /* Simulate step progress */
    const stepDelay = 600;
    for (let i = 0; i < analysisSteps.length - 1; i++) {
      await new Promise(r => setTimeout(r, stepDelay));
      setActiveStep(i + 1);
      setProgress(Math.round(((i + 1) / analysisSteps.length) * 80));
    }

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
        matchedSkills: Array.isArray(comparison.matchedSkills)
          ? comparison.matchedSkills.map(String) : [],
        missingSkills: Array.isArray(comparison.missingSkills)
          ? comparison.missingSkills.map(String) : [],
        matchScore: Number(comparison.matchScore ?? 0),
      };
      setResult(next);
      setJobAnalysis({ ...next, source: response.source });
      setTargetMatchScore(next.matchScore);
      setProgress(100);
      setActiveStep(analysisSteps.length);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The job could not be analyzed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-5 md:p-7 max-w-[1100px] mx-auto font-sans relative">
      
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* ── Header ── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <ScanLine className="h-6 w-6 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">Job Analyzer</h1>
            <p className="text-sm font-medium text-blue-100/70 mt-1 drop-shadow-sm">
              Fetch a live job or paste a description, then compare it against your profile.
            </p>
          </div>
        </div>
      </motion.header>

      {/* ── Input form ── */}
      {!result && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-3xl border border-white/10 bg-black/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            {/* URL input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2 drop-shadow-md">
                <Globe className="h-4 w-4 text-blue-400 drop-shadow-sm" />
                Job URL
              </label>
              <div className="relative group">
                <Input
                  id="job-url-input"
                  placeholder="https://company.com/careers/role"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  className="h-12 rounded-xl border-white/10 bg-black/40 focus:bg-black/60 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-sm pr-10 text-white placeholder:text-blue-100/30 shadow-inner transition-all"
                />
                {jobUrl && (
                  <a
                    href={jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors drop-shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-[11px] font-medium text-blue-200/50 drop-shadow-sm leading-relaxed">
                Paste a direct link to the job posting. The AI will fetch and parse it automatically.
              </p>
            </div>

            {/* Paste description */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2 drop-shadow-md">
                <FileText className="h-4 w-4 text-blue-400 drop-shadow-sm" />
                Or paste description
              </label>
              <Textarea
                id="job-description-input"
                placeholder="Paste responsibilities, qualifications, and requirements here…"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="min-h-[140px] rounded-xl border-white/10 bg-black/40 focus:bg-black/60 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-sm resize-none text-white placeholder:text-blue-100/30 shadow-inner font-mono transition-all"
              />
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 flex flex-wrap items-center gap-3 relative z-10">
            <span className="text-[11px] font-bold text-blue-200/50 uppercase tracking-widest drop-shadow-sm mr-2">Supported:</span>
            {['LinkedIn', 'Glassdoor', 'Indeed', 'Company site', 'PDF upload'].map(source => (
              <span key={source} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/5 text-blue-100/70 border border-white/10 shadow-sm backdrop-blur-md">
                {source}
              </span>
            ))}
            <span className="text-[11px] font-medium text-blue-200/40 italic">and more…</span>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-start gap-4 p-5 rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_4px_20px_rgba(239,68,68,0.15)] relative z-10 backdrop-blur-md"
            >
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5 drop-shadow-sm" />
              <div>
                <p className="text-sm font-bold text-red-300 drop-shadow-md">Analysis failed</p>
                <p className="text-xs font-medium text-red-200/80 mt-1 leading-relaxed">{error}</p>
                <p className="text-xs font-medium text-red-200/50 mt-2 italic">
                  Try pasting the job description directly if the URL fetch fails.
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-end relative z-10 pt-4 border-t border-white/10">
            <Button
              id="analyze-job-btn"
              size="lg"
              onClick={handleAnalyze}
              disabled={!jobDescription.trim() && !jobUrl.trim()}
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Analysis in progress ── */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 rounded-3xl border border-white/10 bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl relative overflow-hidden flex items-center justify-center min-h-[400px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Spinner */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 shadow-inner" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-blue-400 animate-pulse drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-white drop-shadow-lg">Analyzing job requirements</h3>
              <p className="text-sm font-medium text-blue-200/60 drop-shadow-sm">
                The AI is fetching the source and matching it against your profile.
              </p>
            </div>

            {/* Step list */}
            <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
              {analysisSteps.map((step, i) => (
                <AnalysisStep
                  key={step}
                  label={step}
                  done={i < activeStep}
                  active={i === activeStep}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-3">
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-blue-200/50 drop-shadow-sm uppercase tracking-widest">
                <span>Processing…</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Results ── */}
      {result && !analyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 relative z-10"
        >
          {/* Score + role header */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Match score card */}
            <div className="p-8 rounded-3xl border border-white/10 bg-black/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 pointer-events-none">
                <div className={cn("absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] opacity-40 transition-colors duration-700", 
                  result.matchScore >= 80 ? 'bg-emerald-500' :
                  result.matchScore >= 60 ? 'bg-amber-500' :
                  'bg-red-500'
                )} />
              </div>
              <div className="relative z-10">
                <div className="text-6xl font-black mb-1 drop-shadow-lg flex items-start justify-center gap-1">
                  <span className={cn(
                    result.matchScore >= 80 ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]' :
                    result.matchScore >= 60 ? 'text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]' :
                    'text-transparent bg-clip-text bg-gradient-to-br from-red-300 to-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  )}>{result.matchScore}</span>
                  <span className="text-2xl text-white/30 font-bold">%</span>
                </div>
                <div className="text-[11px] font-bold text-blue-200/50 uppercase tracking-widest mb-4 drop-shadow-sm">Match Score</div>
                <div className={cn(
                  'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-md backdrop-blur-md',
                  result.matchScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  result.matchScore >= 60 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30',
                )}>
                  {result.matchScore >= 80 ? '✓ Strong match' :
                   result.matchScore >= 60 ? '~ Good match' :
                   '! Needs work'}
                </div>
              </div>
              <Button asChild size="lg" className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/20 backdrop-blur-md transition-all shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.1)] relative z-10">
                <Link href="/create">
                  Build tailored resume <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Job info */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-black/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner shrink-0 text-white drop-shadow-md">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-extrabold truncate text-white drop-shadow-lg mb-1">{result.role}</h2>
                  <p className="text-sm font-medium text-blue-200/70 drop-shadow-sm">
                    {result.company} · {result.location} · {result.seniority}
                  </p>
                </div>
              </div>

              {result.summary && (
                <p className="text-sm font-medium text-blue-100/80 leading-relaxed border-l-2 border-blue-500/50 pl-4 mb-8 py-1 drop-shadow-sm bg-blue-500/5 rounded-r-lg">
                  {result.summary}
                </p>
              )}

              {/* Skills grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Matched */}
                <div className="bg-black/30 p-5 rounded-2xl border border-emerald-500/10 shadow-inner">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-sm" />
                    <span className="text-sm font-bold text-emerald-300 drop-shadow-md">Matched skills</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-auto shadow-sm">
                      {result.matchedSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.length > 0 ? (
                      result.matchedSkills.map(skill => (
                        <SkillPill key={skill} label={skill} variant="matched" />
                      ))
                    ) : (
                      <span className="text-xs font-medium text-blue-200/40 italic">No matching skills found in saved profile.</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="bg-black/30 p-5 rounded-2xl border border-amber-500/10 shadow-inner">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <AlertTriangle className="h-4 w-4 text-amber-400 drop-shadow-sm" />
                    <span className="text-sm font-bold text-amber-300 drop-shadow-md">Gaps to address</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-auto shadow-sm">
                      {result.missingSkills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length > 0 ? (
                      result.missingSkills.map(skill => (
                        <SkillPill key={skill} label={skill} variant="missing" />
                      ))
                    ) : (
                      <span className="text-xs font-medium text-blue-200/40 italic">No skill gaps detected.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice about skill claims */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-start gap-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-md"
          >
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 drop-shadow-sm" />
            <p className="text-sm font-medium text-blue-100/70 leading-relaxed drop-shadow-sm">
              <span className="font-bold text-amber-300">Transparency note: </span>
              Missing skills are provided for awareness only. Only add skills you can genuinely demonstrate.
              The AI will not prompt you to claim skills you don't have.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-4 justify-center pt-4"
          >
            <Button
              id="analyze-another-btn"
              variant="outline"
              size="lg"
              onClick={() => { setResult(null); setProgress(0); setActiveStep(0); }}
              className="h-12 rounded-xl text-sm font-bold border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all px-6"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Analyze another job
            </Button>
            <Button asChild size="lg" className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-transform hover:-translate-y-1">
              <Link href="/create">
                Create tailored resume <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}