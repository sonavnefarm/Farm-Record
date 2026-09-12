# Project Status

> This is the single most important document in this repository. Every new
> Claude session must read this file (plus `ARCHITECTURE.md` and
> `DEVELOPMENT_PHASES.md`) before writing any code.

Last updated: 2026-09-12 (Prisma 7 / Neon verification session)

## Current Phase

**Foundation (Phases 0–3) is DATABASE-VERIFIED. Phase 4 has not started.**

The Prisma sandbox blocker that affected Phases 1–3 has been resolved by
the person running this project, working locally against a real Neon
PostgreSQL database. This session applied the corresponding Prisma 7
config/code changes to the canonical project and re-verified everything
that can be checked from inside this sandbox. **Do not start Phase 4 yet —
see "Exact Next Step" below.**

## What Was Just Done (this session)

1. **Migrated to Prisma 7's config-based datasource + driver adapter**, per
   a detailed local verification report from the person running this
   project. Prisma 7 removed `datasource.url` from `schema.prisma`:
   - `prisma/schema.prisma`: `datasource db { provider = "postgresql" }` —
     no `url` line.
   - `prisma.config.ts` (new, project root): used by the Prisma CLI
     (`generate`/`migrate`/`studio`) to resolve `DATABASE_URL` via
     `dotenv/config`.
   - `src/lib/db.ts`: rewritten as ONE consolidated implementation using
     `@prisma/adapter-pg`'s `PrismaPg` adapter passed to
     `new PrismaClient({ adapter })`, preserving the existing dev-mode
     `globalForPrisma` singleton pattern unchanged.
   - Added dependencies: `@prisma/adapter-pg`, `pg` (runtime); `@types/pg`,
     `dotenv` (dev, for `prisma.config.ts` only).
   - Full rationale: `DECISIONS.md`, "Migrated to Prisma 7's config-based
     datasource + driver adapter".
2. **Fixed a real, unrelated bug**: `.gitignore`'s `.env*` pattern was
   silently excluding `.env.example` from every commit since Phase 1.
   Added `!.env.example` and confirmed it's now tracked.
3. **Verified as much as this sandbox allows:**
   - Confirmed the new Prisma config loads correctly — `npx prisma
     generate` here now fails at the exact same `binaries.prisma.sh` 403 as
     before the fix (not at schema/config validation), proving the config
     migration itself is correct and the only blocker left is this
     sandbox's network restriction, which is unrelated to this change.
   - Re-ran the full typed-stub-client build check (the technique used
     throughout Phases 2–3 to verify code independent of the Prisma
     binary/network issue) across all 17 routes — clean, no new problems.
   - `npm run lint` — clean.
   - This sandbox still cannot reach `binaries.prisma.sh` and has no
     `DATABASE_URL` configured, so it cannot itself run `generate`,
     `migrate`, `build` (with a real client), or live CRUD — that
     verification was performed by the person locally (next section) and
     is authoritative.

## Real Database Verification (performed locally by the person, outside this sandbox)

This is the actual, authoritative confirmation that the foundation works
end-to-end — not just type-checks:

- **Database:** Neon PostgreSQL.
- **`npx prisma generate`**: succeeded — "Generated Prisma Client (v7.10.0)".
- **`npx prisma migrate dev --name init`**: succeeded after one transient
  `P1001` (couldn't reach the pooled endpoint) resolved on retry. Migration
  `20260912074321_init` was created and applied. Prisma confirmed "Your
  database is now in sync with your schema."
- **Do not reset this database or recreate this migration.**
- A subsequent `npm run build` failed with a duplicate-declaration error in
  `src/lib/db.ts` (`globalForPrisma`/`prisma` defined multiple times) —
  this was a leftover from an earlier local edit attempt, not a project
  design issue. **Fixed in this session** by writing one clean,
  consolidated `src/lib/db.ts` (see above). This fix has not yet been
  re-run against the real Neon database — that's the next step, and it
  must happen outside this sandbox (see below).

## Exact Next Step

**Run this locally (or wherever the Neon `DATABASE_URL` is configured) —
not resolvable inside this sandbox:**

```bash
npm install
npx prisma generate
npm run build
npm run dev
```

Then manually verify real CRUD, per `SETUP.md` §6: add an animal (e.g.
`BUFF-001`, category Buffalo), confirm it appears in the Animals list and
its profile page loads, add a food record for it from `/records/food`,
confirm it appears there and under the animal's Food History, then try
editing and deleting it.

If `npm run build` succeeds and that manual CRUD check passes: Phases 2–3
are fully verified for real, and it's safe to bring the project back here
to begin **Phase 4 — Milk Records**. If anything fails, bring back the
exact error and this session (or the next one) will fix it before Phase 4
starts — per explicit instruction, Phase 4 should not begin before this
foundation is confirmed working end-to-end.

Do NOT run `npx prisma migrate reset`, delete the `20260912074321_init`
migration, or recreate the database — the existing migration should be
preserved and simply confirmed to still apply cleanly.

## Completed Tasks

Phases 0–3 (planning docs, Next.js foundation, Animal Management, Food
Records) — full detail in git history and prior versions of this file.
Summary: all validation/service/action/API/UI code for Animals and Food is
written, type-checks correctly, and (per the previous section) the
underlying Prisma/database layer has now been confirmed to actually work
against a real database — only the fixed `db.ts` needs one more build/CRUD
pass to close the loop.

## Known Bugs / Blockers

- **This sandbox** still cannot reach `binaries.prisma.sh` and has no
  `DATABASE_URL` — this is an environment limitation of the Claude tool
  sandbox, not a project bug, and has been true since Phase 1 (see
  `DECISIONS.md` for the full investigation, including several ruled-out
  workarounds). It does not block progress: the person has a working local
  setup with a real Neon database.
- **Was a bug, now fixed:** `src/lib/db.ts` had duplicate
  `globalForPrisma`/`prisma` declarations locally after an earlier Prisma 7
  edit attempt — consolidated into one implementation this session (not
  yet re-verified against the real database — see "Exact Next Step").
- **Was a bug, now fixed:** `.gitignore` was excluding `.env.example` from
  every commit.

## Current Database State

- Schema: `prisma/schema.prisma` — Animal, FoodRecord, MilkRecord,
  MedicineRecord (MilkRecord/MedicineRecord not yet used by any code —
  Phases 4–5).
- **A real Neon PostgreSQL database exists and is migrated** — migration
  `20260912074321_init` applied, schema in sync. This is the project's
  real, persistent database going forward. Do not reset or recreate it.
- Connection: `DATABASE_URL` in `.env` (not committed), read by
  `prisma.config.ts` (CLI) and `src/lib/db.ts` (app, via
  `@prisma/adapter-pg`).

## Current API State

Unchanged from end of Phase 3:
- Animals: `GET/POST /api/animals`, `GET/PATCH /api/animals/:animalId`,
  `PATCH /api/animals/:animalId/deactivate`
- Food: `GET/POST /api/food`, `PATCH/DELETE /api/food/:recordId`,
  `GET /api/animals/:animalId/food`
- Not yet implemented: Milk, Medicine, Analytics routes (Phases 4, 5, 7).

## Current UI State

Unchanged from end of Phase 3 — Animals and Food Records modules are fully
built; Milk, Medicine, and Analytics pages are still Phase 1 placeholders.

## Next Recommended Task

1. **Immediately:** run the "Exact Next Step" commands above (in an
   environment with the real `DATABASE_URL`) and confirm `npm run build`
   succeeds and manual CRUD works.
2. Once confirmed, mark Phases 2 and 3 fully complete (checkboxes) in
   `DEVELOPMENT_PHASES.md`.
3. Begin **Phase 4 — Milk Records**, following the exact same pattern as
   Food Records (see the detailed plan already written in the previous
   version of this section, preserved in git history / `DEVELOPMENT_PHASES.md`):
   types → Zod validation (morningMilk/eveningMilk >= 0, `totalMilk` is
   NEVER part of the input schema — always server-computed) → service
   layer (compute `totalMilk = morningMilk + eveningMilk` server-side) →
   Server Actions + API routes → quick-add UI + `RecordFilters` reuse →
   wire Milk History into the animal profile page.

## Important Technical Decisions

See `DECISIONS.md` for full detail. Key ones so far:
- Single Next.js app for frontend + backend + API (no separate Express
  server).
- `Animal.id` is the natural key (e.g. `BUFF-001`), immutable after
  creation.
- No financial fields anywhere in the schema (by product constraint).
- Prisma pinned to `7.10.0`. **Prisma 7's config model**: no `url` in
  `schema.prisma`; `prisma.config.ts` for the CLI; `@prisma/adapter-pg` +
  `PrismaClient({ adapter })` for the app at runtime.
- Fonts self-hosted via `@fontsource/*`, not `next/font/google`.
- Mutations use Server Actions; the REST API in `API.md` is implemented in
  parallel as thin wrappers over the same service layer.
- Domain types (`src/types/*.ts`) are kept independent of the generated
  Prisma client.
- Prisma `Decimal` fields (e.g. `FoodRecord.quantity`) are converted to
  plain numbers at the service boundary.
- `RecordFilters` is a shared component built for reuse across Food/Milk/
  Medicine rather than one bespoke filter bar per record type.

## Session Continuity Note

This tool environment does not retain files between separate chat sessions.
To continue development:
1. Keep the project under version control (e.g. push to a GitHub repo you
   own) — this is now more important than ever, since a real, migrated
   Neon database exists and losing track of `prisma/migrations/` would be
   costly to reconstruct. Per current instructions, zips of this project
   are only generated on explicit request or at Phase 10 — ask if you need
   one.
2. At the start of the next session, provide Claude the repository (or
   zip) and ask it to read this file, `ARCHITECTURE.md`, and
   `DEVELOPMENT_PHASES.md` before doing anything else.
3. Run the "Exact Next Step" commands above before/at the start of the next
   session if they haven't been run yet — that's the one gap left before
   Phase 4 can safely begin.
