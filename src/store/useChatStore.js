import { create } from 'zustand';
import api from '../services/api';
import { Message } from '../models';
import { INITIAL_CHAT_HISTORY } from '../data/mockData';

/**
 * Chat Store
 * Manages chat channels, messages and active chat space
 */
const useChatStore = create((set, get) => ({
    // State
    activeChatSpace: null,
    channels: [],
    activeChannel: null,
    messages: [],
    localChatHistory: INITIAL_CHAT_HISTORY,
    chatInput: '',
    loading: false,
    error: null,

    // Actions
    setActiveChatSpace: async (space) => {
        set({ activeChatSpace: space, channels: [], activeChannel: null, messages: [] });
        if (space) {
            await get().fetchChannels(space.id);
        }
    },

    clearActiveChatSpace: () => set({ activeChatSpace: null, channels: [], activeChannel: null, messages: [] }),

    setChatInput: (input) => set({ chatInput: input }),

    // Fetch channels for a space
    fetchChannels: async (spaceId) => {
        if (!spaceId) return;
        set({ loading: true });
        try {
            const data = await api.channels.getBySpace(spaceId);
            set({ channels: data, loading: false });
            // Auto-select first channel (usually "general")
            if (data.length > 0) {
                get().setActiveChannel(data[0]);
            }
            return data;
        } catch (err) {
            console.error('Failed to fetch channels:', err);
            set({ channels: [], loading: false });
        }
    },

    // Set active channel and fetch its messages
    setActiveChannel: (channel) => {
        set({ activeChannel: channel, messages: [] });
        if (channel) {
            get().fetchMessages(channel.id);
        }
    },

    // Create a new channel
    createChannel: async (name, description, createdBy) => {
        const { activeChatSpace, channels } = get();
        if (!activeChatSpace) return;

        try {
            const newChannel = await api.channels.create(activeChatSpace.id, {
                name,
                description,
                createdBy
            });
            set({ channels: [...channels, newChannel] });
            return newChannel;
        } catch (err) {
            console.error('Failed to create channel:', err);
            throw err;
        }
    },

    // Update a channel
    updateChannel: async (channelId, name, description) => {
        const { channels } = get();
        try {
            const updated = await api.channels.update(channelId, { name, description });
            set({ channels: channels.map(c => c.id === channelId ? { ...c, name, description } : c) });
            return updated;
        } catch (err) {
            console.error('Failed to update channel:', err);
            throw err;
        }
    },

    // Delete a channel
    deleteChannel: async (channelId) => {
        const { channels, activeChannel } = get();
        try {
            await api.channels.delete(channelId);
            const remaining = channels.filter(c => c.id !== channelId);
            set({ channels: remaining });
            // If deleted channel was active, switch to first available
            if (activeChannel?.id === channelId && remaining.length > 0) {
                get().setActiveChannel(remaining[0]);
            }
        } catch (err) {
            console.error('Failed to delete channel:', err);
            throw err;
        }
    },

    // Fetch messages for a channel
    fetchMessages: async (channelId) => {
        if (!channelId) return;

        set({ loading: true });
        try {
            const data = await api.messages.getByChannel(channelId);
            const messages = Message.fromApiList(data);
            set({ messages, loading: false });
            return messages;
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            set({ messages: [], loading: false });
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        const { activeChatSpace, activeChannel, messages } = get();
        if (!activeChatSpace || !activeChannel) return;

        const newMessage = {
            id: Date.now(),
            ...messageData,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await api.messages.send(activeChannel.id, {
                ...messageData,
                spaceId: activeChatSpace.id
            });
            const apiMessage = Message.fromApi(response);
            set({ messages: [...messages, apiMessage] });
            return apiMessage;
        } catch (err) {
            // Fallback to local state
            set({ messages: [...messages, newMessage] });
            return newMessage;
        }
    },

    updateMessage: async (id, text, senderId) => {
        const { messages } = get();
        try {
            const updated = await api.messages.update(id, text, senderId);
            const apiMessage = Message.fromApi(updated);
            set({
                messages: messages.map(m => m.id === id ? apiMessage : m)
            });
            return apiMessage;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    deleteMessage: async (id, senderId) => {
        const { messages } = get();
        try {
            const response = await api.messages.delete(id, senderId);
            // Soft delete: mark message as deleted in local state
            set({
                messages: messages.map(m => m.id === id ? {
                    ...m,
                    deletedAt: new Date().toISOString(),
                    deletedBy: senderId,
                    deletedByRole: response.deletedByRole
                } : m)
            });
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // Get current messages
    getCurrentMessages: () => {
        const { messages } = get();
        return messages;
    },
}));

export default useChatStore;

