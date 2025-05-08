import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://localhost:8080/api/v1/user'; // For local development

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const userInfo = await SecureStore.getItemAsync('userInfo');
        
        if (token && userInfo) {
          setUserToken(token);
          setUserInfo(JSON.parse(userInfo));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.log('Error restoring token', e);
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
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      setUserToken(token);
      setUserInfo(user);
      
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the backend server. Please make sure the backend is running.';
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
      const response = await axios.post(`${API_URL}/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the backend server. Please make sure the backend is running.';
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
    setUserToken(null);
    setUserInfo(null);
    axios.defaults.headers.common['Authorization'] = '';
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userInfo');
    setIsLoading(false);
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.put(`${API_URL}/update`, userData);
      
      const updatedUser = response.data.user;
      setUserInfo(updatedUser);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUser));
      
      return { success: true, data: updatedUser };
    } catch (error) {
      let message;
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        message = 'Cannot connect to the backend server. Please make sure the backend is running.';
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
