# Frontend Audit

## Current State
- Built with React, Vite, Tailwind CSS, shadcn/ui.
- Uses Wouter for routing.

## Findings
- **Direct Fetching:** Components like `WorkspaceModule.tsx` and `CreateResume.tsx` are using raw `fetch()` calls to the backend, violating the rule to strictly use `api-client-react`.
- **State Management:** Needs separation of state (auth, profile, resume, job, workflow, AI, export, settings) to avoid scattered `isLoading` flags.
- **Clerk Integration:** Hardcoded fallback `FALLBACK_CLERK_KEY` found in `App.tsx`.
- **UI Consistency:** Broken buttons or dead routes need to be verified. The Settings button and navigation items require comprehensive verification.

## Action Items
- Refactor all direct API calls to use strictly typed React Query hooks from `api-client-react`.
- Audit and repair all Wouter routes.
- Implement specialized state stores (e.g., Zustand) for complex resume and workflow states.
