import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const CustomButton = ({ 
  title, 
  onPress, 
  type = 'primary', 
  disabled = false, 
  loading = false,
  style = {},
  textStyle = {}
}) => {
  const buttonStyle = [
    styles.button,
    type === 'primary' ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabledButton,
    { minHeight: 44 },
    style
  ];

  const buttonTextStyle = [
    styles.buttonText,
    type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
    disabled && styles.disabledButtonText,
    textStyle
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={() => {
        console.log('CustomButton touch detected');
        if (!disabled && !loading && typeof onPress === 'function') {
          console.log('CustomButton calling onPress handler');
          onPress();
        }
      }}
      disabled={disabled || loading}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' ? '#fff' : '#4CAF50'} 
          size="small" 
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minWidth: 100,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
});

export default CustomButton;
