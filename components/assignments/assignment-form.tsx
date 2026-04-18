"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Calendar, Hash } from "lucide-react"

interface AssignmentFormProps {
  courseId: string
  initialData?: {
    id: string
    title: string
    description: string
    dueDate: string
    maxPoints: number
  }
}

export default function AssignmentForm({
  courseId,
  initialData,
}: AssignmentFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Format the date for the datetime-local input (requires "YYYY-MM-DDTHH:MM" format)
  const defaultDueDate = initialData?.dueDate
    ? new Date(initialData.dueDate).toISOString().slice(0, 16)
    : ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dueDate: new Date(formData.get("dueDate") as string).toISOString(),
      maxPoints: parseInt(formData.get("maxPoints") as string, 10),
      courseId,
    }

    try {
      const url = isEditing
        ? `/api/assignments/${initialData.id}`
        : "/api/assignments"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Something went wrong")
        return
      }

      // Go back to the course page
      router.push(`/courses/${courseId}`)
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2.5">
        <Label htmlFor="title" className="text-sm font-semibold text-slate-900">
          Assignment Title
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Week 3 Lab Report"
          defaultValue={initialData?.title}
          required
          minLength={3}
          className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="description" className="text-sm font-semibold text-slate-900">
          Description / Instructions
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the assignment requirements..."
          defaultValue={initialData?.description}
          required
          rows={5}
          minLength={10}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <Label htmlFor="dueDate" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            Due Date
          </Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            defaultValue={defaultDueDate}
            required
            className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="maxPoints" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-500" />
            Max Points
          </Label>
          <Input
            id="maxPoints"
            name="maxPoints"
            type="number"
            min={1}
            max={1000}
            defaultValue={initialData?.maxPoints ?? 100}
            required
            className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </span>
          ) : (
            isEditing ? "Save Changes" : "Post Assignment"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
