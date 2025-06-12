import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import LogMealScreen from '../screens/main/LogMealScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import StatsScreen from '../screens/main/StatsScreen';
import MealDetailScreen from '../screens/main/MealDetailScreen';
import EditMealScreen from '../screens/main/EditMealScreen';
import ScanBarcodeScreen from '../screens/main/ScanBarcodeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LogMeal') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="LogMeal" 
        component={LogMealScreen} 
        options={{ title: 'Log Meal' }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // We could show a splash screen here
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
    );
  }

  return (
    <Stack.Navigator>
      {userToken ? (
        // User is signed in
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MealDetail" 
            component={MealDetailScreen} 
            options={{ title: 'Meal Details' }}
          />
          <Stack.Screen 
            name="EditMeal" 
            component={EditMealScreen} 
            options={{ title: 'Edit Meal' }}
          />
          <Stack.Screen 
            name="ScanBarcode" 
            component={ScanBarcodeScreen} 
            options={{ title: 'Scan Barcode' }}
          />
        </>
      ) : (
        // User is not signed in
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Create Account' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
