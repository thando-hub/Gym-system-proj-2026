// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on page refresh
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                // Stored value was malformed — clear it and start unauthenticated
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await API.post('/Auth/login', { email, password });
            const data = response.data;

            const loggedInUser = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                roles: data.roles,
            };

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            setUser(loggedInUser);

            return {
                success: true,
                role: data.roles?.[0],   // "Admin" | "PersonalTrainer" | "GymMember"
            };
        } catch (err) {
            console.error('Login error:', err);
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed. Please try again.',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);