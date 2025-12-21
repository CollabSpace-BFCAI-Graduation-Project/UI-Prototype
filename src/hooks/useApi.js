import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Space, Message, SpaceMember, SpaceFile, Notification } from '../models';

// ============ SPACES HOOK ============
export function useSpaces() {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSpaces = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.spaces.getAll();
            setSpaces(Space.fromApiList(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpaces();
    }, [fetchSpaces]);

    const createSpace = async (spaceData) => {
        const newSpace = await api.spaces.create(spaceData);
        const spaceModel = Space.fromApi(newSpace);
        setSpaces(prev => [...prev, spaceModel]);
        return spaceModel;
    };

    const updateSpace = async (id, data) => {
        const updated = await api.spaces.update(id, data);
        const spaceModel = Space.fromApi(updated);
        setSpaces(prev => prev.map(s => s.id === id ? spaceModel : s));
        return spaceModel;
    };

    const deleteSpace = async (id) => {
        await api.spaces.delete(id);
        setSpaces(prev => prev.filter(s => s.id !== id));
    };

    const toggleFavorite = (id) => {
        setSpaces(prev => prev.map(s =>
            s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
        ));
    };

    return {
        spaces,
        loading,
        error,
        refetch: fetchSpaces,
        createSpace,
        updateSpace,
        deleteSpace,
        toggleFavorite,
        setSpaces
    };
}

// ============ SPACE MEMBERS HOOK ============
export function useSpaceMembers(spaceId) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMembers = useCallback(async () => {
        if (!spaceId) return;
        try {
            setLoading(true);
            const data = await api.members.getBySpace(spaceId);
            setMembers(SpaceMember.fromApiList(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [spaceId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const updateRole = async (memberId, role) => {
        const updated = await api.members.updateRole(spaceId, memberId, role);
        setMembers(prev => prev.map(m => m.memberId === memberId ? { ...m, role } : m));
        return updated;
    };

    const removeMember = async (memberId) => {
        await api.members.remove(spaceId, memberId);
        setMembers(prev => prev.filter(m => m.memberId !== memberId));
    };

    const inviteMembers = async (emails, inviterName, inviterId) => {
        return await api.members.invite(spaceId, { emails, inviterName, inviterId });
    };

    return {
        members,
        loading,
        error,
        refetch: fetchMembers,
        updateRole,
        removeMember,
        inviteMembers
    };
}

// ============ MESSAGES HOOK ============
export function useMessages(spaceId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!spaceId) return;
        try {
            setLoading(true);
            const data = await api.messages.getBySpace(spaceId);
            setMessages(Message.fromApiList(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [spaceId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const sendMessage = async (messageData) => {
        const newMessage = await api.messages.send(spaceId, messageData);
        const msgModel = Message.fromApi(newMessage);
        setMessages(prev => [...prev, msgModel]);
        return msgModel;
    };

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages,
        sendMessage
    };
}

// ============ FILES HOOK ============
export function useSpaceFiles(spaceId) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = useCallback(async () => {
        if (!spaceId) return;
        try {
            setLoading(true);
            const data = await api.files.getBySpace(spaceId);
            setFiles(SpaceFile.fromApiList(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [spaceId]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const uploadFile = async (fileData) => {
        const newFile = await api.files.upload(spaceId, fileData);
        setFiles(prev => [newFile, ...prev]);
        return newFile;
    };

    return {
        files,
        loading,
        error,
        refetch: fetchFiles,
        uploadFile
    };
}

// ============ NOTIFICATIONS HOOK ============
export function useNotifications(userId) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const data = await api.notifications.getAll(userId);
            setNotifications(Notification.fromApiList(data));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markRead = async (id) => {
        await api.notifications.markRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = async () => {
        await api.notifications.markAllRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        loading,
        error,
        unreadCount,
        refetch: fetchNotifications,
        markRead,
        markAllRead
    };
}

// ============ AUTH HOOK ============
export function useAuth() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('collabspace_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const userData = await api.auth.login({ email, password });
            setUser(userData);
            localStorage.setItem('collabspace_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);
            const userData = await api.auth.register({ name, email, password });
            setUser(userData);
            localStorage.setItem('collabspace_user', JSON.stringify(userData));
            return userData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('collabspace_user');
    };

    const updateProfile = async (data) => {
        if (!user) return;
        const updated = await api.users.update(user.id, data);
        setUser(updated);
        localStorage.setItem('collabspace_user', JSON.stringify(updated));
        return updated;
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
    };
}
