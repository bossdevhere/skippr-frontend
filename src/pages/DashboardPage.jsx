import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Truck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { cn } from '@/utils/cn';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/bookings')
        ]);
        setStats(statsRes.data.data.stats);
        setRecentBookings(bookingsRes.data.data.bookings.slice(0, 4));
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
      <div className="space-y-12 max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Activity className="h-3 w-3" />
              <span>Real-time Overview</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Command <br />
              <span className="text-muted-foreground/30">Center.</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active System</p>
              <p className="text-sm font-black text-emerald-500">v1.0.4 Online</p>
            </div>
            <Button 
              className="rounded-2xl h-14 px-8 bg-emerald-500 hover:bg-emerald-600 font-bold shadow-xl shadow-emerald-500/20"
              onClick={() => navigate('/admin/bookings')}
            >
              Manage All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Inflow" 
            value={stats?.total_bookings || 0} 
            icon={TrendingUp} 
            trend="+12%"
            span="md:col-span-2"
            color="bg-emerald-500"
          />
          <StatCard 
            title="Queue" 
            value={stats?.pending || 0} 
            icon={Clock} 
            color="bg-amber-500"
          />
          <StatCard 
            title="Live" 
            value={stats?.assigned || 0} 
            icon={Truck} 
            color="bg-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h3>
              <button onClick={() => navigate('/admin/bookings')} className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:underline">Full Report</button>
            </div>
            <div className="grid gap-4">
              <AnimatePresence>
                {recentBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-[32px] border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between group hover:bg-card hover:border-emerald-500/30 transition-all duration-500"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        {booking.customer_name[0]}
                      </div>
                      <div>
                        <p className="text-lg font-black uppercase tracking-tighter">{booking.customer_name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{booking.service_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold tracking-tight mb-2">{format(new Date(booking.booking_date), 'MMM dd')}</p>
                      <Badge 
                        variant={booking.status.toLowerCase()}
                        className={cn(
                          "text-[8px] uppercase font-black tracking-widest px-3 py-1 rounded-full",
                          booking.status === 'Pending' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                          booking.status === 'Assigned' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                          booking.status === 'Completed' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Efficiency</h3>
            </div>
            <div className="p-8 rounded-[40px] border border-emerald-500/20 bg-[#050505] text-white space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
               
               <div className="relative z-10">
                 <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Completion Rate</p>
                 <p className="text-6xl font-black tracking-tighter italic">98.4%</p>
                 <div className="h-1 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                   <div className="h-full w-[98%] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                 </div>
               </div>

               <div className="relative z-10 pt-4 grid grid-cols-2 gap-8 border-t border-white/5">
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Avg Time</p>
                   <p className="text-2xl font-black">2.4h</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Response</p>
                   <p className="text-2xl font-black">12m</p>
                 </div>
               </div>

               <div className="relative z-10 pt-8">
                 <div className="flex items-center space-x-3 text-emerald-400">
                   <Sparkles className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Optimized System</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color, span }) => (
  <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm card-hover overflow-hidden relative group", span)}>
    <div className="absolute -top-4 -right-4 p-3 opacity-[0.05] scale-[3] pointer-events-none transition-transform group-hover:scale-[3.5] duration-500">
      <Icon className={cn("h-12 w-12", color.replace('bg-', 'text-'))} />
    </div>
    <CardContent className="p-8">
      <div className="flex items-center justify-between">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className="flex items-center text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-8 space-y-1">
        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{title}</p>
        <p className="text-5xl font-black tracking-tighter leading-none">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default DashboardPage;
