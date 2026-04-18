import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import AssignmentForm from "@/components/assignments/assignment-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewAssignmentPage({ params }: PageProps) {
  const session = await auth()
  if (!session || session.user.role !== "INSTRUCTOR") redirect("/dashboard")

  const { id: courseId } = await params

  // Verify the course exists and belongs to this instructor
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) notFound()
  if (course.instructorId !== session.user.id) redirect(`/courses/${courseId}`)

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/courses/${courseId}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {course.title}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Assignment</h1>
        <p className="text-gray-500 mt-1">
          Create an assignment for <strong>{course.title}</strong>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AssignmentForm courseId={courseId} />
      </div>
    </div>
  )
}
