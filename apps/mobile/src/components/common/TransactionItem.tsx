import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../../types';
import { useThemeStore } from '../../stores/themeStore';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const { theme } = useThemeStore();

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      food: '🍕',
      transport: '🚗',
      housing: '🏠',
      utilities: '💡',
      healthcare: '🏥',
      entertainment: '🎬',
      shopping: '🛍️',
      education: '📚',
      savings: '💰',
      salary: '💼',
      freelance: '💻',
      investment: '📈',
      business: '🏢',
    };
    return iconMap[category] || '💳';
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case 'income':
        return theme.colors.success;
      case 'expense':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'expense' ? '-' : '+';
    return `${sign}$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          marginVertical: 4,
          ...theme.shadows.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(transaction.category)}</Text>
        </View>
        <View style={styles.details}>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            {transaction.description}
          </Text>
          <View style={styles.metadata}>
            <Text style={[styles.category, { color: theme.colors.textSecondary }]}>
              {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
            </Text>
            <Text style={[styles.dot, { color: theme.colors.textSecondary }]}>•</Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDate(transaction.date)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {formatAmount(transaction.amount, transaction.type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 18,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  dot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});