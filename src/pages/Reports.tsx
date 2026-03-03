import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { revenueData, occupancyData, roomTypeDistribution, rooms, bookings, bills } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, BedDouble, Users, DollarSign } from 'lucide-react';

const Reports = () => {
  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);
  const avgRate = rooms.reduce((s, r) => s + r.room_type.base_rate, 0) / rooms.length;
  const totalGuests = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.adults + b.children, 0);

  const bookingsByStatus = [
    { name: 'Checked In', value: bookings.filter(b => b.status === 'checked_in').length, fill: 'hsl(142, 72%, 36%)' },
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, fill: 'hsl(217, 91%, 60%)' },
    { name: 'Checked Out', value: bookings.filter(b => b.status === 'checked_out').length, fill: 'hsl(220, 5%, 46%)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive hotel performance insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
          { label: 'Avg Room Rate', value: `KES ${Math.round(avgRate).toLocaleString()}`, icon: TrendingUp, color: 'text-secondary' },
          { label: 'Total Guests', value: totalGuests.toString(), icon: Users, color: 'text-info' },
          { label: 'Total Rooms', value: rooms.length.toString(), icon: BedDouble, color: 'text-warning' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Trend */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Occupancy Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Occupancy']} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(142, 72%, 36%)" strokeWidth={2} dot={{ fill: 'hsl(142, 72%, 36%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Distribution */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Room Type Distribution</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={roomTypeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {roomTypeDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Booking Status Overview</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {bookingsByStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
