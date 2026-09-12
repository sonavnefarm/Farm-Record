# Development Phases

Legend: `[ ]` not started · `[~]` in progress · `[x]` complete

## Phase 0 — Project Planning `[x]`
- [x] Create `/docs` folder with all planning documents
- [x] Define architecture (`ARCHITECTURE.md`)
- [x] Define database design (`DATABASE.md`)
- [x] Define feature scope (`FEATURES.md`)
- [x] Define phase plan (this file)
- [x] Define setup instructions (`SETUP.md`)
- [x] Define API plan (`API.md`)
- [x] Define deployment plan (`DEPLOYMENT.md`)
- [x] Start decisions log (`DECISIONS.md`)
- [x] Initialize `PROJECT_STATUS.md`
- No UI or application code written in this phase (by design).

## Phase 1 — Project Foundation `[~]`
- [x] Initialize Next.js (App Router) + TypeScript project
- [x] Configure Tailwind CSS (v4, token-based via `globals.css`)
- [x] Build base layout + navigation (Dashboard/Animals/Records/Analytics)
- [x] Establish design system primitives (Button, Panel, PageHeader,
      EmptyState, Skeleton — table primitive deferred to Phase 2 when the
      first real data table is needed)
- [x] Prisma schema authored (`prisma/schema.prisma`, all 4 models) and
      `prisma`/`@prisma/client` installed
- [ ] Prisma client generated + first migration run against a real
      PostgreSQL database — **blocked in the dev sandbox** (no network
      access to `binaries.prisma.sh`); must be done in a normal environment
      before Phase 2 database code can compile. See `DECISIONS.md`.
- [x] `.env.example` + environment configuration
- [x] Basic error handling scaffolding (`error.tsx`, `global-error.tsx`,
      `not-found.tsx`)
- [x] Verify `npm run build` succeeds (all 8 routes prerender cleanly)
- [x] Verify `npm run lint` is clean

## Phase 2 — Animal Management `[~]`
- [x] Animal Prisma model (already in `prisma/schema.prisma` from Phase 1)
- [x] Zod validation (`src/lib/validation/animal.ts`)
- [x] Service layer (`src/lib/services/animals.ts`: list, get, create,
      update, deactivate, reactivate)
- [x] Server Actions for forms (`src/lib/actions/animals.ts`)
- [x] REST API routes matching `API.md` (`/api/animals`,
      `/api/animals/:animalId`, `/api/animals/:animalId/deactivate`)
- [x] Add / Edit / List animal UI (`/animals`, `/animals/new`,
      `/animals/[animalId]/edit`)
- [x] Animal profile page shell (`/animals/[animalId]`) with Food/Milk/
      Medicine history placeholders (real histories arrive Phases 3–5)
- [x] Active/inactive status (soft deactivate + reactivate)
- [x] Category & status filtering (`AnimalFilters`, URL search params)
- [x] Loading states (`loading.tsx` for list and profile) and empty states
- [ ] **CRUD verified end-to-end against a real database** — blocked in
      this sandbox until `npx prisma generate` + the first migration are
      run in a normal environment (see `PROJECT_STATUS.md`). All Phase 2
      code type-checks correctly once the Prisma client exists — verified
      in-session with a temporary stub client (see `DECISIONS.md`).
- [ ] CRUD tested manually

## Phase 3 — Food Records `[~]`
- [x] Food database model (already in `prisma/schema.prisma` from Phase 1)
- [x] Zod validation (`src/lib/validation/food.ts`)
- [x] Service layer (`src/lib/services/food.ts`: list, get, create, update,
      delete, get-by-animal)
- [x] Server Actions (`src/lib/actions/food.ts`)
- [x] REST API routes matching `API.md` (`/api/food`, `/api/food/:recordId`,
      `/api/animals/:animalId/food`)
- [x] Quick-add food record form (animal, date, food name optional,
      quantity) at the top of `/records/food` — no multi-page flow
- [x] Edit food record (`/records/food/[recordId]/edit`)
- [x] Delete/correct food record (delete button per row)
- [x] Food history wired into the animal profile page
- [x] Date / Animal / Category / Food Name filtering (`RecordFilters`)
- [x] Loading state, empty states
- [ ] **CRUD verified end-to-end against a real database** — same
      sandbox blocker as Phase 2 (see `PROJECT_STATUS.md`). Verified via a
      typed stub client that all Phase 3 code type-checks correctly.

## Phase 4 — Milk Records `[ ]`
- [ ] MilkRecord Prisma model + migration
- [ ] Morning/Evening entry with auto-computed total
- [ ] Milk history on animal profile
- [ ] Date / Animal filtering

## Phase 5 — Medicine Records `[ ]`
- [ ] MedicineRecord Prisma model + migration
- [ ] Add medicine record
- [ ] Medicine history on animal profile
- [ ] Date / Animal filtering

## Phase 6 — Dashboard `[ ]`
- [ ] Animal statistics widget
- [ ] Today's milk/food/medicine widgets
- [ ] Recent activity feed
- [ ] Milk trend chart (7/30 day toggle)

## Phase 7 — Analytics `[ ]`
- [ ] Animal analytics
- [ ] Milk analytics (incl. by animal/category, highest producer)
- [ ] Food analytics (incl. by food name, graceful nulls)
- [ ] Medicine history analytics
- [ ] Date range filters incl. custom range
- [ ] Charts

## Phase 8 — UX Refinement `[ ]`
- [ ] Responsive/mobile pass
- [ ] Form usability pass
- [ ] Loading/empty/error state audit
- [ ] Navigation & accessibility pass
- [ ] Table & filter usability pass

## Phase 9 — Testing and Hardening `[ ]`
- [ ] Manual test pass on all CRUD + analytics + filters
- [ ] Edge cases: duplicate IDs, invalid input, DB failures, mobile layout
- [ ] `npm run lint` clean
- [ ] `npm run build` clean

## Phase 10 — Deployment `[ ]`
- [ ] Production environment variables
- [ ] Production PostgreSQL provisioned
- [ ] Prisma migrations applied to production
- [ ] Vercel configuration
- [ ] Production build verified
- [ ] Deployment docs finalized

---

**Current phase: Phase 3 — code complete, DB verification pending (same
sandbox blocker as Phase 2). All Food Record code (validation, service,
Server Actions, API routes, UI, animal-profile integration) is written and
verified to type-check correctly via a typed stub client.**

See `PROJECT_STATUS.md` for the authoritative, continuously updated status.
