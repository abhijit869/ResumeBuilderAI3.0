import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AI Cover Letter Studio | ResumeBuilderAi 3.0',
  description: 'Generate high-converting, tailored cover letters matching your resume template header styling.',
};

export default function CoverLetterPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="cover-letters" />;
}
