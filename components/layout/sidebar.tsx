"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react"

interface SidebarProps {
  role: string
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  // Navigation links — students don't need "My Courses" (they see all)
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/courses",
      label: role === "INSTRUCTOR" ? "My Courses" : "All Courses",
      icon: BookOpen,
    },
    // Students have a separate "My Submissions" page
    ...(role === "STUDENT"
      ? [{ href: "/my-submissions", label: "My Submissions", icon: FileText }]
      : []),
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">EduTask</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          // Check if this link is currently active
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Role badge at the bottom */}
      <div className="p-4 border-t border-slate-700/50">
        <div
          className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
            role === "INSTRUCTOR"
              ? "bg-violet-500/20 text-violet-300"
              : "bg-blue-500/20 text-blue-300"
          }`}
        >
          {role}
        </div>
      </div>
    </aside>
  )
}
