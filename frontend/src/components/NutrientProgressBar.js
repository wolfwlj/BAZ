import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateProgress } from '../utils/helpers';

const NutrientProgressBar = ({ label, current, goal, unit = 'g', color = '#4CAF50' }) => {
  const progress = calculateProgress(current, goal);
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>
          {current} / {goal} {unit}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  valueText: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});

export default NutrientProgressBar;
