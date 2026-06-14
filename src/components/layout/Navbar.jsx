import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  Calendar, 
  PlusCircle,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/context/authStore';
import { useThemeStore } from '@/context/themeStore';
import { cn } from '@/utils/cn';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = !isAuthenticated 
    ? [
        { label: 'Login', path: '/login' },
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
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-card/70 backdrop-blur-xl border border-border px-6 py-3 rounded-[24px] shadow-lg">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">S</div>
          <span className="text-2xl font-black tracking-tighter uppercase text-foreground">Skippr</span>
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
                location.pathname === link.path 
                  ? "bg-foreground text-background" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.icon && <link.icon className="mr-2 h-3.5 w-3.5" />}
              {link.label}
            </Button>
          ))}
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest rounded-xl px-6 h-10 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center md:hidden space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl h-10 w-10"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <button className="p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-2 bg-card border border-border rounded-[24px] p-4 shadow-2xl space-y-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Button 
              key={link.path}
              variant={link.variant || (location.pathname === link.path ? 'secondary' : 'ghost')}
              className="justify-start rounded-xl"
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
            <Button variant="ghost" onClick={handleLogout} className="justify-start rounded-xl text-rose-500">
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
