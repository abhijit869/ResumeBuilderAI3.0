import { useEffect, useRef, useState } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles, WandSparkles, Menu, X, BookOpen, Target, Download, Cpu, Layers, Lock, Zap, BarChart3, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Shell } from '@/components/layout/Shell';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ResumeBuilder from '@/pages/ResumeBuilder';
import Analyzer from '@/pages/Analyzer';
import CreateResume from '@/pages/CreateResume';
import WorkspaceModule from '@/pages/WorkspaceModule';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment.');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
  variables: {
    colorPrimary: '#0ea5e9',
    colorForeground: '#172033',
    colorMutedForeground: '#64748b',
    colorDanger: '#dc2626',
    colorBackground: '#ffffff',
    colorInput: '#f8fafc',
    colorInputForeground: '#172033',
    colorNeutral: '#dbe4ee',
    fontFamily: 'Outfit, sans-serif',
    borderRadius: '0.85rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-slate-900 font-bold',
    headerSubtitle: 'text-slate-500',
    socialButtonsBlockButtonText: 'text-slate-700 font-medium',
    formFieldLabel: 'text-slate-700 font-medium',
    footerActionLink: 'text-sky-600 font-semibold',
    footerActionText: 'text-slate-500',
    dividerText: 'text-slate-400',
    identityPreviewEditButton: 'text-sky-600',
    formFieldSuccessText: 'text-emerald-600',
    alertText: 'text-red-700',
    logoBox: 'rounded-xl',
    logoImage: 'rounded-xl',
    socialButtonsBlockButton: 'border-slate-200 bg-white hover:bg-slate-50',
    formButtonPrimary: 'bg-sky-500 hover:bg-sky-600 text-white font-semibold',
    formFieldInput: 'border-slate-200 bg-slate-50 text-slate-900',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-slate-200',
    alert: 'border-red-200 bg-red-50',
    otpCodeFieldInput: 'border-slate-200 bg-slate-50 text-slate-900',
    formFieldRow: 'gap-2',
    main: 'bg-transparent',
  },
};

function LoadingScreen() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>
        <div>
          <p className="font-semibold">Preparing ResumeGPT</p>
          <p className="mt-1 text-sm text-muted-foreground">Checking your secure session…</p>
        </div>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function WelcomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Workflow', href: '#workflow' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Docs', href: '#docs' },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/30 font-sans">
      <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-transparent")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-lg group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </span>
            ResumeGPT
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="hover:text-foreground transition-colors">{link.name}</a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground"><Link href="/sign-in">Sign in</Link></Button>
            <Button asChild className="shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"><Link href="/sign-up">Create workspace</Link></Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground">{link.name}</a>
            ))}
            <div className="h-px bg-border w-full my-2" />
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full justify-center"><Link href="/sign-in">Sign in</Link></Button>
              <Button asChild className="w-full justify-center"><Link href="/sign-up">Create workspace</Link></Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center relative z-10">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4" /> Enterprise-grade privacy
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
                Build a resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">moves with your career.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Turn your raw career evidence into a polished, ATS-ready application workspace. ResumeGPT acts as your personal career database, matching your history to the jobs you want.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"><Link href="/sign-up">Start building free <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm"><Link href="/sign-in">Sign in to workspace</Link></Button>
              </div>
              <div className="mt-10 grid gap-4 text-sm font-medium text-muted-foreground sm:grid-cols-3">
                {['AI-tailored content', 'Live role matching', 'Export to PDF/PNG'].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 animate-in fade-in duration-500" style={{ animationDelay: `${500 + i * 150}ms`, animationFillMode: 'both' }}>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-3.5 w-3.5" /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-3xl opacity-50 rounded-full" />
              <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5">
                <div className="border-b border-border/50 bg-muted/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><WandSparkles className="h-4 w-4 text-primary" /> Resume Studio</div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/20" />
                    <div className="h-3 w-3 rounded-full bg-success/50" />
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-gradient-to-b from-transparent to-muted/10">
                  <div className="rounded-xl bg-background border border-border/50 p-6 shadow-lg">
                    <div className="flex items-start justify-between border-b border-border/50 pb-5">
                      <div>
                        <div className="h-5 w-40 rounded-md bg-primary/90" />
                        <div className="mt-3 h-3 w-24 rounded-md bg-muted" />
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-6 w-6" /></div>
                    </div>
                    <div className="mt-6 grid gap-6 sm:grid-cols-[1.5fr_1fr]">
                      <div className="space-y-4">
                        <div className="h-3 w-24 rounded-md bg-muted-foreground/30" />
                        <div className="space-y-2">
                          <div className="h-2.5 w-full rounded-md bg-muted" />
                          <div className="h-2.5 w-11/12 rounded-md bg-muted" />
                          <div className="h-2.5 w-4/5 rounded-md bg-muted" />
                        </div>
                      </div>
                      <div className="space-y-4 sm:border-l sm:border-border/50 sm:pl-6">
                        <div className="h-3 w-20 rounded-md bg-primary/40" />
                        <div className="space-y-2">
                          <div className="h-2.5 w-full rounded-md bg-muted" />
                          <div className="h-2.5 w-5/6 rounded-md bg-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="workflow" className="py-24 bg-sidebar relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">4 Steps to Your Next Role</h2>
              <p className="mt-4 text-muted-foreground text-lg">A structured, repeatable workflow that replaces the chaos of updating Word documents.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              {[
                { icon: BookOpen, title: "1. Import", desc: "Dump all your raw career history, achievements, and metrics into a private vault." },
                { icon: Cpu, title: "2. Analyze", desc: "Our AI breaks down your experience into searchable, adaptable capability blocks." },
                { icon: Target, title: "3. Match", desc: "Paste a job description to instantly map your strongest evidence to their requirements." },
                { icon: Download, title: "4. Export", desc: "Generate a perfectly formatted, ATS-compliant PDF ready for submission." },
              ].map((step, idx) => (
                <div key={idx} className="relative group text-center md:text-left flex flex-col items-center md:items-start">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-background border border-border shadow-sm mb-6 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/30">
                    <step.icon className="h-10 w-10 text-primary transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute -inset-2 rounded-2xl bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-background">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 md:flex md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to stand out.</h2>
                <p className="mt-4 text-muted-foreground text-lg">We sweat the details so you can focus on the interview.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Layers, title: "Version Control", desc: "Keep multiple tailored versions of your resume mapped to a single source of truth." },
                { icon: Lock, title: "Privacy First", desc: "Your career data is yours. We don't train public models on your private workspace." },
                { icon: BarChart3, title: "ATS Optimization", desc: "Clean, parsable code beneath the surface ensures bots can read your history accurately." },
                { icon: Zap, title: "Instant Generation", desc: "Go from a blank page to a targeted resume in seconds, not hours." },
              ].map((feat, i) => (
                <Card key={i} className="bg-card/50 hover:bg-card transition-colors border-border/50 overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16">
            <div id="docs">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Documentation</h2>
              <div className="space-y-4">
                <a href="#workflow" className="block p-5 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Getting Started Guide</h4>
                  <p className="text-sm text-muted-foreground mt-1">Learn how to import your first role and set up your evidence vault.</p>
                </a>
                <a href="#features" className="block p-5 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">Beating the ATS</h4>
                  <p className="text-sm text-muted-foreground mt-1">Understand how applicant tracking systems parse your data.</p>
                </a>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">About ResumeGPT</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We built ResumeGPT because the traditional job application process is broken. You shouldn't have to maintain 15 different Word documents just to highlight different facets of your career.
                </p>
                <p>
                  Your career is a database of achievements, not a static piece of paper. ResumeGPT treats it that way, allowing you to query your own history and instantly map it to what hiring managers are actually looking for.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Stop formatting. Start applying.</h2>
            <p className="text-xl text-muted-foreground mb-10">Create your secure workspace today and build your next opportunity with confidence.</p>
            <Button asChild size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"><Link href="/sign-up">Create workspace <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"><Sparkles className="h-3 w-3" /></span>
            ResumeGPT
          </div>
          <p>&copy; {new Date().getFullYear()} ResumeGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const authWorkflow = [
  { label: 'Import', description: 'Bring in your real career evidence.' },
  { label: 'Analyze', description: 'Turn experience into usable signals.' },
  { label: 'Match', description: 'Connect evidence to the target role.' },
  { label: 'Export', description: 'Ship an ATS-ready application.' },
];

function AuthInfoPanel() {
  return (
    <div className="relative z-10 max-w-xl space-y-7">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your career workspace</p>
        <h2 className="text-4xl font-bold tracking-tight">Welcome back.</h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
          ResumeGPT turns your real experience into a repeatable system for every opportunity.
        </p>
      </div>

      <div id="auth-workflow" className="scroll-mt-8 rounded-2xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-semibold">The workflow</h3>
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Live
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {authWorkflow.map((step, index) => (
            <div key={step.label} className="group relative">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">{index + 1}</span>
                {index < authWorkflow.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
              </div>
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="auth-features" className="scroll-mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ['Evidence-first AI', 'Grounded in the work you have actually done.'],
          ['Live job matching', 'See where your strongest proof fits next.'],
          ['Private by design', 'Your workspace stays yours.'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-border/50 bg-background/40 p-4 transition-transform hover:-translate-y-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a id="auth-docs" href="#auth-workflow" className="scroll-mt-8 rounded-xl border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/40">
          <p className="text-sm font-semibold">Documentation</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Learn how importing, matching, and exporting work.</p>
        </a>
        <a id="auth-about" href="#auth-features" className="scroll-mt-8 rounded-xl border border-border/50 bg-background/40 p-4 transition-colors hover:border-primary/40">
          <p className="text-sm font-semibold">About ResumeGPT</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">A focused workspace for applying with confidence.</p>
        </a>
      </div>
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full min-w-0 overflow-x-hidden bg-background font-sans selection:bg-primary/30">
      <div className="hidden w-1/2 flex-col justify-between overflow-y-auto border-r border-border bg-sidebar p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-sidebar to-sidebar pointer-events-none" />
        <div className="absolute -inset-y-1/2 -right-1/4 w-[800px] h-[1000px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-xl relative z-10 group w-fit">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105"><Sparkles className="h-5 w-5" /></span>
          ResumeGPT
        </Link>
        <AuthInfoPanel />
        <div className="relative z-10 text-sm text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-success" /> Secure, private workspace
        </div>
      </div>
      <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-y-auto bg-background p-4 sm:p-6">
         <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
          ResumeGPT
        </Link>
         <div className="relative z-10 w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
      </div>
    </div>
  )
}

function SignInPage() {
  return (
    <AuthLayout>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </AuthLayout>
  );
}

function SignUpPage() {
  return (
    <AuthLayout>
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Creating a fresh account?</p>
        <p className="mt-1 leading-relaxed text-slate-600">
          Use a unique passphrase with several uncommon words, numbers, and symbols. Short passwords such as
          <span className="font-mono text-xs"> admin123 </span>
          are not accepted by the secure sign-in provider.
        </p>
      </div>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </AuthLayout>
  );
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  return isSignedIn ? <Redirect to="/dashboard" /> : <WelcomePage />;
}

function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect to="/" />;
  return <Shell>{children}</Shell>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => addListener(({ user }) => {
    const userId = user?.id ?? null;
    if (previousUserId.current !== undefined && previousUserId.current !== userId) client.clear();
    previousUserId.current = userId;
  }), [addListener, client]);
  return null;
}

function WorkspaceRoute({ page }: { page: React.ReactNode }) {
  return <ProtectedPage>{page}</ProtectedPage>;
}

function ClerkApp() {
  const [, setLocation] = useLocation();
  const stripBase = (path: string) => basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{ signIn: { start: { title: 'Welcome back', subtitle: 'Sign in to continue your career workspace' } }, signUp: { start: { title: 'Create your ResumeGPT account', subtitle: 'Build your next opportunity with confidence' } } }}
      routerPush={to => setLocation(stripBase(to))}
      routerReplace={to => setLocation(stripBase(to), { replace: true })}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/dashboard"><WorkspaceRoute page={<Dashboard />} /></Route>
            <Route path="/create"><WorkspaceRoute page={<CreateResume />} /></Route>
            <Route path="/resume"><WorkspaceRoute page={<ResumeBuilder />} /></Route>
            <Route path="/analyzer"><WorkspaceRoute page={<Analyzer />} /></Route>
            <Route path="/match"><WorkspaceRoute page={<WorkspaceModule kind="match" />} /></Route>
            <Route path="/cover-letter"><WorkspaceRoute page={<WorkspaceModule kind="cover-letter" />} /></Route>
            <Route path="/interview"><WorkspaceRoute page={<WorkspaceModule kind="interview" />} /></Route>
            <Route path="/analytics"><WorkspaceRoute page={<WorkspaceModule kind="analytics" />} /></Route>
            <Route component={NotFound} />
          </Switch>
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return <WouterRouter base={basePath}><ClerkApp /></WouterRouter>;
}