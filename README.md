# Resume Builder AI 3.0

Welcome to **Resume Builder AI 3.0**! This is a comprehensive, modern monorepo designed to power an AI-driven resume generation platform. The system leverages state-of-the-art frontend and backend technologies to provide a seamless, performant, and highly customizable resume-building experience.

## 🏗️ Project Architecture

This project is structured as a **pnpm workspace** monorepo, separating concerns into distinct applications and shared libraries.

### Applications (`/artifacts`)
- **`resume-gpt`**: The main frontend application built with React, Vite, Tailwind CSS (v4), and Shadcn UI components. It features a highly polished Windows 11-style glassmorphism dark mode UI. It serves as the user-facing interface where users can interact with the AI to build, analyze, and format their resumes.
- **`api-server`**: The backend Express server handling business logic, API requests, and interactions with AI models. It uses Drizzle ORM for database management and Clerk for secure authentication. 

### Shared Libraries (`/lib`)
- **`db`**: Database schemas and configurations using Drizzle ORM (PostgreSQL).
- **`api-spec` & `api-zod`**: Shared API types and validation schemas using Zod, ensuring type safety between the frontend and backend.
- **`api-client-react`**: Shared React query hooks and API clients to streamline frontend data fetching.

## 🚀 Key Features

- **Google Gemini AI Engine**: The core AI generation utilizes Google Gemini (`gemini-2.5-flash` and `gemini-2.5-pro`) via the official `@google/genai` SDK.
- **Bring Your Own Key (BYOK)**: Users can securely configure their own Google Gemini API Key directly in the frontend Settings UI, which is safely proxy-passed to the backend server.
- **Glassmorphism UI**: A deeply immersive dark mode UI leveraging backdrop blurs, glowing drop shadows, and Framer Motion micro-animations.
- **AI Agent Pipelines**: An intelligent multi-agent pipeline (Planner, Writer, Editor) working synchronously to analyze, rewrite, and ATS-optimize resumes and cover letters.

## 💻 How to Run Locally

To get the project up and running locally, follow these steps:

### Prerequisites
Make sure you have Node.js (v20+) and `pnpm` installed.

### 1. Install Dependencies
Run the following command at the root of the workspace to install all dependencies across the monorepo:
```bash
pnpm install
```

### 2. Set Up Environment Variables
Copy the example environment file and configure it with your specific API keys (Clerk, Database URL, etc.):
```bash
cp .env.example .env
```

### 3. Start Development Servers
You can run the full stack simultaneously using the root workspace command:
```bash
pnpm dev
```
This will concurrently start the `api-server` (port 8080) and the `resume-gpt` frontend client (port 3000 or via Vite proxy).

## 🧠 Process & Prompts (AI Interaction)

The core feature of this platform is its ability to use AI to generate, rewrite, and format resumes. 

### The AI Generation Process
1. **Input:** The user inputs raw details (experience, education, skills) or selects an existing profile.
2. **Analysis:** The `api-server` routes requests to the AI router using the user's provided Gemini API key.
3. **Generation:** The AI rewrites bullet points, optimizes for specific job descriptions (ATS optimization), and formats the output into strict JSON using Zod schemas.
4. **Render:** The frontend `resume-gpt` consumes the structured JSON and renders it into a beautiful, exportable document.

---

*Need to enable a specific feature or dive into a debugging session? Just let me know which application you'd like to focus on!*
