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

## Phase 1 — Project Foundation `[x]`
- [x] Initialize Next.js (App Router) + TypeScript project
- [x] Configure Tailwind CSS (v4, token-based via `globals.css`)
- [x] Build base layout + navigation (Dashboard/Animals/Records/Analytics)
- [x] Establish design system primitives (Button, Panel, PageHeader,
      EmptyState, Skeleton — table primitive deferred to Phase 2 when the
      first real data table is needed)
- [x] Prisma schema authored (`prisma/schema.prisma`, all 4 models) and
      `prisma`/`@prisma/client` installed (later migrated to Prisma 7's
      config model — see `DECISIONS.md`)
- [x] Prisma client generated + first migration run against a real
      PostgreSQL database — done 2026-09-12 against Neon (migration
      `20260912074321_init`); resolved the earlier sandbox network
      blocker by working locally. See `PROJECT_STATUS.md`.
- [x] `.env.example` + environment configuration
- [x] Basic error handling scaffolding (`error.tsx`, `global-error.tsx`,
      `not-found.tsx`)
- [x] Verify `npm run build` succeeds (all 8 routes prerender cleanly)
- [x] Verify `npm run lint` is clean

## Phase 2 — Animal Management `[x]`
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
- [x] **CRUD verified end-to-end against a real database** — confirmed
      2026-09-12 against a real Neon PostgreSQL database (animal
      creation/persistence, survives refresh). See `PROJECT_STATUS.md`.

## Phase 3 — Food Records `[x]`
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
- [x] **CRUD verified end-to-end against a real database** — confirmed
      2026-09-12 against a real Neon PostgreSQL database (food record
      creation/persistence, survives refresh). See `PROJECT_STATUS.md`.

## Phase 4 — Milk Records `[x]`
- [x] MilkRecord Prisma model (already in `prisma/schema.prisma` from Phase 1)
- [x] Zod validation (`src/lib/validation/milk.ts` — `totalMilk` is NOT
      part of the input schema, confirmed by a dedicated test)
- [x] Pure `computeTotalMilk()` helper (`src/lib/milk.ts`), rounds to avoid
      floating-point artifacts, unit tested
- [x] Service layer (`src/lib/services/milk.ts`: list, get, create, update,
      delete, get-by-animal; server-computes `totalMilk` on every write)
- [x] Server Actions (`src/lib/actions/milk.ts`)
- [x] REST API routes matching `API.md` (`/api/milk`, `/api/milk/:recordId`,
      `/api/animals/:animalId/milk`)
- [x] Quick-add milk record form with live read-only total preview
      (`/records/milk`)
- [x] Edit milk record (`/records/milk/[recordId]/edit`)
- [x] Delete milk record (delete button per row)
- [x] Milk history wired into the animal profile page
- [x] Date / Animal / Category filtering (`RecordFilters`, reused from
      Phase 3 with no code changes needed)
- [x] Loading state, empty states
- [x] Automated tests (Vitest): `computeTotalMilk`, milk validation schema,
      a service-layer test proving `totalMilk` is always server-computed
      and never accepted from client input, plus new regression tests for
      the existing Animal/Food validation schemas
- [x] Code complete, type-checks correctly (typed stub client, 21 routes
      clean), lint clean, all 23 automated tests pass. Per the 2026-09-12
      policy change (see `DECISIONS.md`), manual verification against the
      real Neon database is deferred to the consolidated pass in Phase 10
      rather than gating this phase individually.

## Phase 5 — Medicine Records `[x]`
- [x] MedicineRecord Prisma model (already in `prisma/schema.prisma` from
      Phase 1)
- [x] Zod validation (`src/lib/validation/medicine.ts` — animal, date,
      medicineName only, confirmed minimal by a dedicated test)
- [x] Service layer (`src/lib/services/medicine.ts`: list, get, create,
      update, delete, get-by-animal — no Decimal fields, so no plain-value
      conversion needed here unlike food/milk)
- [x] Server Actions (`src/lib/actions/medicine.ts`)
- [x] REST API routes matching `API.md` (`/api/medicine`,
      `/api/medicine/:recordId`, `/api/animals/:animalId/medicine`)
- [x] Quick-add medicine record form (animal, date, medicine name) at the
      top of `/records/medicine`
- [x] Edit medicine record (`/records/medicine/[recordId]/edit`)
- [x] Delete medicine record (delete button per row)
- [x] Medicine history wired into the animal profile page
- [x] Date / Animal / Category filtering (`RecordFilters`, reused from
      Phase 3/4 with no code changes needed)
- [x] Loading state, empty states
- [x] Automated tests (Vitest): medicine validation schema — valid input,
      missing animal, invalid date, required medicineName (unlike Food's
      optional foodName), max length, and a test confirming the schema
      stays minimal (only 3 fields — no dosage/duration/vet/diagnosis/cost)
- [x] Code complete, type-checks correctly (typed stub client, 25 routes
      clean), lint clean, all 29 automated tests pass. Per the 2026-09-12
      policy, manual verification against the real Neon database is
      deferred to the consolidated Phase 9 pass.

## Phase 6 — Dashboard `[x]`
- [x] Pure aggregation logic, unit tested (`src/lib/dashboard.ts`,
      `src/lib/utils/date-ranges.ts`): `summarizeAnimals`, `buildMilkTrend`
      (fills zero-value days), `mergeRecentActivity`, UTC-day-aligned date
      range helpers
- [x] Service layer (`src/lib/services/dashboard.ts`): `getAnimalSummary`,
      `getTodayStats` (milk/food/medicine aggregates for today),
      `getMilkTrend` (7 or 30 days), `getRecentActivity` (merged across
      Food/Milk/Medicine, newest first)
- [x] Animal statistics widget (total, by category, active/inactive)
- [x] Today's milk/food/medicine widgets
- [x] Recent activity feed (`RecentActivityList`, with per-type icons and
      links to each animal)
- [x] Milk trend chart (`MilkTrendChart`, Recharts line chart) with 7/30
      day toggle via URL search param, consistent with the filter pattern
      used elsewhere in the app
- [x] Empty state for a farm with no animals yet (skips straight to a
      call-to-action instead of showing an all-zero dashboard)
- [x] Loading skeleton for `/`
- [x] Automated tests: 9 new tests across `date-ranges.test.ts` and
      `dashboard.test.ts` covering date range math, trend zero-filling, and
      activity merge/sort/limit — all pure, no database needed
- [x] Code complete, type-checks correctly (typed stub client extended for
      `aggregate`/`groupBy`/`count`, 25 routes clean), lint clean, all 38
      automated tests pass. Per the 2026-09-12 policy, manual verification
      against the real Neon database is deferred to the consolidated
      Phase 9 pass.

## Phase 7 — Analytics `[x]`
- [x] Pure aggregation logic, unit tested (`src/lib/analytics.ts`):
      `aggregateByAnimal`, `aggregateByCategoryTotals`, `averageDaily`,
      `aggregateByFoodName` (gracefully buckets null food names as
      "Unspecified")
- [x] Extended `src/lib/utils/date-ranges.ts` with `buildDailySeries`
      (generic day-bucketing, `buildMilkTrend` from Phase 6 refactored to
      use it) and `resolveDateRange` (Today/7d/30d/Custom preset resolver,
      falls back safely on invalid/missing custom dates)
- [x] Service layer (`src/lib/services/analytics.ts`): `getAnimalAnalytics`
      (reuses Phase 6's `summarizeAnimals`), `getMilkAnalytics`,
      `getFoodAnalytics`, `getMedicineAnalytics` — all Prisma
      `groupBy`/`aggregate` queries wired to the pure functions above
- [x] Animal analytics (totals by category, active/inactive)
- [x] Milk analytics: total, average daily, production trend chart, by
      animal, by category, highest-producing animal
- [x] Food analytics: total quantity, average daily quantity, by animal,
      by category, by food name (graceful null handling)
- [x] Medicine history analytics: recent records, history by animal
      (record counts), usage by date — explicitly history-only, no medical
      interpretation (per `FEATURES.md` §12 constraint, stated directly in
      the UI)
- [x] Date range filters: Today, Last 7 Days, Last 30 Days, Custom Range
      (`AnalyticsDateRangeFilter`, URL search params, consistent with the
      filter pattern used everywhere else in the app)
- [x] Charts: extracted a shared `TrendChart` presentational component
      (used for milk production trend and medicine usage-by-date); Phase
      6's `MilkTrendChart` refactored to use it internally for its own
      rendering, keeping its public API and behavior unchanged
- [x] Loading skeleton for `/analytics`
- [x] Automated tests: 9 new for `analytics.ts`, 8 new for the
      `date-ranges.ts` additions (17 new, 55 total) — all pure, no
      database needed
- [x] Code complete, type-checks correctly (typed stub client extended for
      `groupBy` with `_count`, 25 routes clean), lint clean, all 55
      automated tests pass. Per the 2026-09-12 policy, manual verification
      against the real Neon database is deferred to the consolidated
      Phase 9 pass.

## Phase 8 — UX Refinement `[x]`
- [x] Responsive/mobile pass: standardized all 6 data tables that used
      inconsistent `overflow-hidden` (clips content on narrow screens) to
      `overflow-x-auto` (scrollable), matching the 3 tables that already
      had it right — `AnimalsTable`, `ByAnimalTable`, and the 3 inline
      history tables on the animal profile page
- [x] Form usability pass: the food-name filter now applies on Enter (in
      addition to blur), so keyboard users don't have to tab away to see
      results
- [x] Loading/empty/error state audit: found and filled 4 missing loading
      boundaries (`/animals/[animalId]/edit`, `/records/food/[recordId]/edit`,
      `/records/milk/[recordId]/edit`, `/records/medicine/[recordId]/edit` —
      all fetch real data and were missing `loading.tsx`); confirmed
      `/animals/new` correctly has none (no async work, so a loading
      boundary wouldn't do anything); every list already had an
      appropriate empty state from its original phase
- [x] Navigation & accessibility pass: added a skip-to-content link,
      `aria-current="page"` on the active nav link (top-level and Records
      sub-links), `aria-hidden` on decorative nav icons, `aria-label`s on
      all 6 data tables for screen-reader context, enlarged icon-only
      edit/delete buttons in record tables from `p-1.5` to `p-2` for
      better mobile tap targets, and fixed `--color-text-faint`'s contrast
      ratio (~3.2:1 → ~5:1 against the light background), since it's used
      for genuinely informative text (empty-state copy, timestamps), not
      just decoration — see `DECISIONS.md`
- [x] Table & filter usability pass: covered by the overflow-x-auto fix
      and the Enter-key filter improvement above; spot-checked that every
      filter control reflects its current URL-param value correctly
- [x] No new business functionality was added, per this phase's scope —
      every change here is a fix to something already built
- [x] Code type-checks correctly (typed stub client, 25 routes clean),
      lint clean, all 55 automated tests pass (no new tests needed — this
      phase changed presentation/markup, not logic). Per the 2026-09-12
      policy, manual verification against the real Neon database
      (including actually eyeballing the mobile layout and tab order in a
      browser) is deferred to the consolidated Phase 9 pass, which should
      include a deliberate mobile-viewport and keyboard-only check given
      this phase's changes were necessarily code-reviewed rather than
      visually verified in this sandbox.

## Phase 9 — Testing and Hardening `[ ]`
- [ ] Run the migration-history reconciliation from `SETUP.md` §6
      (non-destructive — regenerate local `prisma/migrations/` to match
      what's already applied on the real Neon database)
- [ ] **Consolidated manual verification against the real Neon database**
      for every phase built so far (Animals, Food, Milk, Medicine,
      Dashboard, Analytics) — per the 2026-09-12 policy change (see
      `DECISIONS.md`), this replaces doing it individually at the end of
      each phase. Confirm: add/edit/deactivate an animal; add/edit/delete
      food/milk/medicine records and confirm the milk total is always
      computed, never editable; confirm all of this survives a browser
      refresh; confirm each animal's profile page shows accurate
      Food/Milk/Medicine history; confirm the Dashboard and Analytics
      pages show correct numbers for real data.
- [ ] **Visually verify Phase 8's UX changes in an actual browser** — these
      were code-reviewed but not visually tested in the Claude sandbox
      (no browser + no live database there): check mobile-width layout and
      table scrolling on at least one real narrow viewport, tab through a
      page with the keyboard to confirm the skip-link and focus order work,
      and spot-check color contrast now that `--color-text-faint` changed.
- [ ] Edge cases: duplicate IDs, invalid input, DB failures, mobile layout
- [ ] `npm run lint` clean
- [ ] `npm run build` clean (with a real generated Prisma client, not the
      sandbox's typed-stub-client verification)
- [ ] `npm test` clean (full automated suite)

## Phase 10 — Deployment `[ ]`
- [ ] Production environment variables
- [ ] Production PostgreSQL provisioned
- [ ] Prisma migrations applied to production
- [ ] Vercel configuration
- [ ] Production build verified
- [ ] Deployment docs finalized

---

**Current phase: Phase 8 — COMPLETE. All fixes were code-level (no new
business functionality). Type-checks correctly, lint clean, 55/55 tests
pass. Because this phase's changes were visual/interactive
(responsiveness, tap targets, contrast) and this sandbox cannot run a
browser against the real database, Phase 9's manual pass should
specifically include eyeballing mobile layout and keyboard navigation, not
just functional CRUD. Ready to begin Phase 9 — Testing and Hardening.**

See `PROJECT_STATUS.md` for the authoritative, continuously updated status.
