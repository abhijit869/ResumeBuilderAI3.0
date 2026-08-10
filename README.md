# Resume Builder AI 3.0

Welcome to **Resume Builder AI 3.0**! This is a comprehensive, modern monorepo designed to power an AI-driven resume generation platform. The system leverages state-of-the-art frontend and backend technologies to provide a seamless, performant, and highly customizable resume-building experience.

## 🏗️ Project Architecture

This project is structured as a **pnpm workspace** monorepo, separating concerns into distinct applications and shared libraries.

### Applications (`/artifacts`)
- **`resume-gpt`**: The main frontend application built with React, Vite, Tailwind CSS, and Shadcn UI components. It serves as the user-facing interface where users can interact with the AI to build and format their resumes.
- **`api-server`**: The backend Express server handling business logic, API requests, PDF parsing, and interactions with AI models. It uses Drizzle ORM for database management and Clerk for authentication.
- **`mockup-sandbox`**: A dedicated Vite sandbox environment for testing and developing isolated UI components before integrating them into the main application.

### Shared Libraries (`/lib`)
- **`db`**: Database schemas and configurations using Drizzle ORM.
- **`api-spec` & `api-zod`**: Shared API types and validation schemas using Zod, ensuring type safety between the frontend and backend.
- **`api-client-react`**: Shared React query hooks and API clients to streamline frontend data fetching.

## 🚀 How to Run and Scan the Project

To get the project up and running locally, follow these steps:

### Prerequisites
Make sure you have Node.js and `pnpm` installed.

### 1. Install Dependencies
Run the following command at the root of the workspace to install all dependencies across the monorepo:
```bash
pnpm install
```

### 2. Set Up Environment Variables
Copy the example environment file and configure it with your specific API keys (e.g., Clerk, Database URL, AI Provider):
```bash
cp .env.example .env
```

### 3. Start Development Servers
You can run the frontend and backend servers individually or use a workspace-wide command (if configured).

**To start the API Server:**
```bash
cd artifacts/api-server
pnpm run dev
```

**To start the Main Frontend (Resume GPT):**
```bash
cd artifacts/resume-gpt
pnpm run dev
```

## 🧠 Process & Prompts (AI Interaction)

The core feature of this platform is its ability to use AI to generate, rewrite, and format resumes. Below is a detailed explanation of the process and example prompts you can use to interact with the AI assistant (me!) to build out or modify features in this project.

### The AI Generation Process
1. **Input:** The user uploads an existing resume (PDF parsing via `pdf-parse`) or inputs raw details (experience, education, skills).
2. **Analysis:** The `api-server` analyzes the content using predefined AI schemas and Zod validations to extract structured data.
3. **Generation:** The AI rewrites bullet points, optimizes for specific job descriptions (ATS optimization), and formats the output.
4. **Render:** The frontend `resume-gpt` renders the structured data into a beautiful, exportable resume format using React components.

### 💬 Example Prompts to Evolve this Project
If you want to add new features or debug issues, you can ask me using prompts like these:

**For Frontend UI/UX:**
- *"Design a new beautiful, modern resume template component in `artifacts/resume-gpt` using Tailwind CSS and Framer Motion for smooth entry animations."*
- *"Implement a new multi-step form wizard for users to input their work experience step-by-step."*

**For Backend / AI Logic:**
- *"Update the Drizzle schema in `lib/db` to include a new table for saving cover letters, and create an API route in `api-server` to fetch them."*
- *"Create a new AI prompt utility in `api-server` that takes a user's raw bullet point and a target job description, and rewrites it to highlight matching keywords."*

**For Debugging:**
- *"I am getting a CORS error when my frontend tries to fetch data from the `api-server`. Can you debug and fix the CORS configuration?"*
- *"The PDF parser isn't extracting text correctly. Let's debug the file upload endpoint."*

---

*Need to enable a specific feature or dive into a debugging session? Just let me know which application you'd like to focus on!*
