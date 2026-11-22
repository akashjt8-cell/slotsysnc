# SlotSync architecture — initial decisions

## Application shape

Start with a modular monolith: one NestJS API with modules for identity, organisations, resources, availability, bookings, payments, waitlists, notifications, check-in, analytics and administration. Split services only when measurable scale or team boundaries justify it.

## Reservation consistency

PostgreSQL is authoritative. A future booking command must:
1. Authenticate the actor and verify organisation/resource access.
2. Validate the resource policy, operating hours, advance window, duration and buffers.
3. Create a short-lived hold or booking in a database transaction.
4. Rely on a database exclusion constraint/transaction strategy to reject overlap races.
5. Write an outbox event in the same transaction.
6. Return the committed reservation result; an outbox worker publishes the Socket.IO event.

The browser's availability is advisory and must be revalidated server-side. On socket reconnect, clients refetch authoritative availability.

## Domain boundaries

- Identity: users, sessions, credentials and platform roles.
- Organisations: tenants, memberships, invitations and permissions.
- Resources: category, policies, images, operating hours and maintenance blocks.
- Availability: slot calculation, holds, buffers and conflict detection.
- Bookings: state machine, history, cancellation and rescheduling.
- Payments: provider orders, verified webhooks, idempotency and refunds.
- Waitlist: FIFO offers, acceptance windows and promotion.
- Notifications: in-app/email delivery and preferences.
- Operations: QR check-in, reviews, analytics, audit logs and disputes.

## Multi-tenancy

Every organisation-owned query must scope by the authenticated organisation membership. Never trust an organisation ID supplied by a client without checking membership and permissions. Customer booking reads and mutations must scope to the authenticated customer unless the actor has a valid staff permission.

## Demo safety

Demo organisations and records are flagged. Demo actions must not call payment providers, send external email, or mutate real customer records. Clearly label demo mode in the UI.
