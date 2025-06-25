import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StreakDisplay = ({ streak }) => {
  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color="#FF9800" />
        <Text style={styles.streakText}>{streak}</Text>
        <Text style={styles.streakLabel}>day streak</Text>
      </View>
      <Text style={styles.motivationText}>
        {getMotivationText(streak)}
      </Text>
    </View>
  );
};

const getMotivationText = (streak) => {
  if (streak === 0) {
    return "Start your streak today!";
  } else if (streak === 1) {
    return "Great start! Keep going!";
  } else if (streak < 5) {
    return "You're building momentum!";
  } else if (streak < 10) {
    return "Impressive streak! You're doing great!";
  } else if (streak < 30) {
    return "Amazing dedication! Keep it up!";
  } else {
    return "Incredible commitment! You're unstoppable!";
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 8,
    marginRight: 4,
  },
  streakLabel: {
    fontSize: 16,
    color: '#666',
  },
  motivationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default StreakDisplay;
