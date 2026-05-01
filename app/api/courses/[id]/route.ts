import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { courseSchema } from "@/lib/validations"
import { ZodError } from "zod"


type Params = { params: Promise<{ id: string }> }


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
  } catch {
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}


export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const data = courseSchema.parse(body)


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

    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ message: "Course deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
