# SlotSync

A multi-purpose resource reservation and management platform for courts, rooms, labs, equipment and shared spaces.

> **Current milestone:** foundation scaffold. The public landing page and responsive demo owner dashboard are implemented. The NestJS API health endpoint and Socket.IO availability subscription skeleton are in place. Authentication, booking transactions, payments and production real-time events are not implemented yet.

## Product principles

- One configurable resource model for many resource categories.
- Fixed and flexible booking modes.
- Per-resource payment policies: free, pay at venue, online and deposit.
- PostgreSQL is the source of truth for reservations. WebSockets distribute committed changes; they do not provide booking locks.
- Demo data is explicitly labelled and must never trigger real payments or notifications.
- Public pages are bright by default; dashboards default to dark and support a persisted light/dark preference.

## Stack

- Web: Next.js App Router, React, TypeScript, custom design tokens and Lucide icons.
- API: NestJS, REST and Socket.IO.
- Data: PostgreSQL, Prisma.
- Local infrastructure: Docker Compose with PostgreSQL and Redis.
- Shared contracts: `packages/shared`.

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- Docker Desktop (or Docker Engine with Compose)

## Run locally

1. Extract this project folder.
2. Copy `.env.example` to `.env` in the project root.
3. Start infrastructure: `docker compose up -d`.
4. Install dependencies: `pnpm install`.
5. Generate the Prisma client: `pnpm db:generate`.
6. Apply the initial schema: `pnpm db:migrate`.
7. Start the apps: `pnpm dev`.
8. Open `http://localhost:3000` for the public website and `http://localhost:3000/dashboard` for the demo dashboard. API health: `http://localhost:4000/api/v1/health`.

For a fresh database, run `pnpm db:migrate --name init` to create and apply the initial schema migration. Then apply `prisma/sql/booking-overlap-constraint.sql` using `psql` after the base tables exist. Commit the generated Prisma migration folder to source control. The schema and exclusion constraint must be tested together before production use.

## Demo mode

The initial web dashboard uses static sample data and makes no network calls. The Prisma seed is optional and creates demo-labelled organisation/resources plus a single sample booking. It intentionally does not create payment transactions or send notifications. The seeded user password is not usable for login; authentication is a later milestone.

## Project layout

```text
apps/
  web/                 Next.js public site and dashboards
  api/                 NestJS REST and Socket.IO API
packages/
  shared/              Shared TypeScript domain contracts
prisma/                Database schema, migrations and demo seed
infrastructure/        (reserved for deployment configuration)
docs/                  Architecture and implementation notes
```

## Important booking integrity requirement

A booking implementation must run conflict checks and writes in a database transaction. The PostgreSQL exclusion constraint is intended to reject overlapping live bookings for the same resource, including buffer time. Map database conflict errors to a stable `SLOT_UNAVAILABLE` API response. Use idempotency keys for booking/payment creation and an outbox for reliable post-commit event delivery. Do not trust a browser's availability view or client-emitted Socket.IO messages as authority.

## Status

This is the first build milestone, not a production-ready booking service. Before launch, implement and test authentication, tenant-scoped authorisation, booking state transitions, expiring holds, webhook verification, audit logging, background jobs, accessibility, automated tests and deployment secrets.
