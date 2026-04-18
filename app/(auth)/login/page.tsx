import LoginForm from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In — EduTask",
  description: "Sign in to your EduTask account",
}

interface LoginPageProps {
  searchParams: Promise<{ registered?: string; callbackUrl?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams

  return (
    <LoginForm registeredSuccess={registered === "true"} />
  )
}
