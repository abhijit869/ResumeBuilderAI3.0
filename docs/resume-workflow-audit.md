# Resume Workflow Audit

## Current State
- Resume generation lacks a formal state machine.

## Findings
- **Durability:** If generation or export fails, the entire process must be restarted.
- **State Tracking:** No tables or logic for `INITIALIZE -> IMPORT -> PARSE -> ... -> COMPLETE` (Phase 34).
- **Modes:** Missing strict implementations for Manual, Auto, Guided, and Expert modes.

## Action Items
- Implement `workflow_runs` and `workflow_steps` in the database.
- Build the workflow orchestrator in `api-server` to allow resumable and retryable generation steps.
