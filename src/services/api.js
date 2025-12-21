// API Service - Connects to Express backend
const API_BASE = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API Error');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// ============ AUTH API ============
export const authApi = {
    login: (email, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name, email, password) =>
        apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),
};

// ============ USERS API ============
export const usersApi = {
    getAll: () => apiCall('/users'),

    getById: (id) => apiCall(`/users/${id}`),

    update: (id, data) =>
        apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

// ============ SPACES API ============
export const spacesApi = {
    getAll: () => apiCall('/spaces'),

    getById: (id) => apiCall(`/spaces/${id}`),

    create: (data) =>
        apiCall('/spaces', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        apiCall(`/spaces/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id) =>
        apiCall(`/spaces/${id}`, {
            method: 'DELETE',
        }),
};

// ============ NOTIFICATIONS API ============
export const notificationsApi = {
    getAll: (userId) => apiCall(`/notifications${userId ? `?userId=${userId}` : ''}`),

    create: (data) =>
        apiCall('/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    markAsRead: (id) =>
        apiCall(`/notifications/${id}/read`, {
            method: 'PUT',
        }),

    markAllAsRead: () =>
        apiCall('/notifications/read-all', {
            method: 'PUT',
        }),
};

// ============ FRIENDS API ============
export const friendsApi = {
    getAll: (userId) => apiCall(`/friends${userId ? `?userId=${userId}` : ''}`),

    sendRequest: (data) =>
        apiCall('/friends', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    acceptRequest: (id) =>
        apiCall(`/friends/${id}/accept`, {
            method: 'PUT',
        }),

    remove: (id) =>
        apiCall(`/friends/${id}`, {
            method: 'DELETE',
        }),
};

// ============ MESSAGES API ============
export const messagesApi = {
    getBySpace: (spaceId) => apiCall(`/messages/${spaceId}`),

    send: (spaceId, data) =>
        apiCall(`/messages/${spaceId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// ============ FILES API ============
export const filesApi = {
    getBySpace: (spaceId) => apiCall(`/files/${spaceId}`),

    upload: (spaceId, data) =>
        apiCall(`/files/${spaceId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Default export with all APIs
export default {
    auth: authApi,
    users: usersApi,
    spaces: spacesApi,
    notifications: notificationsApi,
    friends: friendsApi,
    messages: messagesApi,
    files: filesApi,
};
