import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateNutrilog } from '../../services/NutrilogService';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const EditMealScreen = ({ route, navigation }) => {
  const { meal } = route.params;
  
  const [calories, setCalories] = useState(meal.calories.toString());
  const [proteins, setProteins] = useState(meal.proteins.toString());
  const [fats, setFats] = useState(meal.fats.toString());
  const [carbohydrates, setCarbohydrates] = useState(meal.carbohydrates.toString());
  const [mealType, setMealType] = useState(meal.meal_type);
  const [mealDescription, setMealDescription] = useState(meal.meal_description || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const [caloriesError, setCaloriesError] = useState('');
  const [proteinsError, setProteinsError] = useState('');
  const [fatsError, setFatsError] = useState('');
  const [carbohydratesError, setCarbohydratesError] = useState('');
  const [mealTypeError, setMealTypeError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    // Calories validation
    if (!calories) {
      setCaloriesError('Calories are required');
      isValid = false;
    } else if (isNaN(calories) || parseInt(calories) < 0) {
      setCaloriesError('Please enter a valid number');
      isValid = false;
    } else {
      setCaloriesError('');
    }
    
    // Proteins validation
    if (!proteins) {
      setProteinsError('Protein amount is required');
      isValid = false;
    } else if (isNaN(proteins) || parseInt(proteins) < 0) {
      setProteinsError('Please enter a valid number');
      isValid = false;
    } else {
      setProteinsError('');
    }
    
    // Fats validation
    if (!fats) {
      setFatsError('Fat amount is required');
      isValid = false;
    } else if (isNaN(fats) || parseInt(fats) < 0) {
      setFatsError('Please enter a valid number');
      isValid = false;
    } else {
      setFatsError('');
    }
    
    // Carbohydrates validation
    if (!carbohydrates) {
      setCarbohydratesError('Carbohydrate amount is required');
      isValid = false;
    } else if (isNaN(carbohydrates) || parseInt(carbohydrates) < 0) {
      setCarbohydratesError('Please enter a valid number');
      isValid = false;
    } else {
      setCarbohydratesError('');
    }
    
    // Meal type validation
    if (!mealType) {
      setMealTypeError('Please select a meal type');
      isValid = false;
    } else {
      setMealTypeError('');
    }
    
    return isValid;
  };
  
  const handleUpdateMeal = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      const nutrilogData = {
        calories: parseInt(calories),
        proteins: parseInt(proteins),
        fats: parseInt(fats),
        carbohydrates: parseInt(carbohydrates),
        meal_type: mealType,
        meal_time: meal.meal_time,
        meal_date: meal.meal_date,
        meal_description: mealDescription,
        user_id: meal.user_id
      };
      
      const response = await updateNutrilog(meal.ID, nutrilogData);
      
      setIsLoading(false);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Meal updated successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('MealDetail', { mealId: meal.ID })
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to update meal. Please try again.');
      }
    }
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Edit Meal</Text>
          
          <View style={styles.mealTypeContainer}>
            <Text style={styles.label}>Meal Type</Text>
            <View style={styles.mealTypeButtons}>
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    mealType === type && styles.mealTypeButtonSelected
                  ]}
                  onPress={() => setMealType(type)}
                >
                  <Text 
                    style={[
                      styles.mealTypeButtonText,
                      mealType === type && styles.mealTypeButtonTextSelected
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {mealTypeError ? <Text style={styles.errorText}>{mealTypeError}</Text> : null}
          </View>
          
          <CustomInput
            label="Calories"
            value={calories}
            onChangeText={setCalories}
            placeholder="Enter calories"
            keyboardType="numeric"
            error={caloriesError}
          />
          
          <CustomInput
            label="Protein (g)"
            value={proteins}
            onChangeText={setProteins}
            placeholder="Enter protein amount"
            keyboardType="numeric"
            error={proteinsError}
          />
          
          <CustomInput
            label="Carbohydrates (g)"
            value={carbohydrates}
            onChangeText={setCarbohydrates}
            placeholder="Enter carbohydrate amount"
            keyboardType="numeric"
            error={carbohydratesError}
          />
          
          <CustomInput
            label="Fat (g)"
            value={fats}
            onChangeText={setFats}
            placeholder="Enter fat amount"
            keyboardType="numeric"
            error={fatsError}
          />
          
          <CustomInput
            label="Description (Optional)"
            value={mealDescription}
            onChangeText={setMealDescription}
            placeholder="Enter meal description"
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Save Changes"
              onPress={handleUpdateMeal}
              loading={isLoading}
              style={{ flex: 1, marginRight: 8 }}
            />
            
            <CustomButton
              title="Cancel"
              onPress={handleCancel}
              type="secondary"
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  mealTypeContainer: {
    marginBottom: 16,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  mealTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  mealTypeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  mealTypeButtonText: {
    color: '#666',
  },
  mealTypeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
});

export default EditMealScreen;
