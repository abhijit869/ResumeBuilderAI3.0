"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("sodopel885@juicehour.com");
  const [password, setPassword] = useState("10111997@#");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard/resumes");
    } catch {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKickresumeLogin = async () => {
    setLoading(true);
    try {
      await login("sodopel885@juicehour.com", "10111997@#");
      router.push("/dashboard/resumes");
    } finally {
      setLoading(false);
    }
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
          Sign in to your Kickresume account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#ff5e59] hover:underline"
          >
            Create an account for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          {/* Kickresume test account banner */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200/80 rounded-2xl flex items-start gap-3 text-xs text-orange-950">
            <Sparkles className="w-5 h-5 text-[#ff5e59] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-gray-900 flex items-center gap-1.5">
                Official Account Ready
                <span className="text-[10px] bg-[#5345ff] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  Premium
                </span>
              </p>
              <p className="mt-0.5 text-gray-600 text-[11px] leading-relaxed">
                Pre-filled with your verified Kickresume account (5 AI credits, Premium plan).
              </p>
              <button
                type="button"
                onClick={handleKickresumeLogin}
                className="mt-2 inline-flex items-center text-xs font-bold text-[#ff5e59] hover:underline cursor-pointer"
              >
                1-Click Sign In as sodopel885@juicehour.com &rarr;
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-gray-700">
                Email Address
              </Label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10.5 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59] focus:ring-[#ff5e59]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-gray-700">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-[#ff5e59] hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10.5 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59] focus:ring-[#ff5e59]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold bg-[#ff5e59] hover:bg-[#ee4e34] text-white rounded-xl shadow-md shadow-orange-500/20 mt-2 transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
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
                  Quick Access
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full h-10.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 rounded-xl border-gray-200 hover:bg-gray-50"
                onClick={handleKickresumeLogin}
                type="button"
              >
                <ShieldCheck className="w-4 h-4 text-[#00b5b8]" />
                Continue with Kickresume Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
