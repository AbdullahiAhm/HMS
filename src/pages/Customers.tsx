import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { customers } from '@/data/mockData';
import { Plus, Search, Star, Edit, Trash2, Mail, Phone } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || c.email.includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage guest profiles and records</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input placeholder="First name" /></div>
                <div><Label>Last Name</Label><Input placeholder="Last name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                <div><Label>Phone</Label><Input placeholder="+254..." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ID Type</Label><Input placeholder="National ID / Passport" /></div>
                <div><Label>ID Number</Label><Input placeholder="ID Number" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nationality</Label><Input placeholder="Nationality" /></div>
                <div><Label>Address</Label><Input placeholder="Address" /></div>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Add Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Customer Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {customer.first_name[0]}{customer.last_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.first_name} {customer.last_name}</p>
                    <p className="text-xs text-muted-foreground">{customer.nationality}</p>
                  </div>
                </div>
                {customer.is_vip && (
                  <Badge className="bg-warning text-warning-foreground border-0">
                    <Star className="h-3 w-3 mr-1" /> VIP
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{customer.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{customer.total_stays}</span> total stays
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Customers;
