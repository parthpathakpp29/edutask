import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import CourseForm from "@/components/courses/course-form"

export const metadata = { title: "New Course — EduTask" }

export default async function NewCoursePage() {
  const session = await auth()

  // Only instructors can create courses
  if (!session || session.user.role !== "INSTRUCTOR") {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details to create a new course for your students.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CourseForm />
      </div>
    </div>
  )
}
