import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { assignmentSchema } from "@/lib/validations"
import { ZodError } from "zod"

// GET /api/assignments?courseId=xxx — Get assignments for a specific course
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    const assignments = await prisma.assignment.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        course: { select: { title: true, code: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { dueDate: "asc" },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    )
  }
}

// POST /api/assignments — Create an assignment (instructors only)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Only instructors can create assignments" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = assignmentSchema.parse(body)

    // Verify that the course belongs to this instructor
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    })
    if (!course || course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 403 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate), // Convert ISO string to Date object
        maxPoints: data.maxPoints,
        courseId: data.courseId,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    )
  }
}
