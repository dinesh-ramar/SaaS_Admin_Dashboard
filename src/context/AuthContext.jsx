import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted auth
        const storedUser = localStorage.getItem('saas_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.warn("Session data corrupted, clearing...", err);
                localStorage.removeItem('saas_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // Mock authentication
        // In real app, this calls api.post('/login')
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'admin') {
                    const userData = {
                        id: 1,
                        name: 'Admin User',
                        email: 'admin@saas.com',
                        role: 'admin',
                        token: 'mock-jwt-token-123' // Mock token
                    };
                    setUser(userData);
                    localStorage.setItem('saas_user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('saas_user');
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
