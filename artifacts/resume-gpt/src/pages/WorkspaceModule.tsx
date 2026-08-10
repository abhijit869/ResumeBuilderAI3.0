import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Clipboard, FileCode2, Sparkles, Target, MessageSquare, Award, Zap, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store';
import { auditResumeLocally, createCoverLetter, createInterviewKit, evaluateInterviewAnswerLocally, type CoverLetterTone } from '@/lib/local-tools';
import { customFetch } from '@workspace/api-client-react';

type ModuleKind = 'match' | 'cover-letter' | 'interview' | 'analytics' | 'portfolio';

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
    description: 'Create an editable, AI-generated cover letter based on your profile and the target job.',
    icon: FileCode2,
    eyebrow: 'Advanced AI Generator',
    actions: [{ label: 'Start from a job', href: '/create' }, { label: 'Open resume builder', href: '/resume' }],
  },
  interview: {
    title: 'Interview Prep',
    description: 'Turn the saved target role and your profile evidence into AI-generated questions, stories, and a preparation checklist.',
    icon: BriefcaseBusiness,
    eyebrow: 'Advanced AI Coach',
    actions: [{ label: 'Review target job', href: '/analyzer' }, { label: 'Edit profile evidence', href: '/resume' }],
  },
  analytics: {
    title: 'Resume Analytics',
    description: 'Run a deep AI-powered ATS audit using the same evidence as the resume workflow.',
    icon: BarChart3,
    eyebrow: 'Deep AI Audit',
    actions: [{ label: 'Open resume builder', href: '/resume' }, { label: 'Run a new analysis', href: '/analyzer' }],
  },
  portfolio: {
    title: 'Portfolio Generator',
    description: 'Extract projects and experience from your resume to generate a complete responsive HTML portfolio.',
    icon: FileCode2,
    eyebrow: 'Web Portfolio',
    actions: [{ label: 'Edit profile evidence', href: '/resume' }],
  },
};

export default function WorkspaceModule({ kind }: { kind: ModuleKind }) {
  const { resumeData, jobAnalysis, targetMatchScore, preferredModel } = useAppStore();
  const item = content[kind];
  const Icon = item.icon;
  const localAudit = useMemo(() => auditResumeLocally(resumeData, jobAnalysis), [resumeData, jobAnalysis]);
  const localInterviewKit = useMemo(() => createInterviewKit(resumeData, jobAnalysis), [resumeData, jobAnalysis]);
  
  const [audit, setAudit] = useState<any>(localAudit);
  const [interviewKit, setInterviewKit] = useState<any>(localInterviewKit);
  const [selectedTone, setSelectedTone] = useState<CoverLetterTone>('executive');
  const [letter, setLetter] = useState(() => createCoverLetter(resumeData, jobAnalysis, 'executive'));
  const [portfolioTemplate, setPortfolioTemplate] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Interactive Interview Simulator state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const handleToneChange = (tone: CoverLetterTone) => {
    setSelectedTone(tone);
    setLetter(createCoverLetter(resumeData, jobAnalysis, tone));
  };

  const handleEvaluateAnswer = () => {
    const question = interviewKit.questions[activeQuestionIdx] || 'Interview question';
    const result = evaluateInterviewAnswerLocally(question, userAnswer, resumeData, jobAnalysis);
    setEvaluationResult(result);
  };

  const generateWithAI = async () => {
    setGenerating(true);
    const body = JSON.stringify({ model: preferredModel });
    const headers = { 'Content-Type': 'application/json' };
    try {
      if (kind === 'cover-letter') {
        const data = await customFetch<any>('/api/workspace/resumes/cover-letter', { method: 'POST', body });
        setLetter(data.content);
      } else if (kind === 'interview') {
        const data = await customFetch<any>('/api/workspace/resumes/interview-prep', { method: 'POST', body });
        setInterviewKit(data);
      } else if (kind === 'analytics') {
        const data = await customFetch<any>('/api/workspace/resumes/audit', { method: 'POST', body });
        setAudit(data);
      } else if (kind === 'portfolio') {
        const data = await customFetch<any>('/api/workspace/resumes/portfolio', { method: 'POST', body });
        setPortfolioTemplate(data.htmlTemplate);
      }
    } catch (e) {
      console.error("AI Generation failed", e);
    } finally {
      setGenerating(false);
    }
  };

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
    <div className="mx-auto min-h-full max-w-5xl p-5 md:p-7 relative font-sans text-white">
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[0%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">{item.eyebrow}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">{item.title}</h1>
          </div>
        </div>
        <p className="text-xs text-blue-200/60 drop-shadow-sm mt-1 ml-10">{item.description}</p>
      </motion.header>

      {kind === 'cover-letter' && (
        <Card className="mb-6 border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <CardTitle>AI Cover Letter Studio</CardTitle>
              <CardDescription>Select a tone persona to instantly adapt the letter for your target company culture.</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'executive', label: 'Executive' },
                { id: 'tech', label: 'Tech & Stack' },
                { id: 'startup', label: 'Startup' },
                { id: 'direct', label: 'Direct' },
              ].map(t => (
                <Badge
                  key={t.id}
                  variant={selectedTone === t.id ? 'default' : 'outline'}
                  onClick={() => handleToneChange(t.id as CoverLetterTone)}
                  className="cursor-pointer px-3 py-1 text-xs transition-colors hover:border-primary"
                >
                  {t.label}
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={generateWithAI} disabled={generating} className="ml-2">
                <Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} />
                {generating ? 'Generating...' : 'AI Custom'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Textarea value={letter} onChange={event => setLetter(event.target.value)} className="min-h-[480px] bg-black/40 border-white/10 focus:bg-black/60 focus:border-blue-500/50 transition-all font-serif leading-relaxed text-base text-white" />
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => copyText(letter)}>
                <Clipboard className="mr-2 h-4 w-4" />{copied ? 'Copied to Clipboard' : 'Copy letter'}
              </Button>
              <Button asChild>
                <Link href="/resume">Edit profile evidence <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {kind === 'interview' && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> Interactive AI Simulator Active
            </Badge>
            <Button onClick={generateWithAI} disabled={generating}>
              <Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} />
              {generating ? 'AI Generating...' : 'Generate New Kit'}
            </Button>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-3">
            {/* Interactive Question Practice Box */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Practice Questions & AI Coach
                </CardTitle>
                <CardDescription>Select a question to draft your answer and get instant STAR framework feedback.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {(interviewKit.questions ?? []).map((question: string, index: number) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => {
                        setActiveQuestionIdx(index);
                        setEvaluationResult(null);
                        setUserAnswer('');
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left cursor-pointer transition-all duration-300 ${activeQuestionIdx === index ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'border-white/10 bg-black/30 hover:bg-black/50'}`}
                    >
                      <span className={`font-mono text-sm font-bold ${activeQuestionIdx === index ? 'text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-blue-200/50'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium leading-relaxed">{question}</span>
                    </button>
                  ))}
                </div>

                  <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-black/40 p-5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-primary flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                      <Zap className="w-4 h-4" /> Practice Question #{activeQuestionIdx + 1}
                    </h4>
                    <span className="text-xs text-blue-200/60 drop-shadow-sm">Draft your response below</span>
                  </div>
                  <p className="text-sm font-medium italic text-white drop-shadow-md">
                    "{interviewKit.questions?.[activeQuestionIdx] || 'Loading question...'}"
                  </p>
                  <Textarea
                    placeholder="Type your response using the STAR format (Situation, Task, Action, Result)..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[120px] bg-card/50 text-sm"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleEvaluateAnswer} size="sm" className="gap-2">
                      <Sparkles className="w-4 h-4" /> Evaluate Answer with AI Coach
                    </Button>
                  </div>

                  {evaluationResult && (
                    <div className="mt-4 space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          <span className="font-bold text-sm">AI Score:</span>
                          <span className="text-xl font-extrabold text-primary">{evaluationResult.score}%</span>
                        </div>
                        <div className="flex gap-1">
                          {Object.entries(evaluationResult.starCheck).map(([key, val]) => (
                            <Badge key={key} variant={val ? 'default' : 'outline'} className="text-[10px] uppercase">
                              {key} {val ? '✓' : ''}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coach Feedback:</span>
                        {evaluationResult.feedback.map((fb: string, i: number) => (
                          <div key={i} className="text-xs text-foreground flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" /> {fb}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 rounded border border-border/50 bg-background/60 p-3">
                        <span className="text-xs font-semibold text-primary block mb-1">Suggested Model Response:</span>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">{evaluationResult.improvedAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <CardHeader className="border-b border-white/10 pb-3">
                  <CardTitle>Evidence talking points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  {interviewKit.talkingPoints?.length ? (
                    interviewKit.talkingPoints.map((point: string) => (
                      <div key={point} className="text-sm text-blue-200/80 drop-shadow-sm border-b border-white/10 pb-2 last:border-0">{point}</div>
                    ))
                  ) : (
                    <div className="text-sm text-blue-200/60 drop-shadow-sm">Add experience bullets in the builder to create talking points.</div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <CardHeader className="border-b border-white/10 pb-3">
                  <CardTitle>Interview Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  {interviewKit.checklist?.map((item: string) => (
                    <div key={item} className="flex gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {kind === 'analytics' && (
        <>
          <div className="mb-6 flex justify-end">
            <Button onClick={generateWithAI} disabled={generating}><Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} /> {generating ? 'AI Auditing...' : 'Run Deep AI Audit'}</Button>
          </div>
        <div className="mb-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">{[['Overall ATS', audit.score], ['Completeness', audit.completeness], ['Keyword fit', audit.keywordAlignment], ['Evidence', audit.evidenceStrength]].map(([label, value]) => <Card key={String(label)} className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-blue-200/60 drop-shadow-sm">{label}</div><div className="mt-2 text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">{value}%</div><Progress value={Number(value)} className="mt-3 h-1.5" /></CardContent></Card>)}</div>
          <div className="grid gap-6 lg:grid-cols-2"><Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader className="border-b border-white/10 pb-3"><CardTitle className="text-success drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Working well</CardTitle></CardHeader><CardContent className="space-y-3 pt-4">{audit.strengths?.length ? audit.strengths.map((item: string) => <div key={item} className="flex gap-2 text-sm text-blue-100/90"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</div>) : <p className="text-sm text-blue-200/60">Complete your profile to see strengths.</p>}</CardContent></Card><Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader className="border-b border-white/10 pb-3"><CardTitle className="text-white drop-shadow-md">Next improvements</CardTitle></CardHeader><CardContent className="space-y-3 pt-4">{audit.improvements?.map((item: string) => <div key={item} className="flex gap-2 text-sm text-blue-100/90"><Target className="mt-0.5 h-4 w-4 shrink-0 text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />{item}</div>)}</CardContent></Card></div>
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader className="border-b border-white/10 pb-3"><CardTitle className="text-white drop-shadow-md">Keyword map</CardTitle><CardDescription className="text-blue-200/60 drop-shadow-sm">Deep AI extraction from profile and job text.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2 pt-4">{audit.keywords?.map((keyword: string) => <Badge key={keyword} variant="outline" className="border-white/20 bg-black/40 backdrop-blur-sm shadow-[0_0_8px_rgba(255,255,255,0.05)]">{keyword}</Badge>)}</CardContent></Card>
        </div>
        </>
      )}

      {kind === 'portfolio' && (
        <>
          <div className="mb-6 flex justify-end">
            <Button onClick={generateWithAI} disabled={generating}><Sparkles className={`mr-2 h-4 w-4 ${generating ? 'animate-pulse' : ''}`} /> {generating ? 'AI Generating...' : 'Generate AI Portfolio'}</Button>
          </div>
          {portfolioTemplate ? (
            <Card className="mb-6 border-primary/30">
              <CardHeader>
                <CardTitle>Your AI Portfolio</CardTitle>
                <CardDescription>Generated using Tailwind CSS.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-[600px] rounded border overflow-hidden">
                  <iframe srcDoc={portfolioTemplate} className="w-full h-full bg-white" title="Portfolio Preview" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => copyText(portfolioTemplate)}>
                    <Clipboard className="mr-2 h-4 w-4" />{copied ? 'Copied HTML' : 'Copy HTML Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border-border/60 bg-card/60">
              <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
                <FileCode2 className="w-12 h-12 mb-4 opacity-20" />
                <p>Click "Generate AI Portfolio" to build a responsive HTML page from your profile data.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-white/10 pb-3"><CardTitle className="text-white drop-shadow-md">Current workspace signal</CardTitle><CardDescription className="text-blue-200/60 drop-shadow-sm">These values come from the profile and job analysis currently saved in this browser workspace.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 pt-4">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 shadow-inner"><div className="text-xs uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Profile</div><div className="mt-2 font-semibold text-white drop-shadow-sm">{resumeData.name || 'No profile imported'}</div><div className="mt-1 text-sm text-blue-200/50">{resumeData.skills.length} saved skills · {resumeData.experience.length} roles</div></div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 shadow-inner"><div className="text-xs uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Target match</div><div className="mt-2 font-mono text-3xl font-bold text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">{jobAnalysis ? `${targetMatchScore}%` : '—'}</div><div className="mt-1 text-sm text-blue-200/50">{jobAnalysis?.role || 'Analyze a job to create a match'}</div></div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 sm:col-span-2 shadow-inner"><div className="text-xs uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Next best action</div><div className="mt-2 font-semibold text-white drop-shadow-sm">{jobAnalysis ? `Continue with ${jobAnalysis.role}` : 'Import your profile and analyze a live job URL'}</div><div className="mt-1 text-sm text-blue-200/50">The app keeps the workflow connected so you can return to the same evidence without re-entering it.</div></div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader className="border-b border-white/10 pb-3"><CardTitle className="text-white drop-shadow-md">Continue workflow</CardTitle><CardDescription className="text-blue-200/60 drop-shadow-sm">Jump to the step that creates the source data for this module.</CardDescription></CardHeader><CardContent className="space-y-3 pt-4">{item.actions.map(action => <Button key={action.href} asChild className="w-full justify-between"><Link href={action.href}>{action.label}<ArrowRight className="h-4 w-4" /></Link></Button>)}</CardContent></Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">{resumeData.skills.slice(0, 8).map(skill => <Badge key={skill} variant="outline" className="border-white/20 bg-black/30 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.05)]">{skill}</Badge>)}</div>
    </div>
  );
}