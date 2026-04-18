# EduTask

Full-stack assignment management platform built for the **House of Edtech - Fullstack Developer Fulltime Assignment 1**.

## Overview

EduTask helps instructors and students manage the complete assignment lifecycle:

- Instructors can create courses, post assignments, review submissions, and grade students.
- Students can browse enrolled/available courses, submit assignment work, and view grading feedback.
- Role-based access control ensures each user only sees actions relevant to their role.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React + TypeScript
- **Styling/UI**: Tailwind CSS v4 + Base UI primitives + custom reusable components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth (Credentials Provider) + middleware route protection
- **Validation**: Zod schemas for API input validation

## Core Features

### Authentication & Authorization
- Register and login with role selection (`INSTRUCTOR` / `STUDENT`)
- Auth forms use **Server Actions** (`app/actions/auth.ts`) for login/register/logout
- NextAuth credentials flow is exposed via `app/api/auth/[...nextauth]/route.ts`
- Protected routes via middleware
- Server-side role checks in API routes and pages

### Course Management (CRUD)
- Create course
- View all courses / owned courses
- Edit course
- Delete course (cascades assignments and submissions)

### Assignment Management (CRUD)
- Create assignment
- View assignment details
- Edit assignment
- Delete assignment

### Submission & Grading Workflow
- Students submit assignment responses
- Duplicate submissions prevented for same assignment/student pair
- Instructors view all submissions per assignment
- Instructors grade and provide feedback

### UX & UI
- Responsive dashboard layout
- Accessible, high-contrast form controls
- Improved visibility for labels, helper text, placeholders, and feedback states

## Project Structure (High-Level)

- `app/` - Routes, layouts, API handlers
- `components/` - Reusable UI + feature components
- `lib/` - Auth, Prisma client, validation schemas, helpers
- `prisma/` - Schema and migrations

## API Routes

- `GET/POST /api/auth/[...nextauth]`
- `GET/POST /api/courses`
- `GET/PUT/DELETE /api/courses/:id`
- `GET/POST /api/assignments`
- `GET/PUT/DELETE /api/assignments/:id`
- `GET/POST /api/submissions`
- `GET/PUT /api/submissions/:id`

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Runtime DB URL (pooler)
DATABASE_URL=

# Direct DB URL for Prisma migrations
DIRECT_URL=

# NextAuth
AUTH_SECRET=
NEXTAUTH_URL=

# AI (Groq)
GROQ_API_KEY=
# Optional, defaults to llama-3.3-70b-versatile
GROQ_MODEL=
```

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

- **Live App**: _Add your deployed URL here_
- **Repository**:[ _Add your GitHub repository URL here_](https://github.com/parthpathakpp29/edutask/)

Recommended hosting: Vercel with PostgreSQL (or Supabase Postgres).

## Candidate Details

- **Name**: Parth Patak
- **GitHub**: [github.com/parthpathakpp29](https://github.com/parthpathakpp29)
- **LinkedIn**: [linkedin.com/in/parth-pathak-69626b249](https://www.linkedin.com/in/parth-pathak-69626b249/)
