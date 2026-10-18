"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Check } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex@example.com");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your Kickresume profile, login credentials, and Premium subscription.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-2 text-[#ee4e34] text-sm font-bold">
          <Check className="w-4 h-4 text-[#ff5e59]" />
          <span>Your Kickresume settings have been saved successfully.</span>
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-700/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#ff5e59] text-white border-none font-bold text-xs uppercase tracking-wider">
              Premium Plan Active
            </Badge>
            <span className="text-xs text-gray-300 font-mono">
              Account ID: {user?.id || "9648945"}
            </span>
          </div>
          <h2 className="text-2xl font-black">Kickresume Full Pro Suite</h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-md">
            Full access to all 35+ templates (Hoth, Europe, Vegan), {user?.aiCredits ?? 5} remaining AI credits, ATS scanner, and unlimited high-res PDF exports.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border-white/20 cursor-pointer"
          >
            Manage Subscription
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-black text-gray-900 mb-6">Profile Information</h3>

        <form onSubmit={handleSave} className="space-y-5 max-w-lg">
          <div>
            <Label htmlFor="name" className="text-xs font-bold text-gray-700">Full Name</Label>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
            <div className="mt-1.5 relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-xs font-bold text-gray-700">Change Password</Label>
            <div className="mt-1.5 relative">
              <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="pl-9 rounded-xl border-gray-200 text-sm focus:border-[#ff5e59]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-[#ff5e59] hover:bg-[#ee4e34] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/20 cursor-pointer transition-all"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
