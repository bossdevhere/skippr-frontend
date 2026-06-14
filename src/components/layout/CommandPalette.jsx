import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, LayoutDashboard, LogOut, Moon, Sun, X } from 'lucide-react';
import { useThemeStore } from '@/context/themeStore';
import { cn } from '@/utils/cn';

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // This is a toggle logic handled by parent, but keeping it safe
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  const actions = [
    { id: 'dash', title: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/admin') },
    { id: 'book', title: 'Bookings', icon: Calendar, action: () => navigate('/admin/bookings') },
    { id: 'theme', title: `Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`, icon: theme === 'light' ? Moon : Sun, action: toggleTheme },
    { id: 'logout', title: 'Logout', icon: LogOut, action: () => { localStorage.clear(); navigate('/login'); } },
  ].filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative z-[101] w-full max-w-xl overflow-hidden rounded-xl border bg-card shadow-2xl"
        >
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              autoFocus
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={onClose} className="ml-2 rounded-md p-1 hover:bg-muted">
              <X className="h-4 w-4 opacity-50" />
            </button>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {actions.length > 0 ? (
              actions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="mr-3 h-4 w-4 opacity-70" />
                  <span>{item.title}</span>
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
          <div className="border-t bg-muted/50 px-4 py-2 text-[10px] text-muted-foreground flex justify-between">
            <span>Tip: Use <kbd className="rounded bg-muted px-1 font-sans">Ctrl</kbd> + <kbd className="rounded bg-muted px-1 font-sans">K</kbd> to open anytime.</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export { CommandPalette };
