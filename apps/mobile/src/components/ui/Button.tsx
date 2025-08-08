import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../stores/hooks';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  // Get the contrasting color for text/icons based on button background
  const getContrastColor = (bgColor: string) => {
    return bgColor === theme.colors.primary ? theme.colors.surface : theme.colors.primary;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.button,
      borderRadius: theme.borderRadius.md,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, minHeight: 32 },
      md: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, minHeight: 44 },
      lg: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, minHeight: 52 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.border : theme.colors.secondary,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.border : theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
      },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
    ];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      ...theme.typography.body,
      fontWeight: '600',
    };

    const variantTextStyles = {
      primary: { color: getContrastColor(theme.colors.primary) },
      secondary: { color: getContrastColor(theme.colors.secondary) },
      outline: { color: disabled ? theme.colors.textSecondary : theme.colors.primary },
      ghost: { color: disabled ? theme.colors.textSecondary : theme.colors.text },
    };

    const sizeTextStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    return [
      baseTextStyle,
      sizeTextStyles[size],
      variantTextStyles[variant],
    ];
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={
            variant === 'primary' ? getContrastColor(theme.colors.primary) :
            variant === 'secondary' ? getContrastColor(theme.colors.secondary) :
            theme.colors.primary
          } 
          size="small" 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});