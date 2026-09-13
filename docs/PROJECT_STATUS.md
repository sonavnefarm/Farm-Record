# Project Status

> This is the single most important document in this repository. Every new
> Claude session must read this file (plus `ARCHITECTURE.md` and
> `DEVELOPMENT_PHASES.md`) before writing any code.

Last updated: 2026-09-13 (Phase 8 completion)

## Current Phase

**Phase 8 — UX Refinement: COMPLETE.**

All fixes were code-level polish, per this phase's fix-only scope — no new
business functionality was added. Type-checks correctly, lint clean, all
55 automated tests pass (unchanged — this phase touched presentation/markup,
not logic). Ready to begin **Phase 9 — Testing and Hardening**, which is
now the last phase with meaningful pending work before Deployment.

## Important Caveat on This Phase's Verification

Phase 8 is about responsiveness, accessibility, and visual polish — the
kind of thing best confirmed by actually looking at the app in a browser.
This sandbox has neither a working browser-testable build (no generated
Prisma client) nor a live database, so everything in this phase was
verified by **systematic code review**, not visual inspection. This is
flagged explicitly, and Phase 9's checklist now includes a dedicated
"visually verify Phase 8's changes in an actual browser" item — treat that
as unfinished business from this phase, not optional.

## Policy Reminder: Manual/Live-Database Verification Deferred to Phase 9

Since 2026-09-12, a phase is complete once its code is written,
type-checks, passes lint, and has appropriate automated test coverage.
Manual/live-database verification for everything built happens once,
consolidated, in **Phase 9** (see `DEVELOPMENT_PHASES.md`, `DECISIONS.md`).

## Database & Migration State (carried over, unchanged this session)

A real Neon PostgreSQL database exists and is in active use (Prisma 7 +
`@prisma/adapter-pg`). **Must not be reset; `20260912074321_init` must not
be recreated or deleted.** Local `prisma/migrations/` folder is still
missing (non-destructive fix documented in `SETUP.md` §6) — scheduled for
Phase 9, the very next phase.

## What Was Completed in Phase 8

All fixes, no new functionality, per this phase's explicit scope:

- **Responsive/mobile:** standardized 6 data tables from `overflow-hidden`
  (clips wide tables on narrow screens) to `overflow-x-auto` (scrollable),
  matching the 3 that already had it right.
- **Forms:** the food-name filter now applies on Enter, not just blur.
- **Loading/empty/error states:** added the 4 missing `loading.tsx` files
  for pages that fetch real data but lacked one
  (`/animals/[animalId]/edit`, the three `/records/*/[recordId]/edit`
  pages); confirmed `/animals/new` correctly has none (no async work).
  Every list already had a correct empty state from its original phase —
  no gaps found there.
- **Navigation & accessibility:** skip-to-content link, `aria-current` on
  the active nav item, `aria-hidden` on decorative icons next to visible
  labels, `aria-label`s on all 6 `<table>` elements, larger tap targets
  (`p-1.5` → `p-2`) on icon-only edit/delete buttons, and a real contrast
  fix — `--color-text-faint` measured ~3.2:1 against the background
  (below WCAG AA's 4.5:1) and is used for informative text (empty-state
  copy, timestamps), not just decoration; changed to a value measuring
  ~5:1. Full detail and the exact before/after values are in
  `DECISIONS.md`.
- **Tables & filters:** covered by the above two fixes; spot-checked that
  every filter reflects its current URL value correctly.

## Verification Performed

- Typed-stub-client build check — clean across all 25 routes, same as
  before this phase (no route count change, since this phase only added
  `loading.tsx` boundaries and edited existing markup/styles).
- `npm run lint` — clean.
- `npm test` — 55/55 passing (unchanged — no logic changed this phase).
- Confirmed the real build (unmodified `src/lib/db.ts`) still fails only
  at the same single already-documented root cause.
- **Not done, and flagged explicitly:** actual visual/browser verification
  of the responsive layout, tap targets, and contrast changes. See "Exact
  Next Step".

## Completed Tasks

Phases 0–8 — the full MVP functional scope (Animal/Food/Milk/Medicine
CRUD, Dashboard, Analytics) plus a UX polish pass. All code written,
type-checked, linted, and covered by automated tests where appropriate.
Full file-level detail for each phase is in git history and prior versions
of this file.

## Known Bugs / Blockers

- **This sandbox** still cannot reach `binaries.prisma.sh` and has no
  `DATABASE_URL` configured — unchanged limitation, not a project bug.
- **Scheduled for Phase 9, not currently blocking:** the migration-history
  reconciliation (`SETUP.md` §6), the consolidated manual/live-database
  verification pass, and now also a browser-based visual check of Phase
  8's changes.
- No other known bugs.

## Current Database State

Schema unchanged since Phase 1. Real Neon PostgreSQL database exists,
migrated, in active use. Local migration history reconciliation scheduled
for Phase 9.

## Current API State

Unchanged from end of Phase 7.

## Current UI State

- All pages implemented (no placeholders remain, since Phase 7).
- This phase touched shared components (`AppShell`, `RecordFilters`,
  three record tables, `AnimalsTable`, `ByAnimalTable`, the animal profile
  page's inline history tables) and one design token
  (`--color-text-faint`) — no new pages or components.

## Exact Next Step

Begin **Phase 9 — Testing and Hardening**. This is the phase where
everything deferred so far finally gets a real check. In order:

1. **Migration-history reconciliation** (`SETUP.md` §6) — non-destructive,
   regenerates the local `prisma/migrations/` folder to match what's
   already applied on the real Neon database. Do this first since
   everything else in this phase assumes a working local Prisma setup.
2. **Consolidated manual verification against the real Neon database** —
   full CRUD across Animals, Food, Milk (confirm the total is always
   computed, never editable), Medicine; confirm persistence across
   refresh; confirm the animal profile page's three history sections and
   the Dashboard/Analytics pages show correct numbers for real data.
3. **Visually verify Phase 8's changes in an actual browser** — mobile-
   width layout and table scrolling, keyboard tab order and the skip
   link, and a spot-check that the contrast fix reads as intended.
4. Edge cases: duplicate IDs, invalid input, DB failures, mobile layout.
5. `npm run lint`, `npm run build` (with a real generated client this
   time, not the sandbox's typed-stub verification), and `npm test` —
   all clean.

Then **Phase 10 — Deployment** is all that remains.

## Important Technical Decisions

See `DECISIONS.md` for full detail. Key ones so far:
- Single Next.js app for frontend + backend + API (no separate Express
  server).
- `Animal.id` is the natural key, immutable after creation.
- No financial fields anywhere in the schema.
- Prisma 7 config model: no `url` in `schema.prisma`; `prisma.config.ts`
  for the CLI; `@prisma/adapter-pg` + `PrismaClient({ adapter })` for the
  app at runtime.
- `MilkRecord.totalMilk` is always computed server-side.
- `MedicineRecord` deliberately has only 3 fields — enforced by a test.
- Dashboard/Analytics aggregation is pure logic + thin Prisma service
  layer, consistently.
- `TrendChart` is a shared presentational chart component.
- All data tables use `overflow-x-auto` consistently (Phase 8).
- `--color-text-faint` was darkened for WCAG AA contrast (Phase 8) — if
  adding new UI, don't reintroduce a lighter "faint" tone for text that
  actually carries information.
- Fonts self-hosted via `@fontsource/*`, not `next/font/google`.
- Mutations use Server Actions; the REST API in `API.md` is implemented in
  parallel as thin wrappers for record CRUD; Dashboard/Analytics read
  directly from their service layers.
- Domain types (`src/types/*.ts`) are kept independent of the generated
  Prisma client.
- Vitest added for pure-logic unit tests; full DB integration/manual
  testing (and now also visual/browser testing) is consolidated into
  Phase 9.

## Session Continuity Note

This tool environment does not retain files between separate chat sessions.
To continue development:
1. Keep the project under version control. Per current instructions, zips
   of this project are generated only on explicit request or at Phase 10.
2. At the start of the next session, provide Claude the repository (or
   zip) and ask it to read this file, `ARCHITECTURE.md`, and
   `DEVELOPMENT_PHASES.md` before doing anything else.
3. Phase 9 is next, and unlike Phases 2–8, it genuinely needs to happen in
   an environment with real database access and a real browser — this
   sandbox cannot complete it alone.
