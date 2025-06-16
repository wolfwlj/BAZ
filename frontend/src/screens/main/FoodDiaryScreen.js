import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { 
  getActiveNutritionGoal, 
  checkGoalProgress, 
  getNutrilogsByUserAndDate 
} from '../../services/NutritionGoalService';
import { 
  calculateDailyCalories, 
  calculateDailyNutrients, 
  formatDate
} from '../../utils/helpers';

import NutrientProgressBar from '../../components/NutrientProgressBar';
import MealCard from '../../components/MealCard';

const FoodDiaryScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [nutritionGoal, setNutritionGoal] = useState(null);
  const [todayNutrilogs, setTodayNutrilogs] = useState([]);
  const [goalProgress, setGoalProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const fetchData = async () => {
    if (!userInfo?.ID) return;
    
    setIsLoading(true);
    
    try {
      // Get nutrition goal
      const goalResponse = await getActiveNutritionGoal(userInfo.ID);
      if (goalResponse.success) {
        setNutritionGoal(goalResponse.data.nutrition_goal);
      }
      
      // Get today's nutrilogs
      const nutrilogsResponse = await getNutrilogsByUserAndDate(userInfo.ID, selectedDate);
      if (nutrilogsResponse.success) {
        setTodayNutrilogs(nutrilogsResponse.data.nutrilogs || []);
      }
      
      // Check goal progress
      const progressResponse = await checkGoalProgress(userInfo.ID);
      if (progressResponse.success) {
        setGoalProgress(progressResponse.data);
        
        // Show congratulations if goals were increased
        if (progressResponse.data.goals_increased) {
          Alert.alert(
            'Gefeliciteerd! 🎉',
            'Je hebt je voedingsdoelen 7 dagen op rij behaald! Je doelen zijn verhoogd met 5% om je verder uit te dagen.',
            [{ text: 'Geweldig!', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    setIsLoading(false);
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [userInfo?.ID, selectedDate]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  
  const dailyCalories = calculateDailyCalories(todayNutrilogs);
  const dailyNutrients = calculateDailyNutrients(todayNutrilogs);
  
  const goals = nutritionGoal || {
    calories_goal: 2000,
    proteins_goal: 75,
    fats_goal: 65,
    carbs_goal: 250
  };
  
  const caloriesRemaining = goals.calories_goal - dailyCalories;
  const proteinsRemaining = goals.proteins_goal - dailyNutrients.proteins;
  const fatsRemaining = goals.fats_goal - dailyNutrients.fats;
  const carbsRemaining = goals.carbs_goal - dailyNutrients.carbohydrates;
  
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  
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
            <Text style={styles.title}>Eetdagboek</Text>
            <Text style={styles.date}>{formatDate(new Date(selectedDate))}</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('NutritionGoalSettings')}
          >
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        {goalProgress && goalProgress.consecutive_days > 0 && (
          <View style={styles.achievementBanner}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.achievementText}>
              {goalProgress.consecutive_days} dagen op rij doelen behaald! 🔥
            </Text>
          </View>
        )}
        
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Dagelijkse Voortgang</Text>
          
          <View style={styles.caloriesSummary}>
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesTitle}>Geconsumeerd</Text>
              <Text style={styles.caloriesValue}>{dailyCalories}</Text>
              <Text style={styles.caloriesLabel}>kcal</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesTitle}>Nog nodig</Text>
              <Text style={[
                styles.caloriesValue, 
                caloriesRemaining < 0 ? styles.caloriesExceeded : styles.caloriesRemaining
              ]}>
                {Math.max(0, caloriesRemaining)}
              </Text>
              <Text style={styles.caloriesLabel}>kcal</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voedingsstoffen Voortgang</Text>
          
          <NutrientProgressBar 
            label="Calorieën" 
            current={dailyCalories} 
            goal={goals.calories_goal} 
            unit="kcal"
            color="#FF9800"
            remaining={Math.max(0, caloriesRemaining)}
          />
          
          <NutrientProgressBar 
            label="Eiwitten" 
            current={dailyNutrients.proteins} 
            goal={goals.proteins_goal} 
            unit="g"
            color="#4CAF50"
            remaining={Math.max(0, proteinsRemaining)}
          />
          
          <NutrientProgressBar 
            label="Koolhydraten" 
            current={dailyNutrients.carbohydrates} 
            goal={goals.carbs_goal} 
            unit="g"
            color="#2196F3"
            remaining={Math.max(0, carbsRemaining)}
          />
          
          <NutrientProgressBar 
            label="Vetten" 
            current={dailyNutrients.fats} 
            goal={goals.fats_goal} 
            unit="g"
            color="#F44336"
            remaining={Math.max(0, fatsRemaining)}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isToday ? "Vandaag's Maaltijden" : "Maaltijden"}
            </Text>
            {isToday && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('LogMeal')}
              >
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                <Text style={styles.addButtonText}>Voeg toe</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {todayNutrilogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                {isToday 
                  ? "Nog geen maaltijden gelogd vandaag. Voeg je eerste maaltijd toe!"
                  : "Geen maaltijden gevonden voor deze datum."
                }
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
        
        {goalProgress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doel Status</Text>
            <View style={styles.goalStatus}>
              <View style={styles.goalStatusItem}>
                <Ionicons 
                  name={goalProgress.goal_achieved ? "checkmark-circle" : "time-outline"} 
                  size={24} 
                  color={goalProgress.goal_achieved ? "#4CAF50" : "#FF9800"} 
                />
                <Text style={styles.goalStatusText}>
                  {goalProgress.goal_achieved ? "Doel behaald vandaag!" : "Doel nog niet behaald"}
                </Text>
              </View>
              
              {goalProgress.consecutive_days > 0 && (
                <View style={styles.goalStatusItem}>
                  <Ionicons name="flame" size={24} color="#FF5722" />
                  <Text style={styles.goalStatusText}>
                    {goalProgress.consecutive_days} dagen streak
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  settingsButton: {
    padding: 8,
  },
  achievementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  achievementText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  caloriesSummary: {
    flexDirection: 'row',
    marginTop: 12,
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
  caloriesRemaining: {
    color: '#FF9800',
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
    marginBottom: 16,
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
    marginTop: 8,
  },
  goalStatus: {
    marginTop: 8,
  },
  goalStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default FoodDiaryScreen;
