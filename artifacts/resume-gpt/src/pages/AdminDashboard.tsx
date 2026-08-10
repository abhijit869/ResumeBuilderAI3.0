import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Users, FileText, Target, FileCode2, RefreshCw } from 'lucide-react';
import { customFetch } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';

interface AdminMetrics {
  users: number;
  profiles: number;
  jobsAnalyzed: number;
  resumesGenerated: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customFetch<AdminMetrics>('/api/admin/metrics');
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load metrics. You might not have admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-5 md:p-7 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4 opacity-50" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h2>
        <p className="text-blue-200/60 drop-shadow-sm mb-6 max-w-md">{error}</p>
        <Button onClick={fetchMetrics} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Retry</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-full max-w-5xl p-5 md:p-7 relative font-sans text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-blue-200/60 drop-shadow-sm mt-2">Platform metrics and system status.</p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </motion.header>

      {loading && !metrics ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-muted/20">
              <CardHeader className="h-20" />
              <CardContent className="h-10" />
            </Card>
          ))}
        </div>
      ) : metrics ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200/60 drop-shadow-sm">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-200/60 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{metrics.users}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200/60 drop-shadow-sm">Profiles Synced</CardTitle>
              <FileText className="h-4 w-4 text-blue-200/60 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{metrics.profiles}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200/60 drop-shadow-sm">Jobs Analyzed</CardTitle>
              <Target className="h-4 w-4 text-blue-200/60 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{metrics.jobsAnalyzed}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200/60 drop-shadow-sm">Resumes Generated</CardTitle>
              <FileCode2 className="h-4 w-4 text-blue-200/60 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{metrics.resumesGenerated}</div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
