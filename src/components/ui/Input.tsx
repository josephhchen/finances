import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useThemeStore } from '../../stores/themeStore';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useThemeStore();
  const borderColor = useSharedValue(theme.colors.border);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = () => {
    borderColor.value = withTiming(theme.colors.primary, { duration: 200 });
  };

  const handleBlur = () => {
    borderColor.value = withTiming(
      error ? theme.colors.error : theme.colors.border,
      { duration: 200 }
    );
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize,
      minHeight: multiline ? numberOfLines * 24 + theme.spacing.md : 44,
    },
    leftIcon && { paddingLeft: 48 },
    rightIcon && { paddingRight: 48 },
    disabled && { opacity: 0.6 },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={[styles.leftIcon, { left: theme.spacing.sm }]}>
            {leftIcon}
          </View>
        )}
        <Animated.View style={[styles.inputWrapper, animatedBorderStyle]}>
          <TextInput
            style={inputStyle}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
          />
        </Animated.View>
        {rightIcon && (
          <View style={[styles.rightIcon, { right: theme.spacing.sm }]}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error, marginTop: theme.spacing.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    textAlignVertical: 'top',
  },
  leftIcon: {
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  error: {
    fontSize: 12,
  },
});