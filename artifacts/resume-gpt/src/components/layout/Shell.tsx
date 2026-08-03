import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, FileText, Sparkles, Target, Briefcase, FileCode2, LineChart, Settings, Sun, Moon, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppProvider } from '@/store';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Create Resume", href: "/create", icon: Workflow },
  { title: "Resume Builder", href: "/resume", icon: FileText },
  { title: "AI Analyzer", href: "/analyzer", icon: Sparkles },
  { title: "Job Match", href: "/match", icon: Target },
  { title: "Cover Letter", href: "/cover-letter", icon: FileCode2 },
  { title: "Interview Prep", href: "/interview", icon: Briefcase },
  { title: "Analytics", href: "/analytics", icon: LineChart },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  // Force dark mode initially
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AppProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col z-20">
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ResumeGPT</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground mb-3 px-3 uppercase tracking-wider">Workspace</div>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-sidebar-border mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                RG
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">Your workspace</div>
                <div className="text-xs text-muted-foreground truncate">Live profile mode</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground justify-start px-2 w-full">
                <Link href="/analytics">
                <Settings className="w-4 h-4 mr-2" />
                Settings
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
          <div className="flex-1 overflow-y-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
