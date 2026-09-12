// Prisma 7 configuration for the CLI (migrate, studio, generate). This is
// separate from how the running app connects to the database — the app
// uses the driver adapter directly in src/lib/db.ts. See
// https://pris.ly/d/config-datasource and docs/DECISIONS.md.
import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
