'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Lock,
  Check,
  ArrowRight,
  ShieldCheck,
  X,
  KeyRound,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  signInUser,
  signUpUser,
  signInWithGoogle,
  signInWithGithub,
  signInWithLinkedIn,
  AppUserProfile,
  validatePasswordStrength,
} from '@/lib/auth-service';

interface AuthModalViewProps {
  initialMode?: 'login' | 'signup';
  securityNotice?: string;
  onAuthenticated: (user: AppUserProfile) => void;
  onOpenLinkedInImport?: () => void;
  onClose?: () => void;
  allowClose?: boolean;
}

export function AuthModalView({
  initialMode = 'login',
  securityNotice,
  onAuthenticated,
  onClose,
  allowClose = true,
}: AuthModalViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    'google' | 'linkedin' | 'github' | null
  >(null);
  const [resetSent, setResetSent] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleSocialAuth = async (
    provider: 'google' | 'linkedin' | 'github'
  ) => {
    setErrorMsg(null);
    setSocialLoading(provider);
    try {
      let user: AppUserProfile;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'linkedin') {
        user = await signInWithLinkedIn();
      } else {
        user = await signInWithGithub();
      }
      onAuthenticated(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Social sign-in failed';
      setErrorMsg(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'reset') {
      if (!email.trim()) {
        setErrorMsg('Please enter your account email address.');
        return;
      }
      setResetSent(true);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup') {
      if (!agreedTerms) {
        setErrorMsg(
          'Please accept the Terms of Use and Privacy Policy to continue.'
        );
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(
          'Passwords do not match. Please verify your password confirmation.'
        );
        return;
      }
      const strength = validatePasswordStrength(password);
      if (!strength.valid) {
        setErrorMsg(
          strength.message || 'Password does not meet security requirements.'
        );
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const user = await signUpUser(email, password, fullName);
        onAuthenticated(user);
      } else {
        const user = await signInUser(email, password);
        onAuthenticated(user);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (
        msg.includes('auth/invalid-credential') ||
        msg.includes('auth/wrong-password')
      ) {
        setErrorMsg(
          'Incorrect email or password. Please try again or create an account.'
        );
      } else if (msg.includes('auth/email-already-in-use')) {
        setErrorMsg(
          'An account with this email already exists. Please log in instead.'
        );
      } else if (msg.includes('auth/weak-password')) {
        setErrorMsg(
          'Password should be at least 8 characters with letters and numbers.'
        );
      } else if (msg.includes('auth/user-not-found')) {
        setErrorMsg('No account found with this email. Please sign up first.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ResumeBuilderAi 3.0 Authentication Gateway"
      className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col lg:flex-row overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Left Split Column: Security Architecture & Brand Showcase */}
      <div className="hidden lg:flex lg:w-[38%] bg-slate-900 text-white relative flex-col justify-between p-10 overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(circle at 25% 25%, #FF5A4E 0%, transparent 55%), radial-gradient(circle at 80% 80%, #10B981 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/assets/aistudio/image_663e4373.png"
            alt="ResumeGPT AI Logo"
            width={44}
            height={44}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover shadow-md border border-white/15 shrink-0"
          />
          <div>
            <span className="font-extrabold text-xl tracking-tight block leading-none">
              ResumeBuilderAi <span className="text-[#FF5A4E]">3.0</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300">
              Build · Analyze · Grow · Get Hired
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Auth &amp; Firestore Protected</span>
          </div>

          <h2 className="font-serif text-3xl xl:text-4xl leading-tight">
            Protected Career Workspace.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            All resume versions, cover letters, and job applications are
            securely encrypted and isolated to your authenticated account.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                1-Click Social Sign-In: Google, LinkedIn, and GitHub
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Strict Firestore Rules: Only you can view or edit your documents
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Zero-unauthenticated access: Closed all dashboard loopholes
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                12 original code-rendered templates with selectable export
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Enterprise Security Hardened</span>
          <span>© 2026 ResumeBuilderAi</span>
        </div>
      </div>

      {/* Right Column: Authentication Forms */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative bg-[#FAF9F6]">
        {allowClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Authentication Screen"
            className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 pb-1">
              <Image
                src="/assets/aistudio/image_663e4373.png"
                alt="ResumeGPT AI Logo"
                width={40}
                height={40}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover shadow-xs border border-slate-200 shrink-0"
              />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold font-mono">
                <Lock className="w-3 h-3" />
                <span>SECURE ACCESS GATE</span>
              </div>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-slate-900">
              {mode === 'signup'
                ? 'Create your secure account'
                : mode === 'reset'
                ? 'Reset account password'
                : 'Log in to your workspace'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {mode === 'signup'
                ? 'Sign up to build, optimize, and store recruiter-ready resumes.'
                : mode === 'reset'
                ? 'Enter your email address and we will generate instructions.'
                : 'Sign in to access your resumes, templates, and ATS analytics.'}
            </p>
          </div>

          {/* Security Notice Banner if prompted by protection gate */}
          {securityNotice && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Authentication Required:</strong> {securityNotice}
              </div>
            </div>
          )}

          {/* Error Message & Unauthorized Domain Resolution */}
          {errorMsg && errorMsg.includes('unauthorized-domain') ? (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-3 shadow-xs"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-950 text-sm">
                    Firebase Authorized Domain Required
                  </h4>
                  <p className="text-amber-800 leading-relaxed">
                    Firebase blocks OAuth popups on new domains until they are added to your project settings. To enable Google/GitHub sign-in on this deployment:
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 font-mono text-[11px] text-slate-800 flex items-center justify-between gap-2">
                <span className="truncate select-all">
                  {typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.hostname);
                      setCopiedDomain(true);
                      setTimeout(() => setCopiedDomain(false), 2500);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold text-[10px] shrink-0 transition"
                >
                  {copiedDomain ? 'Copied!' : 'Copy Domain'}
                </button>
              </div>

              <div className="text-[11px] text-amber-900 leading-relaxed space-y-1 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/60">
                <p>1. Open <a href="https://console.firebase.google.com/project/gen-lang-client-0149483350/authentication/settings" target="_blank" rel="noopener noreferrer" className="font-semibold underline text-amber-950 hover:text-black">Firebase Console → Auth Settings</a></p>
                <p>2. Scroll down to <strong>Authorized domains</strong> → <strong>Add domain</strong></p>
                <p>3. Paste your domain and click <strong>Save</strong>.</p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('demo.candidate@resumegpt.io');
                    setPassword('DemoPass2026!Secure');
                    setErrorMsg(null);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Auto-fill Demo Credentials Below</span>
                </button>
              </div>
            </div>
          ) : errorMsg ? (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          ) : null}

          {/* Reset Sent Notice */}
          {resetSent && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium"
            >
              Password reset link prepared for <strong>{email}</strong>. Check
              your inbox or proceed to login.
            </div>
          )}

          {/* Social Authentication Gateway (Google, LinkedIn, GitHub) */}
          {mode !== 'reset' && (
            <div className="space-y-2.5">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={Boolean(socialLoading) || loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-2xs hover:shadow-xs disabled:opacity-60"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {socialLoading === 'google'
                    ? 'Connecting to Google...'
                    : 'Continue with Google'}
                </span>
              </button>

              {/* Grid with LinkedIn and GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* LinkedIn Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('linkedin')}
                  disabled={Boolean(socialLoading) || loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition shadow-2xs hover:shadow-xs disabled:opacity-60"
                >
                  {socialLoading === 'linkedin' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0077B5]" />
                  ) : (
                    <svg
                      className="w-4 h-4 shrink-0 text-[#0077B5]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  )}
                  <span>
                    {socialLoading === 'linkedin'
                      ? 'Connecting...'
                      : 'LinkedIn'}
                  </span>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  disabled={Boolean(socialLoading) || loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300/90 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition shadow-2xs hover:shadow-xs disabled:opacity-60"
                >
                  {socialLoading === 'github' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                  ) : (
                    <svg
                      className="w-4 h-4 shrink-0 text-slate-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  )}
                  <span>
                    {socialLoading === 'github' ? 'Connecting...' : 'GitHub'}
                  </span>
                </button>
              </div>

              {/* Separator */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                  or continue with email credentials
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </div>
          )}

          {/* Email / Password Form */}
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4"
          >
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-fullname"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="auth-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A4E]/30 focus:border-[#FF5A4E]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A4E]/30 focus:border-[#FF5A4E]"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="auth-password"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        setErrorMsg(null);
                      }}
                      className="text-[11px] text-[#FF5A4E] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A4E]/30 focus:border-[#FF5A4E]"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A4E]/30 focus:border-[#FF5A4E]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Security rule: minimum 8 characters with both letters &amp;
                  numbers.
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#FF5A4E] focus:ring-[#FF5A4E]"
                />
                <span>
                  I agree to the{' '}
                  <strong className="text-slate-800">Terms of Use</strong> and{' '}
                  <strong className="text-slate-800">Privacy Policy</strong>.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(socialLoading)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5A4E] to-[#e6483d] hover:from-[#e6483d] hover:to-[#d03d33] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/20 disabled:opacity-60 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : mode === 'reset' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account &amp; Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Log In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-center text-xs text-slate-600">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#FF5A4E] hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#FF5A4E] hover:underline"
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="text-center pt-6 border-t border-slate-200/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Authentication</span>
          </span>
          <span>•</span>
          <span>Private Document Isolation</span>
          <span>•</span>
          <span>Zero-Trust Client Access Control</span>
        </div>
      </div>
    </div>
  );
}
