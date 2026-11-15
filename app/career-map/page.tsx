import { ResumeBuilderApp } from '@/components/ResumeBuilderApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Job Application Pipeline & Tracker | ResumeBuilderAi 3.0',
  description: 'Manage job applications across Wishlist, Applied, Interviewing, and Offer stages with deadline reminders.',
};

export default function CareerMapPage() {
  return <ResumeBuilderApp initialMode="dashboard" initialDashboardTab="career-map" />;
}
