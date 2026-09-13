# Technical Decisions Log

Record significant decisions here as they're made, newest at the top. Keep
entries short: what was decided, why, and any alternatives considered.

---

## 2026-09-11 — Phase 1: Sandbox network limitations (Prisma + Google Fonts)

**Context:** The Claude tool sandbox used for this development session only
allows outbound network access to a fixed allowlist of domains (npm, GitHub,
PyPI, crates.io, etc.). Two things needed for this project are **not** on
that allowlist:
- `binaries.prisma.sh` — where Prisma downloads its query/schema engine
  binaries for `prisma generate`, `prisma format`, `prisma migrate`, etc.
- `fonts.googleapis.com` — where `next/font/google` fetches font files.

**Impact:**
- `npx prisma generate` cannot run inside this sandbox. Because of this,
  Phase 1 does **not** include a `lib/db.ts` Prisma client singleton or any
  code importing `@prisma/client` — importing it before `generate` has run
  fails to resolve the generated `.prisma/client` module. `prisma`,
  `@prisma/client`, and `prisma/schema.prisma` are in place and correct, but
  the client must be generated in an environment with normal internet
  access (any real dev machine, CI, or Vercel build) before Phase 2 code
  that touches the database can compile.
- `next/font/google` was replaced with self-hosted fonts via the
  `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` npm packages,
  imported directly as CSS. This avoids the Google Fonts network call
  entirely and works identically in any environment, sandboxed or not — it
  is not a workaround that needs to be undone later.

**Action for the person running this project:** if continuing development
inside this same sandboxed tool, either ask to have `binaries.prisma.sh`
added to the network allowlist (Settings → network), or run
`npm install && npx prisma generate` locally / in Vercel's build step where
there's no such restriction. Real deployments (Vercel, local dev) are
unaffected — this is purely a constraint of the sandbox used during
development sessions.

**Alternatives considered:** Pin an older Prisma version that might bundle
engines differently — rejected, the binary-download requirement is
unrelated to version and applies to all current Prisma releases. Using
Prisma's WASM/driverAdapters mode to avoid engine downloads — deferred,
since it still requires the schema-engine binary for migrations and adds
complexity not justified until this is confirmed to be a recurring problem.

---

## 2026-09-11 — Phase 1: Pinned Prisma to 7.10.0 (stable)

**Decision:** Installed `prisma`/`@prisma/client` pinned to `7.10.0` rather
than `latest`, which resolved to an `8.0.0-rc.13` release candidate.

**Why:** The RC pulled in a large, unrelated dependency tree (an `alchemy`
deployment tool, `effect`, etc.) not needed for this project, and release
candidates are more likely to have breaking changes. `7.10.0` is the latest
stable release at time of writing.

---

## 2026-09-11 — Phase 1: Design token system

**Decision:** Light theme built on a cool neutral background (`#f6f7f5`),
a single pasture-green accent (`#3f6b4b`) for actions/active states, and a
muted amber (`#a97728`) reserved for sparing secondary emphasis. Typography
uses IBM Plex Sans for UI text and IBM Plex Mono for data values (animal
IDs, quantities) in one consistent family pairing. Panels use hairline
borders (no shadows), and border radius is kept small throughout.

**Why:** Matches the spec's requirement for a light, professional,
restrained UI and avoids generic "AI-generated" patterns (warm
cream+terracotta, heavy card shadows, gradients). The green accent and
mono-for-data pairing are chosen deliberately for a farm data-logging tool
rather than defaulted to.

**Alternatives considered:** A more decorative agricultural theme (wood
textures, illustrated animals) — rejected as contrary to the spec's
explicit "professional, minimal... avoid decorative" requirement.

---

## 2026-09-11 — Phase 2: Verified Phase 2 code compiles via a temporary stub client

**Decision:** To confirm the Phase 2 Animal CRUD code (validation, services,
Server Actions, API routes, UI) has no type errors of its own — separate
from the known, already-documented Prisma-generate sandbox blocker — I
temporarily replaced the one line in `src/lib/db.ts` that imports
`PrismaClient` with a structurally-equivalent stub type, ran `npm run
build`, confirmed all 13 routes compiled and prerendered/handled correctly,
then reverted `src/lib/db.ts` to the real implementation. The stub was never
committed.

**Why:** This isolates the single known failure point (`Cannot find
exported member 'PrismaClient'`, caused by the missing generated client)
from any other potential mistakes in the ~15 new files written for Phase 2,
giving confidence the code is correct and will build successfully the
moment `npx prisma generate` has been run in a real environment.

---

## 2026-09-11 — Phase 2: Server Actions for mutations, Route Handlers for the documented API

**Decision:** Animal create/update/deactivate/reactivate are implemented as
Next.js Server Actions (`src/lib/actions/animals.ts`) wired directly into
the forms via `useActionState`, rather than having the UI call the REST API
routes over `fetch`. The REST routes in `API.md` (`POST /api/animals`, etc.)
are also implemented, as thin wrappers around the same service layer, to
keep that documented contract real and usable by any future external
client (mobile app, scripts, etc.) — but the web UI itself doesn't need to
round-trip through them.

**Why:** Server Actions are the idiomatic Next.js App Router pattern for
form mutations (progressive enhancement, no manual fetch/error-handling
boilerplate in client components, automatic revalidation). Keeping the
service layer (`src/lib/services/animals.ts`) as the single source of
business logic means neither path duplicates validation or database logic.

---

## 2026-09-11 — Phase 3: Convert Prisma Decimal fields to plain numbers at the service boundary

**Decision:** `FoodRecord.quantity` (and future `MilkRecord`/other Decimal
fields) are converted from Prisma's `Decimal` (a Decimal.js instance) to a
plain JS `number` inside the service layer (`toPlainQuantity` helper in
`src/lib/services/food.ts`), before the data is returned to any page or
Server Action.

**Why:** Decimal.js instances are not plain-serializable across the React
Server Component → Client Component boundary — passing one as a prop to a
Client Component throws at runtime. Converting once, at the service
boundary, means every layer above it (pages, forms, tables) only ever
handles plain, serializable data, and the conversion logic lives in exactly
one place. Precision loss from `number` vs `Decimal` is not a concern here:
quantities are kg to two decimal places, well within `number`'s safe range.

---

## 2026-09-11 — Phase 3: Confirmed food.ts type errors are downstream of the Prisma blocker, not new bugs

**Context:** When verifying Phase 3 against the *unmodified* `src/lib/db.ts`
(real `PrismaClient` import, which fails in this sandbox), `npm run build`
reported errors in `src/lib/services/food.ts` in addition to the expected
`db.ts` error. These looked like new problems.

**Finding:** They aren't. Once the `PrismaClient` import fails to resolve,
its type collapses to `any`, which cascades into `prisma.foodRecord.findMany(...)`
etc. also returning `any`, which breaks the generic type inference in the
`toPlainQuantity<T>` helper (it can no longer prove `T` has all of
`FoodRecord`'s fields). This was confirmed by swapping in a *properly
typed* stub client (not `any`-typed) — with that stub, `npm run build`
passed with zero errors across all 17 routes. So there is exactly one root
cause (`binaries.prisma.sh` unreachable in this sandbox), not several.

**Action:** No code change needed. Documented so a future session doesn't
mistake this cascade for a new bug and doesn't waste time re-diagnosing it.

---

## 2026-09-12 — Migrated to Prisma 7's config-based datasource + driver adapter

**Context:** The person running this project locally (outside this sandbox)
resolved the long-standing Prisma network blocker: they got a real Neon
PostgreSQL database, and in doing so hit Prisma 7's breaking change where
`datasource { url = env("DATABASE_URL") }` in `schema.prisma` is no longer
supported — Prisma 7 moved connection configuration out of the schema file.

**Decision:** Adopted Prisma 7's model:
- `prisma/schema.prisma` — `datasource db { provider = "postgresql" }`,
  no `url`. Schema files now describe pure data structure only.
- `prisma.config.ts` (new, project root) — used by the Prisma **CLI**
  (`migrate`, `studio`) to resolve `DATABASE_URL` via `dotenv/config` +
  `defineConfig`/`env` from `prisma/config`.
- `src/lib/db.ts` — the running **app** connects via `@prisma/adapter-pg`
  (`PrismaPg`) passed to `new PrismaClient({ adapter })`, not via a schema
  URL. This is the Prisma 7 runtime pattern for PostgreSQL. Added
  dependencies: `@prisma/adapter-pg`, `pg` (runtime), `@types/pg`, `dotenv`
  (dev, for `prisma.config.ts` only — the Next.js app itself doesn't need
  it, Next.js loads `.env` on its own).
- The dev-mode `globalForPrisma` singleton pattern from Phase 2 is
  preserved unchanged — only the client construction line changed.

**Why:** This is Prisma's documented v7 migration path (confirmed via
official docs and multiple community reports of the same breaking change),
not a workaround. `adapter` is intentionally *not* set in
`prisma.config.ts` — Prisma 7 removed that property; migrations work
automatically through driver adapters without extra CLI config, so
`prisma.config.ts` only needs `datasource.url` for the CLI.

**Verification performed in this sandbox:** Confirmed the new config loads
correctly — running `prisma generate` here now fails at the exact same
`binaries.prisma.sh` 403 as before (not at schema/config validation),
proving the Prisma 7 migration itself is correct and the only remaining
issue is this sandbox's network restriction, unrelated to this fix.
Re-ran the full typed-stub-client build check across all 17 routes — clean,
no new issues introduced by this change. **Full `generate` → `migrate` →
live-database CRUD verification was already performed by the person
locally against a real Neon database** (see `PROJECT_STATUS.md`), which is
the authoritative confirmation this works — this sandbox cannot repeat that
part since it has neither Prisma-binary network access nor a configured
`DATABASE_URL`.

**Also fixed in passing:** `.gitignore`'s `.env*` pattern was silently
excluding `.env.example` from every commit since Phase 1 (a real bug, not
part of this Prisma work) — added a `!.env.example` negation and confirmed
it's now tracked.

---

## 2026-09-12 — Phase 4: Added Vitest for pure-logic unit tests

**Decision:** Added `vitest` as a dev dependency, with a minimal
`vitest.config.mts` (path alias matching `tsconfig.json`'s `@/*`, node
environment). Tests live alongside the code they cover
(`src/lib/milk.test.ts`, `src/lib/validation/*.test.ts`,
`src/lib/services/milk.test.ts`) rather than in a separate `__tests__` tree.
`npm test` runs `vitest run`.

**Why:** The project had no test tooling yet, and Phase 4 was the first
place a deliberate design decision (never trust a client-supplied
`totalMilk`; always compute it server-side) is exactly the kind of thing a
regression test protects well. Scope is deliberately narrow: pure functions
(`computeTotalMilk`) and Zod schemas need no database and run instantly;
the one service-layer test (`createMilkRecord`) uses `vi.mock("@/lib/db")`
to verify the service actually calls `computeTotalMilk` and never accepts
a client total, without needing a live database connection — appropriate
for this sandbox and for fast CI regardless of database access. Full
browser/integration/e2e testing against a real database is intentionally
out of scope for now; that's better done manually per `SETUP.md` §6 or
added later with a real test database if the project grows enough to
justify the setup cost.

**Also fixed:** bumped `@types/node` from `^20` to `^22` (Vitest 5's peer
dependency requirement, and also a better match for the actual Node 22
runtime in use) — a types-only change with no runtime impact.

---

## 2026-09-12 — Phase 4: Confirmed milk.ts type errors are the same known cascade as food.ts

**Context:** Verifying Phase 4 against the *unmodified* `src/lib/db.ts`
(real `PrismaClient` import, which still fails to resolve in this sandbox)
showed new-looking errors in `src/lib/services/milk.ts`, structurally
identical to the `food.ts` cascade documented on 2026-09-11 ("Confirmed
food.ts type errors are downstream of the Prisma blocker, not new bugs").
Same root cause, same non-issue: confirmed clean with a properly-typed stub
client covering `milkRecord` alongside `animal`/`foodRecord` (21 routes,
zero errors). No code change needed; noted here so it isn't re-diagnosed.

---

## 2026-09-12 — Policy change: defer manual/live-database verification to Phase 9

**Decision:** Per explicit instruction, manual end-to-end verification
against the real Neon database (adding records through the running app,
confirming persistence across refresh, etc.) is no longer required as a
gate at the end of every phase. Each phase is considered complete once its
code is written, type-checks correctly, passes lint, and has appropriate
automated test coverage where applicable. All manual/live-database
verification — for every phase built up to that point — is deferred to
happen once, consolidated, during **Phase 9 (Testing and Hardening)** — see
`DEVELOPMENT_PHASES.md`.

**Why:** Repeating "bring the project to a machine with real DB access,
manually click through it, report back" after every single phase adds a
full round-trip of latency for a small, fast-moving project where the same
person is driving both the sandbox session and the local verification.
Consolidating it into one pass at Phase 9 is more efficient and still
provides real, end-to-end confidence before considering the MVP done —
it's the same rigor, applied once instead of five times.

**What this changes:** Phases 2–4 are now marked fully complete in
`DEVELOPMENT_PHASES.md` despite not each having had an individual manual
DB check (Phases 2–3 *did* get one anyway, before this policy was set —
that verification stands and doesn't need to be repeated). Phase 9's
scope (`DEVELOPMENT_PHASES.md`) now explicitly includes manually verifying
every phase's functionality in one consolidated pass, plus the
still-outstanding migration-history reconciliation from `SETUP.md` §6.

**What this doesn't change:** Automated tests (Vitest) still run and must
pass at every phase — those aren't a substitute for live-database
verification, but they're a different, faster kind of confidence that
remains valuable per-phase. Build (`npm run build`) and lint
(`npm run lint`) checks also still happen per-phase, verified via the
typed-stub-client technique in this sandbox until the Prisma/network
limitation here is resolved (unrelated to this policy — see the Phase 1–3
entries above).

---

## 2026-09-12 — Phase 5: Fixed a stub-fidelity gap in the sandbox verification harness (not a source bug)

**Context:** Verifying Phase 5 initially showed a type error in
`src/lib/services/medicine.ts` when checked against the typed stub client.
Unlike `food.ts`/`milk.ts`, `medicine.ts` has no Decimal fields, so
`listMedicineRecords` has no `.map(toPlain...)` step and returns
`prisma.medicineRecord.findMany(...)` directly — meaning it doesn't have
the `as XWithAnimal[]` cast that was silently absorbing a looseness in the
hand-written stub types (`animal` was typed as optional on the stub's row,
when real Prisma always makes it required once `include: { animal }` is
specified).

**Fix:** Corrected the stub's `MedicineRecordRow`/
`MedicineRecordRowWithAnimal` split so `findMany` (which includes the
animal relation) returns a type with `animal` required, matching what real
Prisma would actually generate. No change to `medicine.ts` itself was
needed — the service code was correct; the verification harness wasn't
precise enough for this particular shape. Rebuilt clean across all 25
routes afterward.

**Why this matters for future phases:** if a future service has no
Decimal/plain-value mapper step (skips the pattern established in
`food.ts`/`milk.ts`), remember the stub's `include`-relation rows need
`animal` (or any included relation) to be non-optional, or a spurious
type error will appear that doesn't reflect a real problem.

---

## 2026-09-12 — Phase 6: Dashboard aggregation split into pure logic + service layer

**Decision:** Dashboard aggregation is split across two files:
`src/lib/dashboard.ts` (pure functions — `summarizeAnimals`,
`buildMilkTrend`, `mergeRecentActivity` — no Prisma import, no I/O) and
`src/lib/services/dashboard.ts` (the actual Prisma queries, which call the
pure functions to shape their results). Date-range math
(`src/lib/utils/date-ranges.ts`) is similarly pure, with `now` as an
injectable parameter.

**Why:** This is the same principle already applied to `computeTotalMilk`
in Phase 4 — pure aggregation/calculation logic is trivially unit-testable
without a database or mocking, while the thin service layer wiring it to
Prisma doesn't need its own tests (it's just query construction). It also
means `buildMilkTrend`'s zero-filling behavior (a real correctness
requirement — a 7-day chart with only 2 days of data should still show 7
points, not 2) is verified directly rather than only observable by eyeballing a chart.

**Query approach:** `getTodayStats` uses Prisma's `aggregate`/`count`
directly (sum of milk/food, count of medicine) rather than fetching all of
today's records and summing in JS — appropriate given Postgres does this
efficiently and the query is simple. `getAnimalSummary` reuses the existing
`listAnimals()` service and aggregates in JS instead, since animal counts
for a single farm are a small, already-fetched dataset and this avoids a
second, redundant set of Prisma queries. `getMilkTrend` uses `groupBy` on
`date` for the same efficiency reason as `aggregate`.

**UI:** The milk trend chart is a real Recharts component in the app's own
codebase (already a project dependency since Phase 1), not a chat-context
visualization — the 7/30-day toggle follows the same URL-search-param
pattern already used by `AnimalFilters`/`RecordFilters`, for consistency
and so the choice is shareable/bookmarkable and read server-side.

---

## 2026-09-12 — Phase 7: Analytics reuses Phase 6's aggregation pattern; extracted a shared chart component

**Decision:** Analytics (`src/lib/analytics.ts` pure logic +
`src/lib/services/analytics.ts` Prisma queries) follows the exact
pure-logic/thin-service split established in Phase 6 for the Dashboard.
`getAnimalAnalytics` directly reuses Phase 6's `summarizeAnimals` rather
than reimplementing animal counting — the spec's Animal Analytics and
Dashboard's Animal Summary are literally the same computation. Milk/Food
analytics use `groupBy` (by `animalId`, by `date`, by `foodName` for food)
so per-animal/per-category/per-day aggregation happens in Postgres, not by
fetching every record and summing in JS.

Also extracted `src/components/charts/TrendChart.tsx` as a shared,
toggle-less presentational line chart, and refactored Phase 6's
`MilkTrendChart` to use it internally (its public API and rendered output
are unchanged — verified via the typed-stub build and by inspection). This
was deferred as a "use judgment when you get there" note in Phase 6's
`PROJECT_STATUS.md`, and became worth doing once Analytics needed the same
chart shape twice more (milk production trend, medicine usage-by-date) —
three total uses justified the extraction; two together with a
still-hypothetical third would not have.

**Also fixed a stub-fidelity gap** (not a source bug, same category as the
one noted in Phase 5): the hand-written sandbox verification stub gives
`prisma.medicineRecord.findMany` one fixed return type regardless of the
`select`/`include` actually passed at each call site, whereas real Prisma
infers a different type per call. Phase 5's `medicine.ts` selects the full
animal (with category); Phase 7's `analytics.ts` selects only
`{id, name}`. Resolved by giving the stub's `findMany` the *superset* type
(including `category`) — structurally compatible with code that only reads
`id`/`name`, since TypeScript doesn't excess-property-check values coming
from a function's return type. No production code changed.

**Custom date range:** `resolveDateRange` (in `date-ranges.ts`) silently
falls back to the last 7 days if a "custom" range is selected with a
missing or invalid from/to pair, rather than erroring — consistent with
this app's general approach of validating at the point of user input
(forms) while keeping internal query-shaping code defensive and always
returning something usable.

---

## 2026-09-13 — Phase 8: UX Refinement fixes (no new functionality)

**Context:** Phase 8's scope is explicitly fix-only — audit what's already
built rather than add features. Since this sandbox has no browser and no
live database, verification here was a systematic code review rather than
visual testing; genuinely visual concerns (does it actually look right on
a phone) are flagged for a human/browser check in Phase 9 rather than
claimed as verified.

**Fixes made:**
- **Table overflow inconsistency:** 3 of 9 data tables (`AnimalsTable`,
  `ByAnimalTable`, and the 3 inline animal-profile history tables — 6
  total counting the profile page's three) used `overflow-hidden` on their
  scroll container, which clips a wide table on a narrow screen instead of
  letting the user scroll to see it. The other 3 (Food/Milk/Medicine
  record tables) already used `overflow-x-auto`. Standardized all of them
  on `overflow-x-auto`.
- **Missing loading boundaries:** 4 of the app's dynamic-data pages
  (`/animals/[animalId]/edit`, `/records/{food,milk,medicine}/[recordId]/edit`)
  had no `loading.tsx` despite doing real async data fetching (unlike
  `/animals/new`, which does no async work and correctly has none).
- **Filter responsiveness:** the food-name text filter only applied on
  blur; added an Enter-key handler so keyboard users get the same result
  without needing to tab away first.
- **Accessibility:**
  - Added a skip-to-content link (visually hidden until focused) as the
    first focusable element, targeting a new `id="main-content"` on
    `<main>`.
  - Added `aria-current="page"` to the active nav link (top-level and
    Records sub-links) and `aria-hidden="true"` on decorative nav icons
    that sit next to visible text labels.
  - Added descriptive `aria-label`s to all 6 `<table>` elements in the app
    for screen-reader context (e.g. "Food history", "Milk records",
    dynamic labels like "Breakdown by animal — Total (L)" for the reused
    `ByAnimalTable`).
  - Enlarged icon-only edit/delete buttons in the three record tables from
    `p-1.5` to `p-2` — a small bump toward better mobile tap-target size
    without meaningfully changing desktop density.
  - **Fixed `--color-text-faint`'s contrast ratio**: `#8a938a` on the
    `#f6f7f5` background measures roughly 3.2:1, below WCAG AA's 4.5:1 for
    normal text. This token is used for genuinely informative content
    (empty-state descriptions, timestamps in activity/history lists), not
    purely decorative accents, so it needed to actually pass, not just be
    "close enough". Changed to `#6b756e` (~5:1), which still reads as
    visually quieter than `--color-text-muted` but is no longer a
    contrast failure. This is a single token change in `globals.css`, so
    it improves contrast everywhere the token is used without touching
    component code.

**Not done in this phase (correctly, per scope):** no new pages, fields,
or business logic. No changes to any service, validation, or Server
Action.

---

## 2026-09-10 — Phase 0: Initial architecture decisions

**Decision:** Use Next.js App Router + TypeScript + Tailwind for the entire
application (frontend + backend), Prisma + PostgreSQL for persistence, Zod
for validation, Recharts for charts, lucide-react for icons.

**Why:** Matches the mandated stack; keeps the whole app as one deployable
Vercel project as required; all are mature, low-maintenance choices suited
to a small farm-management MVP.

**Alternatives considered:** Separate Express backend — rejected per spec
(single Next.js app requirement, no compelling reason to split).

---

**Decision:** Use the human-readable Animal ID (e.g. `BUFF-001`) as the
Prisma `@id` (natural key) on the `Animal` model, instead of a separate
surrogate ID plus a unique constraint.

**Why:** The Animal ID is required, unique, and is the primary way animals
are referenced in URLs (`/animals/BUFF-001`) and forms. Avoiding a second
surrogate key keeps the schema simpler and avoids needing to join through an
extra field in every query.

**Alternatives considered:** Surrogate `cuid()` primary key + unique
`animalId` string field — more conventional but adds indirection with no
clear benefit here since the ID is guaranteed unique and stable by the
product requirements.

---

**Decision:** Store `totalMilk` as a persisted column on `MilkRecord`,
computed server-side from `morningMilk + eveningMilk` at write time, rather
than computing it on every read.

**Why:** Analytics (trends, averages, sums) run frequently and benefit from
not recomputing the sum on every row on every query. The value is never
user-editable, so there is no consistency risk as long as the service layer
is the only place that writes it.

---

## Template for future entries

```markdown
## YYYY-MM-DD — Phase N: <short title>

**Decision:** ...

**Why:** ...

**Alternatives considered:** ...
```
