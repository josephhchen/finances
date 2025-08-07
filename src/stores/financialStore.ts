import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Account, Budget, FinancialGoal, LoadingState } from '../types';

interface FinancialStore {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: FinancialGoal[];
  loadingState: LoadingState;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  
  // Account actions
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  updateAccountBalance: (accountId: string, amount: number) => void;
  
  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Goal actions
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'isCompleted'>) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  
  // Utility functions
  getTotalBalance: () => number;
  getMonthlyExpenses: () => number;
  getMonthlyIncome: () => number;
  setLoadingState: (state: LoadingState) => void;
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useFinancialStore = create<FinancialStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      accounts: [],
      budgets: [],
      goals: [],
      loadingState: 'idle',

      // Transaction actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
        
        // Update account balance
        const { updateAccountBalance } = get();
        const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
        updateAccountBalance(transaction.accountId, amount);
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      getTransactionsByAccount: (accountId) => {
        return get().transactions.filter((t) => t.accountId === accountId);
      },

      getTransactionsByCategory: (category) => {
        return get().transactions.filter((t) => t.category === category);
      },

      // Account actions
      addAccount: (account) => {
        const newAccount: Account = {
          ...account,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));
      },

      updateAccountBalance: (accountId, amount) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === accountId ? { ...a, balance: a.balance + amount } : a
          ),
        }));
      },

      // Budget actions
      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: generateId(),
          spent: 0,
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      // Goal actions
      addGoal: (goal) => {
        const newGoal: FinancialGoal = {
          ...goal,
          id: generateId(),
          createdAt: new Date(),
          isCompleted: false,
        };
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      // Utility functions
      getTotalBalance: () => {
        return get().accounts.reduce((total, account) => total + account.balance, 0);
      },

      getMonthlyExpenses: () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        return get().transactions
          .filter((t) => 
            t.type === 'expense' && 
            t.date >= firstDay && 
            t.date <= lastDay
          )
          .reduce((total, t) => total + t.amount, 0);
      },

      getMonthlyIncome: () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        return get().transactions
          .filter((t) => 
            t.type === 'income' && 
            t.date >= firstDay && 
            t.date <= lastDay
          )
          .reduce((total, t) => total + t.amount, 0);
      },

      setLoadingState: (state) => {
        set({ loadingState: state });
      },
    }),
    {
      name: 'financial-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);