// Shared types across all services

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
  date: Date | string;
  accountId: string;
  userId?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  userId?: string;
  color?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Budget {
  id: string;
  name: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  userId?: string;
  alerts?: {
    at50Percent: boolean;
    at75Percent: boolean;
    at90Percent: boolean;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date | string;
  category: 'emergency_fund' | 'vacation' | 'purchase' | 'debt_payoff' | 'investment' | 'other';
  isCompleted: boolean;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// AI Service types
export interface CategorizationRequest {
  transactions: Omit<Transaction, 'category'>[];
}

export interface CategorizationResponse {
  transactionId: string;
  suggestedCategory: TransactionCategory;
  confidence: number;
  reasoning: string;
}

export interface AnalysisRequest {
  userId: string;
  transactions: Transaction[];
  timePeriod?: string;
}

export interface AnalysisResponse {
  insights: SpendingInsight[];
  recommendations: string[];
  financialHealthScore: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date | string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  dateRange?: {
    start: Date | string;
    end: Date | string;
  };
  categories?: TransactionCategory[];
  accounts?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
}