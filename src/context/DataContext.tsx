import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Room, RoomType, Customer, Booking, Bill, BillItem, Payment, HousekeepingTask, RoomStatus, BookingStatus, HousekeepingStatus, PaymentMethod } from '@/types/hotel';
import { rooms as initialRooms, roomTypes, customers as initialCustomers, bookings as initialBookings, bills as initialBills, payments as initialPayments, housekeepingTasks as initialTasks } from '@/data/mockData';

interface DataContextType {
  // Rooms
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: number, updates: Partial<Room>) => void;
  deleteRoom: (id: number) => void;
  roomTypes: RoomType[];

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'total_stays' | 'created_at'>) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => void;
  updateBookingStatus: (id: number, status: BookingStatus) => void;
  deleteBooking: (id: number) => void;

  // Bills & Payments
  bills: Bill[];
  payments: Payment[];
  addBill: (bill: Omit<Bill, 'id' | 'created_at'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => void;

  // Housekeeping
  housekeepingTasks: HousekeepingTask[];
  addTask: (task: Omit<HousekeepingTask, 'id'>) => void;
  updateTaskStatus: (id: number, status: HousekeepingStatus) => void;
  deleteTask: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

let nextId = 10000;
const genId = () => ++nextId;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [housekeepingTasks, setTasks] = useState<HousekeepingTask[]>(initialTasks);

  // Room CRUD
  const addRoom = useCallback((room: Omit<Room, 'id'>) => {
    setRooms(prev => [...prev, { ...room, id: genId() }]);
  }, []);
  const updateRoom = useCallback((id: number, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);
  const deleteRoom = useCallback((id: number) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  }, []);

  // Customer CRUD
  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'total_stays' | 'created_at'>) => {
    setCustomers(prev => [...prev, { ...customer, id: genId(), total_stays: 0, created_at: new Date().toISOString().split('T')[0] }]);
  }, []);
  const updateCustomer = useCallback((id: number, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);
  const deleteCustomer = useCallback((id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  // Booking CRUD
  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'created_at'>) => {
    const newBooking = { ...booking, id: genId(), created_at: new Date().toISOString().split('T')[0] };
    setBookings(prev => [...prev, newBooking]);
    // Set room to reserved
    setRooms(prev => prev.map(r => r.id === booking.room.id ? { ...r, status: 'reserved' as RoomStatus } : r));
  }, []);
  const updateBookingStatus = useCallback((id: number, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const updated = { ...b, status };
      // Update room status based on booking status
      if (status === 'checked_in') {
        setRooms(r => r.map(room => room.id === b.room.id ? { ...room, status: 'occupied' as RoomStatus } : room));
      } else if (status === 'checked_out') {
        setRooms(r => r.map(room => room.id === b.room.id ? { ...room, status: 'cleaning' as RoomStatus } : room));
      } else if (status === 'cancelled') {
        setRooms(r => r.map(room => room.id === b.room.id ? { ...room, status: 'available' as RoomStatus } : room));
      }
      return updated;
    }));
  }, []);
  const deleteBooking = useCallback((id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  // Bill
  const addBill = useCallback((bill: Omit<Bill, 'id' | 'created_at'>) => {
    setBills(prev => [...prev, { ...bill, id: genId(), created_at: new Date().toISOString().split('T')[0] }]);
  }, []);

  // Payment
  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'created_at'>) => {
    const newPayment = { ...payment, id: genId(), created_at: new Date().toISOString().split('T')[0] };
    setPayments(prev => [...prev, newPayment]);
    // Update bill status
    setBills(prev => prev.map(b => {
      if (b.id !== payment.bill_id) return b;
      const totalPaid = [...payments, newPayment].filter(p => p.bill_id === b.id).reduce((s, p) => s + p.amount, 0);
      return { ...b, status: totalPaid >= b.total ? 'paid' : 'partial' };
    }));
  }, [payments]);

  // Housekeeping CRUD
  const addTask = useCallback((task: Omit<HousekeepingTask, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: genId() }]);
  }, []);
  const updateTaskStatus = useCallback((id: number, status: HousekeepingStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}) } : t));
  }, []);
  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{
      rooms, addRoom, updateRoom, deleteRoom, roomTypes,
      customers, addCustomer, updateCustomer, deleteCustomer,
      bookings, addBooking, updateBookingStatus, deleteBooking,
      bills, payments, addBill, addPayment,
      housekeepingTasks, addTask, updateTaskStatus, deleteTask,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
