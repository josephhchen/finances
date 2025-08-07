import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui';
import { useThemeStore } from '../../stores/themeStore';

interface FinancialCardProps {
  title: string;
  amount: number;
  currency?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  amount,
  currency = '$',
  subtitle,
  trend,
  icon,
  onPress,
}) => {
  const { theme } = useThemeStore();

  const formatAmount = (value: number) => {
    return `${currency}${Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTrendColor = () => {
    if (!trend) return theme.colors.textSecondary;
    return trend.isPositive ? theme.colors.success : theme.colors.error;
  };

  return (
    <Card animated onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
            {title}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.amount, { color: theme.colors.text }]}>
        {formatAmount(amount)}
      </Text>
      
      <View style={styles.footer}>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        {trend && (
          <Text style={[styles.trend, { color: getTrendColor() }]}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
  },
  trend: {
    fontSize: 12,
    fontWeight: '500',
  },
});