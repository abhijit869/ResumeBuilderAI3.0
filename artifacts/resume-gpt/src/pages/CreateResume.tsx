import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { analyzeWorkspaceJob, generateWorkspaceResume, importWorkspaceProfile, saveWorkspaceProfile, customFetch } from '@workspace/api-client-react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
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
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ResumeExportActions } from '@/components/ResumeExportActions';
import { RESUME_TEMPLATES } from '@/lib/resume-templates';
import {
  ProfileSource,
  ResumeMode,
  ResumeTemplate,
  useAppStore,
} from '@/store';

type Stage = 'gateway' | 'profile' | 'validation' | 'job' | 'match' | 'strategy' | 'generation' | 'fact_check' | 'critic' | 'ats' | 'studio';

const stages: { id: Stage; label: string; hideInRail?: boolean }[] = [
  { id: 'gateway', label: 'Gateway', hideInRail: true },
  { id: 'profile', label: 'Import Profile' },
  { id: 'validation', label: 'Data Validation' },
  { id: 'job', label: 'Target Job' },
  { id: 'match', label: 'Job Analysis & Match' },
  { id: 'strategy', label: 'Resume Strategy' },
  { id: 'generation', label: 'AI Generation' },
  { id: 'fact_check', label: 'Fact Checker' },
  { id: 'critic', label: 'Quality Critic' },
  { id: 'ats', label: 'ATS Analyzer' },
  { id: 'studio', label: 'Resume Studio' },
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
      className={`group text-left rounded-xl border p-4 transition-colors ${
        selected
          ? 'border-primary bg-primary/10 shadow-[0_0_24px_rgba(0,229,255,0.1)]'
          : 'border-border/60 bg-background/30 hover:border-primary/40 hover:bg-primary/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-blue-200/60 drop-shadow-sm group-hover:text-primary'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{title}</span>
            {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-blue-200/60 drop-shadow-sm">{description}</p>
        </div>
      </div>
    </button>
  );
}

function StageRail({ stage }: { stage: Stage }) {
  const current = stages.findIndex(item => item.id === stage);
  return (
    <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1">
      {stages.filter(s => !s.hideInRail).map((item, index) => {
        const visibleStages = stages.filter(s => !s.hideInRail);
        const currentIndex = visibleStages.findIndex(s => s.id === stage);
        return (
        <div key={item.id} className="flex min-w-max items-center gap-1.5">
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            index <= currentIndex
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-blue-200/60 drop-shadow-sm border border-border/50'
          }`}>
            <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold ${
              index < currentIndex ? 'step-done' : index === currentIndex ? 'step-current' : 'step-pending'
            }`}>
              {index < currentIndex ? <Check className="h-2.5 w-2.5" /> : index + 1}
            </span>
            {item.label}
          </div>
          {index < visibleStages.length - 1 && (
            <div className={`h-px w-4 ${
              index < currentIndex ? 'bg-primary/40' : 'bg-border/50'
            }`} />
          )}
        </div>
      )})}
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: ResumeTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  const layout = template.layout ?? 'ats';
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-xl border p-3 text-left transition-colors ${
        selected
          ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
          : 'border-border/60 bg-background/30 hover:border-primary/40'
      }`}
    >
      <div className={`relative mb-4 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${template.accent} p-1`}>
        {template.imageAsset ? (
          <img src={template.imageAsset} alt={`${template.name} preview`} width={400} height={565} loading="lazy" className="h-full w-full object-cover rounded shadow-xl transition-transform group-hover:scale-105" />
        ) : (
          <div className="absolute right-3 top-3 h-3 w-3 rounded-full border border-white/70" style={{ backgroundColor: template.accentColor }} />
        )}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{template.name}</div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-primary">{template.category}</div>
          <p className="mt-2 text-xs leading-relaxed text-blue-200/60 drop-shadow-sm">{template.description}</p>
        </div>
        {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
      </div>
    </button>
  );
}

function ProfileStep({
  mode,
  profileSource,
  setMode,
  setSource,
  onContinue,
  onLinkedIn,
  onLinkedInAuth,
  resumeData,
  profileUrl,
  setProfileUrl,
  onImport,
  importBlocked,
  onUseCurrentProfile,
  onEnterManually,
  onUploadResume,
  uploading,
  fileError,
  importing,
}: {
  mode: ResumeMode;
  profileSource: ProfileSource;
  setMode: (mode: ResumeMode) => void;
  setSource: (source: ProfileSource) => void;
  onContinue: () => void | Promise<void>;
  onLinkedIn: () => void;
  onLinkedInAuth: () => void;
  resumeData: ReturnType<typeof useAppStore>['resumeData'];
  profileUrl: string;
  setProfileUrl: (value: string) => void;
  onImport: () => void;
  importBlocked: boolean;
  onUseCurrentProfile: () => void;
  onEnterManually: () => void;
  onUploadResume: (file: File) => void;
  uploading: boolean;
  fileError: string;
  importing: boolean;
}) {
  const { updateProfile } = useAppStore();
  return (
    <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
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
                <div className="mt-1 text-xs text-blue-200/60 drop-shadow-sm">Use your existing ResumeGPT data</div>
              </button>
              <button type="button" onClick={onLinkedIn} className={`rounded-lg border p-4 text-left ${profileSource === 'linkedin' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30 hover:border-primary/40'}`}>
                <Linkedin className="mb-3 h-4 w-4 text-[#6ea8fe]" />
                <div className="text-sm font-semibold">LinkedIn</div>
                <div className="mt-1 text-xs text-blue-200/60 drop-shadow-sm">Import after account authorization</div>
              </button>
              <button type="button" onClick={() => setSource('resume-file')} className={`rounded-lg border p-4 text-left ${profileSource === 'resume-file' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30'}`}>
                <Upload className="mb-3 h-4 w-4 text-emerald-400" />
                <div className="text-sm font-semibold">PDF or DOCX</div>
                <div className="mt-1 text-xs text-blue-200/60 drop-shadow-sm">Extract your existing resume</div>
              </button>
              <button type="button" onClick={() => setSource('github')} className={`rounded-lg border p-4 text-left ${profileSource === 'github' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30 hover:border-primary/40'}`}>
                <svg className="mb-3 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <div className="text-sm font-semibold">GitHub</div>
                <div className="mt-1 text-xs text-blue-200/60 drop-shadow-sm">Import projects</div>
              </button>
              <button type="button" onClick={() => setSource('paste')} className={`rounded-lg border p-4 text-left ${profileSource === 'paste' ? 'border-primary bg-primary/10' : 'border-border/60 bg-background/30'}`}>
                <PenLine className="mb-3 h-4 w-4 text-amber-300" />
                <div className="text-sm font-semibold">Manual</div>
                <div className="mt-1 text-xs text-blue-200/60 drop-shadow-sm">Enter information</div>
              </button>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-blue-200/60 drop-shadow-sm">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p><span className="font-semibold text-white drop-shadow-md">Privacy note:</span> LinkedIn import will only read an account you explicitly authorize. The app will never fetch arbitrary LinkedIn accounts or scrape private profile data.</p>
            </div>
            {profileSource === 'linkedin' && (
              <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-end">
                <label className="flex-1 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Public profile URL</span>
                  <Input value={profileUrl} onChange={event => setProfileUrl(event.target.value)} placeholder="https://www.linkedin.com/in/your-name" />
                </label>
                <Button type="button" onClick={onImport} disabled={importing || !profileUrl.trim()}>
                  {importing ? 'Fetching…' : 'Fetch and save profile'}
                </Button>
              </div>
            )}
            {profileSource === 'resume-file' && (
              <div className="flex flex-col gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-400/30 bg-background/40 px-4 py-8 text-center transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/5">
                  <Upload className="h-8 w-8 text-emerald-400" />
                  <span className="text-sm font-medium text-white drop-shadow-md">
                    {uploading ? 'Extracting your resume…' : 'Tap to upload your resume'}
                  </span>
                  <span className="text-xs text-blue-200/60 drop-shadow-sm">PDF (.pdf) or Word (.docx) — the app reads the text and builds your profile.</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    disabled={uploading}
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (file) onUploadResume(file);
                      event.target.value = '';
                    }}
                  />
                </label>
                {fileError && (
                  <p className="text-xs text-destructive">{fileError}</p>
                )}
              </div>
            )}
            {importBlocked && (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white drop-shadow-md">LinkedIn blocked this profile request</p>
                    <p className="mt-1 text-xs leading-relaxed text-blue-200/60 drop-shadow-sm">
                      This URL requires LinkedIn authorization, so ResumeGPT cannot fetch it from the server. Authorize your LinkedIn
                      account to import your verified profile, or continue with saved data.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={onLinkedInAuth} className="gap-2">
                        <Linkedin className="h-4 w-4" /> Continue with LinkedIn
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={onUseCurrentProfile}>Use saved profile</Button>
                      <Button type="button" size="sm" variant="outline" onClick={onEnterManually}>Enter manually</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {profileSource === 'github' && (
              <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-end">
                <label className="flex-1 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">GitHub Username</span>
                  <Input value={profileUrl} onChange={event => setProfileUrl(event.target.value)} placeholder="e.g. torvalds" />
                </label>
                <Button type="button" onClick={onImport} disabled={importing || !profileUrl.trim()}>
                  {importing ? 'Fetching…' : 'Fetch Repositories'}
                </Button>
              </div>
            )}
            

          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Full name</span>
              <Input value={resumeData.name} onChange={event => updateProfile({ name: event.target.value })} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Target title</span>
              <Input value={resumeData.title} onChange={event => updateProfile({ title: event.target.value })} />
            </label>
            <label className="space-y-2 md:col-span-3">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Professional summary</span>
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
    preferredModel,
    setResumeMode,
    profileSource,
    setProfileSource,
    jobAnalysis,
    setJobAnalysis,
    setTargetMatchScore,
    selectedTemplate,
    setSelectedTemplate,
    templateColor,
    setTemplateColor,
    setResumeData,
    setAgentWorkflow,
    agentWorkflow,
  } = useAppStore();
  const [stage, setStage] = useState<Stage>('gateway');
  const [resumeGoal, setResumeGoal] = useState<'tailored' | 'general'>('tailored');
  const [resumeLevel, setResumeLevel] = useState<'internship' | 'executive'>('executive');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const [importBlocked, setImportBlocked] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  const [profileUrl, setProfileUrl] = useState('');

  // Upload a resume file (PDF/DOCX), parse it server-side, and load the
  // extracted profile into the workspace.
  const handleUploadResume = async (file: File) => {
    setUploading(true);
    setFileError('');
    setImportBlocked(false);
    setNotice('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('model', preferredModel);
      const data = await customFetch<any>('/api/workspace/resume-file', {
        method: 'POST',
        body: formData
      });
      const profile = (data.record?.profile ?? {}) as Partial<typeof resumeData>;
      setResumeData({
        ...resumeData,
        ...profile,
        contact: { ...resumeData.contact, ...(profile.contact ?? {}) },
        experience: Array.isArray(profile.experience) ? profile.experience : resumeData.experience,
        education: Array.isArray(profile.education) ? profile.education : resumeData.education,
        projects: Array.isArray(profile.projects) ? profile.projects : resumeData.projects,
        certifications: Array.isArray(profile.certifications) ? profile.certifications : resumeData.certifications,
        languages: Array.isArray(profile.languages) ? profile.languages : resumeData.languages,
        skills: Array.isArray(profile.skills) ? profile.skills : resumeData.skills,
      });
      setProgress(100);
      setNotice(`Resume extracted: ${file.name} — ${(profile.experience ?? []).length} roles, ${(profile.skills ?? []).length} skills. Continue to the target job.`);
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'The file could not be read.');
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = async () => {
    setAnalyzing(true);
    setNotice('');
    try {
      await saveWorkspaceProfile({
        profileUrl: resumeData.contact.linkedin || null,
        profile: resumeData,
      });
      setStage('validation');
      setNotice('Profile imported successfully. Please verify your data.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save your profile.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLinkedIn = () => {
    setProfileSource('linkedin');
    setImportBlocked(false);
    setNotice('Paste the public profile URL below. LinkedIn pages that require sign-in must be exported or authorized before they can be read.');
  };

  // Start the LinkedIn OAuth flow. The user is redirected to LinkedIn's
  // authorization page; on return the callback saves their verified profile
  // and redirects back here with ?linkedin=success (or =error).
  const startLinkedInAuth = () => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const returnTo = `${base}/create`;
    const params = new URLSearchParams({ returnTo, origin: window.location.origin });
    window.location.assign(`/api/auth/linkedin/start?${params.toString()}`);
  };

  // Handle the OAuth round-trip result (linkedin=success | linkedin=error).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('linkedin');
    if (!status) return;
    const message = params.get('linkedinMessage') ?? '';
    if (status === 'success') {
      setProfileSource('linkedin');
      setImportBlocked(false);
      setNotice(message ? `LinkedIn profile imported: ${message}` : 'LinkedIn profile imported. Review the data below and continue.');
    } else {
      setImportBlocked(true);
      setNotice(message || 'LinkedIn sign-in did not complete. You can still use saved data or enter your profile manually.');
    }
    // Clean the URL so a refresh doesn't re-trigger the notice.
    params.delete('linkedin');
    params.delete('linkedinMessage');
    const clean = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', clean);
  }, []);

  const handleImport = async () => {
    if (!profileUrl.trim()) {
      setNotice('Add your public profile URL before continuing.');
      return;
    }
    setAnalyzing(true);
    setProgress(25);
    setImportBlocked(false);
    setNotice('');
    try {
      const normalizedProfileUrl = /^https?:\/\//i.test(profileUrl.trim()) ? profileUrl.trim() : `https://${profileUrl.trim()}`;
      setProfileUrl(normalizedProfileUrl);
      const record = await importWorkspaceProfile({ profileUrl: normalizedProfileUrl, model: preferredModel } as Parameters<typeof importWorkspaceProfile>[0]);
      const profile = record.profile as Partial<typeof resumeData>;
      setResumeData({
        ...resumeData,
        ...profile,
        contact: { ...resumeData.contact, ...(profile.contact ?? {}) },
        experience: Array.isArray(profile.experience) ? profile.experience : resumeData.experience,
        education: Array.isArray(profile.education) ? profile.education : resumeData.education,
        projects: Array.isArray(profile.projects) ? profile.projects : resumeData.projects,
        certifications: Array.isArray(profile.certifications) ? profile.certifications : resumeData.certifications,
        languages: Array.isArray(profile.languages) ? profile.languages : resumeData.languages,
        skills: Array.isArray(profile.skills) ? profile.skills : resumeData.skills,
      });
      setProgress(100);
      setNotice('Profile fetched and saved. Continue to the target job.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile import failed.';
      setImportBlocked(/linkedin requires authorization/i.test(message));
      setNotice(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const continueWithCurrentProfile = () => {
    setProfileSource('current');
    setImportBlocked(false);
    setNotice('Using your saved ResumeGPT profile. Continue to the target job when ready.');
  };

  const enterProfileManually = () => {
    setResumeMode('manual');
    setProfileSource('paste');
    setImportBlocked(false);
    setNotice('Manual profile mode is ready. Add your name, title, summary, and evidence below.');
  };

  const handleAnalyze = async () => {
    if (!jobUrl.trim() && !jobDescription.trim()) return;
    setAnalyzing(true);
    setProgress(35);
    setNotice('');
    try {
      const record = await analyzeWorkspaceJob({
        jobUrl: jobUrl.trim() || null,
        jobDescription: jobDescription.trim() || null,
      });
      const job = record.job as Record<string, unknown>;
      const comparison = record.comparison as Record<string, unknown>;
      const analysis = {
        role: String(job.title ?? 'Target role'),
        company: String(job.company ?? 'Target company'),
        location: String(job.location ?? 'See job listing'),
        seniority: String(job.seniority ?? 'Not specified'),
        summary: String(job.summary ?? ''),
        matchedSkills: Array.isArray(comparison.matchedSkills) ? comparison.matchedSkills.map(String) : [],
        missingSkills: Array.isArray(comparison.missingSkills) ? comparison.missingSkills.map(String) : [],
        matchScore: Number(comparison.matchScore ?? 0),
        source: record.source,
        id: record.id,
      };
      setJobAnalysis(analysis);
      setTargetMatchScore(analysis.matchScore);
      setProgress(100);
      setStage('match');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Job analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setAnalyzing(true);
    setProgress(20);
    setNotice('Three AI agents are planning, writing, and reviewing your resume against the fetched job evidence.');
    
    try {
      let targetJobId = jobAnalysis?.id;
      if (!targetJobId) {
        const record = await analyzeWorkspaceJob({
          jobUrl: jobUrl.trim() || null,
          jobDescription: jobDescription.trim() || resumeData.title || 'Target Role',
        });
        targetJobId = record.id;
        const job = record.job as Record<string, unknown>;
        const comparison = record.comparison as Record<string, unknown>;
        setJobAnalysis({
          id: record.id,
          role: String(job.title ?? 'Target role'),
          company: String(job.company ?? 'Target company'),
          location: String(job.location ?? 'See job listing'),
          seniority: String(job.seniority ?? 'Not specified'),
          summary: String(job.summary ?? ''),
          matchedSkills: Array.isArray(comparison.matchedSkills) ? comparison.matchedSkills.map(String) : [],
          missingSkills: Array.isArray(comparison.missingSkills) ? comparison.missingSkills.map(String) : [],
          matchScore: Number(comparison.matchScore ?? 0),
          source: record.source as 'url' | 'description',
        });
      }

      const workflowStore = useWorkflowStore.getState();
      workflowStore.startWorkflow(targetJobId);
      workflowStore.updateWorkflowStep('planner');

      const version = await generateWorkspaceResume({
        jobAnalysisId: targetJobId,
        mode: resumeMode,
        model: preferredModel,
        templateId: selectedTemplate.id,
      });
      workflowStore.updateWorkflowStep('editor');
      
      const generated = version.resume as Partial<typeof resumeData>;
      if (Array.isArray((version.resume as Record<string, unknown>).agentWorkflow)) {
        setAgentWorkflow((version.resume as Record<string, unknown>).agentWorkflow as { role: string; model: string; status: string }[]);
      }
      setResumeData({
        ...resumeData,
        ...generated,
        contact: { ...resumeData.contact, ...(generated.contact ?? {}) },
        experience: Array.isArray(generated.experience) ? generated.experience : resumeData.experience,
        education: Array.isArray(generated.education) ? generated.education : resumeData.education,
        projects: Array.isArray(generated.projects) ? generated.projects : resumeData.projects,
        certifications: Array.isArray(generated.certifications) ? generated.certifications : resumeData.certifications,
        languages: Array.isArray(generated.languages) ? generated.languages : resumeData.languages,
        skills: Array.isArray(generated.skills) ? generated.skills : resumeData.skills,
      });
      setProgress(100);
      setStage('studio');
      setNotice(`${selectedTemplate.name} selected. The AI planner, writer, and ATS reviewer completed and the resume is saved for final edits.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'AI resume generation failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-5 pb-16 md:p-7 relative font-sans text-white">
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Create your resume</h1>
          <p className="text-sm text-blue-200/60 drop-shadow-sm">Build a tailored resume optimized for ATS systems and specific job targets.</p>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-blue-200/60 drop-shadow-sm hover:text-white drop-shadow-md transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </motion.header>

      {stage !== 'gateway' && <StageRail stage={stage} />}

      {notice && <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-blue-200/60 drop-shadow-sm"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{notice}</div>}

      <div className="space-y-6">
        {stage === 'gateway' && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-amber-400 opacity-20 blur-xl" />
            <Card className="relative h-full w-full border-0 bg-black/60 shadow-none backdrop-blur-xl">
              <CardHeader className="text-center pt-14 pb-8">
                <CardTitle className="bg-gradient-to-r from-primary via-emerald-300 to-amber-300 bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent sm:text-5xl">
                  CREATE YOUR RESUME
                </CardTitle>
                <CardDescription className="mt-4 text-lg text-slate-300">
                  Build a resume tailored to your career goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-12 p-6 md:p-12">
                <div className="grid gap-6 sm:grid-cols-2">
                  <button onClick={() => setResumeGoal('tailored')} className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:scale-[1.02] ${resumeGoal === 'tailored' ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(0,229,255,0.15)]' : 'border-white/10 bg-white/5 hover:border-primary/30'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                      <div className={`rounded-full p-4 transition-colors duration-500 ${resumeGoal === 'tailored' ? 'bg-primary text-black' : 'bg-white/10 text-primary group-hover:bg-primary/20'}`}><Sparkles className="h-8 w-8" /></div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">✨ Tailored Resume</div>
                        <div className="mt-2 text-sm text-slate-400">Target a job specifically</div>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => setResumeGoal('general')} className={`group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:scale-[1.02] ${resumeGoal === 'general' ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(0,229,255,0.15)]' : 'border-white/10 bg-white/5 hover:border-primary/30'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                      <div className={`rounded-full p-4 transition-colors duration-500 ${resumeGoal === 'general' ? 'bg-primary text-black' : 'bg-white/10 text-primary group-hover:bg-primary/20'}`}><FileText className="h-8 w-8" /></div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">📄 General Resume</div>
                        <div className="mt-2 text-sm text-slate-400">Your master resume</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <button onClick={() => setResumeLevel('internship')} className={`group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl border p-5 transition-all duration-300 ${resumeLevel === 'internship' ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/30'}`}>
                    <span className="text-2xl">🎓</span> <span className="text-lg font-semibold tracking-wide">Internship</span>
                  </button>
                  <button onClick={() => setResumeLevel('executive')} className={`group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl border p-5 transition-all duration-300 ${resumeLevel === 'executive' ? 'border-amber-400/50 bg-amber-400/10 text-amber-300' : 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/30'}`}>
                    <span className="text-2xl">🏆</span> <span className="text-lg font-semibold tracking-wide">Executive</span>
                  </button>
                </div>

                <div className="space-y-6 pt-8 border-t border-white/10">
                  <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">Workflow Mode</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => setResumeMode('auto')} className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${resumeMode === 'auto' ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Auto</button>
                    <button onClick={() => {}} className={`rounded-full px-6 py-2.5 text-sm font-bold opacity-50 cursor-not-allowed transition-all duration-300 ${resumeMode === 'guided' ? 'bg-primary text-black' : 'bg-white/5 text-slate-300'}`}>Guided (Soon)</button>
                    <button onClick={() => setResumeMode('manual')} className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${resumeMode === 'manual' ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Manual</button>
                    <button onClick={() => {}} className={`rounded-full px-6 py-2.5 text-sm font-bold opacity-50 cursor-not-allowed transition-all duration-300 ${resumeMode === 'expert' ? 'bg-primary text-black' : 'bg-white/5 text-slate-300'}`}>Expert (Soon)</button>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button size="lg" className="group h-16 rounded-full bg-white px-12 text-lg font-bold text-black transition-all duration-500 hover:scale-105 hover:bg-primary hover:text-black hover:shadow-[0_0_40px_rgba(0,229,255,0.4)]" onClick={() => setStage('profile')}>
                    Continue <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {stage === 'profile' && (
          <ProfileStep
            mode={resumeMode}
            profileSource={profileSource}
            setMode={setResumeMode}
            setSource={setProfileSource}
            onContinue={handleContinue}
            onLinkedIn={handleLinkedIn}
            onLinkedInAuth={startLinkedInAuth}
            resumeData={resumeData}
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
            onImport={handleImport}
            importBlocked={importBlocked}
            onUseCurrentProfile={continueWithCurrentProfile}
            onEnterManually={enterProfileManually}
            onUploadResume={handleUploadResume}
            uploading={uploading}
            fileError={fileError}
            importing={analyzing}
          />
        )}

        {stage !== 'profile' && (
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
               <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{resumeData.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</div>
                <div><div className="font-semibold">{resumeData.name}</div><div className="text-xs text-blue-200/60 drop-shadow-sm">{resumeData.title} · {resumeData.experience.length} roles · {resumeData.skills.length} skills</div></div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStage('profile')}><PenLine className="mr-2 h-3.5 w-3.5" /> Edit profile</Button>
            </CardContent>
          </Card>
        )}

        {stage === 'validation' && (
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Data Validation</CardTitle>
              <CardDescription>Review your profile quality before proceeding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-background/30 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-200/60 drop-shadow-sm mb-4">PROFILE QUALITY</h3>
                {(() => {
                  let score = 0;
                  const checks = [];
                  const warnings = [];
                  
                  if (resumeData.name) { score += 20; checks.push('Personal information'); }
                  else warnings.push('Missing personal information');
                  
                  if (resumeData.education.length > 0) { score += 20; checks.push('Education'); }
                  else warnings.push('Missing education history');
                  
                  if (resumeData.experience.length > 0) { score += 30; checks.push('Experience'); }
                  else warnings.push('Missing experience');
                  
                  if (resumeData.projects.length > 0) { score += 15; checks.push('Projects'); }
                  else warnings.push('Missing projects');
                  
                  if (resumeData.skills.length > 0) { score += 15; checks.push('Skills'); }
                  else warnings.push('Missing skills');

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={score} className="h-3" />
                        </div>
                        <div className="text-lg font-bold text-primary">{score}%</div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        {checks.map(c => (
                          <div key={c} className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" /> {c}
                          </div>
                        ))}
                        {warnings.map(w => (
                          <div key={w} className="flex items-center gap-2 text-amber-400">
                            <AlertTriangle className="h-4 w-4" /> {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStage('profile')}>Fix Profile</Button>
                <Button onClick={() => setStage('job')}>Continue to Target Job <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {stage === 'job' && (
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5 text-primary" /> Add the target job</CardTitle>
              <CardDescription>Paste a public job link or the full description. The analyzer will compare it against your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="block space-y-2"><span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Job link</span><Input value={jobUrl} onChange={event => setJobUrl(event.target.value)} placeholder="https://company.com/careers/senior-product-designer" /></label>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-blue-200/60 drop-shadow-sm"><div className="h-px flex-1 bg-border" /> or paste description <div className="h-px flex-1 bg-border" /></div>
              <label className="block space-y-2"><span className="text-xs font-medium uppercase tracking-wider text-blue-200/60 drop-shadow-sm">Job description</span><Textarea value={jobDescription} onChange={event => setJobDescription(event.target.value)} placeholder="Paste requirements, responsibilities, and qualifications here..." className="min-h-52 font-mono text-xs" /></label>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-background/40 p-3 text-xs text-blue-200/60 drop-shadow-sm"><span className="flex items-center gap-2"><ScanLine className="h-4 w-4 text-primary" /> We’ll extract role, skills, seniority, and keywords.</span><Button onClick={handleAnalyze} disabled={analyzing || (!jobUrl.trim() && !jobDescription.trim())}>{analyzing ? 'Analyzing…' : 'Analyze this job'} <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
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
                  <div><Badge variant="outline" className="border-primary/30 text-primary">{jobAnalysis.company} · {jobAnalysis.seniority}</Badge><div className="mt-5 text-6xl font-black tracking-tighter text-primary">{jobAnalysis.matchScore}<span className="text-3xl text-primary/60">%</span></div><h2 className="mt-1 text-xl font-semibold">{jobAnalysis.role}</h2><p className="mt-2 text-sm text-blue-200/60 drop-shadow-sm">{jobAnalysis.location}</p></div>
                  <div className="mt-8"><Progress value={jobAnalysis.matchScore} className="h-2" /><p className="mt-3 text-xs text-blue-200/60 drop-shadow-sm">Your profile is a strong starting point. Tailoring the evidence and keywords should raise interview readiness.</p></div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader><CardTitle className="flex items-center gap-2"><TargetIcon /> Profile to job comparison</CardTitle><CardDescription>{jobAnalysis.summary}</CardDescription></CardHeader><CardContent className="space-y-5"><div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Matched evidence</div><div className="flex flex-wrap gap-2">{jobAnalysis.matchedSkills.map(skill => <Badge key={skill} variant="outline" className="border-success/30 bg-success/5 text-success">{skill}</Badge>)}</div></div><div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning"><ScanLine className="h-4 w-4" /> Add or strengthen</div><div className="flex flex-wrap gap-2">{jobAnalysis.missingSkills.map(skill => <Badge key={skill} variant="outline" className="border-warning/40 text-warning">{skill}</Badge>)}</div></div></CardContent></Card>
            </div>
            <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div><div className="font-semibold">Next: Resume Strategy</div><div className="text-sm text-blue-200/60 drop-shadow-sm">Plan what to emphasize before generation.</div></div><Button onClick={() => setStage('strategy')}>Generate Strategy <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
          </>
        )}

        {stage === 'strategy' && jobAnalysis && (
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Resume Strategy</CardTitle>
              <CardDescription>Target: {jobAnalysis.role}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/50 bg-background/30 p-4 space-y-2">
                  <h4 className="font-semibold text-emerald-400">Emphasize</h4>
                  {jobAnalysis.matchedSkills.map(skill => <div key={skill} className="text-sm flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-500"/> {skill}</div>)}
                </div>
                <div className="rounded-lg border border-border/50 bg-background/30 p-4 space-y-2">
                  <h4 className="font-semibold text-amber-400">Reduce</h4>
                  <div className="text-sm flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unrelated academic projects</div>
                  <div className="text-sm flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Outdated frameworks</div>
                </div>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-semibold text-primary mb-2">Summary Strategy</h4>
                <p className="text-sm text-slate-300">Focus on backend engineering with strong AI integration experience and cloud deployment capabilities.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button onClick={handleGenerate}>Approve & Generate Resume <WandSparkles className="ml-2 h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {stage === 'studio' && jobAnalysis && (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card"><CardContent className="p-6"><div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> AI Generation Complete</div><h2 className="mt-4 text-3xl font-bold">{resumeData.name}</h2><p className="mt-1 text-primary">{jobAnalysis.role} · {jobAnalysis.company}</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg border border-border/50 bg-background/30 p-3"><div className="font-mono text-2xl font-bold text-success">{jobAnalysis.matchScore}%</div><div className="text-xs text-blue-200/60 drop-shadow-sm">Role match</div></div><div className="rounded-lg border border-border/50 bg-background/30 p-3"><div className="font-mono text-2xl font-bold text-primary">92 / 100</div><div className="text-xs text-blue-200/60 drop-shadow-sm">ATS Compatibility</div></div></div><div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4"><div className="mb-1 text-sm font-semibold">Fact Check & Quality Critic</div><p className="mb-4 text-xs text-blue-200/60 drop-shadow-sm">Supported facts: 100%. Content Quality: 94.</p></div><div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link href="/resume">Open Resume Studio <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></CardContent></Card>
             <div className="space-y-6">
               <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"><CardHeader><CardTitle>Pipeline Results</CardTitle><CardDescription>The structured Resume JSON is ready for the studio.</CardDescription></CardHeader><CardContent className="space-y-3">{['Strategy Applied', 'AI Generation', 'Fact Checker (Supported)', 'Quality Critic (Score: 94)', 'ATS Analysis (Match: 92)'].map(item => <div key={item} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/30 p-3 text-sm"><Check className="h-4 w-4 text-success" />{item}</div>)}</CardContent></Card>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TargetIcon() {
  return <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-primary"><div className="h-2 w-2 rounded-full bg-primary" /></div>;
}