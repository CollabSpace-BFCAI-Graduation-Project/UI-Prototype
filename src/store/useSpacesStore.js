import { create } from 'zustand';
import api from '../services/api';
import { Space } from '../models';

/**
 * Spaces Store
 * Manages spaces, active space, favorites, and filters
 */
const useSpacesStore = create((set, get) => ({
    // State
    spaces: [],
    activeSpace: null,
    userFavorites: [],
    loading: false,
    error: null,

    // Filter state
    activeTab: 'all',
    activeCategory: 'all',
    activeStatus: 'all',
    searchQuery: '',
    viewMode: 'grid',

    // Actions
    setActiveSpace: (space) => set({ activeSpace: space }),
    clearActiveSpace: () => set({ activeSpace: null }),

    // Fetch all spaces
    fetchSpaces: async () => {
        set({ loading: true, error: null });
        try {
            const data = await api.spaces.getAll();
            const spaces = Space.fromApiList(data);
            set({ spaces, loading: false });
            return spaces;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    // Create a new space
    createSpace: async (spaceData) => {
        try {
            const newSpace = await api.spaces.create(spaceData);
            const spaceModel = Space.fromApi(newSpace);
            set((state) => ({ spaces: [...state.spaces, spaceModel] }));
            return spaceModel;
        } catch (err) {
            throw err;
        }
    },

    // Update a space
    updateSpace: async (spaceId, updates) => {
        try {
            const updated = await api.spaces.update(spaceId, updates);
            set((state) => ({
                spaces: state.spaces.map(s => s.id === spaceId ? Space.fromApi(updated) : s),
                activeSpace: state.activeSpace?.id === spaceId ? Space.fromApi(updated) : state.activeSpace
            }));
            return updated;
        } catch (err) {
            throw err;
        }
    },

    // Delete a space
    deleteSpace: async (spaceId) => {
        try {
            await api.spaces.delete(spaceId);
            set((state) => ({
                spaces: state.spaces.filter(s => s.id !== spaceId),
                activeSpace: state.activeSpace?.id === spaceId ? null : state.activeSpace
            }));
        } catch (err) {
            throw err;
        }
    },

    // Favorites
    fetchFavorites: async (userId) => {
        try {
            const favs = await api.users.getFavorites(userId);
            set({ userFavorites: favs });
        } catch (err) {
            console.log('Could not fetch favorites');
        }
    },

    toggleFavorite: async (userId, spaceId) => {
        try {
            const result = await api.users.toggleFavorite(userId, spaceId);
            set((state) => ({
                userFavorites: result.isFavorite
                    ? [...state.userFavorites, spaceId]
                    : state.userFavorites.filter(id => id !== spaceId)
            }));
            return result;
        } catch (err) {
            // Optimistic toggle for offline support
            set((state) => ({
                userFavorites: state.userFavorites.includes(spaceId)
                    ? state.userFavorites.filter(id => id !== spaceId)
                    : [...state.userFavorites, spaceId]
            }));
        }
    },

    // Filters
    setActiveTab: (tab) => set({ activeTab: tab }),
    setActiveCategory: (category) => set({ activeCategory: category }),
    setActiveStatus: (status) => set({ activeStatus: status }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setViewMode: (mode) => set({ viewMode: mode }),

    // Get filtered spaces
    getFilteredSpaces: () => {
        const { spaces, activeTab, activeCategory, activeStatus, searchQuery, userFavorites } = get();

        return spaces.filter(space => {
            const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
            let matchesTab = true;
            if (activeTab === 'favorites') matchesTab = userFavorites.includes(space.id);
            let matchesCategory = true;
            if (activeCategory !== 'all') matchesCategory = space.category === activeCategory;
            let matchesStatus = true;
            if (activeStatus === 'online') matchesStatus = space.isOnline === true;
            if (activeStatus === 'offline') matchesStatus = space.isOnline === false;
            return matchesSearch && matchesTab && matchesCategory && matchesStatus;
        });
    },
}));

export default useSpacesStore;
