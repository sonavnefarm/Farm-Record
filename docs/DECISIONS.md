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
