import { plaidService } from './plaidService';
import { databaseService } from './database';
import { aiService } from './aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncStatus {
  lastSync: Date | null;
  isAutoSyncEnabled: boolean;
  syncInterval: number; // in minutes
}

class SyncService {
  private static instance: SyncService;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private readonly SYNC_SETTINGS_KEY = 'sync_settings';
  private readonly DEFAULT_SYNC_INTERVAL = 30; // 30 minutes

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const settings = await this.getSyncSettings();
      if (settings.isAutoSyncEnabled) {
        this.startAutoSync(settings.syncInterval);
      }
    } catch (error) {
      console.error('Error initializing sync service:', error);
    }
  }

  async enableAutoSync(intervalMinutes: number = this.DEFAULT_SYNC_INTERVAL): Promise<void> {
    try {
      await this.saveSyncSettings({
        lastSync: null,
        isAutoSyncEnabled: true,
        syncInterval: intervalMinutes,
      });

      this.startAutoSync(intervalMinutes);
    } catch (error) {
      console.error('Error enabling auto sync:', error);
      throw error;
    }
  }

  async disableAutoSync(): Promise<void> {
    try {
      await this.saveSyncSettings({
        lastSync: await this.getLastSyncTime(),
        isAutoSyncEnabled: false,
        syncInterval: this.DEFAULT_SYNC_INTERVAL,
      });

      this.stopAutoSync();
    } catch (error) {
      console.error('Error disabling auto sync:', error);
      throw error;
    }
  }

  private startAutoSync(intervalMinutes: number): void {
    this.stopAutoSync(); // Clear any existing interval

    this.syncInterval = setInterval(async () => {
      try {
        await this.performFullSync();
      } catch (error) {
        console.error('Auto sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);

    // Perform initial sync
    setTimeout(() => this.performFullSync(), 5000); // 5 second delay
  }

  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async performFullSync(): Promise<{
    success: boolean;
    syncedAccounts: number;
    newTransactions: number;
    error?: string;
  }> {
    try {
      console.log('Starting full sync...');
      
      // Sync all Plaid accounts
      await plaidService.syncAllAccounts();
      
      // Get updated data counts
      const accounts = await databaseService.getAccounts();
      const plaidAccounts = accounts.filter(acc => acc.plaid_account_id);
      
      // For now, we'll just return basic stats
      // In a real implementation, you'd track specific sync results
      const result = {
        success: true,
        syncedAccounts: plaidAccounts.length,
        newTransactions: 0, // This would be tracked during sync
      };

      // Update last sync time
      await this.updateLastSyncTime();
      
      console.log('Full sync completed successfully:', result);
      return result;

    } catch (error) {
      console.error('Full sync failed:', error);
      return {
        success: false,
        syncedAccounts: 0,
        newTransactions: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async performManualSync(): Promise<void> {
    const result = await this.performFullSync();
    
    if (!result.success) {
      throw new Error(result.error || 'Sync failed');
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const settings = await this.getSyncSettings();
      return settings.lastSync;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  async isAutoSyncEnabled(): Promise<boolean> {
    try {
      const settings = await this.getSyncSettings();
      return settings.isAutoSyncEnabled;
    } catch (error) {
      console.error('Error checking auto sync status:', error);
      return false;
    }
  }

  async getSyncSettings(): Promise<SyncStatus> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SYNC_SETTINGS_KEY);
      
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        return {
          lastSync: settings.lastSync ? new Date(settings.lastSync) : null,
          isAutoSyncEnabled: settings.isAutoSyncEnabled || false,
          syncInterval: settings.syncInterval || this.DEFAULT_SYNC_INTERVAL,
        };
      }
      
      return {
        lastSync: null,
        isAutoSyncEnabled: false,
        syncInterval: this.DEFAULT_SYNC_INTERVAL,
      };
    } catch (error) {
      console.error('Error getting sync settings:', error);
      return {
        lastSync: null,
        isAutoSyncEnabled: false,
        syncInterval: this.DEFAULT_SYNC_INTERVAL,
      };
    }
  }

  private async saveSyncSettings(settings: SyncStatus): Promise<void> {
    try {
      const settingsJson = JSON.stringify({
        ...settings,
        lastSync: settings.lastSync?.toISOString() || null,
      });
      
      await AsyncStorage.setItem(this.SYNC_SETTINGS_KEY, settingsJson);
    } catch (error) {
      console.error('Error saving sync settings:', error);
      throw error;
    }
  }

  private async updateLastSyncTime(): Promise<void> {
    try {
      const currentSettings = await this.getSyncSettings();
      await this.saveSyncSettings({
        ...currentSettings,
        lastSync: new Date(),
      });
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  }

  // Export/backup functionality
  async exportData(): Promise<{
    accounts: any[];
    transactions: any[];
    budgets: any[];
    exportedAt: Date;
  }> {
    try {
      const [accounts, transactions, budgets] = await Promise.all([
        databaseService.getAccounts(),
        databaseService.getTransactions(10000), // Export all transactions
        databaseService.getBudgets(),
      ]);

      return {
        accounts,
        transactions,
        budgets,
        exportedAt: new Date(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async getDataStats(): Promise<{
    totalAccounts: number;
    connectedAccounts: number;
    totalTransactions: number;
    totalBudgets: number;
    aiBudgets: number;
    dataSize: string;
  }> {
    try {
      const [accounts, transactions, budgets] = await Promise.all([
        databaseService.getAccounts(),
        databaseService.getTransactions(10000),
        databaseService.getBudgets(),
      ]);

      const connectedAccounts = accounts.filter(acc => acc.plaid_account_id).length;
      const aiBudgets = budgets.filter(budget => budget.is_ai_generated).length;
      
      // Rough estimate of data size
      const dataSize = `${Math.round(
        (JSON.stringify({ accounts, transactions, budgets }).length) / 1024
      )} KB`;

      return {
        totalAccounts: accounts.length,
        connectedAccounts,
        totalTransactions: transactions.length,
        totalBudgets: budgets.length,
        aiBudgets,
        dataSize,
      };
    } catch (error) {
      console.error('Error getting data stats:', error);
      throw error;
    }
  }

  // Cleanup method
  destroy(): void {
    this.stopAutoSync();
  }
}

export const syncService = SyncService.getInstance();