"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  updateProfile: (profile: Pick<User, "name" | "email">) => void;
  logout: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "user-default-1",
  name: "Alex Morgan",
  email: "alex@example.com",
  plan: "premium",
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

  const login = async (email: string): Promise<boolean> => {
    const loggedUser: User = {
      id: "user-" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0] || "User",
      email: email,
      plan: "premium",
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

  return (
    <AuthContext.Provider
      value={{ user, loading: false, login, signup, updateProfile, logout, upgradeToPremium }}
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
