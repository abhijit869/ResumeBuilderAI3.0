import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export default function DashboardResumesPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="resumes" />;
}

