"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, CheckCircle, Mail, Lock } from "lucide-react"

export default function LoginForm({
  registeredSuccess,
}: {
  registeredSuccess?: boolean
}) {
  const [error, action, isPending] = useActionState(loginAction, null)

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-2xl" />

        {/* Form container */}
        <div className="relative bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 mt-2">Sign in to your EduTask account</p>
          </div>

          {/* Success message */}
          {registeredSuccess && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <p className="text-sm text-green-300">Account created successfully! Please sign in.</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-white">
                  Password
                </Label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mt-6"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">New to EduTask?</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
