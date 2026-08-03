import React, { createContext, useContext, useState } from 'react';

export type Experience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

export type ResumeData = {
  name: string;
  title: string;
  summary: string;
  experience: Experience[];
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
};

const initialData: ResumeData = {
  name: "Jordan Lee",
  title: "Senior Product Designer",
  summary: "Systems-thinking product designer with 8+ years of experience scaling zero-to-one B2B SaaS applications and enterprise platforms. Adept at turning complex technical constraints into intuitive, high-craft user interfaces. Proven track record of collaborating with cross-functional engineering teams to deliver robust component libraries.",
  contact: {
    email: "jordan.lee@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/jordanlee"
  },
  experience: [
    {
      id: "exp-1",
      role: "Lead Product Designer",
      company: "Nexus Dynamics",
      dates: "2021 - Present",
      bullets: [
        "Led the complete redesign of the core analytics platform, improving task completion rate by 42% and reducing customer support tickets by 18%.",
        "Established and maintained a comprehensive design system adopted by 6 cross-functional squads, cutting frontend development time by 30%.",
        "Mentored a team of 3 junior designers, driving weekly design crits and fostering a culture of high craft."
      ]
    },
    {
      id: "exp-2",
      role: "Product Designer",
      company: "Acumen AI",
      dates: "2018 - 2021",
      bullets: [
        "Designed end-to-end data pipeline visualization tools for machine learning engineers, directly contributing to a $15M Series B.",
        "Conducted extensive user research with technical stakeholders to synthesize complex workflows into simple drag-and-drop interfaces.",
        "Partnered closely with PMs to define MVP scope, ensuring rapid iteration cycles and weekly deployments."
      ]
    }
  ],
  skills: ["Figma", "React", "Design Systems", "User Research", "Prototyping", "Data Visualization", "CSS Architecture", "Framer"]
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [atsScore, setAtsScore] = useState<number>(86);
  const [targetMatchScore, setTargetMatchScore] = useState<number>(72);
  const [resumeMode, setResumeMode] = useState<ResumeMode>('auto');
  const [profileSource, setProfileSource] = useState<ProfileSource>('current');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>({
    id: 'ats-clarity',
    name: 'ATS Clarity',
    category: 'ATS optimized',
    description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
    accent: 'from-cyan-400 to-blue-500',
  });

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
