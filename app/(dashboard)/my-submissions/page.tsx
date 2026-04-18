import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, RotateCcw, FileText } from "lucide-react"


export const metadata = { title: "My Submissions — EduTask" }

function StatusBadge({ status }: { status: string }) {
  const config = {
    SUBMITTED: { style: "bg-yellow-100 text-yellow-700", label: "Pending" },
    GRADED: { style: "bg-green-100 text-green-700", label: "Graded" },
    RETURNED: { style: "bg-blue-100 text-blue-700", label: "Returned" },
  }
  const item = config[status as keyof typeof config] ?? {
    style: "bg-gray-100 text-gray-600",
    label: status,
  }

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${item.style}`}
    >
      {item.label}
    </span>
  )
}

export default async function MySubmissionsPage() {
  const session = await auth()

  // This page is only for students
  if (!session || session.user.role !== "STUDENT") redirect("/dashboard")

  const submissions = await prisma.submission.findMany({
    where: { studentId: session.user.id },
    include: {
      assignment: {
        include: { course: { select: { id: true, title: true } } },
      },
    },
    orderBy: { submittedAt: "desc" as const },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-gray-500 mt-1">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}{" "}
          total
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">You haven&apos;t submitted anything yet.</p>
          <Link
            href="/courses"
            className="text-indigo-600 font-medium hover:underline text-sm"
          >
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">
                    {sub.assignment.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sub.assignment.course.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted{" "}
                    {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                  <StatusBadge status={sub.status} />
                  {/* Show grade if graded */}
                  {sub.grade !== null && (
                    <span className="text-sm font-bold text-indigo-600">
                      {sub.grade} / {sub.assignment.maxPoints} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Show feedback if available */}
              {sub.feedback && (
                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700">
                  <strong>Feedback:</strong> {sub.feedback}
                </div>
              )}

              <div className="mt-3">
                <Link
                  href={`/courses/${sub.assignment.course.id}/assignments/${sub.assignmentId}`}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View assignment →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
