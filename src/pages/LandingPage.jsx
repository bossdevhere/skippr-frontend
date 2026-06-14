import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/context/authStore';
import { Navbar } from '@/components/layout/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      title: 'Professional Cleaning',
      description: 'Expert deep cleaning for your living space.',
      icon: Sparkles
    },
    {
      title: 'Trusted Professionals',
      description: 'Background checked and verified service providers.',
      icon: ShieldCheck
    },
    {
      title: 'Instant Booking',
      description: 'Book your service in less than 2 minutes.',
      icon: Clock
    }
  ];

  const handleStartBooking = () => {
    navigate('/book');
  };

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-primary/[0.03] dark:bg-white/[0.03] border border-primary/10 px-4 py-1.5 rounded-full text-[13px] font-medium tracking-tight"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-muted-foreground">Redefining Home Maintenance</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95]"
          >
            Your home deserves <br />
            <span className="text-muted-foreground/40">the premium touch.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            Experience seamless home service bookings. From deep cleaning to professional repairs, we connect you with the best in the city.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6"
          >
            <Button size="lg" className="h-14 px-10 text-md font-semibold group rounded-full" onClick={handleStartBooking}>
              Book a Service
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!isAuthenticated && (
              <Button variant="outline" size="lg" className="h-14 px-10 text-md font-semibold rounded-full" onClick={() => navigate('/signup')}>
                Create Account
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-10 h-full bg-card border border-border/50 rounded-[32px] card-hover group">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-md font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto rounded-[40px] bg-foreground p-12 text-center text-background relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready for a cleaner home?</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Join the residents who trust Skippr for their premium home maintenance.</p>
            <div className="flex justify-center">
              <Button variant="secondary" size="lg" className="h-14 px-12 rounded-full font-bold shadow-xl hover:scale-105 transition-transform" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground/60">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold text-white">S</div>
            <span className="font-semibold text-foreground">Skippr</span>
          </div>
          <div className="flex space-x-8">
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Help</button>
          </div>
          <div className="mt-4 md:mt-0">
            © 2026 Skippr.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
