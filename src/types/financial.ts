export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionCategory = 
  // Income categories
  | 'salary' | 'freelance' | 'investment' | 'business' | 'other_income'
  // Expense categories
  | 'food' | 'transport' | 'housing' | 'utilities' | 'healthcare' 
  | 'entertainment' | 'shopping' | 'education' | 'savings' | 'other_expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: Date;
  accountId: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  color?: string;
}

export interface Budget {
  id: string;
  name: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  alerts?: {
    at50Percent: boolean;
    at75Percent: boolean;
    at90Percent: boolean;
  };
}

export interface BudgetPeriod {
  id: string;
  budgetId: string;
  startDate: Date;
  endDate: Date;
  budgeted: number;
  spent: number;
  remaining: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'emergency_fund' | 'vacation' | 'purchase' | 'debt_payoff' | 'investment' | 'other';
  isCompleted: boolean;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: 'bill_due' | 'budget_limit' | 'goal_milestone' | 'custom';
  dueDate: Date;
  isCompleted: boolean;
  relatedEntityId?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
  };
}

export interface SpendingInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  category?: TransactionCategory;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  data?: Record<string, any>;
  createdAt: Date;
}