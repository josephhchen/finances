import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Brain, TrendingUp, DollarSign, Check, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../stores/hooks';
import { BudgetSuggestion } from '../../types/financial';
import { aiService } from '../../services/aiService';
import { formatCurrency } from '../../utils/format';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const BudgetSuggestionsCard: React.FC = () => {
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Only load suggestions if API key is available and user has accounts
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (apiKey && apiKey.length > 0) {
      checkAccountsAndLoadSuggestions();
    }
  }, []);

  const checkAccountsAndLoadSuggestions = async () => {
    try {
      const { databaseService } = await import('../../services/database');
      await databaseService.initialize();
      const accounts = await databaseService.getAccounts();
      
      // Only load suggestions if user has linked accounts (has Plaid accounts)
      const hasLinkedAccounts = accounts.some(account => account.plaid_account_id);
      if (hasLinkedAccounts) {
        loadSuggestions();
      }
    } catch (error) {
      console.error('Error checking accounts:', error);
    }
  };

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const newSuggestions = await aiService.generateBudgetSuggestions();
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      // Don't show error alert on initial load, just silently fail
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSuggestion = (category: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedSuggestions(newSelected);
  };

  const applySelectedBudgets = async () => {
    if (selectedSuggestions.size === 0) {
      Alert.alert('No Selection', 'Please select at least one budget suggestion to apply.');
      return;
    }

    setIsLoading(true);
    try {
      const selectedBudgets = suggestions.filter(s => selectedSuggestions.has(s.category));
      await aiService.createAIBudgets(selectedBudgets);
      
      Alert.alert(
        'Success!', 
        `Applied ${selectedSuggestions.size} AI-generated budget(s)`,
        [{ text: 'OK', onPress: () => setSelectedSuggestions(new Set()) }]
      );
    } catch (error) {
      console.error('Error applying budgets:', error);
      Alert.alert('Error', 'Failed to apply budget suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return theme.colors.textSecondary;
    }
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Brain size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          AI Budget Suggestions
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Analyzing your spending patterns...
          </Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.suggestionsContainer} showsVerticalScrollIndicator={false}>
            {suggestions.map((suggestion, index) => (
              <Animated.View 
                key={suggestion.category}
                entering={FadeInDown.duration(400).delay(index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.suggestionCard,
                    { 
                      backgroundColor: selectedSuggestions.has(suggestion.category) 
                        ? theme.colors.primary + '10' 
                        : theme.colors.surface,
                      borderColor: selectedSuggestions.has(suggestion.category)
                        ? theme.colors.primary
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => toggleSuggestion(suggestion.category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.suggestionHeader}>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                        {formatCategoryName(suggestion.category)}
                      </Text>
                      <View style={[
                        styles.priorityBadge, 
                        { backgroundColor: getPriorityColor(suggestion.priority) }
                      ]}>
                        <Text style={styles.priorityText}>
                          {suggestion.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.selectionIndicator}>
                      {selectedSuggestions.has(suggestion.category) ? (
                        <Check size={20} color={theme.colors.primary} />
                      ) : (
                        <View style={[styles.checkboxEmpty, { borderColor: theme.colors.border }]} />
                      )}
                    </View>
                  </View>

                  <View style={styles.amountSection}>
                    <View style={styles.amountRow}>
                      <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                        Suggested Budget:
                      </Text>
                      <Text style={[styles.suggestedAmount, { color: theme.colors.text }]}>
                        {formatCurrency(suggestion.suggested_amount)}
                      </Text>
                    </View>
                    <View style={styles.amountRow}>
                      <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
                        Current Spending:
                      </Text>
                      <Text style={[styles.currentAmount, { color: theme.colors.textSecondary }]}>
                        {formatCurrency(suggestion.current_spending)}
                      </Text>
                    </View>
                    {suggestion.savings_potential > 0 && (
                      <View style={styles.amountRow}>
                        <TrendingUp size={14} color="#4CAF50" />
                        <Text style={[styles.savingsText, { color: '#4CAF50' }]}>
                          Potential savings: {formatCurrency(suggestion.savings_potential)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.reasoning, { color: theme.colors.textSecondary }]}>
                    {suggestion.reasoning}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {suggestions.length > 0 && (
            <View style={styles.footer}>
              <Button
                title="Refresh Suggestions"
                onPress={loadSuggestions}
                variant="outline"
                size="sm"
                disabled={isLoading}
              />
              <Button
                title={`Apply Selected (${selectedSuggestions.size})`}
                onPress={applySelectedBudgets}
                variant="primary"
                size="sm"
                disabled={selectedSuggestions.size === 0 || isLoading}
              />
            </View>
          )}
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    maxHeight: 300,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
  },
  amountSection: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  amountLabel: {
    fontSize: 13,
  },
  suggestedAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  currentAmount: {
    fontSize: 13,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  reasoning: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
});