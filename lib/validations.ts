import { z } from "zod"

// ─── Auth ───────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// ─── Courses ─────────────────────────────────────────────────────────────────

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // Course code: short identifier like "CS101"
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(10, "Code must be at most 10 characters"),
})

// ─── Assignments ─────────────────────────────────────────────────────────────

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // We receive dueDate as an ISO string from the form input
  dueDate: z.string().min(1, "Due date is required"),
  maxPoints: z.number().min(1, "Max points must be at least 1").max(1000),
  courseId: z.string().min(1, "Course ID is required"),
})

// ─── Submissions ─────────────────────────────────────────────────────────────

export const submissionSchema = z.object({
  content: z.string().min(10, "Submission must be at least 10 characters"),
  assignmentId: z.string().min(1, "Assignment ID is required"),
})

// ─── Grading ─────────────────────────────────────────────────────────────────

export const gradeSchema = z.object({
  grade: z.number().min(0, "Grade cannot be negative"),
  feedback: z.string().optional(),
  status: z.enum(["GRADED", "RETURNED"]),
})
