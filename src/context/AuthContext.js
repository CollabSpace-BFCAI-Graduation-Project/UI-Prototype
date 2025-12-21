import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for saved session
        const savedUser = localStorage.getItem('collabspace_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem('collabspace_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock login - in real app, call API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password.length >= 4) {
                    const mockUser = {
                        id: 1,
                        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        email,
                        initials: email.substring(0, 2).toUpperCase(),
                        avatarColor: '#3b82f6',
                        role: 'Owner',
                        bio: ''
                    };
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('collabspace_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };

    const signup = async (name, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password.length >= 4) {
                    const mockUser = {
                        id: Date.now(),
                        name,
                        email,
                        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        avatarColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
                        role: 'Member',
                        bio: ''
                    };
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('collabspace_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Please fill all fields'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('collabspace_user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            login,
            signup,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
