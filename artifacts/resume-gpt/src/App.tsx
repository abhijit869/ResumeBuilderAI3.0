import { useEffect, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
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
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          ResumeGPT
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link href="/sign-in">Sign in</Link></Button>
          <Button asChild><Link href="/sign-up">Create account</Link></Button>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" /> Private by design
          </div>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">Build a resume that moves with your career.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">ResumeGPT turns your real experience and target job evidence into a polished, ATS-ready application workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/sign-up">Start building free <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/sign-in">Sign in to workspace</Link></Button>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {['AI-tailored resumes', 'Live job matching', 'PDF, PNG, JPG export'].map(item => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{item}</div>)}
          </div>
        </div>
        <Card className="overflow-hidden border-primary/20 bg-card/70 shadow-2xl shadow-primary/10">
          <div className="border-b border-border/60 bg-gradient-to-br from-primary/15 via-card to-card p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold"><WandSparkles className="h-4 w-4 text-primary" /> Resume Studio</div><span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">Ready</span></div>
            <div className="mt-8 rounded-xl bg-white p-6 text-slate-900 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-200 pb-5"><div><div className="h-4 w-36 rounded bg-sky-500" /><div className="mt-3 h-2 w-24 rounded bg-slate-200" /></div><FileText className="h-7 w-7 text-sky-500" /></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]"><div className="space-y-3"><div className="h-2 w-20 rounded bg-slate-300" /><div className="h-2 w-full rounded bg-slate-100" /><div className="h-2 w-11/12 rounded bg-slate-100" /><div className="h-2 w-4/5 rounded bg-slate-100" /></div><div className="space-y-3 border-l border-slate-200 pl-4"><div className="h-2 w-16 rounded bg-sky-200" /><div className="h-2 w-full rounded bg-slate-100" /><div className="h-2 w-4/5 rounded bg-slate-100" /></div></div>
            </div>
          </div>
          <CardContent className="grid gap-3 p-5 text-sm text-muted-foreground sm:grid-cols-3"><div><strong className="block text-foreground">1</strong>Import evidence</div><div><strong className="block text-foreground">2</strong>Match a role</div><div><strong className="block text-foreground">3</strong>Export confidently</div></CardContent>
        </Card>
      </main>
    </div>
  );
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
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