import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/react';
import { getWorkspaceProfile } from '@workspace/api-client-react';

export type Experience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

export type Education = {
  school: string;
  degree: string;
  dates: string;
  details: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  link: string;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
};

export type Language = {
  name: string;
  proficiency: string;
};

export type ResumeData = {
  name: string;
  title: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  skills: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
};

export type ResumeMode = 'manual' | 'auto';
export type ProfileSource = 'current' | 'linkedin' | 'resume-file' | 'paste';
export type JobAnalysis = {
  id?: number;
  role: string;
  company: string;
  location: string;
  seniority: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  source: 'url' | 'description';
};
export type ResumeTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  accentColor: string;
  layout?: 'ats' | 'editorial' | 'sidebar' | 'timeline' | 'executive' | 'technical' | 'minimal';
};

export type AgentStep = {
  role: string;
  model: string;
  status: string;
};

export type AppState = {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  updateProfile: (profile: Partial<Pick<ResumeData, 'name' | 'title' | 'summary'>>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  updateSummary: (summary: string) => void;
  updateContact: (contact: Partial<ResumeData['contact']>) => void;
  updateSkills: (skills: string[]) => void;
  atsScore: number;
  setAtsScore: (score: number) => void;
  targetMatchScore: number;
  setTargetMatchScore: (score: number) => void;
  resumeMode: ResumeMode;
  setResumeMode: (mode: ResumeMode) => void;
  profileSource: ProfileSource;
  setProfileSource: (source: ProfileSource) => void;
  jobAnalysis: JobAnalysis | null;
  setJobAnalysis: (analysis: JobAnalysis | null) => void;
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  templateColor: string;
  setTemplateColor: (color: string) => void;
  agentWorkflow: AgentStep[];
  setAgentWorkflow: (workflow: AgentStep[]) => void;
};

function createInitialData(): ResumeData {
  return {
    name: "",
    title: "",
    summary: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      linkedin: ""
    },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    skills: []
  };
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: authLoaded, user } = useUser();
  const storageNamespace = user?.id ? `user-${user.id}` : 'guest';
  const storageKey = (name: string) => `resumegpt:${storageNamespace}:${name}`;
  const [resumeData, setResumeData] = useState<ResumeData>(() => createInitialData());
  const [atsScore, setAtsScore] = useState<number>(0);
  const [targetMatchScore, setTargetMatchScore] = useState<number>(0);
  const [resumeMode, setResumeMode] = useState<ResumeMode>('auto');
  const [profileSource, setProfileSource] = useState<ProfileSource>('current');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(() => {
    if (typeof window === 'undefined') return {
      id: 'ats-clarity',
      name: 'ATS Clarity',
      category: 'ATS optimized',
      description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
      accent: 'from-cyan-400 to-blue-500',
      accentColor: '#06b6d4',
      layout: 'ats',
    };
    try {
      const stored = window.localStorage.getItem(storageKey('selected-template'));
      if (stored) {
        const parsed = JSON.parse(stored) as ResumeTemplate;
        if (parsed?.id && parsed?.name) return parsed;
      }
    } catch {
      window.localStorage.removeItem(storageKey('selected-template'));
    }
    return {
      id: 'ats-clarity',
      name: 'ATS Clarity',
      category: 'ATS optimized',
      description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
      accent: 'from-cyan-400 to-blue-500',
      accentColor: '#06b6d4',
      layout: 'ats',
    };
  });
  const [templateColor, setTemplateColor] = useState(() => {
    if (typeof window === 'undefined') return '#06b6d4';
    return window.localStorage.getItem(storageKey('template-color')) || selectedTemplate.accentColor;
  });
  const [agentWorkflow, setAgentWorkflow] = useState<AgentStep[]>([]);
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!authLoaded) return;
    const nextUserId = user?.id ?? null;
    if (previousUserId.current === nextUserId) return;
    previousUserId.current = nextUserId;

    setResumeData(createInitialData());
    setAtsScore(0);
    setTargetMatchScore(0);
    setJobAnalysis(null);
    setAgentWorkflow([]);

    try {
      const storedTemplate = window.localStorage.getItem(storageKey('selected-template'));
      if (storedTemplate) {
        const parsed = JSON.parse(storedTemplate) as ResumeTemplate;
        if (parsed?.id && parsed?.name) setSelectedTemplate(parsed);
      }
      const storedColor = window.localStorage.getItem(storageKey('template-color'));
      setTemplateColor(storedColor || '#06b6d4');
    } catch {
      setTemplateColor('#06b6d4');
    }
  }, [authLoaded, user?.id]);

  useEffect(() => {
    if (!authLoaded || !user?.id) return;
    let cancelled = false;
    getWorkspaceProfile()
      .catch(() => null)
      .then(record => {
        if (cancelled || !record?.profile) return;
        const profile = record.profile as Partial<ResumeData>;
        setResumeData(current => ({
          ...current,
          ...profile,
          contact: { ...current.contact, ...(profile.contact ?? {}) },
          experience: Array.isArray(profile.experience) ? profile.experience : current.experience,
          education: Array.isArray(profile.education) ? profile.education : current.education,
          projects: Array.isArray(profile.projects) ? profile.projects : current.projects,
          certifications: Array.isArray(profile.certifications) ? profile.certifications : current.certifications,
          languages: Array.isArray(profile.languages) ? profile.languages : current.languages,
          skills: Array.isArray(profile.skills) ? profile.skills : current.skills,
        }));
        setProfileSource('linkedin');
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [authLoaded, user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedJob = window.localStorage.getItem(storageKey('last-job-analysis'));
    if (!savedJob) return;
    try {
      const parsed = JSON.parse(savedJob) as JobAnalysis;
      if (parsed?.role && parsed?.source) {
        setJobAnalysis(parsed);
        setTargetMatchScore(parsed.matchScore);
      }
    } catch {
      window.localStorage.removeItem(storageKey('last-job-analysis'));
    }
  }, [storageNamespace]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (jobAnalysis) window.localStorage.setItem(storageKey('last-job-analysis'), JSON.stringify(jobAnalysis));
    else window.localStorage.removeItem(storageKey('last-job-analysis'));
  }, [jobAnalysis, storageNamespace]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey('selected-template'), JSON.stringify(selectedTemplate));
    window.localStorage.setItem(storageKey('template-color'), templateColor);
  }, [selectedTemplate, templateColor, storageNamespace]);

  const updateProfile = (profile: Partial<Pick<ResumeData, 'name' | 'title' | 'summary'>>) => {
    setResumeData(prev => ({ ...prev, ...profile }));
  };

  const updateExperience = (id: string, exp: Partial<Experience>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...exp } : e)
    }));
  };

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, summary }));
  };

  const updateContact = (contact: Partial<ResumeData['contact']>) => {
    setResumeData(prev => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  };

  const updateSkills = (skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  return (
    <AppContext.Provider value={{ 
      resumeData, 
      setResumeData, 
      updateProfile,
      updateExperience,
      updateSummary,
      updateContact,
      updateSkills,
      atsScore, 
      setAtsScore,
      targetMatchScore,
      setTargetMatchScore,
      resumeMode,
      setResumeMode,
      profileSource,
      setProfileSource,
      jobAnalysis,
      setJobAnalysis,
      selectedTemplate,
      setSelectedTemplate,
      templateColor,
      setTemplateColor,
      agentWorkflow,
      setAgentWorkflow,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
