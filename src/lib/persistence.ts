import { ResumeData, CoverLetterData } from '@/types/resume';

const RESUMES_KEY = 'resumebuilder_resumes';
const COVER_LETTERS_KEY = 'resumebuilder_cover_letters';
const USER_KEY = 'resumebuilder_user';

export function saveResumes(resumes: ResumeData[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
  }
}

export function loadResumes(): ResumeData[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(RESUMES_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function saveCoverLetters(coverLetters: CoverLetterData[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COVER_LETTERS_KEY, JSON.stringify(coverLetters));
  }
}

export function loadCoverLetters(): CoverLetterData[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(COVER_LETTERS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function saveUser(user: { name: string; email: string; plan: string }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function loadUser(): { name: string; email: string; plan: string } | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USER_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}
