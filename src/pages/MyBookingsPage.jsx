import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Navbar } from '@/components/layout/Navbar';

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
    <div className="min-h-screen bg-background pb-12">
      <Navbar />
      <div className="pt-32 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
              <p className="text-muted-foreground">Manage and track your service history.</p>
            </div>
            <Button onClick={() => window.location.href = '/book'} size="sm">
              New Booking
            </Button>
          </div>

          {isLoading ? (
            <LoadingState message="Fetching your bookings..." />
          ) : bookings.length > 0 ? (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:border-primary/20 transition-colors overflow-hidden group">
                    <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="px-2 py-0">#{booking.id}</Badge>
                          <Badge variant={booking.status.toLowerCase()}>{booking.status}</Badge>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold">{booking.service_name}</h3>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 opacity-70" />
                              {format(new Date(booking.booking_date.split('T')[0]), 'PPP')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 opacity-70" />
                              {booking.time_slot}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4 opacity-70" />
                          {booking.unit_number}, {booking.address}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 shrink-0">
                        <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={() => {
                          const message = `Check update for booking #${booking.id}`;
                          window.open(`https://wa.me/919999900000?text=${encodeURIComponent(message)}`);
                        }}>
                          Support
                        </Button>
                      </div>
                    </div>
                    {booking.status === 'Completed' && (
                      <div className="bg-emerald-500/5 px-6 py-2 border-t border-emerald-500/10 flex items-center text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="mr-2 h-3 w-3" />
                        Service completed successfully
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No bookings yet"
              description="You haven't booked any services yet. Start by exploring our premium home services."
              action={
                <Button onClick={() => window.location.href = '/book'}>
                  Book a Service
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
