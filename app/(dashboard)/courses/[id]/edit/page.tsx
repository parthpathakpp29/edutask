import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import CourseForm from "@/components/courses/course-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: PageProps) {
  const session = await auth()
  if (!session || session.user.role !== "INSTRUCTOR") redirect("/dashboard")

  const { id } = await params

  const course = await prisma.course.findUnique({ where: { id } })

  if (!course) notFound()

  // Only the course owner can edit it
  if (course.instructorId !== session.user.id) redirect("/courses")

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/courses/${id}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to course
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-500 mt-1">Update course details below.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CourseForm initialData={course} />
      </div>
    </div>
  )
}
