import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ATS Resume Checker & Heuristic Readiness | ResumeBuilderAi 3.0',
  description: 'Audit your resume against Fortune 500 ATS algorithms, keyword frequency benchmarks, and date consistency rules.',
};

export default function AtsCheckerPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="ats-checker" />;
}
