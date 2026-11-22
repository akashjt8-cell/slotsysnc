import { PrismaClient, ResourceCategory, BookingMode, PaymentPolicy, MembershipRole, UserRole, BookingStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed is deliberately demo-only. It does not create real payment records,
  // send notifications, or trigger external integrations.
  const owner = await prisma.user.upsert({ where: { email: 'owner@demo.slotsync.app' }, update: {}, create: { email: 'owner@demo.slotsync.app', passwordHash: 'DEMO_LOGIN_DISABLED', firstName: 'Akash', lastName: 'Demo', platformRole: UserRole.ORG_OWNER } });
  const customer = await prisma.user.upsert({ where: { email: 'maya@demo.slotsync.app' }, update: {}, create: { email: 'maya@demo.slotsync.app', passwordHash: 'DEMO_LOGIN_DISABLED', firstName: 'Maya', lastName: 'Sharma' } });
  const org = await prisma.organisation.upsert({ where: { slug: 'slotsync-sports-hub' }, update: {}, create: { name: 'SlotSync Sports Hub', slug: 'slotsync-sports-hub', timezone: 'Asia/Kolkata', currency: 'INR', isDemo: true } });
  await prisma.membership.upsert({ where: { organisationId_userId: { organisationId: org.id, userId: owner.id } }, update: {}, create: { organisationId: org.id, userId: owner.id, role: MembershipRole.OWNER } });
  const court = await prisma.resource.upsert({ where: { organisationId_slug: { organisationId: org.id, slug: 'badminton-court-01' } }, update: {}, create: { organisationId: org.id, name: 'Badminton Court 01', slug: 'badminton-court-01', category: ResourceCategory.SPORTS, bookingMode: BookingMode.FIXED, paymentPolicy: PaymentPolicy.ONLINE, pricePerHour: 300, slotDurationMins: 60, isDemo: true } });
  await prisma.resource.upsert({ where: { organisationId_slug: { organisationId: org.id, slug: 'meeting-room-a' } }, update: {}, create: { organisationId: org.id, name: 'Meeting Room A', slug: 'meeting-room-a', category: ResourceCategory.ROOM, bookingMode: BookingMode.FLEXIBLE, paymentPolicy: PaymentPolicy.FREE, requiresApproval: true, capacity: 8, isDemo: true } });
  await prisma.resource.upsert({ where: { organisationId_slug: { organisationId: org.id, slug: 'camera-kit-01' } }, update: {}, create: { organisationId: org.id, name: 'Camera Kit 01', slug: 'camera-kit-01', category: ResourceCategory.EQUIPMENT, bookingMode: BookingMode.FLEXIBLE, paymentPolicy: PaymentPolicy.DEPOSIT, depositAmount: 500, isDemo: true } });
  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(10, 0, 0, 0);
  const end = new Date(start); end.setHours(end.getHours() + 1);
  await prisma.booking.upsert({ where: { reference: 'SS-DEMO-2048' }, update: {}, create: { reference: 'SS-DEMO-2048', organisationId: org.id, resourceId: court.id, customerId: customer.id, startsAt: start, endsAt: end, bufferEndsAt: end, status: BookingStatus.CONFIRMED, paymentPolicy: PaymentPolicy.ONLINE, subtotal: 300, currency: 'INR', confirmedAt: new Date() } });
  console.log('SlotSync demo seed complete. No real payments or notifications were created.');
}
main().catch(error => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
