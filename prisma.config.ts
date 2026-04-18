
import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Always use the direct connection for CLI commands (migrate, db push, studio)
    url: process.env["DIRECT_URL"],

  },

})
