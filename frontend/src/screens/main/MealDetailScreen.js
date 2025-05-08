import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getNutrilogById, deleteNutrilog } from '../../services/NutrilogService';
import { getMealTypeIcon, formatDate } from '../../utils/helpers';
import NutrientProgressBar from '../../components/NutrientProgressBar';
import CustomButton from '../../components/CustomButton';

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMealDetails();
  }, []);
  
  const fetchMealDetails = async () => {
    setIsLoading(true);
    const response = await getNutrilogById(mealId);
    
    if (response.success) {
      setMeal(response.data.nutrilog);
    } else {
      Alert.alert('Error', 'Failed to load meal details');
      navigation.goBack();
    }
    
    setIsLoading(false);
  };
  
  const handleEdit = () => {
    navigation.navigate('EditMeal', { meal });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this meal log?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: confirmDelete,
          style: 'destructive'
        }
      ]
    );
  };
  
  const confirmDelete = async () => {
    setIsLoading(true);
    const response = await deleteNutrilog(mealId);
    
    if (response.success) {
      Alert.alert('Success', 'Meal log deleted successfully');
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', response.message || 'Failed to delete meal log');
    }
    
    setIsLoading(false);
  };
  
  if (isLoading || !meal) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading meal details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.mealTypeContainer}>
            <MaterialCommunityIcons 
              name={getMealTypeIcon(meal.meal_type)} 
              size={32} 
              color="#4CAF50" 
            />
            <Text style={styles.mealType}>{meal.meal_type}</Text>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTime}>
              {formatDate(meal.meal_date)} at {meal.meal_time}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Information</Text>
          
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesLabel}>Total Calories</Text>
            <Text style={styles.caloriesValue}>{meal.calories} kcal</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.macroIconText}>P</Text>
              </View>
              <Text style={styles.macroValue}>{meal.proteins}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.macroIconText}>C</Text>
              </View>
              <Text style={styles.macroValue}>{meal.carbohydrates}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: '#F44336' }]}>
                <Text style={styles.macroIconText}>F</Text>
              </View>
              <Text style={styles.macroValue}>{meal.fats}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
          
          <View style={styles.nutritionProgress}>
            <NutrientProgressBar 
              label="Protein" 
              current={meal.proteins} 
              goal={75} 
              color="#4CAF50"
            />
            
            <NutrientProgressBar 
              label="Carbohydrates" 
              current={meal.carbohydrates} 
              goal={250} 
              color="#2196F3"
            />
            
            <NutrientProgressBar 
              label="Fat" 
              current={meal.fats} 
              goal={65} 
              color="#F44336"
            />
          </View>
        </View>
        
        {meal.meal_description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{meal.meal_description}</Text>
          </View>
        ) : null}
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Edit Meal"
            onPress={handleEdit}
            style={{ flex: 1, marginRight: 8 }}
          />
          
          <CustomButton
            title="Delete"
            onPress={handleDelete}
            type="secondary"
            style={{ flex: 1, marginLeft: 8 }}
            textStyle={{ color: '#F44336' }}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 16,
    color: '#666',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutritionProgress: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});

export default MealDetailScreen;
