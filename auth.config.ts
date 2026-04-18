import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [], // No providers needed here — middleware only checks the JWT
  callbacks: {
    // The `authorized` callback runs on every request matched by the middleware.
    // We just check whether a valid session (JWT) exists.
    authorized({ auth }) {
      return !!auth
    },
  },
}
