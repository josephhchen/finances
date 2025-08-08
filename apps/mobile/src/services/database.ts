import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { Account, Transaction, Budget, PlaidItem, AIInsight } from '../types/financial';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync('budget_tracker.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Accounts table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'USD',
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        color TEXT,
        plaid_account_id TEXT,
        plaid_item_id TEXT,
        institution_name TEXT,
        last_synced TEXT,
        sync_enabled INTEGER DEFAULT 0
      );
    `);

    // Transactions table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        accountId TEXT NOT NULL,
        isRecurring INTEGER DEFAULT 0,
        recurringFrequency TEXT,
        tags TEXT,
        plaid_transaction_id TEXT,
        merchant_name TEXT,
        is_pending INTEGER DEFAULT 0,
        is_manual INTEGER DEFAULT 1,
        FOREIGN KEY (accountId) REFERENCES accounts (id)
      );
    `);

    // Budgets table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        limit_amount REAL NOT NULL,
        spent REAL NOT NULL DEFAULT 0,
        period TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        alerts TEXT,
        is_ai_generated INTEGER DEFAULT 0,
        ai_reasoning TEXT
      );
    `);

    // Plaid items table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS plaid_items (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL UNIQUE,
        access_token TEXT NOT NULL,
        institution_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_synced TEXT,
        is_active INTEGER NOT NULL DEFAULT 1
      );
    `);

    // AI insights table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        priority TEXT NOT NULL,
        action_suggested TEXT,
        potential_savings REAL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
      CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(accountId);
      CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
      CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period, startDate, endDate);
    `);
  }

  // Account operations
  async createAccount(account: Omit<Account, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const accountData = {
      ...account,
      id,
      createdAt: account.createdAt.toISOString(),
      last_synced: account.last_synced?.toISOString(),
    };

    await this.db.runAsync(`
      INSERT INTO accounts (
        id, name, type, balance, currency, isActive, createdAt, color,
        plaid_account_id, plaid_item_id, institution_name, last_synced, sync_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      accountData.id,
      accountData.name,
      accountData.type,
      accountData.balance,
      accountData.currency,
      accountData.isActive ? 1 : 0,
      accountData.createdAt,
      accountData.color || null,
      accountData.plaid_account_id || null,
      accountData.plaid_item_id || null,
      accountData.institution_name || null,
      accountData.last_synced || null,
      accountData.sync_enabled ? 1 : 0,
    ]);

    return id;
  }

  async getAccounts(): Promise<Account[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM accounts WHERE isActive = 1 ORDER BY createdAt DESC');
    return result.map(this.mapRowToAccount);
  }

  async updateAccountBalance(accountId: string, balance: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync(
      'UPDATE accounts SET balance = ?, last_synced = ? WHERE id = ?',
      [balance, new Date().toISOString(), accountId]
    );
  }

  // Transaction operations
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const transactionData = {
      ...transaction,
      id,
      date: transaction.date.toISOString(),
      tags: transaction.tags?.join(',') || null,
    };

    await this.db.runAsync(`
      INSERT INTO transactions (
        id, amount, type, category, description, date, accountId,
        isRecurring, recurringFrequency, tags, plaid_transaction_id,
        merchant_name, is_pending, is_manual
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      transactionData.id,
      transactionData.amount,
      transactionData.type,
      transactionData.category,
      transactionData.description,
      transactionData.date,
      transactionData.accountId,
      transactionData.isRecurring ? 1 : 0,
      transactionData.recurringFrequency || null,
      transactionData.tags,
      transactionData.plaid_transaction_id || null,
      transactionData.merchant_name || null,
      transactionData.is_pending ? 1 : 0,
      transactionData.is_manual ? 1 : 0,
    ]);

    // Update account balance
    const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    await this.db.runAsync(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [balanceChange, transaction.accountId]
    );

    return id;
  }

  async getTransactions(limit: number = 100, offset: number = 0): Promise<Transaction[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return result.map(this.mapRowToTransaction);
  }

  async getTransactionsByCategory(category: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync(
      'SELECT * FROM transactions WHERE category = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
      [category, startDate.toISOString(), endDate.toISOString()]
    );
    return result.map(this.mapRowToTransaction);
  }

  // Budget operations
  async createBudget(budget: Omit<Budget, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const budgetData = {
      ...budget,
      id,
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
      alerts: JSON.stringify(budget.alerts || {}),
    };

    await this.db.runAsync(`
      INSERT INTO budgets (
        id, name, category, limit_amount, spent, period, startDate, endDate,
        isActive, alerts, is_ai_generated, ai_reasoning
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      budgetData.id,
      budgetData.name,
      budgetData.category,
      budgetData.limit,
      budgetData.spent,
      budgetData.period,
      budgetData.startDate,
      budgetData.endDate,
      budgetData.isActive ? 1 : 0,
      budgetData.alerts,
      budgetData.is_ai_generated ? 1 : 0,
      budgetData.ai_reasoning || null,
    ]);

    return id;
  }

  async getBudgets(): Promise<Budget[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM budgets WHERE isActive = 1 ORDER BY startDate DESC');
    return result.map(this.mapRowToBudget);
  }

  async updateBudgetSpent(budgetId: string, spent: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.runAsync('UPDATE budgets SET spent = ? WHERE id = ?', [spent, budgetId]);
  }

  // Plaid operations
  async createPlaidItem(item: Omit<PlaidItem, 'id'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const itemData = {
      ...item,
      id,
      created_at: item.created_at.toISOString(),
      last_synced: item.last_synced?.toISOString(),
    };

    await this.db.runAsync(`
      INSERT INTO plaid_items (
        id, item_id, access_token, institution_name, created_at, last_synced, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      itemData.id,
      itemData.item_id,
      itemData.access_token,
      itemData.institution_name,
      itemData.created_at,
      itemData.last_synced || null,
      itemData.is_active ? 1 : 0,
    ]);

    return id;
  }

  async getPlaidItems(): Promise<PlaidItem[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getAllAsync('SELECT * FROM plaid_items WHERE is_active = 1');
    return result.map(this.mapRowToPlaidItem);
  }

  // Helper methods to map database rows to objects
  private mapRowToAccount(row: any): Account {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      balance: row.balance,
      currency: row.currency,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      color: row.color,
      plaid_account_id: row.plaid_account_id,
      plaid_item_id: row.plaid_item_id,
      institution_name: row.institution_name,
      last_synced: row.last_synced ? new Date(row.last_synced) : undefined,
      sync_enabled: Boolean(row.sync_enabled),
    };
  }

  private mapRowToTransaction(row: any): Transaction {
    return {
      id: row.id,
      amount: row.amount,
      type: row.type,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      accountId: row.accountId,
      isRecurring: Boolean(row.isRecurring),
      recurringFrequency: row.recurringFrequency,
      tags: row.tags ? row.tags.split(',') : undefined,
      plaid_transaction_id: row.plaid_transaction_id,
      merchant_name: row.merchant_name,
      is_pending: Boolean(row.is_pending),
      is_manual: Boolean(row.is_manual),
    };
  }

  private mapRowToBudget(row: any): Budget {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      limit: row.limit_amount,
      spent: row.spent,
      period: row.period,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      isActive: Boolean(row.isActive),
      alerts: row.alerts ? JSON.parse(row.alerts) : undefined,
      is_ai_generated: Boolean(row.is_ai_generated),
      ai_reasoning: row.ai_reasoning,
    };
  }

  private mapRowToPlaidItem(row: any): PlaidItem {
    return {
      id: row.id,
      item_id: row.item_id,
      access_token: row.access_token,
      institution_name: row.institution_name,
      created_at: new Date(row.created_at),
      last_synced: row.last_synced ? new Date(row.last_synced) : undefined,
      is_active: Boolean(row.is_active),
    };
  }
}

export const databaseService = new DatabaseService();