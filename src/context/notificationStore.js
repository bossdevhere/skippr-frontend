import { create } from 'zustand';
import api from '@/services/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  lastChecked: new Date().toISOString(),

  fetchNotifications: async () => {
    try {
      const response = await api.get('/bookings');
      const allBookings = response.data.data.bookings;
      
      // Filter bookings created after last checked or just take the last 5 as notifications
      const newNotifications = allBookings.map(booking => ({
        id: booking.id,
        title: 'New Booking',
        message: `${booking.customer_name} booked ${booking.service_name}`,
        time: booking.created_at || booking.booking_date,
        read: false
      })).slice(0, 5);

      set({ 
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));
