import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, 
  Phone, 
  Home, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/utils/cn';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  unit_number: z.string().min(1, 'Unit number is required'),
  address: z.string().min(5, 'Full address is required'),
  service_id: z.number({ required_error: 'Please select a service' }),
  service_name: z.string(),
  booking_date: z.string().min(1, 'Please select a date'),
  time_slot: z.string().min(1, 'Please select a time slot'),
});

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: user.name || '',
      mobile: user.mobile || '',
      booking_date: new Date().toISOString().split('T')[0],
    }
  });

  const selectedServiceId = watch('service_id');
  const selectedDate = watch('booking_date');
  const selectedTimeSlot = watch('time_slot');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data.data.services);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/bookings', data);
      toast.success('Booking successful!');
      navigate('/success', { state: { booking: response.data.data.booking } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const steps = [
    { id: 1, title: 'Details', description: 'Your info' },
    { id: 2, title: 'Service', description: 'What you need' },
    { id: 3, title: 'Schedule', description: 'When to come' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 bg-muted/30 border-b">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Create a New Booking</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us what you need and when. Our verified professionals will take care of the rest.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <nav className="flex flex-col space-y-6">
              {steps.map((s) => (
                <div 
                  key={s.id} 
                  className={cn(
                    "flex items-center space-x-4 transition-all",
                    step === s.id ? "opacity-100" : "opacity-30"
                  )}
                >
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    step === s.id ? "bg-primary" : "bg-muted-foreground"
                  )} />
                  <div className="hidden lg:block">
                    <p className="text-sm font-bold leading-none">{s.title}</p>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Customer Details</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10 h-12" placeholder="John Doe" {...register('customer_name')} />
                          </div>
                          {errors.customer_name && <p className="text-xs text-destructive">{errors.customer_name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Mobile Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10 h-12" placeholder="+91 98765 43210" {...register('mobile')} />
                          </div>
                          {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Service Location</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Unit Number</Label>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10 h-12" placeholder="A-101" {...register('unit_number')} />
                          </div>
                          {errors.unit_number && <p className="text-xs text-destructive">{errors.unit_number.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Building / Area</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10 h-12" placeholder="Green Valley" {...register('address')} />
                          </div>
                          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                        </div>
                      </div>
                    </div>

                    <Button type="button" className="w-full h-14 text-md" onClick={nextStep}>
                      Next: Choose Service
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold">Select a Service</h3>
                    <div className="grid gap-4">
                      {isLoadingServices ? (
                        [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                      ) : (
                        services.map((service) => (
                          <div 
                            key={service.id}
                            onClick={() => {
                              setValue('service_id', service.id);
                              setValue('service_name', service.name);
                            }}
                            className={cn(
                              "group relative p-8 rounded-[24px] border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                              selectedServiceId === service.id 
                                ? "border-primary bg-primary/[0.02] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-primary/20" 
                                : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <div className="space-y-2">
                                <h4 className="text-2xl font-black tracking-tighter">{service.name}</h4>
                                <p className="text-sm text-muted-foreground max-w-md font-medium leading-relaxed">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-black tracking-tighter">₹{service.price}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Fixed Rate</p>
                              </div>
                            </div>
                            {selectedServiceId === service.id && (
                              <motion.div 
                                layoutId="service-check"
                                className="absolute top-4 right-4"
                              >
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                              </motion.div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="h-14 px-8" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button type="button" className="flex-1 h-14 text-md" onClick={nextStep} disabled={!selectedServiceId}>
                        Continue to Schedule
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold">Pick Your Time</h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label>Booking Date</Label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <input 
                              type="date" 
                              className="w-full h-12 pl-10 pr-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              {...register('booking_date')} 
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Available Slots</Label>
                          <div className="grid gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setValue('time_slot', slot)}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all",
                                  selectedTimeSlot === slot
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50"
                                )}
                              >
                                <div className="flex items-center">
                                  <Clock className="mr-3 h-4 w-4 opacity-70" />
                                  {slot}
                                </div>
                                {selectedTimeSlot === slot && <CheckCircle2 className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 border flex items-start space-x-3">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        You can cancel or reschedule up to 4 hours before the service time. 
                        A confirmation will be sent to your mobile number.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="h-14 px-8" onClick={prevStep}>
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 h-14 text-md" disabled={isSubmitting || !selectedTimeSlot}>
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Finalizing Booking...
                          </div>
                        ) : (
                          "Confirm & Pay at Door"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
