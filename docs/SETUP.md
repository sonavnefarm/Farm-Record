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

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If `npx prisma generate` fails with a `binaries.prisma.sh` network/checksum
error, your environment's network is blocking Prisma's engine CDN — this
affected the sandboxed Claude tool used to build Phases 1–3 of this
project (see `PROJECT_STATUS.md` and `DECISIONS.md` for the full
investigation). It is not caused by anything in this codebase. Fix your
network/proxy/firewall to allow `binaries.prisma.sh`, or run this step from
an unrestricted machine or CI runner. **This has already been done
successfully once, against a real Neon database — see `PROJECT_STATUS.md`
for confirmation and the migration name.**

## 6. Verifying Everything Works

Once `.env` has a real `DATABASE_URL` and the two commands above have
succeeded, confirm the app is fully working with:

```bash
npm run build   # should succeed with no errors
npm run lint    # should be clean
npm run dev     # then visit http://localhost:3000
```

In the running app: add an animal (e.g. ID `BUFF-001`, category Buffalo),
confirm it appears in the Animals list and its profile page loads, then add
a food record for it from `/records/food` and confirm it shows up both
there and on the animal's profile page under Food History. If all of that
works, Phases 2 and 3 are verified and it's safe to continue to Phase 4.

## 7. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 8. Production Build

```bash
npm run build
npm start
```

## 9. Useful Commands

```bash
npx prisma studio       # Browse the database
npx prisma migrate dev  # Create + apply a new migration in development
npm run lint             # Lint the project
```

## 10. Continuing Development in a New Claude Session

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
