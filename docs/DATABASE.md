# Database Design

## 1. Engine & ORM

- PostgreSQL
- Prisma ORM
- `prisma/schema.prisma` is the single source of truth for schema. Never edit
  the production database by hand.

## 2. Entity-Relationship Overview

```text
Animal (1) ────< (many) FoodRecord
Animal (1) ────< (many) MilkRecord
Animal (1) ────< (many) MedicineRecord
```

Every record references an Animal by `animalId` (foreign key). Animal name
and category are NOT duplicated into records — they are read through the
relationship (per spec section 14).

## 3. Planned Prisma Schema (target for Phase 1/2)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // No `url` here as of Prisma 7 — see prisma.config.ts (CLI) and
  // src/lib/db.ts (app runtime, via the @prisma/adapter-pg driver
  // adapter). Full rationale in DECISIONS.md.
}

enum AnimalCategory {
  BUFFALO
  COW
  GOAT
}

enum AnimalStatus {
  ACTIVE
  INACTIVE
}

model Animal {
  id         String          @id            // e.g. "BUFF-001" — user-provided, unique
  name       String?
  category   AnimalCategory
  status     AnimalStatus    @default(ACTIVE)
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt

  foodRecords     FoodRecord[]
  milkRecords     MilkRecord[]
  medicineRecords MedicineRecord[]

  @@index([category])
  @@index([status])
}

model FoodRecord {
  id        String   @id @default(cuid())
  animalId  String
  animal    Animal   @relation(fields: [animalId], references: [id])
  date      DateTime
  foodName  String?
  quantity  Decimal  @db.Decimal(8, 2)   // kg
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([animalId])
  @@index([date])
}

model MilkRecord {
  id           String   @id @default(cuid())
  animalId     String
  animal       Animal   @relation(fields: [animalId], references: [id])
  date         DateTime
  morningMilk  Decimal  @db.Decimal(6, 2)  // liters
  eveningMilk  Decimal  @db.Decimal(6, 2)  // liters
  totalMilk    Decimal  @db.Decimal(6, 2)  // computed = morning + evening
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([animalId])
  @@index([date])
}

model MedicineRecord {
  id           String   @id @default(cuid())
  animalId     String
  animal       Animal   @relation(fields: [animalId], references: [id])
  date         DateTime
  medicineName String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([animalId])
  @@index([date])
}
```

### Notes on design choices

- `Animal.id` is a natural key (the human-readable Animal ID, e.g. `BUFF-001`)
  rather than a surrogate key, since the spec requires it to be required and
  unique, and it is the primary way users/URLs reference an animal
  (`/animals/BUFF-001`). This avoids a redundant separate "code" field.
- Record tables use `cuid()` surrogate keys since they have no natural key.
- `totalMilk` is stored (not just computed on read) so historical analytics
  queries are fast and the calculation is guaranteed consistent at write
  time. It is always derived from `morningMilk + eveningMilk` in the service
  layer — never entered directly by the user.
- `Decimal` is used for quantities to avoid floating-point rounding issues
  in aggregated analytics.
- Indexes on `animalId`, `date`, and `category`/`status` support the required
  filtering (spec section 13) and analytics aggregation.
- No `animalName`/`animalCategory` fields on record tables (spec section 14).

**Status as of 2026-09-12:** `prisma/schema.prisma` contains this exact
schema (all four models, up front, since they're small and it's easier to
review as a whole — migrations are still applied incrementally per phase).
The first migration (`20260912074321_init`) has been created and applied
against a real Neon PostgreSQL database, confirmed working outside this
sandbox — see `PROJECT_STATUS.md` for details. Note: as of Prisma 7, the
connection URL is no longer set in this file's `datasource` block; see
`prisma.config.ts` (CLI) and `src/lib/db.ts` (app runtime, via
`@prisma/adapter-pg`) — full rationale in `DECISIONS.md`.

## 4. Migration Strategy

- Use `npx prisma migrate dev --name <description>` for each schema change.
- Commit generated migration files under `prisma/migrations/`.
- Never use `prisma db push` against production.
- Keep this document in sync with `schema.prisma` after every migration.

## 5. Open Questions / Future Considerations

- If multi-farm support is added later, a `Farm` model would own `Animal`
  records via a `farmId` foreign key — current schema does not preclude this.
- If authentication is added, a `User` model would be introduced without
  affecting the Animal/Food/Milk/Medicine relationships.
