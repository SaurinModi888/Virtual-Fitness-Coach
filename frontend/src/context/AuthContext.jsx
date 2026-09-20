import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fitness_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fitness_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getProfile();
      setUser(res.data);
      localStorage.setItem('fitness_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to load profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authAPI.login(credentials);
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('fitness_token', access_token);
      localStorage.setItem('fitness_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      const { access_token, user: newUser } = res.data;
      setToken(access_token);
      setUser(newUser);
      localStorage.setItem('fitness_token', access_token);
      localStorage.setItem('fitness_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileData);
      setUser(res.data.user);
      localStorage.setItem('fitness_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        updateProfile,
        logout,
        refreshProfile: fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
