"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Lock, Mail, User as UserIcon, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await signup(name, email, password);
      router.push("/dashboard/resumes");
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    await signup("Kickresume User", "sodopel885@juicehour.com");
    router.push("/dashboard/resumes");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-[#ff5e59]">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Kick<span className="text-[#ff5e59]">resume</span>
          </span>
        </Link>
        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Create your free Kickresume account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#ff5e59] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-xs font-bold text-gray-700">
                Full Name
              </Label>
              <div className="mt-1.5 relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-10.5 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59] focus:ring-[#ff5e59]"
                  placeholder="e.g. Alex Johnson"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-bold text-gray-700">
                Email Address
              </Label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10.5 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59] focus:ring-[#ff5e59]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-bold text-gray-700">
                Password
              </Label>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10.5 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59] focus:ring-[#ff5e59]"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00b5b8]" />
                <span>Kickresume iconic templates (Hoth, Europe, Vegan)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00b5b8]" />
                <span>5 Free AI Credits included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00b5b8]" />
                <span>ATS Resume Checker & Instant PDF Export</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold bg-[#ff5e59] hover:bg-[#ee4e34] text-white rounded-xl shadow-md shadow-orange-500/20 mt-4 transition-all"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Get Started Free"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-semibold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full h-10.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 rounded-xl border-gray-200 hover:bg-gray-50"
                onClick={handleGoogleSignup}
                type="button"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Sign up with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
