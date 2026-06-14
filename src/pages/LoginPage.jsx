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
  const location = useLocation();

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
    <div className="space-y-8 p-12">
      <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">S</div>
      <div className="space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
          Premium <br />
          Concierge.
        </h1>
        <p className="text-xl text-white/40 font-medium max-w-sm">
          Access your personal portal to manage high-end home services.
        </p>
      </div>
      <div className="flex items-center space-x-6 pt-12">
        <div className="flex -space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-12 rounded-full border-4 border-[#10b981] bg-black overflow-hidden">
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
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
          <p className="text-muted-foreground">
            Welcome back to Skippr.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create Account</Link>
        </div>
        <div className="text-center text-xs text-muted-foreground/50 pt-4">
          Admin access required for dashboard management.
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default LoginPage;
