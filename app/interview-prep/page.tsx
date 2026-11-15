import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'STAR Method Interview Preparation | ResumeBuilderAi 3.0',
  description: 'Practice behavioral interview questions, technical architecture scenarios, and reverse interview questions.',
};

export default function InterviewPrepPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="interview-prep" />;
}
