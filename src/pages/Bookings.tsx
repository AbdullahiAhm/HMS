import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { bookings, rooms, customers } from '@/data/mockData';
import { Plus, Search, CalendarCheck, LogIn, LogOut, Eye } from 'lucide-react';
import type { BookingStatus } from '@/types/hotel';

const statusStyles: Record<BookingStatus, string> = {
  confirmed: 'bg-info text-info-foreground',
  checked_in: 'bg-success text-success-foreground',
  checked_out: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((b) => {
    const guestName = `${b.customer.first_name} ${b.customer.last_name}`.toLowerCase();
    const matchesSearch = guestName.includes(searchTerm.toLowerCase()) || b.id.toString().includes(searchTerm) || b.room.room_number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">Manage reservations, check-ins, and check-outs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Booking</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Guest</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select guest" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.first_name} {c.last_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>{rooms.filter(r => r.status === 'available').map(r => <SelectItem key={r.id} value={r.id.toString()}>Room {r.room_number} - {r.room_type.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Check-in Date</Label><Input type="date" /></div>
                <div><Label>Check-out Date</Label><Input type="date" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Adults</Label><Input type="number" defaultValue={1} min={1} /></div>
                <div><Label>Children</Label><Input type="number" defaultValue={0} min={0} /></div>
              </div>
              <div><Label>Special Requests</Label><Input placeholder="Any special requests..." /></div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Create Booking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-foreground' },
          { label: 'Checked In', value: bookings.filter(b => b.status === 'checked_in').length, color: 'text-success' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-info' },
          { label: 'Checked Out', value: bookings.filter(b => b.status === 'checked_out').length, color: 'text-muted-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by guest, booking ID, room..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Guest</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Room</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Check-in</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Check-out</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Guests</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, i) => (
                  <tr key={booking.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="p-4 font-medium">#{booking.id}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium">{booking.customer.first_name} {booking.customer.last_name}</span>
                        {booking.customer.is_vip && <Badge className="ml-2 bg-warning text-warning-foreground border-0 text-[10px]">VIP</Badge>}
                      </div>
                    </td>
                    <td className="p-4">{booking.room.room_number}</td>
                    <td className="p-4">{booking.check_in_date}</td>
                    <td className="p-4">{booking.check_out_date}</td>
                    <td className="p-4">{booking.adults}A {booking.children > 0 ? `+ ${booking.children}C` : ''}</td>
                    <td className="p-4">
                      <Badge className={`${statusStyles[booking.status]} border-0 capitalize`}>{booking.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="p-4 font-medium">KES {booking.total_amount.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View"><Eye className="h-4 w-4" /></Button>
                        {booking.status === 'confirmed' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success" title="Check In"><LogIn className="h-4 w-4" /></Button>
                        )}
                        {booking.status === 'checked_in' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-info" title="Check Out"><LogOut className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
