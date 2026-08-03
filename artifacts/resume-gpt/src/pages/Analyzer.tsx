import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ScanLine, ArrowRight, Target, AlertTriangle, CheckCircle2, Briefcase } from 'lucide-react';
import { useAppStore } from '@/store';

type AnalysisState = 'idle' | 'analyzing' | 'complete';

export default function Analyzer() {
  const { resumeData, setTargetMatchScore } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<AnalysisState>('idle');
  const [progress, setProgress] = useState(0);

  const handleAnalyze = () => {
    if (!jobDescription && !jobUrl) return;
    
    setStatus('analyzing');
    setProgress(0);
    
    // Simulate AI analysis steps
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setStatus('complete');
          setTargetMatchScore(84); // Update global state
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 mb-2">
          <ScanLine className="w-8 h-8 text-primary" />
          Role Analyzer
        </h1>
        <p className="text-muted-foreground text-lg">Compare your active resume against a target role description.</p>
      </header>

      {status === 'idle' && (
        <Card className="flex-1 bg-card/50 backdrop-blur border-border/50 shadow-2xl">
          <CardContent className="p-8 h-full flex flex-col">
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Job URL (Optional)</label>
                <Input 
                  placeholder="https://boards.greenhouse.io/stripe/jobs/12345" 
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="bg-background"
                />
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm uppercase tracking-widest">or paste</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-sm font-semibold text-foreground mb-2 block">Job Description</label>
                <Textarea 
                  placeholder="Paste the full job description here..." 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="flex-1 min-h-[200px] resize-none bg-background font-mono text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button size="lg" onClick={handleAnalyze} disabled={!jobDescription && !jobUrl} className="px-8 shadow-primary/20 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'analyzing' && (
        <Card className="flex-1 flex items-center justify-center bg-card/50 backdrop-blur border-primary/20 border">
          <div className="max-w-md w-full text-center space-y-6 p-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Analyzing Match...</h3>
              <p className="text-sm text-muted-foreground h-6">
                {progress < 30 ? "Extracting required skills..." : 
                 progress < 60 ? "Cross-referencing your experience..." : 
                 progress < 90 ? "Identifying skill gaps..." : "Finalizing match score..."}
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}

      {status === 'complete' && (
        <div className="flex-1 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-gradient-to-br from-card to-card/50 border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Target className="w-32 h-32" />
              </div>
              <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl font-black text-primary mb-2">84<span className="text-3xl text-primary/60">%</span></div>
                <h3 className="font-semibold text-lg mb-1">Strong Match</h3>
                <p className="text-sm text-muted-foreground">Your background aligns well with the core requirements.</p>
                <Button variant="outline" className="mt-6 w-full border-primary/20 hover:bg-primary/10">
                  Save to Job Tracker
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-muted-foreground" /> Extracted Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold mb-3 text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Matched Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {['Design Systems', 'Figma', 'Prototyping', 'Cross-functional Collaboration', 'User Research'].map(s => (
                        <Badge key={s} variant="success" className="bg-success/10 text-success border-success/20">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-3 text-warning flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missing / Weak Areas</div>
                    <div className="flex flex-wrap gap-2">
                      {['Growth Design', 'A/B Testing', 'Framer'].map(s => (
                        <Badge key={s} variant="outline" className="border-warning/50 text-warning">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "Update your Nexus Dynamics experience to highlight any A/B testing or growth metrics.", action: "Edit Nexus Role" },
                  { text: "Add 'Framer' to your technical skills list if you have experience with it.", action: "Add Skill" },
                  { text: "Generate a targeted cover letter bridging your B2B background with their growth focus.", action: "Draft Cover Letter" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border/50">
                    <p className="text-sm">{item.text}</p>
                    <Button size="sm" variant="secondary" className="shrink-0 ml-4">{item.action} <ArrowRight className="w-3 h-3 ml-2" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8">
             <Button variant="ghost" onClick={() => setStatus('idle')} className="text-muted-foreground">
               Start New Analysis
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
