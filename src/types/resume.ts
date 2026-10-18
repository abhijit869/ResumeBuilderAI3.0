export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'proficient' | 'fluent' | 'native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ResumeCustomization {
  accentColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
  fontSize?: 'sm' | 'md' | 'lg';
  spacing?: 'compact' | 'normal' | 'spacious';
  paperSize?: 'a4' | 'letter';
  showPhoto?: boolean;
  showSummary?: boolean;
  showProjects?: boolean;
  showCertifications?: boolean;
  showLanguages?: boolean;
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  sectionOrder: string[];
  customization?: ResumeCustomization;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterData {
  id: string;
  title: string;
  templateId: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  greeting: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signoff: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isPremium: boolean;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: 'free' | 'premium';
}
