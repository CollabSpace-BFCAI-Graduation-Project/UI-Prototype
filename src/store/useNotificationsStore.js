import { create } from 'zustand';
import api from '../services/api';
import { Notification } from '../models';

/**
 * Notifications Store
 * Manages notifications and invite responses
 */
const useNotificationsStore = create((set, get) => ({
    // State
    notifications: [],
    loading: false,
    error: null,

    // Computed - unread count
    getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
    },

    // Fetch notifications for a user
    fetchNotifications: async (userId) => {
        set({ loading: true, error: null });
        try {
            const data = await api.notifications.getAll(userId);
            // Convert to model instances (which calculates time)
            const notifications = Notification.fromApiList(data);
            // Sort by date, newest first
            const sorted = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            set({ notifications: sorted, loading: false });
            return sorted;
        } catch (err) {
            set({ error: err.message, loading: false });
            return [];
        }
    },

    // Mark single notification as read
    markAsRead: async (id) => {
        try {
            await api.notifications.markRead(id);
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            }));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    },

    // Mark all as read
    markAllAsRead: async () => {
        try {
            await api.notifications.markAllRead();
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            }));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    },

    // Accept an invite
    acceptInvite: async (inviteId, notificationId) => {
        try {
            await Promise.all([
                api.invites.accept(inviteId),
                api.notifications.markRead(notificationId)
            ]);

            // Mark as read locally
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            }));
            return true;
        } catch (err) {
            console.error('Failed to accept invite:', err);
            return false;
        }
    },

    // Decline an invite
    declineInvite: async (inviteId, notificationId) => {
        try {
            await Promise.all([
                api.invites.decline(inviteId),
                api.notifications.markRead(notificationId)
            ]);

            // Mark as read locally
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            }));
            return true;
        } catch (err) {
            console.error('Failed to decline invite:', err);
            return false;
        }
    },

    // Add a notification (for real-time updates)
    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications]
        }));
    },

    // Clear all notifications
    clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationsStore;
