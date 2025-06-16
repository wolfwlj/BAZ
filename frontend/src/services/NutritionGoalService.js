const API_BASE_URL = 'http://localhost:8080/api';

export const createNutritionGoal = async (goalData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/createnutritiongoal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to create nutrition goal' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getActiveNutritionGoal = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getnutritiongoal/${userId}`);
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to get nutrition goal' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateNutritionGoal = async (goalId, goalData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updatenutritiongoal/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to update nutrition goal' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkGoalProgress = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkgoalprogress/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to check goal progress' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getNutrilogsByUserAndDate = async (userId, date = null) => {
  try {
    const url = date 
      ? `${API_BASE_URL}/getnutrilogs/${userId}?date=${date}`
      : `${API_BASE_URL}/getnutrilogs/${userId}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to get nutrilogs' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
