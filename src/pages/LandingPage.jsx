import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Star,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/context/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/utils/cn';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      title: 'Deep Cleaning',
      description: 'Medical-grade sanitation for your peace of mind.',
      icon: Sparkles,
      color: 'bg-emerald-500',
      span: 'col-span-1 md:col-span-2'
    },
    {
      title: 'Verified Pros',
      description: 'Only the top 1% of experts.',
      icon: ShieldCheck,
      color: 'bg-blue-500',
      span: 'col-span-1'
    },
    {
      title: '2-Min Booking',
      description: 'Speed defined.',
      icon: Zap,
      color: 'bg-amber-500',
      span: 'col-span-1'
    },
    {
      title: 'Fixed Pricing',
      description: 'No hidden costs, ever.',
      icon: Clock,
      color: 'bg-indigo-500',
      span: 'col-span-1 md:col-span-2'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-hidden">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-emerald-500/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" 
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="pt-48 pb-32 px-6 relative"
      >
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-sm font-medium backdrop-blur-md"
          >
            <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent font-bold">
              Trusted by 10,000+ Residents
            </span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.85] uppercase"
            >
              Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Experience.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              The digital concierge for your home. We bring elite service standards to your doorstep with a single tap.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
          >
            <Button 
              size="lg" 
              className="h-16 px-12 text-lg font-black group rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]" 
              onClick={() => navigate('/book')}
            >
              Get Started
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 px-12 text-lg font-black rounded-2xl border-white/10 hover:bg-white/5 backdrop-blur-md" 
                onClick={() => navigate('/signup')}
              >
                Join Skippr
              </Button>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-10 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-2xl hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden",
                  feature.span
                )}
              >
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3",
                  feature.color
                )}>
                  <feature.icon className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-lg font-medium">
                  {feature.description}
                </p>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-8 w-8 text-white/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Modern CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[60px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-16 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Stay Clean. <br />Stay Premium.</h2>
              <p className="text-white/40 text-xl max-w-xl mx-auto font-medium">Elevate your living standards with the most trusted professionals in the city.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
              <Button 
                variant="secondary" 
                size="lg" 
                className="h-16 px-16 rounded-2xl font-black bg-white text-black hover:scale-105 transition-transform shadow-2xl" 
                onClick={() => navigate('/signup')}
              >
                Book Now
              </Button>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Instant Approval</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Minimalistic Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-sm text-white/20">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black text-lg">S</div>
            <span className="font-black text-white text-2xl tracking-tighter uppercase">Skippr</span>
          </div>
          
          <nav className="flex space-x-12 font-bold uppercase tracking-widest text-[10px]">
            <button className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
            <button className="hover:text-emerald-400 transition-colors">Terms of Service</button>
            <button className="hover:text-emerald-400 transition-colors">Support</button>
          </nav>

          <div className="font-medium tracking-tight">
            © 2026 Skippr. Crafted for excellence.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
