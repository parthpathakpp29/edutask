import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { courseSchema } from "@/lib/validations"
import { ZodError } from "zod"

// GET /api/courses
// - Instructors: see only their own courses
// - Students: see all available courses
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const where =
      session.user.role === "INSTRUCTOR"
        ? { instructorId: session.user.id }
        : {} // Students see all courses

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { name: true, email: true } },
        _count: { select: { assignments: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

// POST /api/courses — Create a new course (instructors only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Only instructors can create courses" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = courseSchema.parse(body)

    const course = await prisma.course.create({
      data: { ...data, instructorId: session.user.id },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
