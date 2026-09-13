# Architecture

## 1. Overview

The Livestock Farm Management System is a single deployable Next.js application
covering frontend, backend, API, and database access. It manages three animal
categories (Buffalo, Cow, Goat) and tracks Food, Milk, and Medicine records per
animal, with a Dashboard and Analytics layer built on top of that data.

This is an MVP for a single farm, single user (no auth yet), designed so that
authentication, multi-farm, and other features (see FEATURES.md / Future
Expansion) can be added later without a rewrite.

## 2. High-Level Diagram

```text
                    ┌─────────────────────────────┐
                    │        Browser (User)        │
                    └───────────────┬───────────────┘
                                    │ HTTPS
                    ┌───────────────▼───────────────┐
                    │      Next.js (App Router)      │
                    │  ─────────────────────────────  │
                    │  UI (React Server/Client Comps) │
                    │  Server Actions / Route Handlers│
                    │  Zod Validation                 │
                    │  Business Logic (lib/services)  │
                    └───────────────┬───────────────┘
                                    │ Prisma Client
                    ┌───────────────▼───────────────┐
                    │           PostgreSQL            │
                    └─────────────────────────────────┘
```

Everything (frontend, backend, API, DB access) lives in one Next.js project,
deployable as a single unit on Vercel.

## 3. Tech Stack

| Layer          | Choice                                   |
|----------------|-------------------------------------------|
| Framework      | Next.js (App Router), TypeScript, React    |
| Styling        | Tailwind CSS                               |
| Backend        | Next.js Server Actions + Route Handlers    |
| ORM            | Prisma                                     |
| Database       | PostgreSQL (Vercel-compatible provider)    |
| Validation     | Zod                                        |
| Charts         | Recharts (lightweight, React-native fit)   |
| Icons          | lucide-react (professional, no emojis)     |
| Deployment     | Vercel                                     |

Decision rationale is recorded in `DECISIONS.md`.

## 4. Folder Structure (planned)

```text
livestock-farm-app/
  docs/                       # Persistent project memory (this folder)
  prisma/
    schema.prisma
    migrations/
  src/
    app/
      layout.tsx
      page.tsx                 # Dashboard
      animals/
        page.tsx                # Animal list
        [animalId]/page.tsx     # Animal profile
        new/page.tsx             # Add animal
      records/
        food/page.tsx
        milk/page.tsx
        medicine/page.tsx
      analytics/
        page.tsx
      api/
        animals/route.ts
        animals/[animalId]/route.ts
        food/route.ts
        milk/route.ts
        medicine/route.ts
        analytics/*/route.ts
    components/
      layout/                  # Nav, shell
      ui/                      # Buttons, inputs, tables, cards (reusable)
      animals/
      records/
      analytics/
      dashboard/
    lib/
      db.ts                    # Prisma client singleton
      validation/              # Zod schemas
      services/                # Business logic (animals, food, milk, medicine, analytics)
      utils/                   # Date helpers, formatting
    types/
  .env.example
  package.json
  tsconfig.json
  tailwind.config.ts
```

This structure is the target for the fully-built app. As of Phase 7, all
core data modules (Animal, Food, Milk, Medicine) plus Dashboard and
Analytics are fully implemented. The MVP's functional scope from
`FEATURES.md` is now complete; remaining phases (8–10) are refinement,
hardening, and deployment rather than new features. A `vitest.config.mts`
and co-located `*.test.ts` files were added starting in Phase 4 for
pure-logic unit tests (see `DECISIONS.md`). See `PROJECT_STATUS.md` for the
exact current file list.

## 5. Layering Principles

- **UI components** never talk to Prisma directly.
- **Server Actions / Route Handlers** validate input (Zod) then call
  **service functions** in `lib/services/*`.
- **Service functions** contain business logic (e.g. computing milk totals,
  aggregating analytics) and are the only layer that calls Prisma.
- This keeps API logic separate from UI components (per spec section 16) and
  makes services independently testable.

## 6. Cross-Cutting Concerns

- **Validation**: Zod schemas in `lib/validation`, shared between client-side
  form checks (fast feedback) and server-side enforcement (source of truth).
- **Error handling**: Services throw typed errors; route handlers/server
  actions catch them and return human-readable messages. Raw DB errors are
  never surfaced to the UI (see API.md).
- **Loading/Empty states**: Standard reusable components (`<LoadingSkeleton>`,
  `<EmptyState>`) used consistently across list/detail views.
- **Historical integrity**: Animals are never hard-deleted; `status` is set to
  `INACTIVE` instead, preserving all related records.

## 7. Non-Goals (MVP)

- No authentication/authorization (planned as future phase).
- No financial tracking of any kind (see FEATURES.md constraints).
- No multi-farm or multi-user support yet.
- No medical/veterinary decision support — medicine tracking is a simple log.

## 8. Session Continuity Note

Because development spans multiple Claude sessions with no shared memory,
this `docs/` folder is the single source of truth. Every session must read
`PROJECT_STATUS.md`, `ARCHITECTURE.md`, and `DEVELOPMENT_PHASES.md` before
writing any code, and must update `PROJECT_STATUS.md` before ending.
