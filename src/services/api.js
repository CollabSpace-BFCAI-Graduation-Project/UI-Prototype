/**
 * Mock API Service Layer
 * Simulates REST API calls with fake data and delays
 */

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Store
const mockData = {
    users: [
        { id: 1, name: "John Doe", email: "john@example.com", bio: "Product Designer at Acme Corp", initials: "JD", avatarColor: "#3b82f6", status: "online" },
        { id: 2, name: "Sarah Chen", email: "sarah@example.com", bio: "Senior Developer", initials: "SC", avatarColor: "#10b981", status: "online" },
        { id: 3, name: "Mike Ross", email: "mike@example.com", bio: "Marketing Lead", initials: "MR", avatarColor: "#f59e0b", status: "away" },
        { id: 4, name: "Jessica Day", email: "jessica@example.com", bio: "UX Researcher", initials: "JD", avatarColor: "#ec4899", status: "offline" },
        { id: 5, name: "Tom Wilson", email: "tom@example.com", bio: "Backend Engineer", initials: "TW", avatarColor: "#8b5cf6", status: "dnd" },
        { id: 6, name: "Emily Zhang", email: "emily@example.com", bio: "Project Manager", initials: "EZ", avatarColor: "#06b6d4", status: "online" },
    ],

    friends: [
        { id: 1, friendId: 2, status: 'accepted', since: '2024-01-15' },
        { id: 2, friendId: 3, status: 'accepted', since: '2024-02-20' },
        { id: 3, friendId: 4, status: 'pending', since: '2024-03-01' },
        { id: 4, friendId: 6, status: 'accepted', since: '2024-03-10' },
    ],

    friendRequests: [
        { id: 1, fromUserId: 5, toUserId: 1, status: 'pending', createdAt: '2024-03-15' },
    ],

    activity: [
        { id: 1, type: 'session', userId: 2, spaceName: 'Design Weekly', action: 'started a session', time: '10 mins ago' },
        { id: 2, type: 'file', userId: 3, spaceName: 'Project Alpha', action: 'uploaded Design_v3.fig', time: '1 hour ago' },
        { id: 3, type: 'join', userId: 6, spaceName: 'Acme Corp HQ', action: 'joined the space', time: '2 hours ago' },
        { id: 4, type: 'message', userId: 2, spaceName: 'Dev Standup', action: 'mentioned you', time: '3 hours ago' },
        { id: 5, type: 'create', userId: 1, spaceName: 'New Project', action: 'created a new space', time: '1 day ago' },
    ],

    events: [
        { id: 1, title: 'Weekly Design Review', spaceId: 2, startTime: '2024-03-22T14:00:00', duration: 60, attendees: [1, 2, 3] },
        { id: 2, title: 'Sprint Planning', spaceId: 3, startTime: '2024-03-23T10:00:00', duration: 90, attendees: [1, 2, 5] },
        { id: 3, title: 'All Hands Meeting', spaceId: 5, startTime: '2024-03-25T15:00:00', duration: 45, attendees: [1, 2, 3, 4, 5, 6] },
    ],

    devices: {
        microphones: [
            { id: 'mic1', name: 'Default - MacBook Pro Microphone', isDefault: true },
            { id: 'mic2', name: 'AirPods Pro', isDefault: false },
            { id: 'mic3', name: 'Blue Yeti', isDefault: false },
        ],
        speakers: [
            { id: 'spk1', name: 'Default - MacBook Pro Speakers', isDefault: true },
            { id: 'spk2', name: 'AirPods Pro', isDefault: false },
            { id: 'spk3', name: 'External Monitor Speakers', isDefault: false },
        ],
        cameras: [
            { id: 'cam1', name: 'FaceTime HD Camera', isDefault: true },
            { id: 'cam2', name: 'Logitech C920', isDefault: false },
        ],
    },
};

// API Service Functions
export const api = {
    // User APIs
    getCurrentUser: async () => {
        await delay(200);
        return { success: true, data: mockData.users[0] };
    },

    updateUserProfile: async (userId, updates) => {
        await delay(300);
        const userIndex = mockData.users.findIndex(u => u.id === userId);
        if (userIndex >= 0) {
            mockData.users[userIndex] = { ...mockData.users[userIndex], ...updates };
            return { success: true, data: mockData.users[userIndex] };
        }
        return { success: false, error: 'User not found' };
    },

    updateUserStatus: async (userId, status) => {
        await delay(100);
        const userIndex = mockData.users.findIndex(u => u.id === userId);
        if (userIndex >= 0) {
            mockData.users[userIndex].status = status;
            return { success: true, data: { status } };
        }
        return { success: false, error: 'User not found' };
    },

    // Friends APIs
    getFriends: async (userId) => {
        await delay(250);
        const friendships = mockData.friends.filter(f => f.status === 'accepted');
        const friends = friendships.map(f => {
            const friend = mockData.users.find(u => u.id === f.friendId);
            return { ...friend, friendshipId: f.id, friendSince: f.since };
        });
        return { success: true, data: friends };
    },

    getFriendRequests: async (userId) => {
        await delay(200);
        const requests = mockData.friendRequests.filter(r => r.toUserId === userId && r.status === 'pending');
        const requestsWithUsers = requests.map(r => ({
            ...r,
            fromUser: mockData.users.find(u => u.id === r.fromUserId),
        }));
        return { success: true, data: requestsWithUsers };
    },

    sendFriendRequest: async (fromUserId, toUserId) => {
        await delay(300);
        const newRequest = {
            id: Date.now(),
            fromUserId,
            toUserId,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        mockData.friendRequests.push(newRequest);
        return { success: true, data: newRequest };
    },

    acceptFriendRequest: async (requestId) => {
        await delay(200);
        const request = mockData.friendRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'accepted';
            mockData.friends.push({
                id: Date.now(),
                friendId: request.fromUserId,
                status: 'accepted',
                since: new Date().toISOString(),
            });
            return { success: true };
        }
        return { success: false, error: 'Request not found' };
    },

    removeFriend: async (friendshipId) => {
        await delay(200);
        const index = mockData.friends.findIndex(f => f.id === friendshipId);
        if (index >= 0) {
            mockData.friends.splice(index, 1);
            return { success: true };
        }
        return { success: false, error: 'Friendship not found' };
    },

    // Activity APIs
    getActivity: async (userId) => {
        await delay(200);
        const activities = mockData.activity.map(a => ({
            ...a,
            user: mockData.users.find(u => u.id === a.userId),
        }));
        return { success: true, data: activities };
    },

    // Search APIs
    search: async (query, filters = {}) => {
        await delay(300);
        const q = query.toLowerCase();

        const spaces = []; // Would search spaces here
        const people = mockData.users.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );

        return {
            success: true,
            data: {
                spaces,
                people,
                total: spaces.length + people.length
            }
        };
    },

    // Device APIs
    getDevices: async () => {
        await delay(150);
        return { success: true, data: mockData.devices };
    },

    saveDevicePreferences: async (preferences) => {
        await delay(200);
        localStorage.setItem('devicePreferences', JSON.stringify(preferences));
        return { success: true };
    },

    getDevicePreferences: async () => {
        await delay(100);
        const prefs = localStorage.getItem('devicePreferences');
        return { success: true, data: prefs ? JSON.parse(prefs) : null };
    },

    // Events APIs
    getUpcomingEvents: async (userId) => {
        await delay(200);
        return { success: true, data: mockData.events };
    },

    // Stats APIs
    getUserStats: async (userId) => {
        await delay(150);
        return {
            success: true,
            data: {
                spacesJoined: 6,
                hoursSpent: 47,
                messagesent: 234,
                filesShared: 18,
            },
        };
    },
};

export default api;
