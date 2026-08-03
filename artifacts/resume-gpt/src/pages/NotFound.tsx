import { Shell } from '@/components/layout/Shell';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <p className="text-xl text-foreground">View not found</p>
      </div>
    </div>
  );
}
