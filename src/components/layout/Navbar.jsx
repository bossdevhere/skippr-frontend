import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  Calendar, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/context/authStore';
import { cn } from '@/utils/cn';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = !isAuthenticated 
    ? [
        { label: 'Login', path: '/login', variant: 'ghost' },
        { label: 'Sign Up', path: '/signup', variant: 'default' },
      ]
    : user?.role === 'Admin'
    ? [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
      ]
    : [
        { label: 'Book Service', path: '/book', icon: PlusCircle },
        { label: 'My Bookings', path: '/my-bookings', icon: Calendar },
      ];

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-[24px] shadow-2xl">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black font-black shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform">S</div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white">Skippr</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Button 
              key={link.path}
              variant={link.variant || (location.pathname === link.path ? 'secondary' : 'ghost')}
              size="sm"
              onClick={() => navigate(link.path)}
              className={cn(
                "text-[10px] font-black uppercase tracking-widest rounded-xl px-6 h-10 transition-all",
                location.pathname === link.path ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {link.icon && <link.icon className="mr-2 h-3.5 w-3.5" />}
              {link.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest rounded-xl px-6 h-10 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b p-4 space-y-2 flex flex-col">
          {navLinks.map((link) => (
            <Button 
              key={link.path}
              variant={link.variant || (location.pathname === link.path ? 'secondary' : 'ghost')}
              className="justify-start"
              onClick={() => {
                navigate(link.path);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export { Navbar };
