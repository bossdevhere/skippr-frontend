import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Star } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import SplitScreenLayout from '@/components/layout/SplitScreenLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('Welcome back!');
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/book', { replace: true });
      }
    } else {
      toast.error(result.message);
    }
  };

  const leftContent = (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Premium <br />
          <span className="text-emerald-500">Concierge.</span>
        </h1>
        <p className="text-xl text-white/40 font-medium max-w-sm">
          The gateway to your elite home maintenance experience.
        </p>
      </div>
      <div className="flex items-center space-x-6 pt-12">
        <div className="flex -space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-12 rounded-full border-4 border-black bg-emerald-500 overflow-hidden shadow-2xl">
              <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" className="h-full w-full object-cover opacity-80" />
            </div>
          ))}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold tracking-tight">Join 500+ Residents</p>
          <div className="flex text-emerald-500">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 fill-current" />)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SplitScreenLayout leftContent={leftContent}>
      <div className="space-y-10">
        <div className="space-y-2 text-center lg:text-left">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Sign In</h2>
          <p className="text-muted-foreground font-medium">
            Welcome back to the Skippr network.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Email Address</Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="john@example.com"
                type="email"
                className="pl-12 h-14 rounded-2xl bg-card border-border/50 focus:bg-background transition-all"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                className="pl-12 pr-12 h-14 rounded-2xl bg-card border-border/50 focus:bg-background transition-all"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-16 text-lg font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" disabled={isLoading}>
            {isLoading ? (
              <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center space-x-2">
                <span>Access Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center text-sm font-medium text-muted-foreground">
          New to Skippr? <Link to="/signup" className="text-emerald-500 font-black hover:underline uppercase tracking-tighter">Create Account</Link>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default LoginPage;
