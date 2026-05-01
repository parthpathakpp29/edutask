

import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)


const protectedRoutes = ["/dashboard", "/courses", "/my-submissions"]


const authRoutes = ["/login", "/register"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path))
  const isAuthRoute = authRoutes.includes(pathname)


  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }


  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {

  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico).*)"],
}
