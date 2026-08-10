import { create } from 'zustand';

type WorkflowState = {
  // Global App States
  isLoading: boolean;
  
  // Resume Generation Workflow States
  workflowRunId: number | null;
  workflowStatus: 'idle' | 'in_progress' | 'completed' | 'failed';
  currentStep: 'planner' | 'writer' | 'editor' | null;
  
  // Actions
  setLoading: (isLoading: boolean) => void;
  startWorkflow: (runId: number) => void;
  updateWorkflowStep: (step: 'planner' | 'writer' | 'editor') => void;
  completeWorkflow: () => void;
  failWorkflow: () => void;
  resetWorkflow: () => void;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  isLoading: false,
  workflowRunId: null,
  workflowStatus: 'idle',
  currentStep: null,

  setLoading: (isLoading) => set({ isLoading }),
  
  startWorkflow: (runId) => set({ 
    workflowRunId: runId, 
    workflowStatus: 'in_progress', 
    currentStep: 'planner',
    isLoading: true
  }),

  updateWorkflowStep: (step) => set({ 
    currentStep: step,
    workflowStatus: 'in_progress' 
  }),

  completeWorkflow: () => set({ 
    workflowStatus: 'completed', 
    currentStep: null,
    isLoading: false
  }),

  failWorkflow: () => set({ 
    workflowStatus: 'failed', 
    isLoading: false 
  }),

  resetWorkflow: () => set({ 
    workflowRunId: null, 
    workflowStatus: 'idle', 
    currentStep: null,
    isLoading: false
  })
}));
