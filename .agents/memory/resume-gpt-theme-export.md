---
name: ResumeGPT theme and export boundary
description: Browser-only theme and export implementation constraints for the ResumeGPT frontend.
---

ResumeGPT’s theme and download controls use native browser APIs and local state rather than introducing new provider-based UI dependencies. System mode is applied before the first React render and listens for OS preference changes; PDF, PNG, and JPG downloads are generated from the structured resume data.

**Why:** The workspace showed duplicate React context errors when provider-based theme and dropdown packages were introduced into the running frontend, while native controls remained stable.

**How to apply:** Prefer the existing native theme utility and export menu for future resume UX work. Keep downloaded files independent of editor chrome and preserve the saved resume model as the source of truth.