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
  plaid_transaction_id?: string;
  merchant_name?: string;
  is_pending?: boolean;
  is_manual?: boolean;
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
  plaid_account_id?: string;
  plaid_item_id?: string;
  institution_name?: string;
  last_synced?: Date;
  sync_enabled?: boolean;
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
  is_ai_generated?: boolean;
  ai_reasoning?: string;
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

// Plaid-specific types
export interface PlaidLinkResult {
  public_token: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      subtype: string;
    }>;
  };
}

export interface PlaidItem {
  id: string;
  item_id: string;
  access_token: string;
  institution_name: string;
  created_at: Date;
  last_synced?: Date;
  is_active: boolean;
}

// AI-specific types
export interface BudgetSuggestion {
  category: TransactionCategory;
  suggested_amount: number;
  current_spending: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  savings_potential: number;
}

export interface FinancialAnalysis {
  total_income: number;
  total_expenses: number;
  net_flow: number;
  category_breakdown: Array<{
    category: TransactionCategory;
    amount: number;
    percentage: number;
  }>;
  spending_trends: Array<{
    month: string;
    amount: number;
  }>;
  budget_suggestions: BudgetSuggestion[];
}

export interface AIInsight {
  id: string;
  type: 'spending_pattern' | 'saving_opportunity' | 'budget_alert' | 'trend_analysis';
  title: string;
  description: string;
  category?: TransactionCategory;
  priority: 'high' | 'medium' | 'low';
  action_suggested?: string;
  potential_savings?: number;
  is_read: boolean;
  created_at: Date;
}