import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setCurrentUser(parsedUser);
      
      // Set auth token for API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users', userData);
      
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        // Set auth token for API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`;
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Registration failed. Please try again.';
      setError(message);
      throw error;
    }
  };

  // Login user
  const login = async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/users/login', { phone, password });
      
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        // Set auth token for API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.user.token}`;
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please check your credentials.';
      setError(message);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
    
    // Remove auth token
    delete api.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put('/api/users/profile', userData);
      
      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Profile update failed. Please try again.';
      setError(message);
      throw error;
    }
  };

  // Get user profile
  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/users/profile');
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      const message = 
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to fetch profile. Please try again.';
      setError(message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        getProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

