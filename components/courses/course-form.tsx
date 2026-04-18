"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"

interface CourseFormProps {
  // When editing, we pre-fill the form with existing data
  initialData?: {
    id: string
    title: string
    description: string
    code: string
  }
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Read field values from the form
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      code: (formData.get("code") as string).toUpperCase(), // Always uppercase
    }

    try {
      const url = isEditing
        ? `/api/courses/${initialData.id}`
        : "/api/courses"
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

      const course = await res.json()
      // Redirect to the course detail page after save
      router.push(`/courses/${course.id}`)
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
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-sm font-semibold text-slate-900">
            Course Title
          </Label>
        </div>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Introduction to Computer Science"
          defaultValue={initialData?.title}
          required
          minLength={3}
          className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4"
        />
        <p className="text-xs text-slate-600">Give your course a clear, descriptive title</p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="code" className="text-sm font-semibold text-slate-900">
            Course Code
          </Label>
          <span className="text-xs text-slate-500">3-10 chars</span>
        </div>
        <Input
          id="code"
          name="code"
          placeholder="e.g. CS101"
          defaultValue={initialData?.code}
          required
          minLength={3}
          maxLength={10}
          className="h-11 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4 uppercase"
        />
        <p className="text-xs text-slate-600">A unique identifier for this course</p>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="description" className="text-sm font-semibold text-slate-900">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What will students learn in this course? Include key topics, learning objectives, and any prerequisites..."
          defaultValue={initialData?.description}
          required
          rows={5}
          minLength={10}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/15 focus:ring-4 resize-none"
        />
        <p className="text-xs text-slate-600">Provide a clear overview of the course content</p>
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
            isEditing ? "Save Changes" : "Create Course"
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
