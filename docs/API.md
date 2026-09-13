# API Design (Plan)

None of these are implemented yet (Phase 0). This document defines the
target contract so later phases build consistent, predictable APIs.

Implementation will use Next.js Route Handlers under `src/app/api/*` (or
Server Actions where more idiomatic for form submissions) — a final choice
per-endpoint will be recorded in `DECISIONS.md` as it's made in Phase 1/2.

## Conventions

**Status: Animal, Food, Milk, and Medicine endpoints below are implemented**
(`src/app/api/animals/**`, `src/app/api/food/**`, `src/app/api/milk/**`,
`src/app/api/medicine/**`). Only Analytics endpoints remain planned
(Phase 7).

- All endpoints validate input with Zod before touching the database.
- All responses use a consistent envelope:
  - Success: `{ success: true, data: ... }`
  - Failure: `{ success: false, error: "human readable message" }`
- No raw database or stack-trace details are ever returned to the client.
- Dates are ISO 8601 strings over the wire.
- Quantities are numbers over the wire (Decimal in the DB).

## Animals

| Action            | Method & Path                  | Notes                              |
|-------------------|----------------------------------|-------------------------------------|
| Create Animal     | `POST /api/animals`             | id, name?, category                 |
| Get Animals       | `GET /api/animals`               | filter by category, status          |
| Get Animal        | `GET /api/animals/:animalId`     | includes histories or summary       |
| Update Animal     | `PATCH /api/animals/:animalId`   | name, category                      |
| Deactivate Animal | `PATCH /api/animals/:animalId/deactivate` | soft status change         |

## Food

| Action                   | Method & Path                          |
|--------------------------|------------------------------------------|
| Create Food Record       | `POST /api/food`                        |
| Get Food Records         | `GET /api/food` (filters: date, animalId, category, foodName) |
| Get Animal Food History  | `GET /api/animals/:animalId/food`       |

## Milk

| Action                    | Method & Path                          |
|---------------------------|------------------------------------------|
| Create Milk Record        | `POST /api/milk`                        |
| Get Milk Records          | `GET /api/milk` (filters: date, animalId, category) |
| Get Animal Milk History   | `GET /api/animals/:animalId/milk`       |

## Medicine

| Action                       | Method & Path                        |
|-------------------------------|-----------------------------------------|
| Create Medicine Record        | `POST /api/medicine`                  |
| Get Medicine Records           | `GET /api/medicine` (filters: date, animalId, category) |
| Get Animal Medicine History    | `GET /api/animals/:animalId/medicine` |

## Analytics

**Status: not implemented as REST routes.** Like the Dashboard (Phase 6),
the Analytics page (Phase 7) reads directly from its service layer
(`src/lib/services/analytics.ts`, `src/lib/services/dashboard.ts`) via
Server Components, since nothing outside this app currently needs this
data over HTTP. The table below remains the plan for if/when an external
consumer (e.g. a future mobile client) needs it — implementing these would
be straightforward thin wrappers over the existing service functions,
following the same pattern already used for Animals/Food/Milk/Medicine.

| Action                     | Method & Path                                | Backing service function |
|------------------------------|--------------------------------------------|---------------------------|
| Get Dashboard Statistics    | `GET /api/analytics/dashboard`               | `getAnimalSummary`, `getTodayStats`, `getMilkTrend`, `getRecentActivity` (`services/dashboard.ts`) |
| Get Milk Analytics          | `GET /api/analytics/milk?range=7d\|30d\|today\|custom` | `getMilkAnalytics` (`services/analytics.ts`) |
| Get Food Analytics          | `GET /api/analytics/food?range=...`          | `getFoodAnalytics` |
| Get Animal Analytics        | `GET /api/analytics/animals`                 | `getAnimalAnalytics` |
| Get Medicine Analytics      | `GET /api/analytics/medicine?range=...`      | `getMedicineAnalytics` |

## Error Handling Contract

- Validation errors → `400` with field-level messages.
- Not found (e.g. unknown animalId) → `404` with a clear message.
- Duplicate Animal ID → `409` with "An animal with this ID already exists."
- Unexpected/database errors → `500` with a generic message; details logged
  server-side only.

This document will be updated as endpoints are actually implemented, and any
deviation from this plan should be noted in `DECISIONS.md`.
