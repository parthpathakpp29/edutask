import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

// POST /api/submissions/:id/ai-feedback
// Generates AI draft feedback for instructors using Groq.
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Only instructors can generate AI feedback" },
        { status: 403 }
      )
    }

    const { id } = await params

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { name: true } },
        assignment: {
          include: {
            course: { select: { instructorId: true, title: true } },
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    if (submission.assignment.course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"

    const systemPrompt =
      "You are an expert teaching assistant. Generate clear, constructive, concise academic feedback. Be specific, encouraging, and actionable."

    const userPrompt = [
      `Course: ${submission.assignment.course.title}`,
      `Assignment: ${submission.assignment.title}`,
      `Max points: ${submission.assignment.maxPoints}`,
      `Student: ${submission.student.name}`,
      "",
      "Student submission:",
      submission.content,
      "",
      "Write feedback in 3 short parts:",
      "1) What went well",
      "2) What to improve",
      "3) Next steps for the student",
      "",
      "Keep it under 160 words. Plain text only.",
    ].join("\n")

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 320,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!aiRes.ok) {
      const message = await aiRes.text()
      return NextResponse.json(
        { error: `Groq API request failed: ${message}` },
        { status: 502 }
      )
    }

    const aiData = (await aiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const aiFeedback = aiData.choices?.[0]?.message?.content?.trim()

    if (!aiFeedback) {
      return NextResponse.json(
        { error: "AI feedback generation returned empty response" },
        { status: 502 }
      )
    }

    await prisma.submission.update({
      where: { id },
      data: {
        aiFeedback,
        aiGenerated: true,
      },
    })

    return NextResponse.json({ aiFeedback })
  } catch {
    return NextResponse.json(
      { error: "Failed to generate AI feedback" },
      { status: 500 }
    )
  }
}
