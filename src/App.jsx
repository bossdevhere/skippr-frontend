import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useThemeStore } from './context/themeStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookingPage from './pages/BookingPage';
import SuccessPage from './pages/SuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';
import SettingsPage from './pages/SettingsPage';
import OfflinePage from './pages/OfflinePage';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  const { setTheme } = useThemeStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setTheme]);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <Router>
...
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Customer Routes (Mandatory Authentication) */}
          <Route path="/book" element={
            <ProtectedRoute role="Customer">
              <BookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/success" element={<SuccessPage />} />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute role="Customer">
              <MyBookingsPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="Admin">
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="Admin">
              <BookingsPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute role="Admin">
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors expand={false} />
      </div>
    </Router>
  );
};

export default App;
