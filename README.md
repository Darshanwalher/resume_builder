# AI Resume Builder

AI-powered resume builder with a guided step-by-step wizard, Gemini-generated content, and built-in ATS scoring.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

AI Resume Builder is a full-stack web app that walks users through an 8-step guided wizard to build a professional resume, with Google Gemini assisting on experience, project, and skill descriptions along the way. It includes three print-ready templates, a live A4 preview, one-click PDF export, and an AI-generated ATS compatibility score, all wrapped in a custom-built UI with full dark/light theme support.

## Features

- **8-step guided wizard** — Personal Info, Education, Experience, Projects, Skills, Achievements, AI Summary, and Preview & PDF, with auto-save on every step transition
- **AI assistance (Google Gemini)** — generates work experience and project descriptions, suggests skills based on entered experience, writes a professional summary, and scores the finished resume for ATS compatibility
- **Three resume templates** — Minimalist, Modern Blue, and Corporate, each rendered as a true A4 preview and exported to PDF via the browser's print pipeline
- **ATS Score panel** — circular score ring plus AI-generated strengths, improvements, and recommendations for the resume
- **Dashboard** — manage multiple resumes, rename, duplicate workflow, and delete with confirmation
- **Auth** — JWT-based authentication with HttpOnly cookies and bcrypt password hashing
- **Dark / light theme** — system-wide theme toggle with no flash-of-wrong-theme on load
- **Fully custom UI** — no component library; every element is built with Tailwind CSS and vanilla React

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 (Turbopack) |
| HTTP Client | Axios |
| AI Engine | Google Gemini (`@google/genai`) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Font | Inter |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages + API route handlers
│   ├── auth/               # Login / Register
│   ├── dashboard/          # Resume list
│   ├── resume/[resumeId]/  # 8-step wizard workspace
│   └── api/                # auth, resume, and ai route handlers
├── components/             # All UI components (steps, providers, shared UI)
├── apis/                   # Frontend API call wrappers
├── services/               # Axios instance
├── types/                  # TypeScript interfaces
└── lib/                    # Server-side utilities (db, auth)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/<your-username>/ai-resume-builder.git
cd ai-resume-builder
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with Turbopack and fast HMR |
| `npm run build` | Production build + TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## API Overview

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Log in, sets JWT cookie |
| `/api/auth/logout` | POST | Clears the JWT cookie |
| `/api/auth/me` | GET | Returns the current authenticated user |
| `/api/resume` | GET | List all resumes for the current user |
| `/api/resume/create` | POST | Create a blank resume |
| `/api/resume/[resumeId]` | GET / PATCH / DELETE | Read, update, or delete a resume |
| `/api/ai/generate-experience-description` | POST | Gemini-generated work experience description |
| `/api/ai/generate-project-description` | POST | Gemini-generated project description |
| `/api/ai/generate-skills` | POST | Gemini-suggested skills |
| `/api/ai/generate-summary` | POST | Gemini-generated profile summary |
| `/api/ai/ats-score` | POST | Gemini-generated ATS analysis |
| `/api/ai/improve-content` | POST | Gemini-improved text for a given field |

