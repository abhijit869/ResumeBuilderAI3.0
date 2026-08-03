---
name: ResumeGPT deployment drift
description: Production debugging guidance for stale artifact builds and API contract mismatches.
---

The published ResumeGPT URL can continue serving an older successful artifact build after local API and frontend fixes are complete. A healthy production status only proves the old process is running; compare live API metadata and frontend bundle markers with the current source before diagnosing new code.

**Why:** Autoscale deployment builds are promoted through publishing, and restarting local workflows does not replace the public deployment. This can make the live API appear healthy while missing newly added routes or client behavior.

**How to apply:** After a production-only report, call deployment metadata/log tools, curl the published URL, compare `/api` route metadata and bundle markers, then ask the user to publish the current build. Do not claim the live fix is active until the published API reflects the current contract.