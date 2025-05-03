import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getMealTypeIcon } from '../utils/helpers';

const MealCard = ({ meal, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={getMealTypeIcon(meal.meal_type)} 
          size={24} 
          color="#4CAF50" 
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.mealType}>{meal.meal_type}</Text>
        <Text style={styles.mealTime}>{meal.meal_time}</Text>
        <Text style={styles.mealDescription} numberOfLines={2}>
          {meal.meal_description}
        </Text>
      </View>
      <View style={styles.nutritionContainer}>
        <Text style={styles.calories}>{meal.calories} kcal</Text>
        <View style={styles.macrosContainer}>
          <Text style={styles.macroText}>P: {meal.proteins}g</Text>
          <Text style={styles.macroText}>C: {meal.carbohydrates}g</Text>
          <Text style={styles.macroText}>F: {meal.fats}g</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#666',
  },
  nutritionContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
  },
  macroText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default MealCard;
