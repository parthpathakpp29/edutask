// Middleware runs on the edge runtime, so we use the lightweight auth config
// that has NO Prisma or Node.js dependencies.
// The full lib/auth.ts (with Prisma) is only used in server components + API routes.

import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Routes that need a logged-in user
const protectedRoutes = ["/dashboard", "/courses", "/my-submissions"]

// Routes that redirect logged-in users away (to dashboard)
const authRoutes = ["/login", "/register"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path))
  const isAuthRoute = authRoutes.includes(pathname)

  // Redirect unauthenticated users to login
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from login/register
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Skip Next.js internals and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
}
