import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/bookings')
        ]);
        setStats(statsRes.data.data.stats);
        setRecentBookings(bookingsRes.data.data.bookings.slice(0, 5));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <AdminLayout><LoadingState message="Calculating metrics..." /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Bookings" 
            value={stats?.total_bookings || 0} 
            icon={Calendar} 
            trend="+12%"
          />
          <StatCard 
            title="Pending" 
            value={stats?.pending || 0} 
            icon={Clock} 
            color="text-yellow-500"
          />
          <StatCard 
            title="Assigned" 
            value={stats?.assigned || 0} 
            icon={Truck} 
            color="text-blue-500"
          />
          <StatCard 
            title="Completed" 
            value={stats?.completed || 0} 
            icon={CheckCircle2} 
            color="text-emerald-500"
            trend="+5%"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Chart Placeholder / Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {booking.customer_name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{booking.service_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{format(new Date(booking.booking_date), 'MMM dd')}</p>
                      <Badge variant={booking.status.toLowerCase()}>{booking.status}</Badge>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs" onClick={() => navigate('/admin/bookings')}>
                  View all bookings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, i) => (
                    <div key={i} className="flex space-x-4 text-sm">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="font-medium">
                          {booking.customer_name} 
                          <span className="font-normal text-muted-foreground"> booked </span> 
                          {booking.service_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.created_at || booking.booking_date), 'MMM dd, hh:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <Card className="border-border/40 card-hover overflow-hidden relative">
    <div className="absolute top-0 right-0 p-3 opacity-[0.03] scale-[2] pointer-events-none">
      <Icon className={cn("h-12 w-12", color)} />
    </div>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-primary/[0.03] dark:bg-white/[0.03] border border-primary/5", color)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-5 space-y-1">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-black tracking-tighter leading-none">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default DashboardPage;
