// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
        throw error;
    }
}

// ============ AUTH ============
export const auth = {
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
};

// ============ USERS ============
export const users = {
    getAll: () => request('/users'),
    getById: (id) => request(`/users/${id}`),
    update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
    uploadAvatar: (id, imageData) => request(`/users/${id}/avatar`, { method: 'POST', body: { imageData } }),
    deleteAvatar: (id) => request(`/users/${id}/avatar`, { method: 'DELETE' }),
    getSpaces: (userId) => request(`/users/${userId}/spaces`),
    getInvites: (userId) => request(`/users/${userId}/invites`),
    // Favorites
    getFavorites: (userId) => request(`/users/${userId}/favorites`),
    addFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}`, { method: 'POST' }),
    removeFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}`, { method: 'DELETE' }),
    toggleFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}/toggle`, { method: 'POST' }),
};

// ============ SPACES ============
export const spaces = {
    getAll: () => request('/spaces'),
    getById: (id) => request(`/spaces/${id}`),
    create: (data) => request('/spaces', { method: 'POST', body: data }),
    update: (id, data) => request(`/spaces/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/spaces/${id}`, { method: 'DELETE' }),
};

// ============ SPACE MEMBERS ============
export const members = {
    getBySpace: (spaceId) => request(`/spaces/${spaceId}/members`),
    add: (spaceId, data) => request(`/spaces/${spaceId}/members`, { method: 'POST', body: data }),
    updateRole: (spaceId, memberId, role) => request(`/spaces/${spaceId}/members/${memberId}`, { method: 'PUT', body: { role } }),
    remove: (spaceId, memberId) => request(`/spaces/${spaceId}/members/${memberId}`, { method: 'DELETE' }),
    leave: (spaceId, userId) => request(`/spaces/${spaceId}/leave`, { method: 'POST', body: { userId } }),
    invite: (spaceId, data) => request(`/spaces/${spaceId}/invite`, { method: 'POST', body: data }),
};

// ============ INVITES ============
export const invites = {
    accept: (inviteId) => request(`/invites/${inviteId}/accept`, { method: 'POST' }),
    decline: (inviteId) => request(`/invites/${inviteId}/decline`, { method: 'POST' }),
};

// ============ NOTIFICATIONS ============
export const notifications = {
    getAll: (userId) => request(`/notifications${userId ? `?userId=${userId}` : ''}`),
    create: (data) => request('/notifications', { method: 'POST', body: data }),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
};

// ============ MESSAGES ============
export const messages = {
    getBySpace: (spaceId) => request(`/messages/${spaceId}`),
    send: (spaceId, data) => request(`/messages/${spaceId}`, { method: 'POST', body: data }),
};

// ============ FILES ============
export const files = {
    getBySpace: (spaceId) => request(`/files/${spaceId}`),
    upload: (spaceId, data) => request(`/files/${spaceId}`, { method: 'POST', body: data }),
};

// Export grouped API
const api = {
    auth,
    users,
    spaces,
    members,
    invites,
    notifications,
    messages,
    files,
};

export default api;
