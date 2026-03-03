export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'out_of_service';
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'mobile_money' | 'bank_transfer';
export type HousekeepingStatus = 'pending' | 'in_progress' | 'completed';
export type HousekeepingPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RoomType {
  id: number;
  name: string;
  description: string;
  base_rate: number;
  max_occupancy: number;
  amenities: string[];
}

export interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  room_type: RoomType;
  floor: number;
  status: RoomStatus;
  notes?: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_type: string;
  id_number: string;
  nationality: string;
  address: string;
  is_vip: boolean;
  total_stays: number;
  created_at: string;
}

export interface Booking {
  id: number;
  customer: Customer;
  room: Room;
  check_in_date: string;
  check_out_date: string;
  status: BookingStatus;
  adults: number;
  children: number;
  special_requests?: string;
  total_amount: number;
  created_at: string;
}

export interface BillItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category: string;
}

export interface Bill {
  id: number;
  booking: Booking;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'open' | 'paid' | 'partial';
  created_at: string;
}

export interface Payment {
  id: number;
  bill_id: number;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  created_at: string;
}

export interface HousekeepingTask {
  id: number;
  room: Room;
  task_type: string;
  description: string;
  assigned_to: string;
  status: HousekeepingStatus;
  priority: HousekeepingPriority;
  scheduled_date: string;
  completed_at?: string;
}

export interface DashboardStats {
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  reserved_rooms: number;
  cleaning_rooms: number;
  maintenance_rooms: number;
  todays_checkins: number;
  todays_checkouts: number;
  occupancy_rate: number;
  total_revenue: number;
  active_bookings: number;
  pending_housekeeping: number;
}

export interface StaffProfile {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}
