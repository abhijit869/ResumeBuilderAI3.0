import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('ResumeGPT workspace render error', error, info.componentStack);
  }

  private recover = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-background p-6 text-foreground">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            ResumeGPT
          </div>
          <h1 className="mt-3 text-2xl font-bold">We hit a temporary workspace error</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your saved work is still protected. Refresh the workspace and try again. If the problem continues,
            sign out and sign back in to refresh the secure session.
          </p>
          <Button type="button" className="mt-6" onClick={this.recover}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh workspace
          </Button>
        </section>
      </main>
    );
  }
}