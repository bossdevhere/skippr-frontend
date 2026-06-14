import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/context/themeStore';
import { useNotificationStore } from '@/context/notificationStore';
import { CommandPalette } from './CommandPalette';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, clearAll } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Polling for notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out hidden lg:block",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center mb-12 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">S</div>
            {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight">Skippr</span>}
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-xl transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t space-y-2">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-3 py-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">Theme</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        "lg:ml-64", 
        !isSidebarOpen && "lg:ml-20"
      )}>
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background/80 backdrop-blur-md px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">Admin</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Super User</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
