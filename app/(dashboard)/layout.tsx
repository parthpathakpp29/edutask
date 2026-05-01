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

      <Sidebar role={session.user.role} />


      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <Navbar user={session.user} />


        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>

        </main>
      </div>
    </div>
  )
}
