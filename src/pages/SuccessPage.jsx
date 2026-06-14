import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, Smartphone, MessageSquare, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const handleWhatsApp = () => {
    const message = `*Skippr Booking Confirmation*\n\nHi ${booking.customer_name},\nYour booking for *${booking.service_name}* is confirmed for *${format(new Date(booking.booking_date), 'PPP')}* at *${booking.time_slot}*.\n\n*Address:* ${booking.unit_number}, ${booking.address}\n*Status:* Pending\n\nThank you for choosing Skippr!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${booking.mobile.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle className="h-10 w-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold tracking-tight">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              We've received your request. A service professional will be assigned shortly.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-emerald-500/20 bg-emerald-50/10 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</p>
                <p className="font-semibold text-lg">{booking.service_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</p>
                <p className="font-semibold">{booking.customer_name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{format(new Date(booking.booking_date), 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Slot</p>
                  <p className="text-sm font-medium">{booking.time_slot}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:col-span-2">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{booking.unit_number}, {booking.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button onClick={handleWhatsApp} variant="emerald" className="flex-1 h-12 shadow-lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            Send WhatsApp Preview
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1 h-12">
            Back to Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center">
            <Smartphone className="mr-2 h-4 w-4" />
            Need help? Contact support at +91 99999 00000
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
