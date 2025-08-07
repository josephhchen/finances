import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeStore } from '../../stores/themeStore';

interface CardProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  shadow?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  style?: any;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'sm',
  animated = false,
  style,
  onPress,
}) => {
  const { theme } = useThemeStore();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[padding],
      ...theme.shadows[shadow],
    },
    style,
  ];

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={cardStyle}>
        {children}
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
});