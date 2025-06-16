import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

export const AuthContext = createContext();

// Storage implementation that works on both web and native
const storage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
};

// Get API URL based on environment
export const getApiUrl = () => {
  // For development on physical device
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  // For development on emulator/web
  if (__DEV__) {
    if (Platform.OS === 'web') {
      // Use localhost for web development
      return 'http://localhost:8080/api/v1/user';
    } else {
      // Use your computer's local IP address for mobile development
      return 'http://192.168.0.117:8080/api/v1/user';
    }
  }
  
  // For production
  return 'https://your-production-api.com/api/v1/user'; // Replace with your production API URL
};

const API_URL = getApiUrl();

// Create axios instance with custom config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure credentials are included in cross-origin requests
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Add request interceptor to handle token and ensure credentials
api.interceptors.request.use(
  async (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;
    
    const token = await storage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await storage.removeItem('userToken');
      await storage.removeItem('userInfo');
      // You might want to trigger a logout here
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      try {
        const token = await storage.getItem('userToken');
        const userInfo = await storage.getItem('userInfo');
        
        if (token && userInfo) {
          setUserToken(token);
          setUserInfo(JSON.parse(userInfo));
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.log('Error restoring token', e);
        // Clear any invalid tokens
        await storage.removeItem('userToken');
        await storage.removeItem('userInfo');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      if (token && user) {
        setUserToken(token);
        setUserInfo(user);
        
        // Store token and user info securely
        await storage.setItem('userToken', token);
        await storage.setItem('userInfo', JSON.stringify(user));
        
        // Set the token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the server. Please check your internet connection.';
      } else {
        message = error.response?.data?.error || 'Login failed. Please try again.';
      }
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the server. Please check your internet connection.';
      } else {
        message = error.response?.data?.error || 'Registration failed. Please try again.';
      }
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear token from axios headers
      delete api.defaults.headers.common['Authorization'];
      
      // Clear storage
      await storage.removeItem('userToken');
      await storage.removeItem('userInfo');
      
      // Clear state
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.put('/update', userData);
      
      const updatedUser = response.data.user;
      setUserInfo(updatedUser);
      await storage.setItem('userInfo', JSON.stringify(updatedUser));
      
      return { success: true, data: updatedUser };
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the server. Please check your internet connection.';
      } else {
        message = error.response?.data?.error || 'Update failed. Please try again.';
      }
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
