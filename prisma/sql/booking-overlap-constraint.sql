-- SlotSync initial PostgreSQL migration supplements Prisma's generated schema.
-- Run after `prisma migrate dev` has created the base tables, then keep this
-- constraint in the migration history for production deployments.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Database-level protection against overlapping live reservations for the same
-- resource. Application code must still validate operating hours, permissions,
-- holds and state transitions inside a transaction.
ALTER TABLE "Booking"
  ADD CONSTRAINT "booking_no_live_overlap"
  EXCLUDE USING gist (
    "resourceId" WITH =,
    tstzrange("startsAt", "bufferEndsAt", '[)') WITH &&
  )
  WHERE ("status" IN ('PENDING_APPROVAL', 'HELD', 'PENDING_PAYMENT', 'CONFIRMED'));

CREATE INDEX IF NOT EXISTS "booking_hold_expiry_idx" ON "BookingHold" ("expiresAt");
