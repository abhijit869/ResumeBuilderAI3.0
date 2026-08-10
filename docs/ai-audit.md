# AI Audit

## Current State
- Some generic API routes exist (`lib/workspace.ts` fetching OpenCode Zen).

## Findings
- **Model Registry:** No dynamic registry for discovering Zen models (e.g., `deepseek-v4-flash-free`).
- **Router:** No `ModelRouter` to handle fallback and "Free-first" logic.
- **Prompts:** No versioned `PromptRegistry`. Prompts might be hardcoded in application logic.
- **Providers:** No strict `OpenCodeZenProvider.ts` class.
- **External Dependencies:** Ensure absolutely no OpenRouter logic exists.

## Action Items
- Create `artifacts/api-server/src/ai/providers/OpenCodeZenProvider.ts`.
- Implement `ModelRegistry.ts`, `ModelRouter.ts`, and `PromptRegistry.ts` (Phase 7-12).
- Enforce Phase 10 "Free-first" model selection.
