"use server"

import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { ZodError } from "zod"

// ─── Login ───────────────────────────────────────────────────────────────────

// This is called by the LoginForm. On success, next-auth issues a JWT and
// redirects. On failure, we return an error string to display in the form.
export async function loginAction(
  prevState: string | null,
  formData: FormData
) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // signIn throws a NEXT_REDIRECT on success (which we re-throw below)
    // and throws AuthError on bad credentials
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    // AuthError means bad credentials
    if (error instanceof AuthError) {
      return "Invalid email or password"
    }
    // All other errors (including the internal NEXT_REDIRECT) must be re-thrown
    throw error
  }

  return null
}

// ─── Register ────────────────────────────────────────────────────────────────

// This is called by the RegisterForm. Creates the user then redirects to login.
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
    // Validate all fields using our Zod schema
    const validated = registerSchema.parse(data)

    // Check if an account with this email already exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    })
    if (existing) {
      return "An account with this email already exists"
    }

    // Hash the password before saving (never store plain text passwords)
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
    // Log the full error so we can see what's actually going wrong
    console.error("[registerAction] Error:", error)
    if (error instanceof ZodError) {
      return error.issues[0]?.message ?? "Invalid input"
    }
    return "Registration failed. Please try again."
  }

  // Registration successful — redirect to login with a success flag
  redirect("/login?registered=true")
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}
