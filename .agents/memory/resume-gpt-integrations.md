---
name: ResumeGPT integrations
description: External data boundaries for profile imports, job-page analysis, and AI tailoring.
---

ResumeGPT should treat profile and job data as permissioned inputs. LinkedIn import must read only an account the user explicitly authorizes; the product must not offer arbitrary-account fetching or private-profile scraping. Public job URL extraction should use a configured web-reading connector rather than pretending a local simulated result is a live scrape. AI tailoring should run server-side through a Replit AI Integration once the workflow moves beyond the local prototype.

**Why:** The available integration search did not expose a general LinkedIn OAuth/profile connector, and the web scraping connectors require workspace configuration before they can be bound to the app.

**How to apply:** Keep the current Resume Studio flow usable with manual/current-profile inputs, show honest authorization states for LinkedIn, and add live connector-backed steps only after the user enables the relevant connector from workspace settings.