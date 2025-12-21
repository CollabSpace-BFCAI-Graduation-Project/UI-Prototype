// API Service - Connects to Express backend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IMAGE_BASE = process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000';

// Helper to get full image URL from relative path
export const getImageUrl = (path) => {
    if (!path) return null;
    // // If already a full URL, return as-is
    // if (path.startsWith('http://') || path.startsWith('https://')) {
    //     return path;
    // }
    // Prepend the base URL for relative paths
    return `${IMAGE_BASE}${path}`;
};

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

    delete: (id) =>
        apiCall(`/users/${id}`, {
            method: 'DELETE',
        }),

    uploadAvatar: (id, imageData) =>
        apiCall(`/users/${id}/avatar`, {
            method: 'POST',
            body: JSON.stringify({ imageData }),
        }),

    deleteAvatar: (id) =>
        apiCall(`/users/${id}/avatar`, {
            method: 'DELETE',
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
    messages: messagesApi,
    files: filesApi,
};
