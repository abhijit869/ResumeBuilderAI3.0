import React, { createContext, useContext, useEffect, useState } from 'react';
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
};

const initialData: ResumeData = {
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

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [targetMatchScore, setTargetMatchScore] = useState<number>(0);
  const [resumeMode, setResumeMode] = useState<ResumeMode>('auto');
  const [profileSource, setProfileSource] = useState<ProfileSource>('current');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>({
    id: 'ats-clarity',
    name: 'ATS Clarity',
    category: 'ATS optimized',
    description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
    accent: 'from-cyan-400 to-blue-500',
    accentColor: '#06b6d4',
  });
  const [templateColor, setTemplateColor] = useState('#06b6d4');

  useEffect(() => {
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
  }, []);

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
