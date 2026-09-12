# Deployment Plan

> Target process for Phase 10. Nothing has been deployed yet as of Phase 0.

## 1. Target Architecture

```text
User → Vercel → Next.js Frontend + Server/API → Prisma → PostgreSQL
```

Single Next.js project, single Vercel deployment.

## 2. Database Provider

Any Vercel-compatible PostgreSQL provider (e.g. Vercel Postgres, Neon,
Supabase). Chosen provider and rationale will be recorded in
`DECISIONS.md` when selected.

## 3. Required Environment Variables

| Variable       | Purpose                          |
|-----------------|------------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string       |

Set these in Vercel's Project Settings → Environment Variables. Never commit
`.env` files.

## 4. Pre-Deployment Checklist (Phase 10)

- [ ] All Prisma migrations committed and applied to production database
- [ ] `npm run build` succeeds locally
- [ ] `npm run lint` clean
- [ ] Environment variables configured in Vercel
- [ ] Manual smoke test of core flows (add animal, add records, dashboard,
      analytics) against production build

## 5. Deployment Steps

1. Push the repository to GitHub (or connected Git provider).
2. Import the project into Vercel.
3. Configure `DATABASE_URL` in Vercel environment variables.
4. Trigger deployment (`git push` to the connected branch, or manual deploy).
5. Run `npx prisma migrate deploy` against the production database (via a
   Vercel build step or manually) — do not use `migrate dev` in production.
6. Verify the deployed app end-to-end.

## 6. Rollback

- Use Vercel's deployment history to roll back the application instantly.
- Database migrations are additive where possible; destructive migrations
  should be reviewed carefully since Vercel rollback does not roll back the
  database.

This document will be filled in with concrete provider names, project IDs,
and any deployment-specific quirks once Phase 10 begins.
