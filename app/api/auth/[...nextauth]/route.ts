// This file wires up the next-auth v5 HTTP handlers for GET and POST.
// next-auth needs these two routes to handle login, logout, and session callbacks.
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
