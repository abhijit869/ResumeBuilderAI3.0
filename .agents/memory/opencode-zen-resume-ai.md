---
name: OpenCode Zen resume AI
description: Provider and grounding rules for ResumeGPT's server-side AI workflow.
---

ResumeGPT uses the OpenCode Zen OpenAI-compatible chat endpoint. The configured agent models are `deepseek-v4-flash-free`, `nemotron-3-ultra-free`, `mimo-v2.5-free`, and `ling-3.0-flash-free`, with role-specific preference order and automatic fallback. The API key is stored as the `OPENCODEZEN_API_KEY` secret and must never be surfaced in logs or UI.

**Why:** The managed Replit AI provider setup was declined, while the user supplied an OpenCode Zen credential and requested a resilient multi-agent workflow using free models. All four requested model IDs returned successful endpoint responses during verification.

**How to apply:** Keep AI calls server-side, ground every generation step in persisted profile and job evidence, and return an explicit provider error instead of fabricated resume content when the provider is unavailable.