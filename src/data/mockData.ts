import type { RoomType, Room, Customer, Booking, Bill, BillItem, Payment, HousekeepingTask, DashboardStats } from '@/types/hotel';

export const roomTypes: RoomType[] = [
  { id: 1, name: 'Standard Single', description: 'Comfortable single room', base_rate: 5000, max_occupancy: 1, amenities: ['Wi-Fi', 'TV', 'AC'] },
  { id: 2, name: 'Standard Double', description: 'Spacious double room', base_rate: 8000, max_occupancy: 2, amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar'] },
  { id: 3, name: 'Deluxe Room', description: 'Premium room with city view', base_rate: 12000, max_occupancy: 2, amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Room Service', 'City View'] },
  { id: 4, name: 'Executive Suite', description: 'Luxury suite with living area', base_rate: 20000, max_occupancy: 3, amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Room Service', 'Lounge', 'Jacuzzi'] },
  { id: 5, name: 'Presidential Suite', description: 'Top-tier luxury experience', base_rate: 35000, max_occupancy: 4, amenities: ['Wi-Fi', 'TV', 'AC', 'Mini Bar', 'Room Service', 'Lounge', 'Jacuzzi', 'Butler Service'] },
];

export const rooms: Room[] = [
  { id: 1, room_number: '101', room_type_id: 1, room_type: roomTypes[0], floor: 1, status: 'available' },
  { id: 2, room_number: '102', room_type_id: 1, room_type: roomTypes[0], floor: 1, status: 'occupied' },
  { id: 3, room_number: '103', room_type_id: 2, room_type: roomTypes[1], floor: 1, status: 'reserved' },
  { id: 4, room_number: '104', room_type_id: 2, room_type: roomTypes[1], floor: 1, status: 'cleaning' },
  { id: 5, room_number: '201', room_type_id: 3, room_type: roomTypes[2], floor: 2, status: 'available' },
  { id: 6, room_number: '202', room_type_id: 3, room_type: roomTypes[2], floor: 2, status: 'occupied' },
  { id: 7, room_number: '203', room_type_id: 3, room_type: roomTypes[2], floor: 2, status: 'available' },
  { id: 8, room_number: '204', room_type_id: 2, room_type: roomTypes[1], floor: 2, status: 'maintenance' },
  { id: 9, room_number: '301', room_type_id: 4, room_type: roomTypes[3], floor: 3, status: 'occupied' },
  { id: 10, room_number: '302', room_type_id: 4, room_type: roomTypes[3], floor: 3, status: 'available' },
  { id: 11, room_number: '303', room_type_id: 5, room_type: roomTypes[4], floor: 3, status: 'reserved' },
  { id: 12, room_number: '304', room_type_id: 5, room_type: roomTypes[4], floor: 3, status: 'available' },
  { id: 13, room_number: '401', room_type_id: 1, room_type: roomTypes[0], floor: 4, status: 'available' },
  { id: 14, room_number: '402', room_type_id: 2, room_type: roomTypes[1], floor: 4, status: 'occupied' },
  { id: 15, room_number: '403', room_type_id: 3, room_type: roomTypes[2], floor: 4, status: 'out_of_service' },
  { id: 16, room_number: '404', room_type_id: 1, room_type: roomTypes[0], floor: 4, status: 'available' },
];

export const customers: Customer[] = [
  { id: 1, first_name: 'Ahmed', last_name: 'Mohamed', email: 'ahmed@email.com', phone: '+254712345678', id_type: 'National ID', id_number: '12345678', nationality: 'Kenyan', address: 'Nairobi, Kenya', is_vip: true, total_stays: 12, created_at: '2024-01-15' },
  { id: 2, first_name: 'Fatima', last_name: 'Hassan', email: 'fatima@email.com', phone: '+254723456789', id_type: 'Passport', id_number: 'AB1234567', nationality: 'Somali', address: 'Mogadishu, Somalia', is_vip: false, total_stays: 3, created_at: '2024-03-20' },
  { id: 3, first_name: 'John', last_name: 'Kamau', email: 'john.k@email.com', phone: '+254734567890', id_type: 'National ID', id_number: '87654321', nationality: 'Kenyan', address: 'Mombasa, Kenya', is_vip: false, total_stays: 5, created_at: '2024-02-10' },
  { id: 4, first_name: 'Sarah', last_name: 'Wanjiku', email: 'sarah.w@email.com', phone: '+254745678901', id_type: 'Passport', id_number: 'CD7654321', nationality: 'Kenyan', address: 'Nakuru, Kenya', is_vip: true, total_stays: 8, created_at: '2024-01-05' },
  { id: 5, first_name: 'Omar', last_name: 'Ali', email: 'omar.a@email.com', phone: '+254756789012', id_type: 'National ID', id_number: '11223344', nationality: 'Kenyan', address: 'Kisumu, Kenya', is_vip: false, total_stays: 2, created_at: '2024-06-12' },
  { id: 6, first_name: 'Grace', last_name: 'Ochieng', email: 'grace.o@email.com', phone: '+254767890123', id_type: 'Passport', id_number: 'EF9876543', nationality: 'Kenyan', address: 'Eldoret, Kenya', is_vip: false, total_stays: 1, created_at: '2024-08-01' },
];

export const bookings: Booking[] = [
  { id: 1001, customer: customers[0], room: rooms[1], check_in_date: '2026-03-01', check_out_date: '2026-03-05', status: 'checked_in', adults: 1, children: 0, total_amount: 20000, created_at: '2026-02-25' },
  { id: 1002, customer: customers[1], room: rooms[2], check_in_date: '2026-03-03', check_out_date: '2026-03-06', status: 'confirmed', adults: 2, children: 1, special_requests: 'Extra pillows', total_amount: 24000, created_at: '2026-02-28' },
  { id: 1003, customer: customers[2], room: rooms[5], check_in_date: '2026-03-02', check_out_date: '2026-03-04', status: 'checked_in', adults: 2, children: 0, total_amount: 24000, created_at: '2026-02-27' },
  { id: 1004, customer: customers[3], room: rooms[8], check_in_date: '2026-03-01', check_out_date: '2026-03-07', status: 'checked_in', adults: 2, children: 1, special_requests: 'Late checkout', total_amount: 120000, created_at: '2026-02-20' },
  { id: 1005, customer: customers[4], room: rooms[10], check_in_date: '2026-03-04', check_out_date: '2026-03-08', status: 'confirmed', adults: 2, children: 2, total_amount: 140000, created_at: '2026-03-01' },
  { id: 1006, customer: customers[5], room: rooms[13], check_in_date: '2026-03-01', check_out_date: '2026-03-03', status: 'checked_in', adults: 1, children: 0, total_amount: 16000, created_at: '2026-02-28' },
  { id: 1007, customer: customers[0], room: rooms[0], check_in_date: '2026-02-20', check_out_date: '2026-02-25', status: 'checked_out', adults: 1, children: 0, total_amount: 25000, created_at: '2026-02-15' },
];

const billItems1: BillItem[] = [
  { id: 1, description: 'Room Charge - Standard Single (5 nights)', quantity: 5, unit_price: 5000, total: 25000, category: 'Room' },
  { id: 2, description: 'Room Service - Breakfast', quantity: 3, unit_price: 800, total: 2400, category: 'Food & Beverage' },
  { id: 3, description: 'Laundry Service', quantity: 1, unit_price: 500, total: 500, category: 'Service' },
];

const billItems2: BillItem[] = [
  { id: 4, description: 'Room Charge - Executive Suite (6 nights)', quantity: 6, unit_price: 20000, total: 120000, category: 'Room' },
  { id: 5, description: 'Mini Bar', quantity: 4, unit_price: 1500, total: 6000, category: 'Food & Beverage' },
  { id: 6, description: 'Spa Treatment', quantity: 2, unit_price: 5000, total: 10000, category: 'Service' },
  { id: 7, description: 'Airport Transfer', quantity: 1, unit_price: 3000, total: 3000, category: 'Transport' },
];

export const bills: Bill[] = [
  { id: 1, booking: bookings[0], items: billItems1, subtotal: 27900, tax: 4464, total: 32364, status: 'open', created_at: '2026-03-01' },
  { id: 2, booking: bookings[3], items: billItems2, subtotal: 139000, tax: 22240, total: 161240, status: 'partial', created_at: '2026-03-01' },
  { id: 3, booking: bookings[6], items: [billItems1[0]], subtotal: 25000, tax: 4000, total: 29000, status: 'paid', created_at: '2026-02-20' },
];

export const payments: Payment[] = [
  { id: 1, bill_id: 2, amount: 100000, method: 'credit_card', reference: 'TXN-2026-001', created_at: '2026-03-02' },
  { id: 2, bill_id: 3, amount: 29000, method: 'mobile_money', reference: 'MPESA-ABC123', created_at: '2026-02-25' },
];

export const housekeepingTasks: HousekeepingTask[] = [
  { id: 1, room: rooms[3], task_type: 'Checkout Cleaning', description: 'Full room cleaning after checkout', assigned_to: 'Mary Njeri', status: 'in_progress', priority: 'high', scheduled_date: '2026-03-03' },
  { id: 2, room: rooms[0], task_type: 'Daily Cleaning', description: 'Regular daily cleaning', assigned_to: 'Peter Odhiambo', status: 'pending', priority: 'medium', scheduled_date: '2026-03-03' },
  { id: 3, room: rooms[4], task_type: 'Deep Cleaning', description: 'Monthly deep cleaning', assigned_to: 'Mary Njeri', status: 'pending', priority: 'low', scheduled_date: '2026-03-04' },
  { id: 4, room: rooms[7], task_type: 'Maintenance', description: 'Fix AC unit and plumbing', assigned_to: 'James Mwangi', status: 'in_progress', priority: 'urgent', scheduled_date: '2026-03-02' },
  { id: 5, room: rooms[5], task_type: 'Turndown Service', description: 'Evening turndown service', assigned_to: 'Peter Odhiambo', status: 'completed', priority: 'medium', scheduled_date: '2026-03-03', completed_at: '2026-03-03T18:30:00' },
  { id: 6, room: rooms[8], task_type: 'VIP Preparation', description: 'Prepare room with flowers and amenities for VIP', assigned_to: 'Lucy Waithera', status: 'completed', priority: 'high', scheduled_date: '2026-03-01', completed_at: '2026-03-01T12:00:00' },
];

export const dashboardStats: DashboardStats = {
  total_rooms: 16,
  occupied_rooms: 4,
  available_rooms: 7,
  reserved_rooms: 2,
  cleaning_rooms: 1,
  maintenance_rooms: 1,
  todays_checkins: 2,
  todays_checkouts: 1,
  occupancy_rate: 25,
  total_revenue: 222604,
  active_bookings: 6,
  pending_housekeeping: 3,
};

export const revenueData = [
  { month: 'Sep', revenue: 450000 },
  { month: 'Oct', revenue: 520000 },
  { month: 'Nov', revenue: 480000 },
  { month: 'Dec', revenue: 680000 },
  { month: 'Jan', revenue: 390000 },
  { month: 'Feb', revenue: 560000 },
  { month: 'Mar', revenue: 222604 },
];

export const occupancyData = [
  { day: 'Mon', rate: 75 },
  { day: 'Tue', rate: 82 },
  { day: 'Wed', rate: 68 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 95 },
  { day: 'Sat', rate: 88 },
  { day: 'Sun', rate: 60 },
];

export const roomTypeDistribution = [
  { name: 'Standard Single', value: 4, fill: 'hsl(217, 91%, 53%)' },
  { name: 'Standard Double', value: 4, fill: 'hsl(142, 72%, 36%)' },
  { name: 'Deluxe Room', value: 4, fill: 'hsl(48, 96%, 47%)' },
  { name: 'Executive Suite', value: 2, fill: 'hsl(0, 72%, 51%)' },
  { name: 'Presidential Suite', value: 2, fill: 'hsl(212, 52%, 24%)' },
];
