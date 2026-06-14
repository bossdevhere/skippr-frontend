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
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out hidden lg:block",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center mb-8 px-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">S</div>
            {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight">Skippr</span>}
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t space-y-1">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">Theme</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-4 lg:px-8">
          <button 
            className="lg:hidden mr-4 p-2 rounded-md hover:bg-accent"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div 
            className="flex flex-1 items-center max-w-md cursor-pointer group"
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-muted-foreground transition-colors group-hover:border-primary/50">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              <span>Search or command...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4 relative">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </Button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-80 z-50 rounded-xl border bg-card shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="text-[10px] text-muted-foreground hover:text-primary">Clear all</button>
                        )}
                      </div>
                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => { markAsRead(n.id); setIsNotificationsOpen(false); navigate('/admin/bookings'); }}
                              className={cn(
                                "p-4 border-b last:border-0 hover:bg-accent transition-colors cursor-pointer",
                                !n.read && "bg-emerald-500/5"
                              )}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-xs">{n.title}</p>
                                <span className="text-[10px] text-muted-foreground">
                                  {format(new Date(n.time), 'hh:mm a')}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-xs text-muted-foreground">
                            No new notifications
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t bg-muted/10">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-[10px] h-8"
                          onClick={() => { setIsNotificationsOpen(false); navigate('/admin/bookings'); }}
                        >
                          View all bookings
                        </Button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
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
