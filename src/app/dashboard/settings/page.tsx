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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, login details, and subscription.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Your settings have been saved successfully.</span>
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <Badge className="bg-white/20 text-white border-none mb-2">
            Current Plan
          </Badge>
          <h2 className="text-2xl font-bold">Pro Plan (Unlimited Access)</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Access to all 35+ templates, AI resume writer, and unlimited PDF downloads.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="outline"
            className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold"
          >
            Manage Billing
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>

        <form onSubmit={handleSave} className="space-y-5 max-w-lg">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-1.5 relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Change Password</Label>
            <div className="mt-1.5 relative">
              <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="pl-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
