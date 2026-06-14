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
    <nav className="fixed top-0 w-full z-50 border-b glass px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">S</div>
          <span className="text-xl font-bold tracking-tighter">Skippr</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1 bg-muted/50 p-1 rounded-full border border-border/50">
          {navLinks.map((link) => (
            <Button 
              key={link.path}
              variant={link.variant || (location.pathname === link.path ? 'secondary' : 'ghost')}
              size="sm"
              onClick={() => navigate(link.path)}
              className={cn(
                "text-xs font-semibold rounded-full px-4",
                location.pathname === link.path && "shadow-sm"
              )}
            >
              {link.icon && <link.icon className="mr-2 h-3.5 w-3.5" />}
              {link.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs font-semibold rounded-full px-4 text-destructive hover:text-destructive hover:bg-destructive/10">
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
