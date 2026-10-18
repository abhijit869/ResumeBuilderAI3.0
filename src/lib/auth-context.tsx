"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  avatar?: string;
  aiCredits: number;
  remainingProxycurlCredits?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  updateProfile: (profile: Pick<User, "name" | "email">) => void;
  logout: () => void;
  upgradeToPremium: () => void;
  useAiCredit: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "user-kr-9648945",
  name: "sodopel885",
  email: "sodopel885@juicehour.com",
  plan: "premium",
  aiCredits: 5,
  remainingProxycurlCredits: 2,
  avatar: "https://d2sn08my3g92cp.cloudfront.net/avatar/user.png",
};

function getInitialUser(): User {
  if (typeof window === "undefined") return DEMO_USER;

  try {
    const saved = localStorage.getItem("resumebuilder_auth_user");
    return saved ? (JSON.parse(saved) as User) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const router = useRouter();

  const login = async (email: string, password?: string): Promise<boolean> => {
    // If user signs in with the specified Kickresume test account or any account
    const isKickresumeAccount = email.toLowerCase() === "sodopel885@juicehour.com";
    const loggedUser: User = {
      id: isKickresumeAccount ? "user-kr-9648945" : "user-" + Math.random().toString(36).substring(2, 9),
      name: isKickresumeAccount ? "sodopel885" : email.split("@")[0] || "User",
      email: email,
      plan: "premium",
      aiCredits: 5,
      avatar: "https://d2sn08my3g92cp.cloudfront.net/avatar/user.png",
    };
    setUser(loggedUser);
    localStorage.setItem("resumebuilder_auth_user", JSON.stringify(loggedUser));
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: "user-" + Math.random().toString(36).substring(2, 9),
      name: name || email.split("@")[0],
      email: email,
      plan: "free",
      aiCredits: 5,
    };
    setUser(newUser);
    localStorage.setItem("resumebuilder_auth_user", JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (profile: Pick<User, "name" | "email">) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = { ...currentUser, ...profile };
      localStorage.setItem("resumebuilder_auth_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("resumebuilder_auth_user");
    router.push("/login");
  };

  const upgradeToPremium = () => {
    if (user) {
      const updated: User = { ...user, plan: "premium" };
      setUser(updated);
      localStorage.setItem("resumebuilder_auth_user", JSON.stringify(updated));
    }
  };

  const useAiCredit = (): boolean => {
    if (!user) return false;
    if (user.aiCredits <= 0) return false;
    const updated: User = { ...user, aiCredits: user.aiCredits - 1 };
    setUser(updated);
    localStorage.setItem("resumebuilder_auth_user", JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading: false, login, signup, updateProfile, logout, upgradeToPremium, useAiCredit }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
