# ResumeBuilderAI 3.0 — Database Schema & Data Models

## Cloud Firestore Schema Hierarchy

```
/users/{uid}
  ├── displayName: string
  ├── email: string
  ├── photoURL: string (optional)
  ├── providerId: string
  ├── plan: string ("ResumeBuilderAi 3.0 Pro", "Free", "Tier 2")
  ├── createdAt: ISO 8601 string
  │
  ├── /resumes/{resumeId}
  │     ├── id: string (UUID)
  │     ├── userId: string (Owner UID)
  │     ├── title: string
  │     ├── templateId: string (TemplateId)
  │     ├── themeColor: string
  │     ├── fontFamily: string
  │     ├── fontSize: "compact" | "normal" | "comfortable"
  │     ├── lineSpacing: "tight" | "normal" | "relaxed"
  │     ├── marginSize: "compact" | "normal" | "generous"
  │     ├── pageSize: "A4" | "LETTER"
  │     ├── atsScore: number (0-100)
  │     ├── personalInfo: PersonalInfoObject
  │     ├── experience: Array<ExperienceItem>
  │     ├── education: Array<EducationItem>
  │     ├── skills: Array<SkillItem>
  │     ├── projects: Array<ProjectItem>
  │     ├── certifications: Array<string>
  │     ├── languages: Array<LanguageItem>
  │     ├── customSections: Array<CustomSectionItem>
  │     ├── sectionOrder: Array<string>
  │     ├── versionHistory: Array<VersionSnapshot>
  │     └── updatedAt: ISO 8601 string
  │
  ├── /coverLetters/{letterId}
  │     ├── id: string (UUID)
  │     ├── userId: string
  │     ├── title: string
  │     ├── templateId: string
  │     ├── matchingResumeId: string (optional)
  │     ├── recipientName: string
  │     ├── recipientTitle: string
  │     ├── companyName: string
  │     ├── companyAddress: string
  │     ├── letterDate: string
  │     ├── bodyParagraphs: Array<string>
  │     ├── themeColor: string
  │     ├── fontFamily: string
  │     └── updatedAt: ISO 8601 string
  │
  ├── /jobApplications/{jobId}
  │     ├── id: string
  │     ├── userId: string
  │     ├── company: string
  │     ├── role: string
  │     ├── status: "wishlist" | "applied" | "interviewing" | "offer" | "rejected"
  │     ├── salary: string
  │     ├── location: string
  │     ├── resumeIdUsed: string
  │     ├── notes: string
  │     └── updatedAt: ISO 8601 string
  │
  └── /portfolios/{portfolioId}
        ├── id: string
        ├── userId: string
        ├── slug: string
        ├── title: string
        ├── bio: string
        ├── published: boolean
        └── socialLinks: Record<string, string>
```
