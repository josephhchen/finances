import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeStore } from '@/src/stores/themeStore';
import { useFinancialStore } from '@/src/stores/financialStore';
import { FinancialCard, TransactionItem } from '@/src/components/common';
import { Button } from '@/src/components/ui';

export default function DashboardScreen() {
  const { theme } = useThemeStore();
  const { 
    getTotalBalance, 
    getMonthlyIncome, 
    getMonthlyExpenses, 
    transactions 
  } = useFinancialStore();
  
  const [balanceVisible, setBalanceVisible] = React.useState(true);

  const totalBalance = getTotalBalance();
  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = () => {
    router.push('/add-transaction');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Financial Overview
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setBalanceVisible(!balanceVisible)}
            style={[styles.eyeButton, { backgroundColor: theme.colors.surface }]}
          >
            {balanceVisible ? 
              <Eye size={20} color={theme.colors.textSecondary} /> : 
              <EyeOff size={20} color={theme.colors.textSecondary} />
            }
          </TouchableOpacity>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <FinancialCard
            title="Total Balance"
            amount={balanceVisible ? totalBalance : 0}
            subtitle={balanceVisible ? "Across all accounts" : "••••••"}
            trend={{
              value: 2.5,
              isPositive: true,
            }}
          />
        </Animated.View>

        {/* Income and Expenses */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <FinancialCard
              title="Monthly Income"
              amount={balanceVisible ? monthlyIncome : 0}
              subtitle={balanceVisible ? "This month" : "••••••"}
            />
          </View>
          <View style={styles.statCard}>
            <FinancialCard
              title="Monthly Expenses"
              amount={balanceVisible ? monthlyExpenses : 0}
              subtitle={balanceVisible ? "This month" : "••••••"}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(700).delay(300)} style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <Button
              title="Add Transaction"
              onPress={handleAddTransaction}
              icon={<Plus size={18} color="#FFFFFF" />}
              fullWidth
            />
          </View>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <Animated.View 
                key={transaction.id}
                entering={FadeInDown.duration(300).delay(500 + index * 100)}
              >
                <TransactionItem 
                  transaction={transaction}
                  onPress={() => router.push(`/transaction/${transaction.id}`)}
                />
              </Animated.View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                No transactions yet. Start by adding your first transaction!
              </Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  eyeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  statCard: {
    flex: 1,
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  recentSection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
