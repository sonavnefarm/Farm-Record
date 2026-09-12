# Features (MVP Scope)

This document is the functional source of truth. If a requested feature is
not listed here (or explicitly excluded), it should not be built without
updating this document first.

## 1. Navigation

```text
Dashboard
Animals
Records
  Food
  Milk
  Medicine
Analytics
```

## 2. Animal Management

- Categories: Buffalo, Cow, Goat
- Fields: Animal ID (required, unique), Name (optional), Category (required),
  Status (Active/Inactive, default Active)
- Create, edit, list, deactivate (soft — never hard delete)
- Filter list by Category and Status
- Animal Profile page at `/animals/[animalId]` showing:
  - Animal ID, Name, Category, Status
  - Food History
  - Milk History
  - Medicine History

## 3. Food Records

- Fields: Date (required), Animal (required), Food Name (optional),
  Quantity (required, > 0, kg)
- Create, edit, and delete/correct records
- Filter by Date, Animal, Category, Food Name
- Explicitly excluded: price, cost, supplier, expense tracking, profit

## 4. Milk Records

- Fields: Date (required), Animal (required), Morning Milk (>= 0, L),
  Evening Milk (>= 0, L), Total Milk (auto-calculated, not user-entered)
- Create, edit records
- Filter by Date, Animal, Category
- Supports historical analysis: today, 7-day, 30-day, average daily,
  animal-level, category-level

## 5. Medicine Records

- Fields: Date (required), Animal (required), Medicine Name (required)
- Create, edit records
- Filter by Date, Animal, Category
- Explicitly excluded: price, dosage, duration, veterinarian, diagnosis,
  prescription, pharmacy, treatment cost — this stays a simple log

## 6. Dashboard

- Animal Summary: total, buffaloes, cows, goats, active, inactive
- Today's Records: milk production, food consumption, medicine records
- Recent Activity: recently added food/milk/medicine records
- Milk Trend chart: last 7 days (default) or last 30 days

## 7. Analytics

- Animal Analytics: totals by category, active/inactive
- Milk Analytics: total milk, average daily milk, trend, by animal, by
  category, highest-producing animal
- Food Analytics: total quantity, average daily quantity, trend, by animal,
  by category, by food name (graceful handling of missing food names)
- Medicine Analytics: recent records, history by animal, usage by date
  (history only — no medical interpretation or recommendations)
- Date range filters: Today, Last 7 Days, Last 30 Days, Custom Range

## 8. Filtering (cross-cutting)

- Records: Date, Animal, Animal Category (+ Food Name for food records)
- Analytics: Today, Last 7 Days, Last 30 Days, Custom Range

## 9. Cross-Cutting UX Requirements

- Loading states (skeletons, disabled buttons while saving) on every
  data-fetching view
- Empty states with helpful guidance text on every list
- Human-readable error messages; no raw DB errors surfaced
- Fast data entry: adding a record should not require multi-page navigation
- Light, professional, minimal, responsive UI; no emojis in the UI

## 10. Explicitly Out of Scope (MVP)

- Any financial tracking: feed prices, food costs, expenses, profitability,
  profit per animal, revenue, financial forecasting
- Authentication / authorization
- Multiple farms / multiple users
- Animal photos
- Vaccination tracking
- Notifications
- Advanced reports / data export
- Backup/restore tooling
- AI-based insights

These may be considered in future phases per explicit instruction only (see
`DEVELOPMENT_PHASES.md` and the source spec's "Future Expansion" section).
