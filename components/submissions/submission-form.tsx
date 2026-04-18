"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Send } from "lucide-react"

interface SubmissionFormProps {
  assignmentId: string
  // If the student already submitted, show the existing content (read-only)
  existingSubmission?: {
    id: string
    content: string
    status: string
    grade: number | null
    feedback: string | null
  }
}

export default function SubmissionForm({
  assignmentId,
  existingSubmission,
}: SubmissionFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // If already submitted, show the submitted content + result
  if (existingSubmission) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">You have already submitted this assignment.</p>
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-slate-900">Your Submission</Label>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
            {existingSubmission.content}
          </div>
        </div>

        {/* Show grade if it's been graded */}
        {existingSubmission.status !== "SUBMITTED" && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-indigo-700">
              Grade: {existingSubmission.grade ?? "—"} points
            </p>
            {existingSubmission.feedback && (
              <p className="text-sm text-indigo-700/90">
                Feedback: {existingSubmission.feedback}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      content: formData.get("content") as string,
      assignmentId,
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Something went wrong")
        return
      }

      // Refresh the page to show the submitted state
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-2.5">
        <Label htmlFor="content" className="text-sm font-semibold text-slate-900">
          Your Answer / Work
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your submission here..."
          required
          rows={8}
          minLength={10}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4 resize-none"
        />
        <p className="text-xs text-slate-600">Minimum 10 characters</p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Assignment
          </span>
        )}
      </Button>
    </form>
  )
}
