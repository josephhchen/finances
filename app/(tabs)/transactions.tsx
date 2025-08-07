import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Filter, Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeStore } from '@/src/stores/themeStore';
import { useFinancialStore } from '@/src/stores/financialStore';
import { TransactionItem } from '@/src/components/common';
import { Button, Input } from '@/src/components/ui';

export default function TransactionsScreen() {
  const { theme } = useThemeStore();
  const { transactions } = useFinancialStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTransaction = () => {
    router.push('/add-transaction');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Transactions
        </Text>
        <TouchableOpacity 
          onPress={handleAddTransaction}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.searchSection}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={theme.colors.textSecondary} />}
        />
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}>
          <Filter size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, index) => (
            <Animated.View 
              key={transaction.id}
              entering={FadeInDown.duration(300).delay(200 + index * 50)}
            >
              <TransactionItem 
                transaction={transaction}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
              />
            </Animated.View>
          ))
        ) : (
          <Animated.View 
            entering={FadeInDown.duration(600).delay(300)}
            style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
              No transactions found
            </Text>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              {searchQuery ? 
                "Try adjusting your search criteria" : 
                "Start by adding your first transaction!"
              }
            </Text>
            {!searchQuery && (
              <Button
                title="Add Transaction"
                onPress={handleAddTransaction}
                style={styles.emptyStateButton}
              />
            )}
          </Animated.View>
        )}
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
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