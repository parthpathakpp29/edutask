import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import StatsCard from "@/components/dashboard/stats-card"
import Link from "next/link"
import { BookOpen, FileText, Clock, CheckCircle, Plus } from "lucide-react"


export const metadata = { title: "Dashboard — EduTask" }

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isInstructor = session.user.role === "INSTRUCTOR"

  // ─── Fetch stats based on role ────────────────────────────────────────
  if (isInstructor) {
    // Instructor stats
    const [courseCount, assignmentCount, pendingCount] = await Promise.all([
      // How many courses this instructor has created
      prisma.course.count({
        where: { instructorId: session.user.id },
      }),
      // How many assignments across all their courses
      prisma.assignment.count({
        where: { course: { instructorId: session.user.id } },
      }),
      // How many submissions are waiting to be graded
      prisma.submission.count({
        where: {
          status: "SUBMITTED",
          assignment: { course: { instructorId: session.user.id } },
        },
      }),
    ])

    const recentSubmissions = await prisma.submission.findMany({
      where: {
        status: "SUBMITTED" as const,
        assignment: { course: { instructorId: session.user.id } },
      },
      include: {
        student: { select: { name: true } },
        assignment: { select: { title: true, courseId: true } },
      },
      orderBy: { submittedAt: "desc" as const },
      take: 5,
    })

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s an overview of your teaching activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="My Courses"
            value={courseCount}
            icon={<BookOpen className="w-5 h-5" />}
            color="indigo"
          />
          <StatsCard
            label="Total Assignments"
            value={assignmentCount}
            icon={<FileText className="w-5 h-5" />}
            color="violet"
          />
          <StatsCard
            label="Pending to Grade"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            color="blue"
            description="Submissions awaiting your review"
          />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="flex gap-3">
            <Link
              href="/courses/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Course
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>

        {/* Recent pending submissions */}
        {recentSubmissions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Pending Submissions
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sub.student.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sub.assignment.title}
                    </p>
                  </div>
                  <Link
                    href={`/courses/${sub.assignment.courseId}/assignments/${sub.assignmentId}/submissions`}
                    className="text-xs text-indigo-600 hover:underline font-medium"
                  >
                    Review →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Student Dashboard ────────────────────────────────────────────────
  const [courseCount, submissionCount, gradedCount] = await Promise.all([
    // Students see all courses
    prisma.course.count(),
    // Student's total submissions
    prisma.submission.count({ where: { studentId: session.user.id } }),
    // Student's graded submissions
    prisma.submission.count({
      where: { studentId: session.user.id, status: "GRADED" },
    }),
  ])

  const upcomingAssignments = await prisma.assignment.findMany({
    where: { dueDate: { gt: new Date() } },
    include: { course: { select: { title: true } } },
    orderBy: { dueDate: "asc" as const },
    take: 5,
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-500 mt-1">Track your courses and assignments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Available Courses"
          value={courseCount}
          icon={<BookOpen className="w-5 h-5" />}
          color="indigo"
        />
        <StatsCard
          label="My Submissions"
          value={submissionCount}
          icon={<FileText className="w-5 h-5" />}
          color="violet"
        />
        <StatsCard
          label="Graded"
          value={gradedCount}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Upcoming assignments */}
      {upcomingAssignments.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Upcoming Assignments
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {assignment.course.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-700">
                    {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400">Due date</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
