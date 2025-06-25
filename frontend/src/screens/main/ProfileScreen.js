import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ProfileScreen = () => {
  const { userInfo, updateProfile, logout } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(userInfo?.username || '');
  const [firstName, setFirstName] = useState(userInfo?.first_name || '');
  const [lastName, setLastName] = useState(userInfo?.last_name || '');
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phone_number || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = () => {
    let isValid = true;
    
    // Username validation
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    // First name validation
    if (!firstName) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    
    // Last name validation
    if (!lastName) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }
    
    // Password validation (only if provided)
    if (password) {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
      } else {
        setPasswordError('');
      }
      
      // Confirm password validation
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      } else {
        setConfirmPasswordError('');
      }
    } else {
      setPasswordError('');
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  const handleSaveProfile = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      const userData = {
        email: userInfo.email, // Email is required for the API but we don't allow changing it
        username,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      };
      
      // Only include password if it was changed
      if (password) {
        userData.password = password;
      }
      
      const result = await updateProfile(userData);
      
      setIsLoading(false);
      
      if (result.success) {
        setIsEditing(false);
        setPassword('');
        setConfirmPassword('');
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    }
  };
  
  const handleLogout = () => {
    const confirmMessage = 'Are you sure you want to log out?';
    
    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        console.log('Logout confirmed');
        logout();
      } else {
        console.log('Logout cancelled');
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        confirmMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Logout',
            onPress: () => {
              console.log('Logout confirmed');
              logout();
            },
            style: 'destructive'
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileIconContainer}>
            <Text style={styles.profileIconText}>
              {userInfo?.first_name?.charAt(0) || ''}
              {userInfo?.last_name?.charAt(0) || ''}
            </Text>
          </View>
          <Text style={styles.emailText}>{userInfo?.email}</Text>
          
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={18} color="#4CAF50" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          {isEditing ? (
            <>
              <CustomInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                error={usernameError}
              />
              
              <CustomInput
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                autoCapitalize="words"
                error={firstNameError}
              />
              
              <CustomInput
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                autoCapitalize="words"
                error={lastNameError}
              />
              
              <CustomInput
                label="Phone Number (Optional)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              
              <View style={styles.passwordSection}>
                <Text style={styles.passwordTitle}>Change Password (Optional)</Text>
                
                <CustomInput
                  label="New Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                  error={passwordError}
                />
                
                <CustomInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                  error={confirmPasswordError}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  loading={isLoading}
                  style={{ flex: 1, marginRight: 8 }}
                />
                
                <CustomButton
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setUsername(userInfo?.username || '');
                    setFirstName(userInfo?.first_name || '');
                    setLastName(userInfo?.last_name || '');
                    setPhoneNumber(userInfo?.phone_number || '');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  type="secondary"
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Username</Text>
                <Text style={styles.profileValue}>{userInfo?.username}</Text>
              </View>
              
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>First Name</Text>
                <Text style={styles.profileValue}>{userInfo?.first_name}</Text>
              </View>
              
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Last Name</Text>
                <Text style={styles.profileValue}>{userInfo?.last_name}</Text>
              </View>
              
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Phone Number</Text>
                <Text style={styles.profileValue}>
                  {userInfo?.phone_number || 'Not provided'}
                </Text>
              </View>
            </>
          )}
        </View>
        
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.settingArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Privacy</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.settingArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.settingArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileIconText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
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
  profileItem: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: '#333',
  },
  passwordSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  settingArrow: {
    marginLeft: 'auto',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 12,
  },
});

export default ProfileScreen;
