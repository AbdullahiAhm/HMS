import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/DataContext';
import { Plus, Search, LogIn, LogOut, Eye, X, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { BookingStatus } from '@/types/hotel';

const statusStyles: Record<BookingStatus, string> = {
  confirmed: 'bg-info text-info-foreground',
  checked_in: 'bg-success text-success-foreground',
  checked_out: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const Bookings = () => {
  const { bookings, rooms, customers, addBooking, addCustomer, updateBookingStatus, deleteBooking } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [creatingGuest, setCreatingGuest] = useState(false);

  const [formCustomerId, setFormCustomerId] = useState('');
  const [formRoomId, setFormRoomId] = useState('');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [formAdults, setFormAdults] = useState('1');
  const [formChildren, setFormChildren] = useState('0');
  const [formRequests, setFormRequests] = useState('');

  // New guest inline form
  const [newGuest, setNewGuest] = useState({ first_name: '', last_name: '', email: '', phone: '', id_type: '', id_number: '', nationality: '', address: '', is_vip: false });

  const resetForm = () => {
    setFormCustomerId(''); setFormRoomId(''); setFormCheckIn(''); setFormCheckOut(''); setFormAdults('1'); setFormChildren('0'); setFormRequests('');
    setCreatingGuest(false);
    setNewGuest({ first_name: '', last_name: '', email: '', phone: '', id_type: '', id_number: '', nationality: '', address: '', is_vip: false });
  };

  const handleCreateGuestAndSelect = () => {
    if (!newGuest.first_name || !newGuest.last_name || !newGuest.email) {
      toast.error('Guest first name, last name, and email are required');
      return;
    }
    addCustomer(newGuest);
    // The newly added customer will be the last one in the list after re-render
    // We need to find it by matching details since addCustomer generates the id
    toast.success(`Guest ${newGuest.first_name} ${newGuest.last_name} added`);
    setCreatingGuest(false);
    // Select the newly created customer - it'll be the latest one
    setTimeout(() => {
      const latest = customers[customers.length - 1];
      // The new customer isn't in the array yet due to state batching, so we use a workaround:
      // We set a flag and the customer ID will be auto-selected after next render
    }, 0);
    // Use a special marker to auto-select newest customer
    setFormCustomerId('__newest__');
  };

  const handleAdd = () => {
    let customerId = formCustomerId;
    // If newest marker, pick the last customer
    if (customerId === '__newest__') {
      customerId = customers[customers.length - 1]?.id.toString() || '';
    }
    if (!customerId || !formRoomId || !formCheckIn || !formCheckOut) { toast.error('Please fill all required fields'); return; }
    const customer = customers.find(c => c.id.toString() === customerId)!;
    const room = rooms.find(r => r.id.toString() === formRoomId)!;
    if (!customer || !room) { toast.error('Invalid guest or room selection'); return; }
    const nights = Math.max(1, Math.ceil((new Date(formCheckOut).getTime() - new Date(formCheckIn).getTime()) / (1000 * 60 * 60 * 24)));
    addBooking({
      customer, room,
      check_in_date: formCheckIn, check_out_date: formCheckOut,
      status: 'confirmed',
      adults: parseInt(formAdults), children: parseInt(formChildren),
      special_requests: formRequests || undefined,
      total_amount: room.room_type.base_rate * nights,
    });
    toast.success('Booking created successfully');
    resetForm(); setAddOpen(false);
  };

  const handleCheckIn = (id: number) => { updateBookingStatus(id, 'checked_in'); toast.success('Guest checked in'); };
  const handleCheckOut = (id: number) => { updateBookingStatus(id, 'checked_out'); toast.success('Guest checked out'); };
  const handleCancel = (id: number) => { updateBookingStatus(id, 'cancelled'); toast.success('Booking cancelled'); };
  const handleDelete = (id: number) => { deleteBooking(id); toast.success('Booking deleted'); };

  const filteredBookings = bookings.filter((b) => {
    const guestName = `${b.customer.first_name} ${b.customer.last_name}`.toLowerCase();
    const matchesSearch = guestName.includes(searchTerm.toLowerCase()) || b.id.toString().includes(searchTerm) || b.room.room_number.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableRooms = rooms.filter(r => r.status === 'available');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">Manage reservations, check-ins, and check-outs</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Booking</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Guest Selection or Creation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Guest</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-secondary"
                    onClick={() => setCreatingGuest(!creatingGuest)}
                  >
                    {creatingGuest ? (
                      <><X className="h-3 w-3 mr-1" /> Cancel</>
                    ) : (
                      <><UserPlus className="h-3 w-3 mr-1" /> New Guest</>
                    )}
                  </Button>
                </div>
                {creatingGuest ? (
                  <div className="space-y-3 rounded-md border border-border p-3 bg-muted/30">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">First Name *</Label>
                        <Input value={newGuest.first_name} onChange={e => setNewGuest(g => ({ ...g, first_name: e.target.value }))} placeholder="First name" />
                      </div>
                      <div>
                        <Label className="text-xs">Last Name *</Label>
                        <Input value={newGuest.last_name} onChange={e => setNewGuest(g => ({ ...g, last_name: e.target.value }))} placeholder="Last name" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Email *</Label>
                      <Input type="email" value={newGuest.email} onChange={e => setNewGuest(g => ({ ...g, email: e.target.value }))} placeholder="email@example.com" />
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input value={newGuest.phone} onChange={e => setNewGuest(g => ({ ...g, phone: e.target.value }))} placeholder="+254..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">ID Type</Label>
                        <Input value={newGuest.id_type} onChange={e => setNewGuest(g => ({ ...g, id_type: e.target.value }))} placeholder="Passport" />
                      </div>
                      <div>
                        <Label className="text-xs">ID Number</Label>
                        <Input value={newGuest.id_number} onChange={e => setNewGuest(g => ({ ...g, id_number: e.target.value }))} placeholder="ID number" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Nationality</Label>
                      <Input value={newGuest.nationality} onChange={e => setNewGuest(g => ({ ...g, nationality: e.target.value }))} placeholder="Kenyan" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      onClick={handleCreateGuestAndSelect}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add Guest & Select
                    </Button>
                  </div>
                ) : (
                  <Select value={formCustomerId} onValueChange={setFormCustomerId}>
                    <SelectTrigger><SelectValue placeholder="Select guest" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.first_name} {c.last_name}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label>Room</Label>
                <Select value={formRoomId} onValueChange={setFormRoomId}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>{availableRooms.map(r => <SelectItem key={r.id} value={r.id.toString()}>Room {r.room_number} - {r.room_type.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Check-in Date</Label><Input type="date" value={formCheckIn} onChange={e => setFormCheckIn(e.target.value)} /></div>
                <div><Label>Check-out Date</Label><Input type="date" value={formCheckOut} onChange={e => setFormCheckOut(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Adults</Label><Input type="number" value={formAdults} onChange={e => setFormAdults(e.target.value)} min={1} /></div>
                <div><Label>Children</Label><Input type="number" value={formChildren} onChange={e => setFormChildren(e.target.value)} min={0} /></div>
              </div>
              <div><Label>Special Requests</Label><Input placeholder="Any special requests..." value={formRequests} onChange={e => setFormRequests(e.target.value)} /></div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleAdd}>Create Booking</Button>
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
          <Card key={s.label}><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">{s.label}</p><p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p></CardContent></Card>
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
                        {booking.status === 'confirmed' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success" title="Check In" onClick={() => handleCheckIn(booking.id)}><LogIn className="h-4 w-4" /></Button>
                        )}
                        {booking.status === 'checked_in' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-info" title="Check Out" onClick={() => handleCheckOut(booking.id)}><LogOut className="h-4 w-4" /></Button>
                        )}
                        {(booking.status === 'confirmed') && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" title="Cancel" onClick={() => handleCancel(booking.id)}><X className="h-4 w-4" /></Button>
                        )}
                        {(booking.status === 'checked_out' || booking.status === 'cancelled') && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Delete" onClick={() => handleDelete(booking.id)}><Trash2 className="h-4 w-4" /></Button>
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
