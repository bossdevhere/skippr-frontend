import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
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
    <div className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">
        Manage your services <br />
        in one place.
      </h1>
      <p className="text-lg text-white/80">
        Log in to access your personalized dashboard, track active bookings, and manage your account settings.
      </p>
      <div className="flex items-center space-x-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-muted flex items-center justify-center text-[10px] text-primary font-bold">
              U{i}
            </div>
          ))}
        </div>
        <span className="text-sm text-white/60">Trusted by 500+ residents</span>
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
