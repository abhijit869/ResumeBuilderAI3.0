import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/react';
import { getWorkspaceState } from '@workspace/api-client-react';
import { RESUME_TEMPLATES, templateWithLayout } from '@/lib/resume-templates';

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

function normalizeResumeData(value: unknown, base = createInitialData()): ResumeData {
  if (!value || typeof value !== 'object') return base;
  const candidate = value as Partial<ResumeData>;
  return {
    ...base,
    ...candidate,
    contact: { ...base.contact, ...(candidate.contact ?? {}) },
    experience: Array.isArray(candidate.experience) ? candidate.experience : base.experience,
    education: Array.isArray(candidate.education) ? candidate.education : base.education,
    projects: Array.isArray(candidate.projects) ? candidate.projects : base.projects,
    certifications: Array.isArray(candidate.certifications) ? candidate.certifications : base.certifications,
    languages: Array.isArray(candidate.languages) ? candidate.languages : base.languages,
    skills: Array.isArray(candidate.skills) ? candidate.skills : base.skills,
  };
}

function normalizeJobAnalysis(value: {
  id: number;
  source: 'url' | 'description';
  job: Record<string, unknown>;
  comparison: Record<string, unknown>;
}): JobAnalysis {
  const job = value.job;
  const comparison = value.comparison;
  const stringValue = (candidate: unknown, fallback: string) => typeof candidate === 'string' && candidate.trim() ? candidate : fallback;
  const stringArray = (candidate: unknown) => Array.isArray(candidate) ? candidate.filter((item): item is string => typeof item === 'string') : [];
  return {
    id: value.id,
    source: value.source,
    role: stringValue(job.title, 'Target role'),
    company: stringValue(job.company, 'Target company'),
    location: stringValue(job.location, 'See job listing'),
    seniority: stringValue(job.seniority, 'Not specified'),
    summary: stringValue(job.summary, 'Saved target role analysis'),
    matchedSkills: stringArray(comparison.matchedSkills),
    missingSkills: stringArray(comparison.missingSkills),
    matchScore: typeof comparison.matchScore === 'number' ? comparison.matchScore : 0,
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
  const [readyStorageNamespace, setReadyStorageNamespace] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoaded) return;
    const nextUserId = user?.id ?? null;
    if (previousUserId.current === nextUserId) return;
    previousUserId.current = nextUserId;
    setReadyStorageNamespace(null);

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
    setReadyStorageNamespace(storageNamespace);
  }, [authLoaded, user?.id]);

  useEffect(() => {
    if (!authLoaded || !user?.id) return;
    let cancelled = false;
    getWorkspaceState()
      .then(state => {
        if (cancelled) return;
        if (state.profile?.profile) {
          setResumeData(current => normalizeResumeData(state.profile?.profile, current));
          setProfileSource(state.profile.source === 'public-url' ? 'linkedin' : 'current');
        }
        if (state.job) {
          const job = normalizeJobAnalysis(state.job);
          setJobAnalysis(job);
          setTargetMatchScore(job.matchScore);
        }
        if (state.resume?.resume) {
          const savedResume = normalizeResumeData(state.resume.resume);
          setResumeData(savedResume);
          setResumeMode(state.resume.mode);
          const savedWorkflow = state.resume.resume.agentWorkflow;
          if (Array.isArray(savedWorkflow)) setAgentWorkflow(savedWorkflow as AgentStep[]);
          const savedTemplate = RESUME_TEMPLATES.find(template => template.id === state.resume?.templateId);
          if (savedTemplate) {
            const template = templateWithLayout(savedTemplate);
            setSelectedTemplate(template);
            setTemplateColor(template.accentColor);
          }
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [authLoaded, user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || readyStorageNamespace !== storageNamespace) return;
    window.localStorage.setItem(storageKey('selected-template'), JSON.stringify(selectedTemplate));
    window.localStorage.setItem(storageKey('template-color'), templateColor);
  }, [selectedTemplate, templateColor, storageNamespace, readyStorageNamespace]);

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
