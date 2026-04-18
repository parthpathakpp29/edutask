"use client"

import { useActionState } from "react"
import { registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, UserPlus, Mail, Lock, User, BookOpen, Briefcase } from "lucide-react"

export default function RegisterForm() {
  const [error, action, isPending] = useActionState(registerAction, null)

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
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-slate-400 mt-2">Join EduTask and transform education</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-sm font-semibold text-white">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  required
                  className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4"
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-semibold text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4"
                />
              </div>
              <p className="text-xs text-slate-400">Create a strong password with at least 6 characters</p>
            </div>

            {/* Role selection */}
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-semibold text-white">What&apos;s your role?</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Student option */}
                <label className="relative flex cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 text-center rounded-lg border-2 border-slate-700 bg-slate-800/30 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 transition-all duration-200">
                    <BookOpen className="w-5 h-5 text-slate-400 peer-checked:text-indigo-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-slate-300 peer-checked:text-indigo-300">Student</div>
                    <div className="text-xs text-slate-500 peer-checked:text-indigo-400 mt-1">Learn & submit</div>
                  </div>
                </label>

                {/* Instructor option */}
                <label className="relative flex cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="INSTRUCTOR"
                    className="sr-only peer"
                  />
                  <div className="w-full p-4 text-center rounded-lg border-2 border-slate-700 bg-slate-800/30 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 transition-all duration-200">
                    <Briefcase className="w-5 h-5 text-slate-400 peer-checked:text-indigo-400 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-slate-300 peer-checked:text-indigo-300">Instructor</div>
                    <div className="text-xs text-slate-500 peer-checked:text-indigo-400 mt-1">Create & manage</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mt-6"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">Already registered?</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
