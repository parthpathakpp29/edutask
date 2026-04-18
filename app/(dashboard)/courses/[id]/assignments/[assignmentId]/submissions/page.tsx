import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, RotateCcw } from "lucide-react"
import GradeForm from "@/components/submissions/grade-form"

interface PageProps {
  params: Promise<{ id: string; assignmentId: string }>
}

// Status badge helper
function StatusBadge({ status }: { status: string }) {
  const styles = {
    SUBMITTED: "bg-yellow-100 text-yellow-700",
    GRADED: "bg-green-100 text-green-700",
    RETURNED: "bg-blue-100 text-blue-700",
  }
  const icons = {
    SUBMITTED: <Clock className="w-3 h-3" />,
    GRADED: <CheckCircle className="w-3 h-3" />,
    RETURNED: <RotateCcw className="w-3 h-3" />,
  }
  const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-600"
  const icon = icons[status as keyof typeof icons]

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${style}`}
    >
      {icon}
      {status}
    </span>
  )
}

export default async function SubmissionsPage({ params }: PageProps) {
  const session = await auth()
  if (!session || session.user.role !== "INSTRUCTOR") redirect("/dashboard")

  const { id: courseId, assignmentId } = await params

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: { select: { id: true, title: true, instructorId: true } },
    },
  })

  if (!assignment || assignment.courseId !== courseId) notFound()

  // Only the course instructor can see all submissions
  if (assignment.course.instructorId !== session.user.id) redirect("/dashboard")

  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { submittedAt: "desc" },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={`/courses/${courseId}/assignments/${assignmentId}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to assignment
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-500 mt-1">
          {assignment.title} — {submissions.length} submission
          {submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              {/* Student info + status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {sub.student.name}
                  </p>
                  <p className="text-sm text-gray-500">{sub.student.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted{" "}
                    {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <StatusBadge status={sub.status} />
              </div>

              {/* Submission content */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap mb-4 border border-gray-100">
                {sub.content}
              </div>

              {/* Grade form */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {sub.status === "SUBMITTED" ? "Grade this submission" : "Update grade"}
                </h3>
                <GradeForm
                  submission={{
                    id: sub.id,
                    grade: sub.grade,
                    feedback: sub.feedback,
                    aiFeedback: sub.aiFeedback,
                    status: sub.status,
                    student: sub.student,
                    assignment: { maxPoints: assignment.maxPoints },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
