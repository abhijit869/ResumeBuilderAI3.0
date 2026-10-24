import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <ResumeBuilderApp initialMode="landing" initialDashboardTab="overview" />;
}

