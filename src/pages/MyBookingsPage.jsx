import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/utils/cn';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data.data.bookings);
      } catch (error) {
        toast.error('Failed to load your bookings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/[0.05] blur-[120px] rounded-full" />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Sparkles className="h-3 w-3" />
              <span>Personal Portal</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                My <br />
                <span className="text-muted-foreground/30">History.</span>
              </h1>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto pt-2">
                Track your active requests and review your past premium services.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-6"
            >
              <Button onClick={() => window.location.href = '/book'} className="rounded-full px-8 h-12 bg-emerald-500 hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-500/20">
                Request New Service
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {isLoading ? (
              <LoadingState message="Accessing records..." />
            ) : bookings.length > 0 ? (
              <div className="grid gap-6">
                <AnimatePresence>
                  {bookings.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative"
                    >
                      <div className={cn(
                        "relative p-8 rounded-[32px] border transition-all duration-500 bg-card/50 backdrop-blur-sm",
                        "hover:bg-card hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5",
                        booking.status === 'Completed' ? "border-border/50" : "border-emerald-500/20"
                      )}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border-border/50">#{booking.id}</Badge>
                              <Badge 
                                variant={booking.status.toLowerCase()}
                                className={cn(
                                  "text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full",
                                  booking.status === 'Pending' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                  booking.status === 'Assigned' && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                                  booking.status === 'Completed' && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                )}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="text-3xl font-black uppercase tracking-tighter">{booking.service_name}</h3>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                                  {format(new Date(booking.booking_date.split('T')[0]), 'PPP')}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                                  {booking.time_slot}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/30 w-fit px-4 py-2 rounded-xl border border-border/50">
                              <MapPin className="mr-2 h-3.5 w-3.5 opacity-50" />
                              {booking.unit_number}, {booking.address}
                            </div>
                          </div>

                          <div className="flex gap-3 shrink-0">
                            <Button 
                              variant="outline" 
                              className="rounded-2xl h-14 px-6 border-border/50 hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-500/30 transition-all font-bold uppercase text-[10px] tracking-widest"
                              onClick={() => {
                                const message = `I need help with my booking #${booking.id} (${booking.service_name})`;
                                window.open(`https://wa.me/919999900000?text=${encodeURIComponent(message)}`);
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Concierge
                            </Button>
                          </div>
                        </div>

                        {booking.status === 'Completed' && (
                          <div className="absolute -bottom-px left-8 right-8 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState 
                title="Silence in the halls"
                description="You haven't requested any services yet. Experience the Skippr standard today."
                action={
                  <Button onClick={() => window.location.href = '/book'} className="rounded-full px-12 h-14 bg-emerald-500 hover:bg-emerald-600 font-black uppercase text-xs tracking-widest text-white shadow-xl shadow-emerald-500/20">
                    Create First Booking
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyBookingsPage;
