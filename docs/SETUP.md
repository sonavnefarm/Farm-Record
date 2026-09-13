# Setup

## 1. Prerequisites

- Node.js 18.18+ (LTS recommended)
- npm
- A PostgreSQL database (local via Docker, or a hosted Vercel-compatible
  provider such as Vercel Postgres, Neon, or Supabase)

## 2. Environment Variables

Create a `.env` file at the project root (never commit it):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
```

An `.env.example` file with the same key (no real value) is committed
instead.

### Fastest path to a real PostgreSQL database

If you don't already have one, the quickest zero-cost option that's also
Vercel-compatible:

1. Create a free project at [neon.com](https://neon.com) (or Supabase, or
   Vercel Postgres — any of these work identically for this app).
2. Copy the connection string it gives you into `.env` as `DATABASE_URL`.
   Make sure `?sslmode=require` (or your provider's equivalent) is included
   if they require SSL — most managed Postgres providers do.
3. Continue with the commands in the next section.

## 3. Install Dependencies

```bash
npm install
```

## 4. Prisma Configuration (Prisma 7)

This project uses Prisma 7, which moved database connection configuration
out of `prisma/schema.prisma` and into two separate places:

- **`prisma.config.ts`** (project root) — used by the Prisma **CLI**
  (`generate`, `migrate`, `studio`). It reads `DATABASE_URL` from `.env` via
  `dotenv/config`. You shouldn't need to touch this file for normal use.
- **`src/lib/db.ts`** — the running **app** connects using the
  `@prisma/adapter-pg` driver adapter (`new PrismaClient({ adapter })`),
  which also reads `DATABASE_URL` from the environment. This is separate
  from the CLI config by Prisma 7 design.

Both just need `DATABASE_URL` set in `.env` (step 2) — you don't need to
edit either file to get started.

## 5. Database Setup

**If you're setting up a brand-new, empty database:**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

**If you're reconnecting to this project's existing Neon database** (the
one already migrated on 2026-09-12, migration name `20260912074321_init`)
**and your local `prisma/migrations/` folder is missing or empty** — this
happens because that folder isn't currently tracked the same way across
every hand-off of this project — do **not** run `migrate dev --name init`
again. That command assumes it's creating the first migration against an
empty database; running it against a database that already has your tables
will make Prisma detect a mismatch and it may prompt to reset the database,
which would destroy existing data. Instead, see Section 6 below.

If `npx prisma generate` fails with a `binaries.prisma.sh` network/checksum
error, your environment's network is blocking Prisma's engine CDN — this
affected the sandboxed Claude tool used to build Phases 1–4 of this
project (see `PROJECT_STATUS.md` and `DECISIONS.md` for the full
investigation). It is not caused by anything in this codebase. Fix your
network/proxy/firewall to allow `binaries.prisma.sh`, or run this step from
an unrestricted machine or CI runner. **This has already been done
successfully once, against a real Neon database — see `PROJECT_STATUS.md`
for confirmation and the migration name.**

## 6. Reconciling Missing Migration History (existing database, empty local `prisma/migrations/`)

This is the "baselining an existing database" workflow Prisma officially
documents for exactly this situation: a database already has the correct
schema and migration history recorded in its `_prisma_migrations` table,
but the local `prisma/migrations/` folder is missing (as noted in
`PROJECT_STATUS.md`, this affected the transfer of this project at least
once). This procedure is **non-destructive** — it does not run any SQL
against the database, drop anything, or reset any data. Run it once,
locally, where `DATABASE_URL` points at the real Neon database:

```bash
mkdir -p prisma/migrations/20260912074321_init

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/20260912074321_init/migration.sql

npx prisma migrate resolve --applied 20260912074321_init

npx prisma migrate status
```

What each step does:
- `migrate diff --from-empty --to-schema-datamodel` generates the SQL that
  *would* create the current schema from nothing, using your own working
  local Prisma CLI — this regenerates an equivalent `migration.sql` file
  without needing to know the exact original file content.
- `migrate resolve --applied 20260912074321_init` tells Prisma "this
  migration already reflects reality, just record that in
  `_prisma_migrations`" — it does not execute the SQL file against the
  database. If the database's `_prisma_migrations` table already has this
  row (likely, since this migration was already applied once), this may
  report it's already recorded — that's fine, not an error worth worrying
  about.
- `migrate status` should then report the database is in sync with no
  pending migrations.

Commit the resulting `prisma/migrations/20260912074321_init/migration.sql`
(and `prisma/migrations/migration_lock.toml`, which Prisma also creates) to
version control afterward so this doesn't need to be repeated.

**Do not** run `prisma migrate reset`, delete this migration once created,
or recreate the database to "fix" this — none of that is necessary and all
of it would be destructive.

## 7. Verifying Everything Works

Once `.env` has a real `DATABASE_URL` and Section 5 or 6 (whichever
applies) has succeeded, confirm the app is fully working with:

```bash
npm run build   # should succeed with no errors
npm run lint    # should be clean
npm test        # should show all automated tests passing
npm run dev     # then visit http://localhost:3000
```

In the running app: add an animal (e.g. ID `BUFF-001`, category Buffalo),
confirm it appears in the Animals list and its profile page loads, then add
a food record for it from `/records/food` and a milk record from
`/records/milk`, confirming both show up in their respective lists and on
the animal's profile page under Food History / Milk History (with the milk
total calculated automatically, not entered). If all of that works, Phases
2–4 are verified and it's safe to continue to Phase 5.

## 8. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 9. Production Build

```bash
npm run build
npm start
```

## 10. Useful Commands

```bash
npx prisma studio       # Browse the database
npx prisma migrate dev  # Create + apply a new migration in development
npm run lint             # Lint the project
npm test                 # Run the automated test suite (Vitest)
```

## 11. Continuing Development in a New Claude Session

1. Provide Claude with the current repository contents (or a zip of the
   project) plus this `docs/` folder.
2. Ask Claude to read `docs/PROJECT_STATUS.md`, `docs/ARCHITECTURE.md`, and
   `docs/DEVELOPMENT_PHASES.md` first.
3. Confirm the next task before Claude begins writing code.

Because this tool environment does not persist files between separate chat
sessions, the recommended workflow is:
- Keep the project in a Git repository (GitHub, GitLab, etc.), or
- Download the project zip at the end of each session and re-upload it at
  the start of the next one.

Either way, `docs/PROJECT_STATUS.md` is what makes the next session
resumable — keep it accurate and up to date.
