import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  Moon, 
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/context/themeStore';
import { Button } from '../ui/Button';
import { cn } from '@/utils/cn';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Calendar, label: 'Registry', path: '/admin/bookings' },
    { icon: Settings, label: 'System', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-emerald-500/30 transition-colors duration-500">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-500 ease-in-out hidden lg:block",
          isSidebarOpen ? "w-72" : "w-24"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center mb-16 px-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 shrink-0">S</div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-4 font-black text-2xl tracking-tighter uppercase"
              >
                Skippr
              </motion.span>
            )}
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" 
                      : "text-muted-foreground hover:bg-emerald-500/5 hover:text-emerald-500"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "")} />
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-4 font-bold text-xs uppercase tracking-widest"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border/50 space-y-3">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-accent transition-all group"
            >
              {theme === 'light' ? <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform" /> : <Sun className="h-5 w-5 group-hover:rotate-45 transition-transform" />}
              {isSidebarOpen && <span className="ml-4 font-bold text-xs uppercase tracking-widest">Theme</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
            >
              <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="ml-4 font-bold text-xs uppercase tracking-widest">Sign Out</span>}
            </button>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-background z-50 hover:scale-110 transition-transform"
        >
          {isSidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-500",
        "lg:ml-72", 
        !isSidebarOpen && "lg:ml-24"
      )}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background/50 backdrop-blur-md px-6 lg:px-12">
          <button 
            className="lg:hidden p-2 rounded-xl bg-card border border-border"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-auto flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Authorized Personnel</p>
              <p className="text-sm font-black uppercase tracking-tighter">Deven Rajput</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-black text-xs shadow-inner">
              AD
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
