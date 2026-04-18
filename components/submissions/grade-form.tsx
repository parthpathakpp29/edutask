"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Sparkles } from "lucide-react"

interface GradeFormProps {
  submission: {
    id: string
    grade: number | null
    feedback: string | null
    aiFeedback?: string | null
    status: string
    student: { name: string; email: string }
    assignment: { maxPoints: number }
  }
}

export default function GradeForm({ submission }: GradeFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [feedback, setFeedback] = useState(
    submission.feedback ?? submission.aiFeedback ?? ""
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      grade: parseFloat(formData.get("grade") as string),
      feedback: formData.get("feedback") as string,
      status: "GRADED" as const,
    }

    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Something went wrong")
        return
      }

      setSuccess(true)
      router.refresh() // Re-fetch the page to show updated status
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGenerateAIFeedback() {
    setError("")
    setSuccess(false)
    setIsGeneratingAI(true)

    try {
      const res = await fetch(`/api/submissions/${submission.id}/ai-feedback`, {
        method: "POST",
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Failed to generate AI feedback")
        return
      }

      const data = (await res.json()) as { aiFeedback: string }
      setFeedback(data.aiFeedback)
    } catch {
      setError("Network error while generating AI feedback.")
    } finally {
      setIsGeneratingAI(false)
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

      {success && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Grade saved successfully!</p>
        </div>
      )}

      <div className="space-y-2.5">
        <Label htmlFor="grade" className="text-sm font-semibold text-slate-900">
          Grade{" "}
          <span className="text-slate-500 font-normal text-xs">
            (out of {submission.assignment.maxPoints})
          </span>
        </Label>
        <Input
          id="grade"
          name="grade"
          type="number"
          min={0}
          max={submission.assignment.maxPoints}
          defaultValue={submission.grade ?? ""}
          step={0.5}
          required
          className="w-32 h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4"
        />
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="feedback" className="text-sm font-semibold text-slate-900">
            Feedback
          </Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateAIFeedback}
            disabled={isGeneratingAI || isLoading}
            className="h-8 px-3 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {isGeneratingAI ? "Generating..." : "Generate AI Feedback"}
          </Button>
        </div>
        <Textarea
          id="feedback"
          name="feedback"
          placeholder="Provide feedback to the student..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4 resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          "Save Grade"
        )}
      </Button>
    </form>
  )
}
