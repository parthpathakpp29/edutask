import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { gradeSchema } from "@/lib/validations"
import { ZodError } from "zod"

type Params = { params: Promise<{ id: string }> }


export async function GET(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = await params

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: {
          include: {
            course: { select: { id: true, title: true, instructorId: true } },
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }


    if (
      session.user.role === "STUDENT" &&
      submission.studentId !== session.user.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(submission)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    )
  }
}


export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Only instructors can grade submissions" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const data = gradeSchema.parse(body)

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { assignment: { include: { course: true } } },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }


    if (submission.assignment.course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        grade: data.grade,
        feedback: data.feedback,
        status: data.status,
        gradedAt: new Date(),
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
      { error: "Failed to grade submission" },
      { status: 500 }
    )
  }
}
