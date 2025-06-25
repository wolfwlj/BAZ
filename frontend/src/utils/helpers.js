// Chart types
export const CHART_TYPES = {
  CALORIES: 'calories',
  NUTRIENTS: 'nutrients',
  MACROS: 'macros'
};

// Time periods for filtering data
export const TIME_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

// Chart colors
export const CHART_COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  tertiary: '#FFC107',
  background: '#FFFFFF',
  text: '#000000',
  grid: '#E0E0E0'
};

// Format date to display in a user-friendly way
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate total calories for a day
export const calculateDailyCalories = (nutrilogs) => {
  return nutrilogs.reduce((total, log) => total + log.calories, 0);
};

// Calculate total nutrients for a day
export const calculateDailyNutrients = (nutrilogs) => {
  return nutrilogs.reduce(
    (totals, log) => {
      return {
        proteins: totals.proteins + log.proteins,
        fats: totals.fats + log.fats,
        carbohydrates: totals.carbohydrates + log.carbohydrates,
      };
    },
    { proteins: 0, fats: 0, carbohydrates: 0 }
  );
};

// Group nutrilogs by date
export const groupByDate = (nutrilogs) => {
  const grouped = {};
  
  nutrilogs.forEach(log => {
    const date = log.meal_date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(log);
  });
  
  return grouped;
};

// Calculate streak (consecutive days with entries)
export const calculateStreak = (nutrilogs) => {
  if (!nutrilogs || nutrilogs.length === 0) return 0;
  
  // Sort logs by date (newest first)
  const sortedDates = [...new Set(nutrilogs.map(log => log.meal_date))]
    .sort((a, b) => new Date(b) - new Date(a));
  
  if (sortedDates.length === 0) return 0;
  
  // Check if today has an entry
  const today = new Date().toISOString().split('T')[0];
  const mostRecentDate = new Date(sortedDates[0]).toISOString().split('T')[0];
  
  // If most recent entry is not today or yesterday, streak is broken
  if (today !== mostRecentDate && 
      new Date(today) - new Date(mostRecentDate) > 24 * 60 * 60 * 1000) {
    return 0;
  }
  
  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i + 1]);
    
    // Check if dates are consecutive
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Get meal type icon
export const getMealTypeIcon = (mealType) => {
  switch (mealType.toLowerCase()) {
    case 'breakfast':
      return 'coffee';
    case 'lunch':
      return 'hamburger';
    case 'dinner':
      return 'food-variant';
    case 'snack':
      return 'food-apple';
    default:
      return 'food';
  }
};

// Calculate progress towards daily goals
export const calculateProgress = (current, goal) => {
  if (!goal) return 0;
  const progress = (current / goal) * 100;
  return Math.min(progress, 100); // Cap at 100%
};
