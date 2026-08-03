import { Link } from 'wouter';
import { ArrowRight, Sparkles, FileText, Target, Activity, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { resumeData, atsScore, targetMatchScore } = useAppStore();

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {resumeData.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground text-lg">Your career command center is ready.</p>
        </div>
        <Button asChild size="lg" className="rounded-full px-6 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-shadow">
          <Link href="/resume" className="flex items-center gap-2">
            Continue Editing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ATS Readiness */}
        <Card className="bg-card/50 backdrop-blur border-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> ATS Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold tracking-tighter text-success">{atsScore}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={atsScore} indicatorClassName="bg-success" className="h-1.5 mb-3" />
            <p className="text-sm text-muted-foreground">Top 12% of product design candidates.</p>
          </CardContent>
        </Card>

        {/* Target Role Match */}
        <Card className="bg-card/50 backdrop-blur border-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Target Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold tracking-tighter text-primary">{targetMatchScore}%</span>
            </div>
            <Progress value={targetMatchScore} className="h-1.5 mb-3" />
            <p className="text-sm text-muted-foreground">Matched against "Staff Product Designer".</p>
          </CardContent>
        </Card>

        {/* Active Profile */}
        <Card className="bg-primary text-primary-foreground border-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Active Profile</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-semibold mb-1">{resumeData.title}</div>
            <div className="text-sm text-primary-foreground/80 mb-4">{resumeData.experience.length} Roles • {resumeData.skills.length} Skills</div>
            <div className="flex gap-2">
              <Badge variant="glass" className="text-xs">Figma</Badge>
              <Badge variant="glass" className="text-xs">Design Systems</Badge>
              <Badge variant="glass" className="text-xs">+6 more</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 border-border/40 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> 
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Tailored actions to increase your interview rate.</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">3 Actions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Quantify Nexus Dynamics impact", desc: "Add specific metrics to your redesign bullet points to strengthen your executive narrative.", type: "Content", action: "Edit Experience" },
                { title: "Add missing keyword: 'Agile'", desc: "78% of your target roles require Agile methodology experience.", type: "Keyword", action: "Add Skill" },
                { title: "Trim summary length", desc: "Your summary is 42 words. ATS prefers crisp 20-30 word value propositions.", type: "Optimization", action: "Rewrite" }
              ].map((rec, i) => (
                <div key={i} className="flex items-start justify-between p-4 rounded-lg bg-background/40 border border-border/30 hover:border-border/80 transition-colors group">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{rec.type}</Badge>
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/resume">
                      {rec.action} <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/40 border-border/40 backdrop-blur h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                {[
                  { time: "2 hours ago", text: "Matched against Staff Designer at Stripe", icon: Target },
                  { time: "Yesterday", text: "Optimized resume summary", icon: Zap },
                  { time: "2 days ago", text: "Updated Nexus Dynamics experience", icon: FileText },
                ].map((act, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-background bg-muted-foreground/20 text-muted-foreground group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground group-[.is-active]:border-primary/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                       <act.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4 md:ml-0 p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1">{act.time}</div>
                      <div className="text-sm font-medium">{act.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
