"use client"

import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

interface NavbarProps {
  user: {
    name?: string | null
    email?: string | null
    role: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Left side — page context (could be used for breadcrumbs later) */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Welcome back,</span>
        <span className="font-semibold text-gray-900">{user.name}</span>
      </div>

      {/* Right side — user info + sign out */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-gray-900 leading-none">{user.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Sign out using a server action — no client-side auth state needed */}
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sign out
          </Button>
        </form>
      </div>
    </header>
  )
}
