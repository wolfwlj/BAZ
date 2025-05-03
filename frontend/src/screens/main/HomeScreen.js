import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { getAllNutrilogs } from '../../services/NutrilogService';
import { 
  calculateDailyCalories, 
  calculateDailyNutrients, 
  groupByDate, 
  calculateStreak,
  formatDate
} from '../../utils/helpers';

import NutrientProgressBar from '../../components/NutrientProgressBar';
import MealCard from '../../components/MealCard';
import StreakDisplay from '../../components/StreakDisplay';

// Daily nutrient goals (these could be personalized per user in a real app)
const DAILY_GOALS = {
  calories: 2000,
  proteins: 75,
  carbohydrates: 250,
  fats: 65
};

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [nutrilogs, setNutrilogs] = useState([]);
  const [todayNutrilogs, setTodayNutrilogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const fetchNutrilogs = async () => {
    setIsLoading(true);
    const response = await getAllNutrilogs();
    
    if (response.success) {
      const logs = response.data.nutrilogs || [];
      setNutrilogs(logs);
      
      // Get today's logs
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter(log => log.meal_date === today);
      setTodayNutrilogs(todayLogs);
      
      // Calculate streak
      const userStreak = calculateStreak(logs);
      setStreak(userStreak);
    }
    
    setIsLoading(false);
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchNutrilogs();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchNutrilogs();
  };
  
  const dailyCalories = calculateDailyCalories(todayNutrilogs);
  const dailyNutrients = calculateDailyNutrients(todayNutrilogs);
  
  const caloriesRemaining = DAILY_GOALS.calories - dailyCalories;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userInfo?.username || 'User'}</Text>
            <Text style={styles.date}>{formatDate(new Date())}</Text>
          </View>
        </View>
        
        <StreakDisplay streak={streak} />
        
        <View style={styles.caloriesSummary}>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesTitle}>Today's Calories</Text>
            <Text style={styles.caloriesValue}>{dailyCalories}</Text>
            <Text style={styles.caloriesLabel}>consumed</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesTitle}>Remaining</Text>
            <Text style={[
              styles.caloriesValue, 
              caloriesRemaining < 0 ? styles.caloriesExceeded : null
            ]}>
              {caloriesRemaining}
            </Text>
            <Text style={styles.caloriesLabel}>calories</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Progress</Text>
          
          <NutrientProgressBar 
            label="Calories" 
            current={dailyCalories} 
            goal={DAILY_GOALS.calories} 
            unit="kcal"
            color="#FF9800"
          />
          
          <NutrientProgressBar 
            label="Protein" 
            current={dailyNutrients.proteins} 
            goal={DAILY_GOALS.proteins} 
            color="#4CAF50"
          />
          
          <NutrientProgressBar 
            label="Carbs" 
            current={dailyNutrients.carbohydrates} 
            goal={DAILY_GOALS.carbohydrates} 
            color="#2196F3"
          />
          
          <NutrientProgressBar 
            label="Fat" 
            current={dailyNutrients.fats} 
            goal={DAILY_GOALS.fats} 
            color="#F44336"
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('LogMeal')}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.addButtonText}>Add Meal</Text>
            </TouchableOpacity>
          </View>
          
          {todayNutrilogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No meals logged today. Tap "Add Meal" to log your first meal!
              </Text>
            </View>
          ) : (
            todayNutrilogs.map(meal => (
              <MealCard 
                key={meal.ID} 
                meal={meal} 
                onPress={() => navigation.navigate('MealDetail', { mealId: meal.ID })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  caloriesSummary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  caloriesContainer: {
    flex: 1,
    alignItems: 'center',
  },
  caloriesTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  caloriesExceeded: {
    color: '#F44336',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HomeScreen;
