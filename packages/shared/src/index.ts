export type UserRole = 'CUSTOMER' | 'ORG_OWNER' | 'ORG_ADMIN' | 'STAFF' | 'PLATFORM_ADMIN';
export type BookingMode = 'FIXED' | 'FLEXIBLE';
export type PaymentPolicy = 'FREE' | 'PAY_AT_VENUE' | 'ONLINE' | 'DEPOSIT';
export type BookingStatus = 'PENDING_APPROVAL' | 'HELD' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED' | 'NO_SHOW' | 'REJECTED';
export type ResourceCategory = 'SPORTS' | 'ROOM' | 'LAB' | 'EQUIPMENT' | 'STUDY_SPACE' | 'OTHER';
export type AvailabilityInterval = { startsAt: string; endsAt: string; available: boolean; reason?: 'BOOKED' | 'HELD' | 'MAINTENANCE' | 'OUTSIDE_HOURS' };
export type ApiError = { statusCode: number; code: string; message: string; requestId?: string };
