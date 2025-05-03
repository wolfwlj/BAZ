import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

// This is a mock function to simulate fetching nutrition data from an API
// In a real app, you would connect to a food database API
const fetchNutritionData = async (barcode) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - in a real app, this would come from an API
  const mockData = {
    '5449000000996': { // Coca-Cola
      name: 'Coca-Cola (330ml)',
      calories: 139,
      proteins: 0,
      carbohydrates: 35,
      fats: 0
    },
    '8710398500395': { // Yogurt
      name: 'Greek Yogurt (150g)',
      calories: 150,
      proteins: 15,
      carbohydrates: 6,
      fats: 8
    },
    '3017620422003': { // Nutella
      name: 'Nutella (15g serving)',
      calories: 80,
      proteins: 1,
      carbohydrates: 8.5,
      fats: 4.5
    },
    '5000159459228': { // Snickers
      name: 'Snickers Bar (50g)',
      calories: 250,
      proteins: 4.5,
      carbohydrates: 30,
      fats: 12
    }
  };
  
  // Return mock data if barcode exists, otherwise simulate not found
  if (mockData[barcode]) {
    return { success: true, data: mockData[barcode] };
  } else {
    return { success: false, message: 'Product not found in database' };
  }
};

const ScanBarcodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isLoading) return;
    
    setScanned(true);
    setIsLoading(true);
    
    try {
      const result = await fetchNutritionData(data);
      
      if (result.success) {
        Alert.alert(
          'Product Found',
          `${result.data.name}\n\nCalories: ${result.data.calories} kcal\nProtein: ${result.data.proteins}g\nCarbs: ${result.data.carbohydrates}g\nFat: ${result.data.fats}g`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                setScanned(false);
                setIsLoading(false);
              }
            },
            {
              text: 'Use These Values',
              onPress: () => {
                navigation.navigate('LogMeal', {
                  nutritionData: {
                    calories: result.data.calories,
                    proteins: result.data.proteins,
                    carbohydrates: result.data.carbohydrates,
                    fats: result.data.fats,
                    description: result.data.name
                  }
                });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Product Not Found',
          'Sorry, we couldn\'t find nutrition information for this product.',
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setIsLoading(false);
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while scanning. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
              setIsLoading(false);
            }
          }
        ]
      );
    }
  };
  
  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };
  
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>No access to camera</Text>
          <Text style={styles.subMessageText}>
            Camera permission is required to scan barcodes.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={flashMode}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.flashButton}
              onPress={toggleFlash}
            >
              <Ionicons 
                name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} 
                size={28} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanArea}>
            <View style={styles.scanFrame} />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching product database...</Text>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.instructionText}>
              Align barcode within the frame to scan
            </Text>
            
            {scanned && !isLoading && (
              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  closeButton: {
    padding: 8,
  },
  flashButton: {
    padding: 8,
  },
  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scanAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subMessageText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanBarcodeScreen;
