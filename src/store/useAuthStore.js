import { create } from 'zustand';
import api from '../services/api';

/**
 * Auth Store
 * Manages user authentication state
 */
const useAuthStore = create((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    authInitialized: false, // Track if auth has been checked
    loading: false,
    error: null,

    // Actions
    setUser: (user) => set({ user, isAuthenticated: !!user }),

    login: async (identifier, password) => {
        set({ loading: true, error: null });
        try {
            const userData = await api.auth.login({ identifier, password });
            set({ user: userData, isAuthenticated: true, loading: false });
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            // Store the full error data for warnings, lockout info, etc.
            const errorData = err.data || { error: err.message || 'Login failed' };
            set({ error: errorData, loading: false });
            throw err;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const newUser = await api.auth.register(userData);
            set({ user: newUser, isAuthenticated: true, loading: false });
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        } catch (err) {
            set({ error: err.message || 'Registration failed', loading: false });
            throw err;
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('user');
    },

    updateProfile: async (profileData) => {
        const { user } = get();
        if (!user) return;

        try {
            const updatedUser = await api.users.update(user.id, profileData);
            set({ user: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    uploadAvatar: async (imageData) => {
        const { user } = get();
        if (!user) return;

        try {
            const updatedUser = await api.users.uploadAvatar(user.id, imageData);
            set({ user: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            throw err;
        }
    },

    deleteAvatar: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const updatedUser = await api.users.deleteAvatar(user.id);
            set({ user: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            throw err;
        }
    },

    // Initialize from localStorage or OAuth callback
    initialize: () => {
        // Check for OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        const errorParam = urlParams.get('error');

        if (userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                set({ user, isAuthenticated: true, authInitialized: true });
                localStorage.setItem('user', JSON.stringify(user));
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            } catch (e) {
                console.error('Failed to parse OAuth user data:', e);
            }
        }

        if (errorParam) {
            const errorMessages = {
                'oauth_denied': 'Google sign-in was cancelled',
                'invalid_state': 'Security validation failed. Please try again.',
                'no_code': 'Authentication failed. Please try again.',
                'token_failed': 'Failed to get access token from Google',
                'no_user_info': 'Could not retrieve your Google profile',
                'user_not_found': 'User account not found',
                'callback_failed': 'Authentication callback failed'
            };
            set({ error: { error: errorMessages[errorParam] || 'Authentication failed' }, authInitialized: true });
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        // Check localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                set({ user, isAuthenticated: true, authInitialized: true });
            } catch (e) {
                localStorage.removeItem('user');
                set({ authInitialized: true });
            }
        } else {
            set({ authInitialized: true });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
