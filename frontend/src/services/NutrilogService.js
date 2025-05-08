import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/user'; // For local development

export const createNutrilog = async (nutrilogData) => {
  try {
    const response = await axios.post(`${API_URL}/createnutrilog`, nutrilogData);
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
    const response = await axios.get(`${API_URL}/getnutrilog/${id}`);
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
    const response = await axios.get(`${API_URL}/getallnutrilogs`);
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
    const response = await axios.put(`${API_URL}/updatenutrilog/${id}`, nutrilogData);
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
    const response = await axios.delete(`${API_URL}/deletenutrilog/${id}`);
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
