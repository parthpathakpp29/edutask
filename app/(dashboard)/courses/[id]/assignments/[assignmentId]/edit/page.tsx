import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import AssignmentForm from "@/components/assignments/assignment-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string; assignmentId: string }>
}

export const metadata = { title: "Edit Assignment — EduTask" }

export default async function EditAssignmentPage({ params }: PageProps) {
  const session = await auth()
  if (!session || session.user.role !== "INSTRUCTOR") redirect("/dashboard")

  const { id: courseId, assignmentId } = await params

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  })

  if (!assignment || assignment.courseId !== courseId) notFound()
  if (assignment.course.instructorId !== session.user.id) redirect(`/courses/${courseId}`)

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/courses/${courseId}/assignments/${assignmentId}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to assignment
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
        <p className="text-gray-500 mt-1">Update assignment details below.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AssignmentForm
          courseId={courseId}
          initialData={{
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate.toISOString(),
            maxPoints: assignment.maxPoints,
          }}
        />
      </div>
    </div>
  )
}
