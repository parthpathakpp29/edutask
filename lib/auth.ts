// Full auth configuration — runs server-side only (API routes, server components).
// This file CAN import Prisma and bcrypt since it never runs on the edge runtime.

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Spread the shared edge-safe config (session strategy, pages, trustHost...)
  ...authConfig,

  // Add the Credentials provider — this needs Prisma and bcrypt (Node.js only)
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        // Look up user in the database
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        // Return user data — stored in JWT token
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],

  callbacks: {
    // Add id and role to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },

    // Copy id and role from token into session.user
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
