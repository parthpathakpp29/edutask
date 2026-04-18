import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { courseSchema } from "@/lib/validations"
import { ZodError } from "zod"

// In Next.js 16, dynamic route params are a Promise and must be awaited
type Params = { params: Promise<{ id: string }> }

// GET /api/courses/:id — Get a single course with its assignments
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        assignments: {
          include: { _count: { select: { submissions: true } } },
          orderBy: { dueDate: "asc" },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

// PUT /api/courses/:id — Update a course (only the instructor who owns it)
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = courseSchema.parse(body)

    // Make sure the course exists and belongs to this instructor
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    if (course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own courses" },
        { status: 403 }
      )
    }

    const updated = await prisma.course.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

// DELETE /api/courses/:id — Delete a course (only the instructor who owns it)
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    if (course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own courses" },
        { status: 403 }
      )
    }

    // Cascade delete is configured in the schema (assignments + submissions delete too)
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
