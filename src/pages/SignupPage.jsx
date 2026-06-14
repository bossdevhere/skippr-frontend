import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Star, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/context/authStore';
import SplitScreenLayout from '@/components/layout/SplitScreenLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    const result = await signup({ ...data, role: 'Customer' });
    if (result.success) {
      toast.success('Account created! Welcome to Skippr.');
      navigate('/book');
    } else {
      toast.error(result.message);
    }
  };

  const leftContent = (
    <div className="space-y-8 p-12">
      <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">S</div>
      <div className="space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
          Elevated <br />
          Living.
        </h1>
        <p className="text-xl text-white/40 font-medium max-w-sm">
          Join the elite network of residents enjoying seamless home maintenance.
        </p>
      </div>
      <div className="space-y-4 pt-6">
        {[
          'Bespoke Service History',
          'Priority Expert Dispatch',
          'Exclusive Resident Perks',
        ].map((item, i) => (
          <div key={i} className="flex items-center space-x-3 text-sm font-bold uppercase tracking-widest text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-6 pt-8">
        <div className="flex -space-x-4">
          {[4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-12 rounded-full border-4 border-[#10b981] bg-black overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="user" className="h-full w-full object-cover opacity-80" />
            </div>
          ))}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold tracking-tight">Verified Community</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-muted-foreground">
            Get started with Skippr today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="John Doe"
                className="pl-10"
                {...register('name')}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="mobile"
                placeholder="+91 98765 43210"
                className="pl-10"
                {...register('mobile')}
              />
            </div>
            {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
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
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Creating Account..." : (
              <span className="flex items-center space-x-2">
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </div>
      </div>
    </SplitScreenLayout>
  );
};

export default SignupPage;
