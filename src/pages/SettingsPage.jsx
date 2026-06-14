import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  LogOut, 
  Moon, 
  Sun,
  Monitor
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useThemeStore } from '@/context/themeStore';
import { useAuthStore } from '@/context/authStore';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your administrator account and dashboard preferences.</p>
        </div>

        <div className="grid gap-6">
          {/* Admin Profile */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 opacity-70" />
                Admin Profile
              </CardTitle>
              <CardDescription>Personal information associated with your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue={user?.name || 'Skippr Admin'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={user?.email} disabled className="bg-muted/50" />
                </div>
              </div>
              <Button size="sm">Save Profile</Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Monitor className="mr-2 h-5 w-5 opacity-70" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your dashboard viewing experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark visual themes.</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme} className="w-32">
                  {theme === 'light' ? (
                    <><Moon className="mr-2 h-4 w-4" /> Dark Mode</>
                  ) : (
                    <><Sun className="mr-2 h-4 w-4" /> Light Mode</>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between border-t pt-6">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts for new service bookings.</p>
                </div>
                <div className="h-6 w-10 rounded-full bg-emerald-500 flex items-center justify-end px-1 cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-destructive">
                <Shield className="mr-2 h-5 w-5 opacity-70" />
                Security & Session
              </CardTitle>
              <CardDescription>Manage your authentication and log out of the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logout</Label>
                  <p className="text-xs text-muted-foreground">Terminate your current session and return to login.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout} className="w-32">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-muted-foreground opacity-50 pt-8 pb-12">
          Skippr Admin Engine v1.0.0 • Connected to Supabase Production
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
