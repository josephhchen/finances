// Shared utilities and constants

import { TransactionCategory } from '@budget-tracker/types';

// Constants
export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'salary',
    'freelance', 
    'investment',
    'business',
    'other_income'
  ] as const,
  EXPENSE: [
    'food',
    'transport',
    'housing',
    'utilities',
    'healthcare',
    'entertainment',
    'shopping',
    'education',
    'savings',
    'other_expense'
  ] as const
};

export const ACCOUNT_TYPES = [
  'checking',
  'savings',
  'credit',
  'cash',
  'investment'
] as const;

export const BUDGET_PERIODS = [
  'weekly',
  'monthly',
  'yearly'
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
] as const;

// Utility functions
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString(locale, options || defaultOptions);
};

export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const getCategoryIcon = (category: TransactionCategory): string => {
  const iconMap: Record<TransactionCategory, string> = {
    // Income
    salary: '💼',
    freelance: '💻',
    investment: '📈',
    business: '🏢',
    other_income: '💰',
    // Expenses
    food: '🍕',
    transport: '🚗',
    housing: '🏠',
    utilities: '💡',
    healthcare: '🏥',
    entertainment: '🎬',
    shopping: '🛍️',
    education: '📚',
    savings: '🏦',
    other_expense: '💳',
  };
  
  return iconMap[category] || '💳';
};

export const getCategoryColor = (category: TransactionCategory): string => {
  const colorMap: Record<TransactionCategory, string> = {
    // Income - Green shades
    salary: '#22C55E',
    freelance: '#16A34A',
    investment: '#15803D',
    business: '#166534',
    other_income: '#14532D',
    // Expenses - Various colors
    food: '#F97316',
    transport: '#3B82F6',
    housing: '#8B5CF6',
    utilities: '#EAB308',
    healthcare: '#EF4444',
    entertainment: '#EC4899',
    shopping: '#F59E0B',
    education: '#06B6D4',
    savings: '#10B981',
    other_expense: '#6B7280',
  };
  
  return colorMap[category] || '#6B7280';
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};