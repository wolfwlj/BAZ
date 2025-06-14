import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/user'; // For local development

export const createMotivationalMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}/createmotivationalmessage`, messageData);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to create motivational message. Please try again.';
    }
    return { success: false, message };
  }
};

export const getMotivationalMessagesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getmotivationalmessages/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to fetch motivational messages. Please try again.';
    }
    return { success: false, message };
  }
};

export const getUnreadMotivationalMessagesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/getunreadmotivationalmessages/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to fetch unread motivational messages. Please try again.';
    }
    return { success: false, message };
  }
};

export const getTimedMotivationalMessages = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/gettimedmotivationalmessages/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to fetch timed motivational messages. Please try again.';
    }
    return { success: false, message };
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axios.put(`${API_URL}/markmessageasread/${messageId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to mark message as read. Please try again.';
    }
    return { success: false, message };
  }
};

export const deleteMotivationalMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${API_URL}/deletemotivationalmessage/${messageId}`);
    return { success: true, data: response.data };
  } catch (error) {
    let message;
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      message = 'Cannot connect to the backend server. Please make sure the backend is running.';
    } else {
      message = error.response?.data?.error || 'Failed to delete motivational message. Please try again.';
    }
    return { success: false, message };
  }
};
