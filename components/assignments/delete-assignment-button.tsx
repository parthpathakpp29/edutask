"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface DeleteAssignmentButtonProps {
  assignmentId: string
  courseId: string
  compact?: boolean
}

export default function DeleteAssignmentButton({
  assignmentId,
  courseId,
  compact = false,
}: DeleteAssignmentButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this assignment? All related submissions will also be deleted."
    )
    if (!confirmed) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push(`/courses/${courseId}`)
        router.refresh()
        return
      }

      const err = await res.json()
      alert(err.error || "Failed to delete assignment")
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
      className={
        compact
          ? "text-xs text-red-600 hover:text-red-700 font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-50"
          : "flex items-center gap-1.5 text-sm px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      }
    >
      <Trash2 className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {isLoading ? "Deleting..." : compact ? "Delete" : "Delete Assignment"}
    </button>
  )
}
