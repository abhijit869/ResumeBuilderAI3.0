import { useEffect, useRef, useState } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles, WandSparkles, Menu, X, BookOpen, Target, Download, Cpu, Layers, Lock, Zap, BarChart3, Check, ScanLine, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard';

const queryClient = new QueryClient();
const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '');
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

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
    colorPrimary: '#3b82f6',
    colorForeground: '#f8fafc',
    colorMutedForeground: 'rgba(191, 219, 254, 0.7)',
    colorDanger: '#ef4444',
    colorBackground: 'transparent',
    colorInput: 'rgba(0, 0, 0, 0.2)',
    colorInputText: '#f8fafc',
    colorNeutral: 'rgba(255, 255, 255, 0.1)',
    fontFamily: "'Geist', 'Segoe UI Variable', system-ui, sans-serif",
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'w-[420px] max-w-full overflow-hidden rounded-2xl',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-bold tracking-tight text-white drop-shadow-md',
    headerSubtitle: 'text-blue-200/70',
    socialButtonsBlockButton: 'rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white',
    socialButtonsProviderIcon: 'filter brightness-0 invert',
    formButtonPrimary: 'rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all border border-blue-400/30',
    formFieldInput: 'rounded-xl border-white/10 bg-black/20 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner',
    formFieldLabel: 'text-blue-100/90 font-medium',
    footerAction: 'bg-transparent',
    main: 'bg-transparent',
    dividerLine: 'bg-white/10',
    dividerText: 'text-blue-200/50',
    identityPreviewText: 'text-white',
    identityPreviewEditButtonIcon: 'text-blue-400',
    formResendCodeLink: 'text-blue-400 hover:text-blue-300',
  },
};

function LoadingScreen() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div>
          <p className="text-sm font-semibold">Preparing ResumeGPT</p>
          <p className="mt-1 text-xs text-muted-foreground">Verifying your secure session…</p>
        </div>
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function WelcomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // NOTE: rest of WelcomePage below is unchanged

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
    <div className="min-h-[100dvh] bg-[#0A0E17] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden relative dark">
      {/* Background glass effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", isScrolled ? "bg-[#0A0E17]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-transparent")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-lg group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">ResumeGPT</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100/70">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="hover:text-white transition-colors drop-shadow-sm">{link.name}</a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/5"><Link href="/sign-in">Sign in</Link></Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-transform hover:-translate-y-0.5 rounded-xl"><Link href="/sign-up">Create workspace</Link></Button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0E17]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2 z-50">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-blue-100 hover:text-white">{link.name}</a>
            ))}
            <div className="h-px bg-white/10 w-full my-2" />
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl"><Link href="/sign-in">Sign in</Link></Button>
              <Button asChild className="w-full justify-center bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 rounded-xl"><Link href="/sign-up">Create workspace</Link></Button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <ShieldCheck className="h-4 w-4" /> Enterprise-grade privacy
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.1] text-white drop-shadow-lg">
                Build a resume that <br className="hidden sm:block" />
                <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">moves with your career.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-blue-100/80 md:text-xl drop-shadow-sm">
                Turn your raw career evidence into a polished, ATS-ready application workspace. ResumeGPT acts as your personal career database, matching your history to the jobs you want.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/30 transition-transform hover:-translate-y-1 rounded-xl"><Link href="/sign-up">Start building free <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-transform hover:-translate-y-1 rounded-xl"><Link href="/sign-in">Sign in to workspace</Link></Button>
              </div>
              <div className="mt-10 grid gap-4 text-sm font-bold text-blue-100/90 sm:grid-cols-3">
                {['AI-tailored content', 'Live role matching', 'Export to PDF/PNG'].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    key={item} 
                    className="flex items-center gap-2 drop-shadow-md"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]"><Check className="h-3.5 w-3.5" /></div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 to-indigo-500/30 blur-[80px] opacity-60 rounded-full pointer-events-none" />
              <Card className="relative overflow-hidden border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl">
                <div className="border-b border-white/10 bg-white/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-white"><WandSparkles className="h-4 w-4 text-blue-400" /> Resume Studio</div>
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/50 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/50 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-gradient-to-b from-transparent to-black/30">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-6 shadow-inner backdrop-blur-md">
                    <div className="flex items-start justify-between border-b border-white/10 pb-5">
                      <div>
                        <div className="h-5 w-40 rounded-md bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        <div className="mt-3 h-3 w-24 rounded-md bg-white/20" />
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><FileText className="h-6 w-6" /></div>
                    </div>
                    <div className="mt-6 grid gap-6 sm:grid-cols-[1.5fr_1fr]">
                      <div className="space-y-4">
                        <div className="h-3 w-24 rounded-md bg-white/20" />
                        <div className="space-y-2">
                          <div className="h-2.5 w-full rounded-md bg-white/10" />
                          <div className="h-2.5 w-11/12 rounded-md bg-white/10" />
                          <div className="h-2.5 w-4/5 rounded-md bg-white/10" />
                        </div>
                      </div>
                      <div className="space-y-4 sm:border-l sm:border-white/10 sm:pl-6">
                        <div className="h-3 w-20 rounded-md bg-blue-400/40" />
                        <div className="space-y-2">
                          <div className="h-2.5 w-full rounded-md bg-white/10" />
                          <div className="h-2.5 w-5/6 rounded-md bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="workflow" className="py-24 relative overflow-hidden bg-black/10 border-y border-white/5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white drop-shadow-lg">4 Steps to Your Next Role</h2>
              <p className="mt-4 text-blue-100/80 text-lg font-medium drop-shadow-sm">A structured, repeatable workflow that replaces the chaos of updating Word documents.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              
              {[
                { icon: BookOpen, title: "1. Import", desc: "Dump all your raw career history, achievements, and metrics into a private vault." },
                { icon: Cpu, title: "2. Analyze", desc: "Our AI breaks down your experience into searchable, adaptable capability blocks." },
                { icon: Target, title: "3. Match", desc: "Paste a job description to instantly map your strongest evidence to their requirements." },
                { icon: Download, title: "4. Export", desc: "Generate a perfectly formatted, ATS-compliant PDF ready for submission." },
              ].map((step, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  key={idx} 
                  className="relative group text-center md:text-left flex flex-col items-center md:items-start"
                >
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/10 group-hover:border-blue-500/50 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                    <step.icon className="h-10 w-10 text-blue-400 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">{step.title}</h3>
                  <p className="text-blue-100/70 text-sm font-medium leading-relaxed drop-shadow-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 relative z-10">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:flex md:items-end md:justify-between"
            >
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white drop-shadow-lg">Everything you need to stand out.</h2>
                <p className="mt-4 text-blue-100/80 text-lg font-medium drop-shadow-sm">We sweat the details so you can focus on the interview.</p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Layers, title: "Version Control", desc: "Keep multiple tailored versions of your resume mapped to a single source of truth." },
                { icon: Lock, title: "Privacy First", desc: "Your career data is yours. We don't train public models on your private workspace." },
                { icon: BarChart3, title: "ATS Optimization", desc: "Clean, parsable code beneath the surface ensures bots can read your history accurately." },
                { icon: Zap, title: "Instant Generation", desc: "Go from a blank page to a targeted resume in seconds, not hours." },
              ].map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={i} 
                >
                  <Card className="bg-white/5 hover:bg-white/10 transition-all duration-300 border-white/10 overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl hover:border-blue-500/30 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] h-full">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white border border-blue-400/20 group-hover:border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <feat.icon className="h-6 w-6 drop-shadow-sm" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-white drop-shadow-md">{feat.title}</h3>
                      <p className="text-sm text-blue-100/70 font-medium leading-relaxed">{feat.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-black/20 border-y border-white/5 backdrop-blur-md relative z-10">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="docs"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow-md">
                <BookOpen className="h-6 w-6 text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" /> Documentation
              </h2>
              <div className="space-y-4">
                <a href="#workflow" className="block p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/40 transition-all group shadow-lg backdrop-blur-xl">
                  <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors drop-shadow-sm">Getting Started Guide</h4>
                  <p className="text-sm text-blue-100/70 font-medium mt-1">Learn how to import your first role and set up your evidence vault.</p>
                </a>
                <a href="#features" className="block p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/40 transition-all group shadow-lg backdrop-blur-xl">
                  <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors drop-shadow-sm">Beating the ATS</h4>
                  <p className="text-sm text-blue-100/70 font-medium mt-1">Understand how applicant tracking systems parse your data.</p>
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-md">About ResumeGPT</h2>
              <div className="space-y-4 text-blue-100/80 font-medium leading-relaxed drop-shadow-sm">
                <p>
                  We built ResumeGPT because the traditional job application process is broken. You shouldn't have to maintain 15 different Word documents just to highlight different facets of your career.
                </p>
                <p>
                  Your career is a database of achievements, not a static piece of paper. ResumeGPT treats it that way, allowing you to query your own history and instantly map it to what hiring managers are actually looking for.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 text-center relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-white drop-shadow-lg">Stop formatting. Start applying.</h2>
            <p className="text-xl text-blue-100/80 font-medium mb-10 drop-shadow-sm">Create your secure workspace today and build your next opportunity with confidence.</p>
            <Button asChild size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-400/30 transition-transform hover:-translate-y-1 rounded-xl"><Link href="/sign-up">Create workspace <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
          </motion.div>
        </section>
      </main>

      <footer className="py-10 text-center text-sm font-medium text-blue-200/50 border-t border-white/10 bg-[#0A0E17]/80 backdrop-blur-xl relative z-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white drop-shadow-md">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]"><Sparkles className="h-3 w-3" /></span>
            ResumeGPT
          </div>
          <p>&copy; {new Date().getFullYear()} ResumeGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const authWorkflow = [
  { label: 'Import', description: 'Bring in your real career evidence.', icon: BookOpen },
  { label: 'Analyze', description: 'Turn experience into usable signals.', icon: Cpu },
  { label: 'Match', description: 'Connect evidence to the target role.', icon: Target },
  { label: 'Export', description: 'Ship an ATS-ready application.', icon: Download },
];

function AuthInfoPanel() {
  return (
    <div className="relative z-10 max-w-xl space-y-7">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Your career workspace</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">Welcome back.</h2>
        <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-blue-100/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          ResumeGPT turns your real experience into a repeatable system for every opportunity.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-black/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="mb-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white drop-shadow-md text-lg">System Workflow</h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 drop-shadow-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Active
            </span>
          </div>
        </div>

        {/* Animated Workflow Diagram */}
        <div className="relative pt-2 pb-4 z-10">
          {/* Background Track Line */}
          <div className="absolute top-6 left-6 right-6 h-[2px] bg-white/10 rounded-full" />
          
          {/* Animated Glowing Progress Line */}
          <motion.div 
            className="absolute top-6 left-6 h-[2px] rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            initial={{ width: "0%", opacity: 0 }}
            animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-4 gap-2 relative">
            {authWorkflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex flex-col items-center text-center relative group/step">
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0E17] border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10 transition-colors group-hover/step:bg-blue-500/20 group-hover/step:text-white"
                  >
                    <Icon className="h-4 w-4 drop-shadow-sm" />
                    {/* Pulsing glow ring on hover */}
                    <div className="absolute -inset-2 rounded-xl border border-blue-400/0 group-hover/step:border-blue-400/50 group-hover/step:animate-ping opacity-0 group-hover/step:opacity-100" style={{ animationDuration: '1.5s' }} />
                  </motion.div>
                  <p className="text-sm font-bold text-white drop-shadow-md">{step.label}</p>
                  <p className="mt-1 text-[11px] font-medium leading-tight text-blue-200/70 drop-shadow-sm max-w-[80px]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { icon: Layers, title: 'Evidence-first AI', desc: 'Grounded in the work you have actually done.' },
          { icon: Target, title: 'Live job matching', desc: 'See where your strongest proof fits next.' },
          { icon: ShieldCheck, title: 'Private by design', desc: 'Your workspace stays strictly yours.' },
        ].map((feat) => (
          <div key={feat.title} className="rounded-xl border border-white/5 bg-white/5 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-[0_10px_25px_rgba(59,130,246,0.2)] group flex flex-col items-center text-center">
            <feat.icon className="h-6 w-6 text-blue-400/70 mb-3 transition-colors group-hover:text-blue-300 drop-shadow-sm" />
            <p className="text-xs font-bold text-white drop-shadow-md">{feat.title}</p>
            <p className="mt-1.5 text-[10px] font-medium leading-relaxed text-blue-200/70 drop-shadow-sm">{feat.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const authImages = [
  'image_1785728969980.png',
  'image_1785728979292.png',
  'image_1785728986395.png',
  'image_1785728994722.png',
  'image_1785729003531.png',
  'image_1785729015438.png',
  'image_1785729058524.png',
  'image_1785729071425.png',
  'image_1785729091691.png',
  'image_1785729136518.png',
  'image_1785729169973.png',
  'image_1785729204118.png',
  'image_1785729255791.png',
  'image_1785729306904.png',
  'image_1785730912046.png',
  'image_1785730925607.png',
  'image_1785731001409.png',
  'image_1785731013224.png',
  'image_1785731074466.png'
];

function AuthLayout({ children }: { children: React.ReactNode }) {
  const [randomImage, setRandomImage] = useState<string>('');
  
  useEffect(() => {
    // Setting random image only on client side to prevent hydration mismatch
    const randomIdx = Math.floor(Math.random() * authImages.length);
    setRandomImage(authImages[randomIdx]);
  }, []);

  return (
    <div className="flex min-h-[100dvh] w-full min-w-0 overflow-x-hidden bg-[#0A0E17] font-sans selection:bg-blue-500/30 dark text-foreground">
      {/* Dynamic Background with dark colourful light blue accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="hidden w-1/2 flex-col justify-between overflow-hidden relative border-r border-white/10 p-12 lg:flex z-10 shadow-2xl">
        {randomImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${basePath}/assets/${randomImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/80 via-[#0A0E17]/60 to-[#0A0E17]/90 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-xl relative z-10 group w-fit">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"><Sparkles className="h-5 w-5" /></span>
            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">ResumeGPT</span>
          </Link>
        </motion.div>

        <AuthInfoPanel />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 text-sm font-medium text-blue-200/70 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Secure, enterprise-grade workspace
        </motion.div>
      </div>

      <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-y-auto bg-transparent p-4 sm:p-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 to-[#0A0E17]/90 backdrop-blur-3xl" />
         <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 font-semibold tracking-tight z-20">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md"><Sparkles className="h-4 w-4" /></span>
          <span className="text-white">ResumeGPT</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="relative z-20 w-full max-w-[440px] rounded-2xl bg-white/5 border border-white/10 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/5 shadow-inner">
            {children}
          </div>
        </motion.div>
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

import { setAuthTokenGetter } from '@workspace/api-client-react';

function ApiClientInitializer() {
  const { getToken } = useAuth();
  
  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
    return () => {
      setAuthTokenGetter(null);
    };
  }, [getToken]);
  
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
          <ApiClientInitializer />
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
            <Route path="/portfolio"><WorkspaceRoute page={<WorkspaceModule kind="portfolio" />} /></Route>
            <Route path="/interview"><WorkspaceRoute page={<WorkspaceModule kind="interview" />} /></Route>
            <Route path="/analytics"><WorkspaceRoute page={<WorkspaceModule kind="analytics" />} /></Route>
            <Route path="/admin"><WorkspaceRoute page={<AdminDashboard />} /></Route>
            <Route path="/settings"><WorkspaceRoute page={<Settings />} /></Route>
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