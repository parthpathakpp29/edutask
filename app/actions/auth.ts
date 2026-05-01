"use server"

import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { ZodError } from "zod"




export async function loginAction(
  prevState: string | null,
  formData: FormData
) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {

    if (error instanceof AuthError) {
      return "Invalid email or password"
    }

    throw error
  }

  return null
}




export async function registerAction(
  prevState: string | null,
  formData: FormData
) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  }

  try {

    const validated = registerSchema.parse(data)


    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    })
    if (existing) {
      return "An account with this email already exists"
    }


    const hashedPassword = await bcrypt.hash(validated.password, 10)

    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role as "STUDENT" | "INSTRUCTOR",
      },
    })
  } catch (error) {

    console.error("[registerAction] Error:", error)
    if (error instanceof ZodError) {
      return error.issues[0]?.message ?? "Invalid input"
    }
    return "Registration failed. Please try again."
  }


  redirect("/login?registered=true")
}



export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
