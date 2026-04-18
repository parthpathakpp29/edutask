import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { assignmentSchema } from "@/lib/validations"
import { ZodError } from "zod"

type Params = { params: Promise<{ id: string }> }

// GET /api/assignments/:id — Get a single assignment with submission count
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await params

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: { id: true, title: true, code: true, instructorId: true },
        },
        _count: { select: { submissions: true } },
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 }
    )
  }
}

// PUT /api/assignments/:id — Update an assignment (instructor owner only)
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = assignmentSchema.parse(body)

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }
    if (assignment.course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        maxPoints: data.maxPoints,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    )
  }
}

// DELETE /api/assignments/:id
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }
    if (assignment.course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    await prisma.assignment.delete({ where: { id } })
    return NextResponse.json({ message: "Assignment deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    )
  }
}
