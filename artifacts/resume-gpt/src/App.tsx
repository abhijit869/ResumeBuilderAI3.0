import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Shell } from '@/components/layout/Shell';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import ResumeBuilder from '@/pages/ResumeBuilder';
import Analyzer from '@/pages/Analyzer';
import CreateResume from '@/pages/CreateResume';
import WorkspaceModule from '@/pages/WorkspaceModule';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/create" component={CreateResume} />
        <Route path="/resume" component={ResumeBuilder} />
        <Route path="/analyzer" component={Analyzer} />
        <Route path="/match"><WorkspaceModule kind="match" /></Route>
        <Route path="/cover-letter"><WorkspaceModule kind="cover-letter" /></Route>
        <Route path="/interview"><WorkspaceModule kind="interview" /></Route>
        <Route path="/analytics"><WorkspaceModule kind="analytics" /></Route>
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
