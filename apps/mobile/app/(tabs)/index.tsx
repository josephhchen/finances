import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Eye, EyeOff, Landmark } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';

import { useTheme } from '@/src/stores/hooks';
import { FinancialCard, TransactionItem } from '@/src/components/common';
import { Button } from '@/src/components/ui';
import { PlaidLinkButton } from '@/src/components/plaid/PlaidLinkButton';
import { AccountCard } from '@/src/components/accounts/AccountCard';
import { BudgetSuggestionsCard } from '@/src/components/ai/BudgetSuggestionsCard';
import { databaseService } from '@/src/services/database';
import { plaidService } from '@/src/services/plaidService';
import { Account, Transaction } from '@/src/types/financial';
import { formatCurrency } from '@/src/utils/format';

export default function DashboardScreen() {
  const theme = useTheme();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await databaseService.initialize();
      await loadData();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        databaseService.getAccounts(),
        databaseService.getTransactions(50)
      ]);
      
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const currentMonth = new Date();
  const monthlyTransactions = transactions.filter(t => 
    t.date.getMonth() === currentMonth.getMonth() &&
    t.date.getFullYear() === currentMonth.getFullYear()
  );
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = () => {
    router.push('/add-transaction');
  };

  const handlePlaidSuccess = async (accountIds: string[]) => {
    await loadData();
  };

  const handleSyncToggle = async (account: Account) => {
    // Toggle sync functionality would be implemented here
    console.log('Toggle sync for account:', account.name);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <Animated.View entering={FadeInUp.duration(800).delay(100)}>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Financial Overview
            </Text>
          </Animated.View>
          <Animated.View entering={SlideInRight.duration(700).delay(200)}>
            <TouchableOpacity 
              onPress={() => setBalanceVisible(!balanceVisible)}
              style={[styles.eyeButton, { backgroundColor: theme.colors.surface }]}
              activeOpacity={0.7}
            >
              {balanceVisible ? 
                <Eye size={20} color={theme.colors.textSecondary} /> : 
                <EyeOff size={20} color={theme.colors.textSecondary} />
              }
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

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

        {/* AI Budget Suggestions */}
        <Animated.View entering={FadeInDown.duration(600).delay(250)}>
          <BudgetSuggestionsCard />
        </Animated.View>

        {/* Accounts Section */}
        {accounts.length > 0 && (
          <Animated.View entering={FadeInDown.duration(700).delay(300)} style={styles.accountsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Accounts
            </Text>
            {accounts.slice(0, 2).map((account, index) => (
              <Animated.View 
                key={account.id}
                entering={FadeInDown.duration(300).delay(350 + index * 100)}
              >
                <AccountCard 
                  account={account}
                  onSyncToggle={handleSyncToggle}
                />
              </Animated.View>
            ))}
            {accounts.length > 2 && (
              <TouchableOpacity 
                style={styles.viewAllAccounts}
                onPress={() => console.log('View all accounts - navigation would be implemented here')}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.text }]}>
                  View all {accounts.length} accounts
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(700).delay(400)} style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            {accounts.length === 0 && (
              <PlaidLinkButton
                title="Link Bank Account"
                onSuccess={handlePlaidSuccess}
                variant="outline"
              />
            )}
            <Button
              title="Add Manual Transaction"
              onPress={handleAddTransaction}
              icon={<Plus size={18} color={theme.colors.surface} />}
              variant={accounts.length === 0 ? "primary" : "primary"}
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
              <Text style={[styles.seeAll, { color: theme.colors.text }]}>
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
            <View style={[styles.emptyState, { 
              backgroundColor: theme.colors.surface, 
              borderColor: theme.colors.border 
            }]}>
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
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: -0.3,
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
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  accountsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  viewAllAccounts: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
