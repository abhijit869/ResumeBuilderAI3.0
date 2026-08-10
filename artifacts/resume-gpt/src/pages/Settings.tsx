import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2, CheckCircle2, Cpu, Palette, Shield,
  Bell, User, KeyRound, Eye, RotateCcw,
  ChevronRight, AlertTriangle, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

/* ── Settings section wrapper ──────────────────────────────────────── */
function SettingsSection({
  title, description, icon: Icon, children, danger = false,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className={cn(
      'fluent-surface overflow-hidden border border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl',
      danger && 'border-destructive/20 bg-destructive/2',
    )}>
      {/* Section header */}
      <div className={cn(
        'px-5 py-4 border-b border-white/10 flex items-center gap-3',
        danger && 'border-destructive/15',
      )}>
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
          danger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className={cn('text-sm font-semibold', danger && 'text-destructive')}>{title}</h3>
          <p className="text-[11px] text-blue-200/60 drop-shadow-sm">{description}</p>
        </div>
      </div>
      {/* Section content */}
      <div className="divide-y divide-white/10">
        {children}
      </div>
    </div>
  );
}

/* ── Settings row ──────────────────────────────────────────────────── */
function SettingsRow({
  label, description, children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <div className="flex-1 min-w-0 mr-6">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-[11px] text-blue-200/60 drop-shadow-sm mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ── Model card ────────────────────────────────────────────────────── */
const models = [
  { id: 'deepseek-v4-flash-free', name: 'DeepSeek V4 Flash', speed: 'Fast', quality: 'High', cost: 'Free', icon: '⚡' },
  { id: 'ling-3.0-flash-free',    name: 'Ling 3.0 Flash',    speed: 'Fast', quality: 'Good', cost: 'Free', icon: '🌊' },
  { id: 'nemotron-3-ultra-free',  name: 'Nemotron 3 Ultra',  speed: 'Slow', quality: 'Best', cost: 'Free', icon: '🔮' },
  { id: 'mimo-v2.5-free',         name: 'Mimo V2.5',         speed: 'Fast', quality: 'Good', cost: 'Free', icon: '✨' },
];

function ModelCard({
  model, selected, onSelect,
}: {
  model: typeof models[0]; selected: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'mode-card text-left w-full',
        selected && 'selected',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">{model.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{model.name}</span>
            {selected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-blue-200/60 drop-shadow-sm">
              ⚡ {model.speed}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-blue-200/60 drop-shadow-sm">
              ★ {model.quality}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">
              {model.cost}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SETTINGS PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Settings() {
  const {
    preferredModel, setPreferredModel,
    templateColor, setTemplateColor,
    setResumeData, setJobAnalysis, setTargetMatchScore, setAtsScore,
  } = useAppStore();

  const [cleared, setCleared] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'appearance' | 'privacy' | 'account'>('ai');

  const handleResetWorkspace = () => {
    if (!window.confirm('Are you sure you want to reset your saved profile and job analysis data?')) return;
    setResumeData({
      name: '', title: '', summary: '',
      contact: { email: '', phone: '', location: '', linkedin: '' },
      experience: [], education: [], projects: [],
      certifications: [], languages: [], skills: [],
    });
    setJobAnalysis(null);
    setTargetMatchScore(0);
    setAtsScore(0);
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  const tabs = [
    { id: 'ai' as const,         label: 'AI & Models',  icon: Cpu },
    { id: 'appearance' as const, label: 'Appearance',   icon: Palette },
    { id: 'privacy' as const,    label: 'Privacy',      icon: Shield },
    { id: 'account' as const,    label: 'Account',      icon: User },
  ];

  return (
    <div className="p-5 md:p-7 max-w-[900px] mx-auto relative font-sans text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[0%] right-[0%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      {/* ── Header ── */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs text-blue-200/60 drop-shadow-sm mt-0.5">
          Manage AI models, appearance, privacy, and workspace configuration.
        </p>
      </motion.header>

      {/* ── Tab bar ── */}
      <div
        className="flex gap-1 p-1 rounded-xl bg-black/30 border border-white/10 backdrop-blur-md mb-6 overflow-x-auto"
        style={{ animation: 'slide-up 0.4s cubic-bezier(0.22,1,0.36,1) 60ms both' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`settings-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 shrink-0',
              activeTab === tab.id
                ? 'bg-background text-white drop-shadow-md shadow-sm border border-white/10'
                : 'text-blue-200/60 drop-shadow-sm hover:text-white drop-shadow-md hover:bg-background/50',
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── AI & Models tab ── */}
      {activeTab === 'ai' && (
        <div
          className="space-y-5 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <SettingsSection
            title="Primary AI Model"
            description="Choose the default model for resume generation and job analysis."
            icon={Cpu}
          >
            <div className="p-5">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {models.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    selected={preferredModel === model.id}
                    onSelect={() => setPreferredModel(model.id)}
                  />
                ))}
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-200/60 drop-shadow-sm leading-relaxed">
                  Model changes take effect immediately. The AI router will automatically use the best available
                  model for each specific task (parsing, writing, validation).
                </p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="API Keys"
            description="Configure custom API keys for AI generation."
            icon={KeyRound}
          >
            <div className="p-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gemini-key" className="text-sm font-medium">Google Gemini API Key</Label>
                <p className="text-[11px] text-blue-200/60 drop-shadow-sm leading-relaxed">
                  Required to use Gemini models. Your key is stored securely in your browser's local storage and is only sent to the ResumeGPT backend to proxy requests to Google.
                </p>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    id="gemini-key"
                    type="password"
                    placeholder="AIzaSy..."
                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    defaultValue={typeof window !== "undefined" ? window.localStorage.getItem("resumegpt-gemini-key") || "" : ""}
                    onChange={(e) => {
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem("resumegpt-gemini-key", e.target.value.trim());
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            title="AI Behavior"
            description="Control how the AI processes and generates content."
            icon={Cpu}
          >
            <SettingsRow
              label="Workflow mode"
              description="How much control you have over each AI step."
            >
              <Select defaultValue="auto">
                <SelectTrigger id="workflow-mode-select" className="w-[140px] h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="guided">Guided</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </SettingsRow>

            <SettingsRow
              label="AI transparency"
              description="Show reasoning and source attribution for AI changes."
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-5 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
            </SettingsRow>

            <SettingsRow
              label="Fact checking"
              description="AI will flag unverifiable claims before export."
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-5 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                </div>
              </div>
            </SettingsRow>
          </SettingsSection>
        </div>
      )}

      {/* ── Appearance tab ── */}
      {activeTab === 'appearance' && (
        <div
          className="space-y-5 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <SettingsSection
            title="Theme & Colors"
            description="Customize the visual appearance of your workspace."
            icon={Palette}
          >
            <SettingsRow
              label="Application theme"
              description="Choose between dark, light, or system-matched theme."
            >
              <Select defaultValue="dark">
                <SelectTrigger id="theme-select" className="w-[120px] h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </SettingsRow>

            <SettingsRow
              label="Resume accent color"
              description="Default accent color used in PDF and preview layouts."
            >
              <div className="flex items-center gap-3">
                <input
                  id="theme-color-picker"
                  type="color"
                  value={templateColor}
                  onChange={e => setTemplateColor(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                />
                <span className="font-mono text-[11px] text-blue-200/60 drop-shadow-sm uppercase">{templateColor}</span>
              </div>
            </SettingsRow>

            <SettingsRow
              label="Accent presets"
              description="Quick color presets for the resume accent."
            >
              <div className="flex gap-2">
                {['#2563eb', '#7c3aed', '#059669', '#ea580c', '#db2777'].map(color => (
                  <button
                    key={color}
                    onClick={() => setTemplateColor(color)}
                    className={cn(
                      'w-6 h-6 rounded-full transition-all',
                      templateColor === color && 'ring-2 ring-offset-1 ring-offset-background ring-border scale-110',
                    )}
                    style={{ background: color }}
                    title={color}
                  />
                ))}
              </div>
            </SettingsRow>
          </SettingsSection>

          <SettingsSection
            title="Motion & Animation"
            description="Control animation preferences."
            icon={Palette}
          >
            <SettingsRow
              label="Reduced motion"
              description="Minimizes animations. Respects system preference automatically."
            >
              <div className="w-9 h-5 rounded-full bg-muted border border-border relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-background shadow" />
              </div>
            </SettingsRow>
          </SettingsSection>
        </div>
      )}

      {/* ── Privacy tab ── */}
      {activeTab === 'privacy' && (
        <div
          className="space-y-5 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <SettingsSection
            title="Data Privacy"
            description="Control how your career data is stored and processed."
            icon={Shield}
          >
            <SettingsRow
              label="Local processing only"
              description="Resume data stays in your session and is never sent to third-party training pipelines."
            >
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
              </span>
            </SettingsRow>

            <SettingsRow
              label="Data retention"
              description="Your workspace data is retained only for your active session."
            >
              <span className="text-xs text-blue-200/60 drop-shadow-sm">Session only</span>
            </SettingsRow>
          </SettingsSection>

          {/* Danger zone */}
          <SettingsSection
            title="Workspace Reset"
            description="Permanently clear saved profile, job analysis, and resume draft."
            icon={AlertTriangle}
            danger
          >
            <div className="p-5">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/5 border border-destructive/15 mb-4">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/60 drop-shadow-sm leading-relaxed">
                  This action resets your profile evidence, target job match scores, and current resume draft.
                  This cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-200/60 drop-shadow-sm">All workspace data will be cleared.</p>
                <Button
                  id="reset-workspace-btn"
                  variant="destructive"
                  size="sm"
                  onClick={handleResetWorkspace}
                  className="h-8 px-4 rounded-lg text-xs gap-1.5"
                >
                  {cleared
                    ? <><CheckCircle2 className="h-3.5 w-3.5" /> Reset</>
                    : <><RotateCcw className="h-3.5 w-3.5" /> Reset Workspace</>
                  }
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* ── Account tab ── */}
      {activeTab === 'account' && (
        <div
          className="space-y-5 animate-fade-in"
          style={{ animationFillMode: 'both' }}
        >
          <SettingsSection
            title="Account"
            description="Manage your ResumeGPT account details."
            icon={User}
          >
            <SettingsRow label="Authentication" description="Managed by Clerk secure sign-in.">
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <Shield className="h-3.5 w-3.5" /> Secured
              </span>
            </SettingsRow>
            <SettingsRow label="Plan" description="Current workspace plan.">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted border border-border text-blue-200/60 drop-shadow-sm">
                Free
              </span>
            </SettingsRow>
          </SettingsSection>

          <SettingsSection
            title="Notifications"
            description="Control when and how you receive updates."
            icon={Bell}
          >
            <SettingsRow label="AI completion alerts" description="Notify when a long-running AI task finishes.">
              <div className="w-9 h-5 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </SettingsRow>
            <SettingsRow label="Export complete" description="Notify when PDF/DOCX export is ready.">
              <div className="w-9 h-5 rounded-full bg-primary relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </SettingsRow>
          </SettingsSection>

          <SettingsSection
            title="Keyboard Shortcuts"
            description="Available keyboard shortcuts in the workspace."
            icon={KeyRound}
          >
            <div className="p-5 space-y-2.5">
              {[
                { keys: ['⌘', 'K'], label: 'Open command palette' },
                { keys: ['⌘', 'S'], label: 'Save resume' },
                { keys: ['⌘', 'Z'], label: 'Undo' },
                { keys: ['⌘', 'Shift', 'Z'], label: 'Redo' },
                { keys: ['⌘', 'E'], label: 'Export PDF' },
              ].map(({ keys, label }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-blue-200/60 drop-shadow-sm">{label}</span>
                  <div className="flex items-center gap-1">
                    {keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="text-[10px] font-mono bg-muted border border-border rounded px-1.5 py-0.5 text-white drop-shadow-md"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>
        </div>
      )}
    </div>
  );
}
