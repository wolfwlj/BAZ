import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { 
  getActiveNutritionGoal, 
  createNutritionGoal, 
  updateNutritionGoal 
} from '../../services/NutritionGoalService';

const NutritionGoalSettingsScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [nutritionGoal, setNutritionGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [goals, setGoals] = useState({
    calories_goal: '2000',
    proteins_goal: '75',
    fats_goal: '65',
    carbs_goal: '250'
  });

  useEffect(() => {
    fetchNutritionGoal();
  }, [userInfo?.ID]);

  const fetchNutritionGoal = async () => {
    if (!userInfo?.ID) return;
    
    setIsLoading(true);
    const response = await getActiveNutritionGoal(userInfo.ID);
    
    if (response.success && response.data.nutrition_goal) {
      const goal = response.data.nutrition_goal;
      setNutritionGoal(goal);
      setGoals({
        calories_goal: goal.calories_goal.toString(),
        proteins_goal: goal.proteins_goal.toString(),
        fats_goal: goal.fats_goal.toString(),
        carbs_goal: goal.carbs_goal.toString()
      });
    }
    
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!userInfo?.ID) return;
    
    // Validate inputs
    const caloriesGoal = parseInt(goals.calories_goal);
    const proteinsGoal = parseInt(goals.proteins_goal);
    const fatsGoal = parseInt(goals.fats_goal);
    const carbsGoal = parseInt(goals.carbs_goal);
    
    if (isNaN(caloriesGoal) || caloriesGoal <= 0) {
      Alert.alert('Fout', 'Voer een geldig aantal calorieën in');
      return;
    }
    
    if (isNaN(proteinsGoal) || proteinsGoal <= 0) {
      Alert.alert('Fout', 'Voer een geldig aantal eiwitten in');
      return;
    }
    
    if (isNaN(fatsGoal) || fatsGoal <= 0) {
      Alert.alert('Fout', 'Voer een geldig aantal vetten in');
      return;
    }
    
    if (isNaN(carbsGoal) || carbsGoal <= 0) {
      Alert.alert('Fout', 'Voer een geldig aantal koolhydraten in');
      return;
    }
    
    setIsSaving(true);
    
    const goalData = {
      user_id: userInfo.ID,
      calories_goal: caloriesGoal,
      proteins_goal: proteinsGoal,
      fats_goal: fatsGoal,
      carbs_goal: carbsGoal
    };
    
    let response;
    if (nutritionGoal) {
      // Update existing goal
      response = await updateNutritionGoal(nutritionGoal.ID, goalData);
    } else {
      // Create new goal
      response = await createNutritionGoal(goalData);
    }
    
    setIsSaving(false);
    
    if (response.success) {
      Alert.alert(
        'Succes', 
        'Je voedingsdoelen zijn bijgewerkt!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } else {
      Alert.alert('Fout', response.error || 'Er is iets misgegaan');
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Standaardwaarden herstellen',
      'Weet je zeker dat je de standaardwaarden wilt herstellen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        { 
          text: 'Herstellen', 
          onPress: () => {
            setGoals({
              calories_goal: '2000',
              proteins_goal: '75',
              fats_goal: '65',
              carbs_goal: '250'
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Voedingsdoelen</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dagelijkse Doelen</Text>
          <Text style={styles.sectionDescription}>
            Stel je dagelijkse voedingsdoelen in. Deze worden automatisch verhoogd wanneer je ze 7 dagen achtereen behaalt.
          </Text>

          <View style={styles.goalInput}>
            <View style={styles.goalInputHeader}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.goalLabel}>Calorieën</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={goals.calories_goal}
                onChangeText={(text) => setGoals({...goals, calories_goal: text})}
                keyboardType="numeric"
                placeholder="2000"
              />
              <Text style={styles.unitLabel}>kcal</Text>
            </View>
          </View>

          <View style={styles.goalInput}>
            <View style={styles.goalInputHeader}>
              <Ionicons name="fitness" size={20} color="#4CAF50" />
              <Text style={styles.goalLabel}>Eiwitten</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={goals.proteins_goal}
                onChangeText={(text) => setGoals({...goals, proteins_goal: text})}
                keyboardType="numeric"
                placeholder="75"
              />
              <Text style={styles.unitLabel}>g</Text>
            </View>
          </View>

          <View style={styles.goalInput}>
            <View style={styles.goalInputHeader}>
              <Ionicons name="water" size={20} color="#2196F3" />
              <Text style={styles.goalLabel}>Koolhydraten</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={goals.carbs_goal}
                onChangeText={(text) => setGoals({...goals, carbs_goal: text})}
                keyboardType="numeric"
                placeholder="250"
              />
              <Text style={styles.unitLabel}>g</Text>
            </View>
          </View>

          <View style={styles.goalInput}>
            <View style={styles.goalInputHeader}>
              <Ionicons name="ellipse" size={20} color="#F44336" />
              <Text style={styles.goalLabel}>Vetten</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={goals.fats_goal}
                onChangeText={(text) => setGoals({...goals, fats_goal: text})}
                keyboardType="numeric"
                placeholder="65"
              />
              <Text style={styles.unitLabel}>g</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automatische Aanpassingen</Text>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Slimme Doelen</Text>
              <Text style={styles.infoText}>
                Wanneer je je doelen 7 dagen achtereen behaalt, worden ze automatisch met 5% verhoogd om je uit te blijven dagen.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetToDefaults}
          >
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.resetButtonText}>Standaardwaarden</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Opslaan...' : 'Opslaan'}
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  goalInput: {
    marginBottom: 16,
  },
  goalInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  unitLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NutritionGoalSettingsScreen;
