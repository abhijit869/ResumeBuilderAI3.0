import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="overview" />;
}

