import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '18 ATS Resume Templates | ResumeBuilderAi 3.0',
  description: 'Explore 18 code-rendered, battle-tested ATS resume templates across 7 industry categories.',
};

export default function TemplatesPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="templates" />;
}
