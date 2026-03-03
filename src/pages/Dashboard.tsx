import { BedDouble, CalendarCheck, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Brush } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardStats, rooms, bookings, revenueData, occupancyData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { RoomStatus } from '@/types/hotel';

const statusColors: Record<RoomStatus, string> = {
  available: 'bg-success',
  occupied: 'bg-destructive',
  reserved: 'bg-info',
  cleaning: 'bg-warning',
  maintenance: 'bg-muted-foreground',
  out_of_service: 'bg-destructive/60',
};

const statusLabels: Record<RoomStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
  cleaning: 'Cleaning',
  maintenance: 'Maintenance',
  out_of_service: 'Out of Service',
};

const kpiCards = [
  { title: 'Occupancy Rate', value: `${dashboardStats.occupancy_rate}%`, icon: TrendingUp, change: '+5.2%', positive: true, color: 'text-secondary' },
  { title: 'Total Revenue', value: `KES ${(dashboardStats.total_revenue).toLocaleString()}`, icon: DollarSign, change: '+12.3%', positive: true, color: 'text-success' },
  { title: 'Active Bookings', value: dashboardStats.active_bookings.toString(), icon: CalendarCheck, change: '+2', positive: true, color: 'text-info' },
  { title: 'Available Rooms', value: `${dashboardStats.available_rooms}/${dashboardStats.total_rooms}`, icon: BedDouble, change: '-1', positive: false, color: 'text-warning' },
];

const Dashboard = () => {
  const recentBookings = bookings.filter(b => b.status === 'checked_in' || b.status === 'confirmed').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Zakaria. Here's your hotel overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className="flex items-center mt-1 text-xs">
                    {kpi.positive ? (
                      <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                    )}
                    <span className={kpi.positive ? 'text-success' : 'text-destructive'}>{kpi.change}</span>
                    <span className="text-muted-foreground ml-1">vs last week</span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Status Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Room Status Overview</CardTitle>
            <div className="flex flex-wrap gap-3 mt-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-3 w-3 rounded-sm ${statusColors[key as RoomStatus]}`} />
                  {label}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`${statusColors[room.status]} rounded-md p-2 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                  title={`Room ${room.room_number} - ${room.room_type.name} - ${statusLabels[room.status]}`}
                >
                  <span className="text-xs font-bold text-card">{room.room_number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Check-ins</span>
              </div>
              <span className="text-xl font-bold">{dashboardStats.todays_checkins}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-info" />
                <span className="text-sm font-medium">Check-outs</span>
              </div>
              <span className="text-xl font-bold">{dashboardStats.todays_checkouts}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Brush className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">Housekeeping</span>
              </div>
              <span className="text-xl font-bold">{dashboardStats.pending_housekeeping}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Total Guests</span>
              </div>
              <span className="text-xl font-bold">{dashboardStats.occupied_rooms * 2}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Revenue (KES)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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

        {/* Occupancy Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Occupancy Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-muted-foreground">Booking ID</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Guest</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Room</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Check-in</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Check-out</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                  <th className="pb-3 font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">#{booking.id}</td>
                    <td className="py-3">{booking.customer.first_name} {booking.customer.last_name}</td>
                    <td className="py-3">{booking.room.room_number} - {booking.room.room_type.name}</td>
                    <td className="py-3">{booking.check_in_date}</td>
                    <td className="py-3">{booking.check_out_date}</td>
                    <td className="py-3">
                      <Badge className={
                        booking.status === 'checked_in' ? 'bg-success text-success-foreground border-0' :
                        booking.status === 'confirmed' ? 'bg-info text-info-foreground border-0' :
                        'bg-muted text-muted-foreground border-0'
                      }>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium">KES {booking.total_amount.toLocaleString()}</td>
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

export default Dashboard;
