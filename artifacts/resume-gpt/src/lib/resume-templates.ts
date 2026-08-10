import type { ResumeTemplate } from '@/store';
import img1 from '@assets/image_1785728969980.png';
import img2 from '@assets/image_1785728979292.png';
import img3 from '@assets/image_1785728986395.png';
import img4 from '@assets/image_1785728994722.png';
import img5 from '@assets/image_1785729003531.png';
import img6 from '@assets/image_1785729015438.png';
import img7 from '@assets/image_1785729058524.png';
import img8 from '@assets/image_1785729071425.png';
import img9 from '@assets/image_1785729091691.png';
import img10 from '@assets/image_1785729136518.png';
import img11 from '@assets/image_1785729169973.png';
import img12 from '@assets/image_1785729204118.png';
import img13 from '@assets/image_1785729255791.png';
import img14 from '@assets/image_1785729306904.png';
import img15 from '@assets/image_1785730912046.png';
import img16 from '@assets/image_1785730925607.png';
import img17 from '@assets/image_1785731001409.png';
import img18 from '@assets/image_1785731013224.png';
import img19 from '@assets/image_1785731074466.png';

export const DEFAULT_RESUME_TEMPLATE: ResumeTemplate = {
  id: 'ats-clarity',
  name: 'ATS Clarity',
  category: 'ATS optimized',
  description: 'Clean hierarchy, recruiter-friendly scanning, and reliable parsing.',
  accent: 'from-cyan-400 to-blue-500',
  accentColor: '#06b6d4',
  layout: 'ats',
  imageAsset: img1,
};

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  DEFAULT_RESUME_TEMPLATE,
  {
    id: 'executive-signal',
    name: 'Executive Signal',
    category: 'Executive',
    description: 'Confident typography and measured spacing for senior leadership roles.',
    accent: 'from-amber-300 to-orange-500',
    accentColor: '#f59e0b',
    layout: 'executive',
    imageAsset: img2,
  },
  {
    id: 'studio-grid',
    name: 'Studio Grid',
    category: 'Creative',
    description: 'A refined visual system for product, design, and brand portfolios.',
    accent: 'from-fuchsia-400 to-purple-500',
    accentColor: '#d946ef',
    layout: 'minimal',
    imageAsset: img3,
  },
  {
    id: 'modern-column',
    name: 'Modern Column',
    category: 'Modern',
    description: 'A balanced two-column layout with fast visual scanning.',
    accent: 'from-emerald-300 to-teal-500',
    accentColor: '#10b981',
    layout: 'technical',
    imageAsset: img4,
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    category: 'Academic',
    description: 'Structured sections for research, publications, and credentials.',
    accent: 'from-violet-300 to-indigo-500',
    accentColor: '#8b5cf6',
    layout: 'ats',
    imageAsset: img5,
  },
  {
    id: 'minimal-one',
    name: 'Minimal One',
    category: 'Minimal',
    description: 'Quiet, premium, and intentionally focused on your strongest evidence.',
    accent: 'from-slate-300 to-slate-500',
    accentColor: '#64748b',
    layout: 'minimal',
    imageAsset: img6,
  },
  {
    id: 'editorial-profile',
    name: 'Editorial Profile',
    category: 'Premium editorial',
    description: 'Centered identity, fine rules, compact timelines, and color-ready sections.',
    accent: 'from-teal-700 via-slate-700 to-cyan-500',
    accentColor: '#0f766e',
    layout: 'editorial',
    imageAsset: img7,
  },
  {
    id: 'midnight-sidebar',
    name: 'Midnight Sidebar',
    category: 'Professional',
    description: 'A strong dark information rail inspired by modern UX and product resumes.',
    accent: 'from-slate-950 via-slate-800 to-cyan-700',
    accentColor: '#22d3ee',
    layout: 'sidebar',
    imageAsset: img8,
  },
  {
    id: 'timeline-profile',
    name: 'Timeline Profile',
    category: 'Structured',
    description: 'A compact profile rail with a clear chronology for experience-led careers.',
    accent: 'from-indigo-950 via-slate-800 to-blue-600',
    accentColor: '#60a5fa',
    layout: 'timeline',
    imageAsset: img9,
  },
  {
    id: 'compact-executive',
    name: 'Compact Executive',
    category: 'Leadership',
    description: 'A crisp top header and dense evidence blocks for experienced candidates.',
    accent: 'from-slate-100 via-slate-300 to-slate-500',
    accentColor: '#334155',
    layout: 'executive',
    imageAsset: img10,
  },
  {
    id: 'technical-split',
    name: 'Technical Split',
    category: 'Technical',
    description: 'Experience stays dominant while highlights, education, and certifications stay visible.',
    accent: 'from-slate-700 via-cyan-700 to-cyan-400',
    accentColor: '#0891b2',
    layout: 'technical',
    imageAsset: img11,
  },
  {
    id: 'blueprint-minimal',
    name: 'Blueprint Minimal',
    category: 'Minimal',
    description: 'Airy two-column structure with blue section labels and a project-ready rhythm.',
    accent: 'from-sky-100 via-white to-blue-200',
    accentColor: '#0369a1',
    layout: 'minimal',
    imageAsset: img12,
  },
  {
    id: 'modern-focus',
    name: 'Modern Focus',
    category: 'Modern',
    description: 'Subtle sectioning and a focus on clean layout for modern professionals.',
    accent: 'from-purple-500 to-pink-500',
    accentColor: '#a855f7',
    layout: 'ats',
    imageAsset: img13,
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    category: 'Creative',
    description: 'High contrast and bold accents designed for maximum impact.',
    accent: 'from-red-500 to-orange-500',
    accentColor: '#ef4444',
    layout: 'minimal',
    imageAsset: img14,
  },
  {
    id: 'professional-standard',
    name: 'Professional Standard',
    category: 'Professional',
    description: 'A versatile format that adapts perfectly for general roles.',
    accent: 'from-blue-600 to-cyan-500',
    accentColor: '#2563eb',
    layout: 'technical',
    imageAsset: img15,
  },
  {
    id: 'classic-pro',
    name: 'Classic Pro',
    category: 'Traditional',
    description: 'A time-tested design with professional spacing and fonts.',
    accent: 'from-slate-500 to-gray-500',
    accentColor: '#6b7280',
    layout: 'ats',
    imageAsset: img16,
  },
  {
    id: 'designer-canvas',
    name: 'Designer Canvas',
    category: 'Creative',
    description: 'A visual canvas suited for designers and creative developers.',
    accent: 'from-rose-400 to-pink-500',
    accentColor: '#f43f5e',
    layout: 'editorial',
    imageAsset: img17,
  },
  {
    id: 'data-grid',
    name: 'Data Grid',
    category: 'Technical',
    description: 'A structured layout geared towards data scientists and engineers.',
    accent: 'from-emerald-500 to-cyan-500',
    accentColor: '#10b981',
    layout: 'technical',
    imageAsset: img18,
  },
  {
    id: 'startup-edge',
    name: 'Startup Edge',
    category: 'Modern',
    description: 'Fast-paced, contemporary layout perfect for startup roles.',
    accent: 'from-indigo-500 to-purple-600',
    accentColor: '#6366f1',
    layout: 'timeline',
    imageAsset: img19,
  }
];

export function templateWithLayout(template: ResumeTemplate): ResumeTemplate {
  return {
    ...DEFAULT_RESUME_TEMPLATE,
    ...template,
    layout: template.layout ?? (template.id === 'editorial-profile' ? 'editorial' : 'ats'),
  };
}