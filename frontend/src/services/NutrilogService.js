import axios from 'axios';
import { getApiUrl } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = getApiUrl();

// Create axios instance with the same configuration as AuthContext
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Add request interceptor to handle token
api.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    let token;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createNutrilog = async (nutrilogData) => {
  try {
    const response = await api.post('/createnutrilog', nutrilogData);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to create nutrilog. Please try again.';
    }
    return { success: false, message };
  }
};

export const getNutrilogById = async (id) => {
  try {
    const response = await api.get(`/getnutrilog/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to fetch nutrilog. Please try again.';
    }
    return { success: false, message };
  }
};

export const getAllNutrilogs = async () => {
  try {
    const response = await api.get('/getallnutrilogs');
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to fetch nutrilogs. Please try again.';
    }
    return { success: false, message };
  }
};

export const updateNutrilog = async (id, nutrilogData) => {
  try {
    const response = await api.put(`/updatenutrilog/${id}`, nutrilogData);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to update nutrilog. Please try again.';
    }
    return { success: false, message };
  }
};

export const deleteNutrilog = async (id) => {
  try {
    const response = await api.delete(`/deletenutrilog/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to delete nutrilog. Please try again.';
    }
    return { success: false, message };
  }
};
