import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Trash2, 
  CheckCircle2,
  Clock,
  Truck,
  MoreHorizontal,
  Calendar,
  User,
  Filter,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { cn } from '@/utils/cn';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data.bookings);
      setFilteredBookings(response.data.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    if (search) {
      result = result.filter(b => 
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.service_name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toString().includes(search)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(b => b.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [search, statusFilter, bookings]);

  const handleUpdateStatus = async (status) => {
    try {
      await api.patch(`/bookings/${selectedBooking.id}`, { status });
      toast.success(`Booking ${status} successfully`);
      setIsUpdateModalOpen(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Truck className="h-3 w-3" />
              <span>Operations Management</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Booking <br />
              <span className="text-muted-foreground/30">Registry.</span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                  placeholder="Search Registry..." 
                  className="pl-12 h-14 w-full sm:w-[300px] rounded-2xl bg-card border-border/50 focus:bg-background transition-all font-bold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
               {['All', 'Pending', 'Assigned', 'Completed'].map((status) => (
                 <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-4 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      statusFilter === status 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" 
                        : "bg-card border-border/50 text-muted-foreground hover:border-emerald-500/30"
                    )}
                 >
                   {status}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* List Registry */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState message="Decoding registry..." />
          ) : filteredBookings.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="p-8 rounded-[32px] border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-8 group-hover:bg-card group-hover:border-emerald-500/30 transition-all duration-500">
                      <div className="flex items-center space-x-6">
                        <div className="h-16 w-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-2xl border border-emerald-500/20">
                          {booking.customer_name[0]}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">#{booking.id}</span>
                            <Badge 
                              variant={booking.status.toLowerCase()}
                              className={cn(
                                "text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full",
                                booking.status === 'Pending' && "bg-amber-500/10 text-amber-600",
                                booking.status === 'Assigned' && "bg-blue-500/10 text-blue-600",
                                booking.status === 'Completed' && "bg-emerald-500/10 text-emerald-600"
                              )}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-black tracking-tighter uppercase">{booking.customer_name}</h3>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{booking.service_name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-8 md:gap-12">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Schedule</p>
                          <div className="flex items-center text-sm font-bold tracking-tight">
                            <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                            {format(new Date(booking.booking_date.split('T')[0]), 'MMM dd')}
                          </div>
                          <div className="flex items-center text-[10px] font-medium text-muted-foreground mt-0.5">
                            <Clock className="mr-2 h-3 w-3 opacity-50" />
                            {booking.time_slot}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contact</p>
                          <p className="text-sm font-bold tracking-tight">{booking.mobile}</p>
                          <p className="text-[10px] font-medium text-muted-foreground opacity-60">Unit {booking.unit_number}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                           <Button 
                              variant="outline" 
                              className="rounded-2xl h-14 px-6 border-border/50 hover:bg-emerald-500/5 hover:text-emerald-600 transition-all font-bold uppercase text-[10px] tracking-widest"
                              onClick={() => { setSelectedBooking(booking); setIsUpdateModalOpen(true); }}
                            >
                              Update Status
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-14 w-14 rounded-2xl text-rose-500 hover:bg-rose-500/10"
                              onClick={() => handleDeleteBooking(booking.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState 
              title="Registry Clear"
              description="No bookings found matching your current filters."
            />
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)}
        title="Override Status"
      >
        <div className="space-y-8 py-4">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Modify Status For</p>
            <p className="text-3xl font-black tracking-tighter uppercase">{selectedBooking?.customer_name}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { status: 'Pending', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { status: 'Assigned', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => handleUpdateStatus(item.status)}
                className={cn(
                  "flex items-center justify-between p-6 rounded-[24px] border-2 transition-all duration-300",
                  selectedBooking?.status === item.status 
                    ? `border-emerald-500 ${item.bg}` 
                    : "border-border/50 hover:border-emerald-500/30"
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn("mr-4 h-6 w-6", item.color)} />
                  <span className="text-lg font-black uppercase tracking-tighter">{item.status}</span>
                </div>
                {selectedBooking?.status === item.status && (
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default BookingsPage;
