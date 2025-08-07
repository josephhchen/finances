import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Target, TrendingUp } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeStore } from '@/src/stores/themeStore';
import { useFinancialStore } from '@/src/stores/financialStore';
import { FinancialCard } from '@/src/components/common';
import { Button } from '@/src/components/ui';

export default function BudgetsScreen() {
  const { theme } = useThemeStore();
  const { budgets } = useFinancialStore();

  const activeBudgets = budgets.filter(budget => budget.isActive);
  const totalBudgeted = activeBudgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = activeBudgets.reduce((sum, budget) => sum + budget.spent, 0);

  const handleAddBudget = () => {
    // Navigate to add budget screen when implemented
    console.log('Add budget');
  };

  const getBudgetProgress = (budget: any) => {
    return (budget.spent / budget.limit) * 100;
  };

  const getBudgetColor = (progress: number) => {
    if (progress >= 90) return theme.colors.error;
    if (progress >= 75) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Budgets
        </Text>
        <TouchableOpacity 
          onPress={handleAddBudget}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.overviewSection}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <FinancialCard
                title="Total Budgeted"
                amount={totalBudgeted}
                subtitle="This month"
                icon={<Target size={20} color={theme.colors.primary} />}
              />
            </View>
            <View style={styles.statCard}>
              <FinancialCard
                title="Total Spent"
                amount={totalSpent}
                subtitle="This month"
                icon={<TrendingUp size={20} color={theme.colors.error} />}
                trend={{
                  value: totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100) : 0,
                  isPositive: false,
                }}
              />
            </View>
          </View>
        </Animated.View>

        {/* Budgets List */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.budgetsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Active Budgets
          </Text>
          
          {activeBudgets.length > 0 ? (
            activeBudgets.map((budget, index) => {
              const progress = getBudgetProgress(budget);
              const progressColor = getBudgetColor(progress);
              
              return (
                <Animated.View 
                  key={budget.id}
                  entering={FadeInDown.duration(300).delay(300 + index * 100)}
                >
                  <TouchableOpacity
                    style={[styles.budgetCard, { 
                      backgroundColor: theme.colors.card,
                      borderRadius: theme.borderRadius.lg,
                      ...theme.shadows.sm,
                    }]}
                    onPress={() => router.push(`/budget/${budget.id}`)}
                  >
                    <View style={styles.budgetHeader}>
                      <View>
                        <Text style={[styles.budgetName, { color: theme.colors.text }]}>
                          {budget.name}
                        </Text>
                        <Text style={[styles.budgetCategory, { color: theme.colors.textSecondary }]}>
                          {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                        </Text>
                      </View>
                      <View style={styles.budgetAmounts}>
                        <Text style={[styles.spentAmount, { color: theme.colors.text }]}>
                          ${budget.spent.toLocaleString()}
                        </Text>
                        <Text style={[styles.limitAmount, { color: theme.colors.textSecondary }]}>
                          of ${budget.limit.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.progressSection}>
                      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              backgroundColor: progressColor,
                              width: `${Math.min(progress, 100)}%`,
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.progressText, { color: progressColor }]}>
                        {progress.toFixed(0)}% used
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          ) : (
            <Animated.View 
              entering={FadeInDown.duration(600).delay(400)}
              style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}
            >
              <Target size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                No budgets yet
              </Text>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                Create your first budget to start tracking your spending goals
              </Text>
              <Button
                title="Create Budget"
                onPress={handleAddBudget}
                style={styles.emptyStateButton}
              />
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  overviewSection: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  budgetsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  budgetCard: {
    padding: 16,
    marginVertical: 4,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetCategory: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  budgetAmounts: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  limitAmount: {
    fontSize: 12,
  },
  progressSection: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    marginTop: 16,
  },
});