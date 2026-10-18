import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, CoverLetterData } from '@/types/resume';
import { sampleResume } from '@/lib/sample-data';

const createEmptyResumeData = (): Omit<ResumeData, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: 'Untitled Resume',
  templateId: 'hoth',
  atsScore: 88,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  awards: [],
  sectionOrder: ['personalInfo', 'summary', 'workExperience', 'education', 'skills', 'languages', 'certifications', 'projects', 'awards'],
});

interface ResumeStore {
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  coverLetters: CoverLetterData[];
  currentCoverLetter: CoverLetterData | null;
  
  // Resume actions
  setResumes: (resumes: ResumeData[]) => void;
  setCurrentResume: (resume: ResumeData | null) => void;
  createResume: (title?: string) => ResumeData;
  updateResume: (id: string, data: Partial<ResumeData>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => ResumeData;
  loadSampleResume: () => ResumeData;
  
  // Cover letter actions
  setCoverLetters: (coverLetters: CoverLetterData[]) => void;
  setCurrentCoverLetter: (coverLetter: CoverLetterData | null) => void;
  createCoverLetter: (title?: string) => CoverLetterData;
  updateCoverLetter: (id: string, data: Partial<CoverLetterData>) => void;
  deleteCoverLetter: (id: string) => void;
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Math.random().toString(36).substring(2, 11);
};

const cloneResume = (resume: ResumeData): ResumeData => JSON.parse(JSON.stringify(resume)) as ResumeData;

export const useResumeStore = create<ResumeStore>()(persist((set, get) => ({
  resumes: [sampleResume],
  currentResume: null,
  coverLetters: [],
  currentCoverLetter: null,
  
  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  
  createResume: (title) => {
    const now = new Date().toISOString();
    const newResume: ResumeData = {
      ...createEmptyResumeData(),
      id: generateId(),
      title: title || 'Untitled Resume',
      atsScore: 85,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ resumes: [...state.resumes, newResume] }));
    return newResume;
  },
  
  updateResume: (id, data) => {
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
      ),
      currentResume:
        state.currentResume?.id === id
          ? { ...state.currentResume, ...data, updatedAt: new Date().toISOString() }
          : state.currentResume,
    }));
  },
  
  deleteResume: (id) => {
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
      currentResume: state.currentResume?.id === id ? null : state.currentResume,
    }));
  },
  
  duplicateResume: (id) => {
    const original = get().resumes.find((r) => r.id === id);
    if (!original) throw new Error('Resume not found');
    const now = new Date().toISOString();
    const duplicate: ResumeData = {
      ...cloneResume(original),
      id: generateId(),
      title: `${original.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ resumes: [...state.resumes, duplicate] }));
    return duplicate;
  },

  loadSampleResume: () => {
    const now = new Date().toISOString();
    const sample: ResumeData = {
      ...cloneResume(sampleResume),
      id: generateId(),
      title: 'Alex Johnson – Senior Engineer (Sample)',
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ resumes: [sample, ...state.resumes] }));
    return sample;
  },

  setCoverLetters: (coverLetters) => set({ coverLetters }),
  setCurrentCoverLetter: (coverLetter) => set({ currentCoverLetter: coverLetter }),
  
  createCoverLetter: (title) => {
    const now = new Date().toISOString();
    const newCoverLetter: CoverLetterData = {
      id: generateId(),
      title: title || 'Untitled Cover Letter',
      templateId: 'professional',
      recipientName: '',
      recipientTitle: '',
      companyName: '',
      companyAddress: '',
      date: new Date().toLocaleDateString(),
      greeting: 'Dear Hiring Manager,',
      openingParagraph: '',
      bodyParagraphs: [''],
      closingParagraph: '',
      signoff: 'Sincerely,',
      senderName: '',
      senderEmail: '',
      senderPhone: '',
      senderAddress: '',
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ coverLetters: [...state.coverLetters, newCoverLetter] }));
    return newCoverLetter;
  },
  
  updateCoverLetter: (id, data) => {
    set((state) => ({
      coverLetters: state.coverLetters.map((cl) =>
        cl.id === id ? { ...cl, ...data, updatedAt: new Date().toISOString() } : cl
      ),
      currentCoverLetter:
        state.currentCoverLetter?.id === id
          ? { ...state.currentCoverLetter, ...data, updatedAt: new Date().toISOString() }
          : state.currentCoverLetter,
    }));
  },
  
  deleteCoverLetter: (id) => {
    set((state) => ({
      coverLetters: state.coverLetters.filter((cl) => cl.id !== id),
      currentCoverLetter: state.currentCoverLetter?.id === id ? null : state.currentCoverLetter,
    }));
  },
}), {
  name: 'resumebuilder-documents-v1',
  partialize: (state) => ({
    resumes: state.resumes,
    coverLetters: state.coverLetters,
  }),
}));
