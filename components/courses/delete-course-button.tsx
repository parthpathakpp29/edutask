"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    // Ask the user to confirm before deleting
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This will also delete all assignments and submissions."
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/courses")
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to delete course")
      }
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="flex items-center gap-1.5 text-sm px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  )
}
