import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/DataContext';
import { Plus, Search, BedDouble, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Room, RoomStatus } from '@/types/hotel';

const statusColors: Record<RoomStatus, string> = {
  available: 'bg-success text-success-foreground',
  occupied: 'bg-destructive text-destructive-foreground',
  reserved: 'bg-info text-info-foreground',
  cleaning: 'bg-warning text-warning-foreground',
  maintenance: 'bg-muted-foreground text-card',
  out_of_service: 'bg-destructive/60 text-destructive-foreground',
};

const Rooms = () => {
  const { rooms, roomTypes, addRoom, updateRoom, deleteRoom } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // Add form state
  const [formNumber, setFormNumber] = useState('');
  const [formFloor, setFormFloor] = useState('');
  const [formTypeId, setFormTypeId] = useState('');
  const [formStatus, setFormStatus] = useState<RoomStatus>('available');
  const [formNotes, setFormNotes] = useState('');

  const resetForm = () => {
    setFormNumber(''); setFormFloor(''); setFormTypeId(''); setFormStatus('available'); setFormNotes('');
  };

  const openEdit = (room: Room) => {
    setEditRoom(room);
    setFormNumber(room.room_number);
    setFormFloor(room.floor.toString());
    setFormTypeId(room.room_type_id.toString());
    setFormStatus(room.status);
    setFormNotes(room.notes || '');
  };

  const handleAdd = () => {
    if (!formNumber || !formFloor || !formTypeId) { toast.error('Please fill all required fields'); return; }
    const rt = roomTypes.find(t => t.id.toString() === formTypeId)!;
    addRoom({
      room_number: formNumber,
      room_type_id: rt.id,
      room_type: rt,
      floor: parseInt(formFloor),
      status: 'available',
      notes: formNotes || undefined,
    });
    toast.success(`Room ${formNumber} added successfully`);
    resetForm();
    setAddOpen(false);
  };

  const handleUpdate = () => {
    if (!editRoom) return;
    const rt = roomTypes.find(t => t.id.toString() === formTypeId)!;
    updateRoom(editRoom.id, {
      room_number: formNumber,
      room_type_id: rt.id,
      room_type: rt,
      floor: parseInt(formFloor),
      status: formStatus,
      notes: formNotes || undefined,
    });
    toast.success(`Room ${formNumber} updated`);
    setEditRoom(null);
    resetForm();
  };

  const handleDelete = (room: Room) => {
    if (room.status === 'occupied') { toast.error('Cannot delete an occupied room'); return; }
    deleteRoom(room.id);
    toast.success(`Room ${room.room_number} deleted`);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.room_number.includes(searchTerm) || room.room_type.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    return matchesSearch && matchesStatus && matchesFloor;
  });

  const floors = [...new Set(rooms.map(r => r.floor))].sort();

  const renderRoomForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Room Number</Label><Input placeholder="e.g. 501" value={formNumber} onChange={e => setFormNumber(e.target.value)} /></div>
        <div><Label>Floor</Label><Input type="number" placeholder="e.g. 5" value={formFloor} onChange={e => setFormFloor(e.target.value)} /></div>
      </div>
      <div><Label>Room Type</Label>
        <Select value={formTypeId} onValueChange={setFormTypeId}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>{roomTypes.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name} - KES {t.base_rate.toLocaleString()}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {editRoom && (
        <div><Label>Status</Label>
          <Select value={formStatus} onValueChange={(v) => setFormStatus(v as RoomStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="out_of_service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div><Label>Notes</Label><Input placeholder="Any special notes..." value={formNotes} onChange={e => setFormNotes(e.target.value)} /></div>
      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">Manage all hotel rooms and their status</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Room</DialogTitle></DialogHeader>
            {renderRoomForm(handleAdd, "Create Room")}
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editRoom} onOpenChange={(o) => { if (!o) { setEditRoom(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Room {editRoom?.room_number}</DialogTitle></DialogHeader>
          {renderRoomForm(handleUpdate, "Save Changes")}
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search rooms..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Floor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map(f => <SelectItem key={f} value={f.toString()}>Floor {f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room Type Summary */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {roomTypes.map((type) => {
          const count = rooms.filter(r => r.room_type_id === type.id).length;
          const available = rooms.filter(r => r.room_type_id === type.id && r.status === 'available').length;
          return (
            <Card key={type.id}>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">{type.name}</p>
                <p className="text-2xl font-bold mt-1">{available}<span className="text-sm text-muted-foreground font-normal">/{count}</span></p>
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-xs font-medium mt-1 text-secondary">KES {type.base_rate.toLocaleString()}/night</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Room Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-bold">Room {room.room_number}</span>
                </div>
                <Badge className={`${statusColors[room.status]} border-0 capitalize`}>
                  {room.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Type:</span> {room.room_type.name}</p>
                <p><span className="font-medium text-foreground">Floor:</span> {room.floor}</p>
                <p><span className="font-medium text-foreground">Rate:</span> KES {room.room_type.base_rate.toLocaleString()}/night</p>
                <p><span className="font-medium text-foreground">Max:</span> {room.room_type.max_occupancy} guest(s)</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {room.room_type.amenities.slice(0, 3).map(a => (
                  <span key={a} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{a}</span>
                ))}
                {room.room_type.amenities.length > 3 && (
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">+{room.room_type.amenities.length - 3}</span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(room)}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(room)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
