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
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
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
  const selectedTimeSlot = watch('time_slot');
  
  // Watch fields for Step 1 validation
  const customer_name = watch('customer_name');
  const mobile = watch('mobile');
  const unit_number = watch('unit_number');
  const address = watch('address');

  const isStep1Complete = customer_name?.length >= 2 && mobile?.length >= 10 && unit_number?.length >= 1 && address?.length >= 5;

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
    { id: 1, title: 'Identity' },
    { id: 2, title: 'Service' },
    { id: 3, title: 'Schedule' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 overflow-hidden relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Left Sidebar - Title & Progress */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                <Sparkles className="h-3 w-3" />
                <span>Concierge Booking</span>
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Request <br />
                <span className="text-muted-foreground/40">Excellence.</span>
              </h1>
              <p className="text-muted-foreground font-medium max-w-sm">
                Complete the steps to secure your premium home maintenance service.
              </p>
            </div>

            <nav className="flex flex-col space-y-8">
              {steps.map((s) => (
                <div 
                  key={s.id} 
                  className={cn(
                    "flex items-center space-x-4 transition-all duration-500",
                    step === s.id ? "translate-x-2" : "opacity-30"
                  )}
                >
                  <div className={cn(
                    "h-1 w-8 rounded-full transition-all duration-500",
                    step === s.id ? "bg-emerald-500 w-12" : "bg-muted-foreground"
                  )} />
                  <span className="text-xs font-black uppercase tracking-widest">{s.title}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Content - Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Full Name</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                          <Input className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all" placeholder="John Doe" {...register('customer_name')} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Mobile Number</Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                          <Input className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all" placeholder="+91 98765 43210" {...register('mobile')} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Unit Number</Label>
                        <div className="relative group">
                          <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                          <Input className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all" placeholder="A-101" {...register('unit_number')} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Building / Area</Label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                          <Input className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:bg-card transition-all" placeholder="Green Valley Estate" {...register('address')} />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      className="w-full h-16 text-lg font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-20 disabled:grayscale transition-all shadow-xl shadow-emerald-500/20" 
                      onClick={nextStep}
                      disabled={!isStep1Complete}
                    >
                      Choose Service
                      <ChevronRight className="ml-2 h-6 w-6" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid gap-4">
                      {isLoadingServices ? (
                        [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-[32px]" />)
                      ) : (
                        services.map((service) => (
                          <div 
                            key={service.id}
                            onClick={() => {
                              setValue('service_id', service.id);
                              setValue('service_name', service.name);
                            }}
                            className={cn(
                              "group relative p-8 rounded-[32px] border transition-all duration-500 cursor-pointer overflow-hidden",
                              selectedServiceId === service.id 
                                ? "border-emerald-500 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10 scale-[1.02]" 
                                : "border-border/50 bg-card/50 hover:bg-card hover:border-emerald-500/30"
                            )}
                          >
                            <div className="flex justify-between items-center relative z-10">
                              <div className="space-y-2">
                                <h4 className="text-3xl font-black tracking-tighter uppercase">{service.name}</h4>
                                <p className="text-sm text-muted-foreground max-w-md font-medium">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-4xl font-black tracking-tighter">₹{service.price}</p>
                                <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mt-1">Premium Rate</p>
                              </div>
                            </div>
                            {selectedServiceId === service.id && (
                              <motion.div 
                                layoutId="service-check"
                                className="absolute top-6 right-6"
                              >
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                              </motion.div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="h-16 px-8 rounded-2xl border-border" onClick={prevStep}>
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                      <Button type="button" className="flex-1 h-16 text-lg font-black rounded-2xl bg-emerald-500 text-white" onClick={nextStep} disabled={!selectedServiceId}>
                        Schedule Visit
                        <ChevronRight className="ml-2 h-6 w-6" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-10"
                  >
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Preferred Date</Label>
                        <div className="relative group">
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="date" 
                            className="w-full h-16 pl-14 pr-6 rounded-2xl border border-border/50 bg-card/50 focus:bg-card focus:border-emerald-500 outline-none transition-all font-bold"
                            {...register('booking_date')} 
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Select Time Window</Label>
                        <div className="grid gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setValue('time_slot', slot)}
                              className={cn(
                                "flex items-center justify-between p-5 rounded-2xl border text-sm font-bold transition-all duration-300",
                                selectedTimeSlot === slot
                                  ? "border-emerald-500 bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                  : "border-border/50 bg-card/50 hover:border-emerald-500/30"
                              )}
                            >
                              <div className="flex items-center">
                                <Clock className="mr-3 h-4 w-4" />
                                {slot}
                              </div>
                              {selectedTimeSlot === slot && <CheckCircle2 className="h-4 w-4" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-start space-x-4">
                      <Info className="h-6 w-6 text-emerald-500 shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        Our verified professional will arrive within the selected time window. 
                        You can reschedule up to 4 hours before the appointment via the dashboard.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="h-16 px-8 rounded-2xl border-border" onClick={prevStep}>
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                      <Button type="submit" className="flex-1 h-16 text-lg font-black rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" disabled={isSubmitting || !selectedTimeSlot}>
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Confirming...
                          </div>
                        ) : (
                          "Confirm Booking"
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
