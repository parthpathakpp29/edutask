import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { submissionSchema } from "@/lib/validations"
import { ZodError } from "zod"


export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const assignmentId = searchParams.get("assignmentId")


    const where: Record<string, string> = {}
    if (session.user.role === "STUDENT") {
      where.studentId = session.user.id
      if (assignmentId) where.assignmentId = assignmentId
    } else if (assignmentId) {
      where.assignmentId = assignmentId
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: {
          select: { id: true, title: true, maxPoints: true, courseId: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    })

    return NextResponse.json(submissions)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}


export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can submit assignments" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = submissionSchema.parse(body)


    const existing = await prisma.submission.findFirst({
      where: {
        studentId: session.user.id,
        assignmentId: data.assignmentId,
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted this assignment" },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        content: data.content,
        studentId: session.user.id,
        assignmentId: data.assignmentId,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    )
  }
}
