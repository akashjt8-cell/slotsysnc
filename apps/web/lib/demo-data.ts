export type BookingStatus = 'Confirmed' | 'Awaiting approval' | 'Completed';
export type Booking = { id: string; customer: string; initials: string; resource: string; category: string; date: string; time: string; amount: string; status: BookingStatus; color: string };

export const bookings: Booking[] = [
  { id: 'SS-2048', customer: 'Maya Sharma', initials: 'MS', resource: 'Badminton Court 01', category: 'Sports', date: 'Today', time: '10:00 – 11:00 AM', amount: '₹300', status: 'Confirmed', color: 'violet' },
  { id: 'SS-2047', customer: 'Arjun Rao', initials: 'AR', resource: 'Meeting Room A', category: 'Workspace', date: 'Today', time: '11:30 AM – 12:30 PM', amount: 'Free', status: 'Awaiting approval', color: 'blue' },
  { id: 'SS-2046', customer: 'Ishita Nair', initials: 'IN', resource: 'Camera Kit 01', category: 'Equipment', date: 'Today', time: '1:00 – 4:00 PM', amount: '₹500 deposit', status: 'Confirmed', color: 'amber' },
  { id: 'SS-2045', customer: 'Rohan Mehta', initials: 'RM', resource: 'Study Room 03', category: 'Study space', date: 'Tomorrow', time: '9:00 – 10:00 AM', amount: 'Free', status: 'Confirmed', color: 'green' },
  { id: 'SS-2044', customer: 'Diya Kapoor', initials: 'DK', resource: 'Badminton Court 02', category: 'Sports', date: 'Tomorrow', time: '4:00 – 5:00 PM', amount: '₹300', status: 'Completed', color: 'rose' }
];

export const resources = [
  { name: 'Badminton Court 01', type: 'Sports · Court', availability: 'Available now', next: 'Next slot at 10:00 AM', rate: '₹300 / hour', icon: 'activity', state: 'available' },
  { name: 'Meeting Room A', type: 'Workspace · 8 seats', availability: 'In use', next: 'Available at 11:30 AM', rate: 'Free', icon: 'users', state: 'busy' },
  { name: 'Camera Kit 01', type: 'Equipment · Sony A7 IV', availability: 'Available now', next: 'Ready for reservation', rate: '₹500 deposit', icon: 'camera', state: 'available' },
  { name: 'Study Room 03', type: 'Study space · 4 seats', availability: 'Maintenance', next: 'Back tomorrow at 8:00 AM', rate: 'Free', icon: 'book-open', state: 'maintenance' }
];
