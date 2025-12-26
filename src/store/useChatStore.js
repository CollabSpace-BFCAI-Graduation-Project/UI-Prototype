import { create } from 'zustand';
import api from '../services/api';
import { Message } from '../models';
import { INITIAL_CHAT_HISTORY } from '../data/mockData';

/**
 * Chat Store
 * Manages chat messages and active chat space
 */
const useChatStore = create((set, get) => ({
    // State
    activeChatSpace: null,
    messages: [],
    localChatHistory: INITIAL_CHAT_HISTORY,
    chatInput: '',
    loading: false,
    error: null,

    // Actions
    setActiveChatSpace: (space) => {
        set({ activeChatSpace: space, messages: [] });
        if (space) {
            get().fetchMessages(space.id);
        }
    },

    clearActiveChatSpace: () => set({ activeChatSpace: null, messages: [] }),

    setChatInput: (input) => set({ chatInput: input }),

    // Fetch messages for a space
    fetchMessages: async (spaceId) => {
        if (!spaceId) return;

        set({ loading: true });
        try {
            const data = await api.messages.getBySpace(spaceId);
            const messages = Message.fromApiList(data);
            set({ messages, loading: false });
            return messages;
        } catch (err) {
            // Fallback to local history
            const { localChatHistory } = get();
            const localMessages = localChatHistory[spaceId] || [];
            set({ messages: localMessages, loading: false });
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        const { activeChatSpace, messages, localChatHistory } = get();
        if (!activeChatSpace) return;

        const newMessage = {
            id: Date.now(),
            ...messageData,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await api.messages.send(activeChatSpace.id, messageData);
            const apiMessage = Message.fromApi(response);
            set({ messages: [...messages, apiMessage] });
            return apiMessage;
        } catch (err) {
            // Fallback to local state
            set({
                messages: [...messages, newMessage],
                localChatHistory: {
                    ...localChatHistory,
                    [activeChatSpace.id]: [...(localChatHistory[activeChatSpace.id] || []), newMessage]
                }
            });
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

    // Get current messages (API or local)
    getCurrentMessages: () => {
        const { activeChatSpace, messages, localChatHistory } = get();
        if (!activeChatSpace) return [];

        if (messages.length > 0) return messages;
        return localChatHistory[activeChatSpace.id] || [];
    },
}));

export default useChatStore;
