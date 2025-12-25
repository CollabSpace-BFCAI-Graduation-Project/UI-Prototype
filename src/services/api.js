// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
            const error = new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
            // Attach the full error response for lockout info, warnings, etc.
            error.data = errorData;
            error.status = response.status;
            throw error;
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
    // Profile & Privacy
    getProfile: (id, viewerId) => request(`/users/${id}/profile?viewerId=${viewerId}`),
    updatePrivacy: (id, data) => request(`/users/${id}/privacy`, { method: 'PUT', body: data }),
    getSharedSpaces: (id, viewerId) => request(`/users/${id}/shared-spaces?viewerId=${viewerId}`),
    search: (query, viewerId) => request(`/users/search?q=${encodeURIComponent(query)}&viewerId=${viewerId}`),
    // Favorites
    getFavorites: (userId) => request(`/users/${userId}/favorites`),
    addFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}`, { method: 'POST' }),
    removeFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}`, { method: 'DELETE' }),
    toggleFavorite: (userId, spaceId) => request(`/users/${userId}/favorites/${spaceId}/toggle`, { method: 'POST' }),
};

// ============ SPACES ============
export const spaces = {
    getAll: (userId) => request(`/spaces${userId ? `?userId=${userId}` : ''}`),
    search: (query, userId) => request(`/spaces/search?q=${encodeURIComponent(query)}&userId=${userId}`),
    getById: (id) => request(`/spaces/${id}`),
    create: (data) => request('/spaces', { method: 'POST', body: data }),
    update: (id, data) => request(`/spaces/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/spaces/${id}`, { method: 'DELETE' }),

    // Join Requests
    join: (spaceId, userId) => request(`/spaces/${spaceId}/join`, { method: 'POST', body: { userId } }),
    getRequests: (spaceId) => request(`/spaces/${spaceId}/requests`),
    approveRequest: (spaceId, requestId) => request(`/spaces/${spaceId}/requests/${requestId}/approve`, { method: 'POST' }),
    rejectRequest: (spaceId, requestId) => request(`/spaces/${spaceId}/requests/${requestId}/reject`, { method: 'POST' }),

    // Ownership
    transferOwnership: (spaceId, currentOwnerId, newOwnerId) => request(`/spaces/${spaceId}/transfer-ownership`, {
        method: 'POST',
        body: { currentOwnerId, newOwnerId }
    }),

    // Thumbnail
    uploadThumbnail: (spaceId, imageData) => request(`/spaces/${spaceId}/thumbnail`, {
        method: 'POST',
        body: { imageData }
    }),

    update: (id, data) => request(`/spaces/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/spaces/${id}`, { method: 'DELETE' }),

    // Bans
    getBans: (spaceId) => request(`/spaces/${spaceId}/bans`),
    unban: (spaceId, banId) => request(`/spaces/${spaceId}/bans/${banId}`, { method: 'DELETE' }),
};

// ============ SPACE MEMBERS ============
export const members = {
    getBySpace: (spaceId) => request(`/spaces/${spaceId}/members`),
    add: (spaceId, data) => request(`/spaces/${spaceId}/members`, { method: 'POST', body: data }),
    updateRole: (spaceId, memberId, role) => request(`/spaces/${spaceId}/members/${memberId}`, { method: 'PUT', body: { role } }),
    remove: (spaceId, memberId) => request(`/spaces/${spaceId}/members/${memberId}`, { method: 'DELETE' }),
    ban: (spaceId, memberId, bannedBy, reason) => request(`/spaces/${spaceId}/members/${memberId}/ban`, { method: 'POST', body: { bannedBy, reason } }),
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
    /**
     * Upload a file to a space
     * @param {string} spaceId - The space ID
     * @param {File} file - The file object from input
     * @param {string} uploadedBy - User ID who uploaded
     */
    upload: async (spaceId, file, uploadedBy) => {
        // Convert file to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        return request(`/files/${spaceId}`, {
            method: 'POST',
            body: {
                name: file.name,
                fileData: base64,
                uploadedBy: uploadedBy
            }
        });
    },
    download: (fileId) => `${API_BASE_URL}/files/${fileId}/download`,
    delete: (fileId, userId) => request(`/files/${fileId}`, { method: 'DELETE', body: { userId } }),
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
