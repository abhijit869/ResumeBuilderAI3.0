import { Link } from 'wouter';
import {
  ArrowRight, Sparkles, FileText, Target, Activity,
  CheckCircle2, ChevronRight, Zap, TrendingUp, Clock,
  Star, Award, Flame, WandSparkles, BarChart3,
  Briefcase, FileCode2, Plus, ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/* ── Mini sparkline ─────────────────────────────────────────────────── */
function Sparkline({ values, color = '#3b82f6' }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 72; const H = 24;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`url(#spark-gradient)`} />
      <defs>
        <linearGradient id="spark-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Score ring ─────────────────────────────────────────────────────── */
function ScoreRing({
  value, size = 72, stroke = 5,
  color = '#3b82f6', label,
}: {
  value: number; size?: number; stroke?: number;
  color?: string; label: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size} height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(.22,1,.36,1)', filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold leading-none text-white drop-shadow-md">{value || '—'}</span>
        </div>
      </div>
      <span className="text-[10px] text-blue-200/70 font-bold uppercase tracking-wider drop-shadow-sm">{label}</span>
    </div>
  );
}

/* ── Quick action button ─────────────────────────────────────────────── */
function QuickAction({
  href, icon: Icon, label, color,
}: {
  href: string; icon: React.ElementType; label: string; color: string;
}) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
        'group flex flex-col items-center gap-2 p-3.5 rounded-2xl cursor-pointer',
        'border border-white/10 bg-white/5 hover:bg-white/10',
        'hover:border-blue-500/30 transition-all duration-300',
        'shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)] backdrop-blur-xl',
      )}>
        <div className={cn('h-10 w-10 flex items-center justify-center rounded-xl shadow-inner border border-white/5 transition-colors duration-300', color)}>
          <Icon className="h-5 w-5 drop-shadow-sm" />
        </div>
        <span className="text-[11px] font-bold text-blue-100/70 group-hover:text-white transition-colors text-center leading-tight drop-shadow-sm">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

/* ── Metric card ─────────────────────────────────────────────────────── */
function MetricCard({
  icon: Icon, label, value, sub, trend, accentClass, delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: string;
  trend?: number;
  accentClass: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="relative p-5 rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl overflow-hidden group hover:border-blue-500/30 hover:bg-black/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shadow-inner border border-white/10 transition-colors', accentClass)}>
            <Icon className="h-5 w-5 drop-shadow-sm" />
          </div>
          {trend !== undefined && (
            <span className={cn(
              'flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-md',
              trend >= 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30',
            )}>
              <TrendingUp className={cn('h-3 w-3', trend < 0 && 'rotate-180')} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="text-3xl font-extrabold tracking-tight mb-1 text-white drop-shadow-lg">{value}</div>
        <div className="text-[11px] font-bold text-blue-200/60 uppercase tracking-widest mb-1 drop-shadow-sm">{label}</div>
        {sub && <div className="text-[11px] font-medium text-blue-200/50 line-clamp-2 mt-1.5 leading-relaxed">{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ── Recommendation item ─────────────────────────────────────────────── */
function RecoItem({
  icon: Icon, title, desc, type, href, color,
}: {
  icon: React.ElementType;
  title: string; desc: string; type: string; href: string;
  color: 'primary' | 'accent' | 'warning';
}) {
  const iconColors = {
    primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500/30 group-hover:text-blue-300',
    accent:  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/30 group-hover:text-indigo-300',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/30 group-hover:text-amber-300',
  };
  const typeColors = {
    primary: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    accent:  'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };
  return (
    <Link href={href}>
      <div className={cn(
        'group flex items-start gap-4 p-4 rounded-xl cursor-pointer',
        'border border-white/5 bg-white/5 hover:bg-white/10',
        'hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)] backdrop-blur-lg',
      )}>
        <div className={cn('shrink-0 flex h-10 w-10 items-center justify-center rounded-xl mt-0.5 border shadow-inner transition-colors duration-300', iconColors[color])}>
          <Icon className="h-5 w-5 drop-shadow-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest shadow-sm', typeColors[color])}>
              {type}
            </span>
            <h4 className="text-sm font-bold text-white drop-shadow-md">{title}</h4>
          </div>
          <p className="text-xs font-medium text-blue-100/70 line-clamp-2 leading-relaxed drop-shadow-sm">{desc}</p>
        </div>
        <ChevronRight className="shrink-0 h-5 w-5 text-blue-200/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-1" />
      </div>
    </Link>
  );
}

/* ── Activity item ──────────────────────────────────────────────────── */
function ActivityItem({
  time, text, isLast = false,
}: { time: string; text: string; isLast?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative shrink-0 pt-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        {!isLast && (
          <div className="absolute top-3.5 left-1 -translate-x-[1px] w-[2px] h-10 bg-gradient-to-b from-blue-500/50 to-transparent" />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-4">
        <div className="text-[9px] font-bold text-blue-300/80 mb-1 uppercase tracking-widest drop-shadow-sm">{time}</div>
        <div className="text-xs font-bold text-blue-100/90 line-clamp-2 drop-shadow-md">{text}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { resumeData, atsScore, targetMatchScore } = useAppStore();
  const firstName = resumeData.name.trim().split(' ')[0] || 'there';

  const completeness = Math.round(
    (resumeData.name ? 25 : 0) +
    (resumeData.experience.length > 0 ? 35 : 0) +
    (resumeData.skills.length > 0 ? 25 : 0) +
    (resumeData.summary.length > 40 ? 15 : 0),
  );

  const recommendations = [
    resumeData.experience.length === 0
      ? { title: 'Add your first experience', desc: 'Add roles and evidence so the analyzer can compare your background.', type: 'Profile', href: '/resume', icon: FileText, color: 'primary' as const }
      : { title: 'Strengthen your evidence', desc: 'Add measurable outcomes supported by your real experience.', type: 'Content', href: '/resume', icon: Star, color: 'primary' as const },
    resumeData.skills.length === 0
      ? { title: 'Add your core skills', desc: 'Skills from your profile are used to calculate live job matches.', type: 'Profile', href: '/resume', icon: Award, color: 'accent' as const }
      : { title: 'Run a live job analysis', desc: 'Paste a job and instantly map your strongest evidence to requirements.', type: 'Workflow', href: '/analyzer', icon: Sparkles, color: 'accent' as const },
    resumeData.summary.trim().length < 40
      ? { title: 'Write a stronger summary', desc: 'A clear value proposition gives AI better evidence to tailor your resume.', type: 'Optimization', href: '/resume', icon: Flame, color: 'warning' as const }
      : { title: 'Create a tailored version', desc: 'Pick a template and let AI tailor your profile to the target role.', type: 'Workflow', href: '/create', icon: Zap, color: 'warning' as const },
  ];

  const sparkData = [40, 55, 48, 72, 65, 80, 75, 88, 82, 95];

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  return (
    <div className="p-5 md:p-7 max-w-[1400px] mx-auto space-y-8 font-sans">
      {/* ── Greeting header ── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 drop-shadow-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Workspace Active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
            {greeting},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">{firstName}</span>.
          </h1>
          <p className="text-sm font-medium text-blue-100/70 mt-2 drop-shadow-sm">
            Your career workspace is ready. {completeness > 0
              ? `Profile ${completeness}% complete.`
              : 'Start by adding your profile.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" size="sm" className="h-10 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all hover:border-blue-400/40 font-bold px-4">
            <Link href="/analyzer">
              <Target className="h-4 w-4 mr-2 text-blue-400" />
              Analyze Job
            </Link>
          </Button>
          <Button asChild size="sm" className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-transform hover:-translate-y-0.5">
            <Link href="/create" className="flex items-center gap-1.5">
              <Plus className="h-4 w-4 mr-1" />
              Create Resume
            </Link>
          </Button>
        </div>
      </motion.header>

      {/* ── Metric row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          icon={CheckCircle2}
          label="ATS Readiness"
          value={<span className={atsScore > 0 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]' : 'text-blue-100/50'}>{atsScore || '—'}</span>}
          sub={atsScore ? 'Based on your current resume' : 'Save a profile to calculate'}
          trend={atsScore ? 12 : undefined}
          accentClass="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/30"
          delay={100}
        />
        <MetricCard
          icon={Target}
          label="Job Match"
          value={<span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">{targetMatchScore ? `${targetMatchScore}%` : '—'}</span>}
          sub={targetMatchScore ? 'Based on latest job analysis' : 'Analyze a job to calculate'}
          trend={targetMatchScore ? 8 : undefined}
          accentClass="bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500/30"
          delay={200}
        />
        <MetricCard
          icon={FileText}
          label="Profile"
          value={<span className="text-white truncate block">{resumeData.title || 'Untitled'}</span>}
          sub={`${resumeData.experience.length} roles · ${resumeData.skills.length} skills`}
          accentClass="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/30"
          delay={300}
        />
        <MetricCard
          icon={Activity}
          label="Completeness"
          value={<span className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">{completeness}%</span>}
          sub="Profile strength across all sections"
          accentClass="bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/30"
          delay={400}
        />
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">

        {/* ── AI Recommendations (2 cols) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2 xl:col-span-3 p-6 rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Sparkles className="h-5 w-5 drop-shadow-sm" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white drop-shadow-md">AI Recommendations</h2>
                  <p className="text-[11px] font-medium text-blue-200/60 drop-shadow-sm">Tailored actions to increase your interview rate</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 drop-shadow-md shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                {recommendations.length} Actions
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <RecoItem key={i} {...rec} />
              ))}
            </div>

            {/* Workflow status row */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest drop-shadow-sm">AI Workflow Status</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Profile import', done: resumeData.name.length > 0 },
                  { label: 'Skills extraction', done: resumeData.skills.length > 0 },
                  { label: 'Job analysis', done: targetMatchScore > 0 },
                  { label: 'Resume generation', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300',
                      step.done ? 'bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-white/10',
                    )}>
                      {step.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 drop-shadow-sm" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200/30" />
                      )}
                    </div>
                    <span className={cn(
                      'text-sm transition-colors duration-300 drop-shadow-sm',
                      step.done ? 'text-white font-bold' : 'text-blue-100/50 font-medium group-hover:text-blue-100/80',
                    )}>
                      {step.label}
                    </span>
                    {step.done && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400/50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right panel ── */}
        <div className="lg:col-span-1 xl:col-span-2 flex flex-col gap-5">

          {/* Score overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden"
          >
            <h3 className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-5 flex items-center gap-2 drop-shadow-sm">
              <BarChart3 className="h-4 w-4 text-blue-400/70" /> Score Overview
            </h3>
            <div className="flex items-center justify-around">
              <ScoreRing value={atsScore || 0} color="#34d399" label="ATS" />
              <ScoreRing value={targetMatchScore || 0} color="#3b82f6" label="Match" />
              <ScoreRing value={completeness || 0} color="#fbbf24" label="Complete" />
            </div>
            {(atsScore > 0 || targetMatchScore > 0) && (
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-200/60 drop-shadow-sm">Score trend</span>
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                  <Sparkline values={sparkData} color="#3b82f6" />
                  <span className="text-[10px] font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">↑ 12%</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="p-6 rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative overflow-hidden"
          >
            <h3 className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-4 drop-shadow-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              <QuickAction href="/analyzer"    icon={Sparkles}  label="Analyze Job"    color="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/40" />
              <QuickAction href="/match"       icon={Target}    label="Job Match"      color="bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500/40" />
              <QuickAction href="/cover-letter" icon={FileCode2} label="Cover Letter"   color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/40" />
              <QuickAction href="/interview"   icon={Briefcase} label="Interview Prep" color="bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/40" />
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="p-6 rounded-2xl border border-white/10 bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl flex-1 relative overflow-hidden"
          >
            <h3 className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-5 flex items-center gap-2 drop-shadow-sm">
              <Clock className="h-4 w-4 text-blue-400/70" /> Recent Activity
            </h3>
            <div className="space-y-1">
              {targetMatchScore > 0 ? (
                <>
                  <ActivityItem time="Latest" text={`Live job match: ${targetMatchScore}%`} />
                  <ActivityItem time="Saved"  text="Profile evidence available to workflow" isLast />
                </>
              ) : (
                <>
                  <ActivityItem time="Ready" text="Import a profile URL to start" />
                  <ActivityItem time="Next"  text="Analyze a real job page for comparison" isLast />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CTA banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative overflow-hidden rounded-3xl p-8 border border-blue-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.4) 0%, rgba(79,70,229,0.4) 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/30 blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-cyan-500/20 blur-[60px] translate-y-1/2 pointer-events-none mix-blend-screen" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <WandSparkles className="h-4 w-4 text-blue-300 drop-shadow-md" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest drop-shadow-sm">AI-Powered</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg">Ready to land your next role?</h3>
            <p className="text-sm font-medium text-blue-100/80 mt-1 drop-shadow-sm">Generate a perfectly tailored resume in under 60 seconds.</p>
          </div>
          <Button
            asChild size="lg"
            className="shrink-0 bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-xl h-12 px-6 transition-all hover:scale-105 hover:-translate-y-1 border border-white"
          >
            <Link href="/create" className="flex items-center gap-2 text-sm">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
