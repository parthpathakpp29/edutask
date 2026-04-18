import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar — receives the user role to show role-specific nav items */}
      <Sidebar role={session.user.role} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navbar — receives user info for display */}
        <Navbar user={session.user} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
     
        </main>
      </div>
    </div>
  )
}
