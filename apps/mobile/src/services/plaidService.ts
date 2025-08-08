import { PlaidLinkResult, Account, Transaction, PlaidItem, TransactionCategory } from '../types/financial';
import { databaseService } from './database';

// Backend API service for secure Plaid operations
class PlaidService {
  private baseUrl = 'http://localhost:8080';
  
  private async makeAuthenticatedRequest(endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication header when auth is implemented
        // 'Authorization': `Bearer ${authToken}`
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async createLinkToken(): Promise<{ link_token: string }> {
    try {
      return await this.makeAuthenticatedRequest('/plaid/link-token');
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }

  async exchangePublicToken(publicToken: string): Promise<{ access_token: string; item_id: string; account_ids: string[] }> {
    try {
      return await this.makeAuthenticatedRequest('/plaid/exchange-token', {
        public_token: publicToken,
        user_id: 'user_123' // TODO: Get from auth context
      });
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  async linkAccount(linkResult: PlaidLinkResult): Promise<string[]> {
    try {
      // Exchange public token for access token (handled by backend)
      const response = await this.exchangePublicToken(linkResult.public_token);
      
      // The backend handles all the account creation and initial sync
      // Just return the account IDs that were created
      return response.account_ids;
    } catch (error) {
      console.error('Error linking account:', error);
      throw error;
    }
  }

  async syncTransactions(): Promise<{ success: boolean; accounts_updated: number; transactions_added: number }> {
    try {
      return await this.makeAuthenticatedRequest('/plaid/sync-transactions');
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw error;
    }
  }

}

export const plaidService = new PlaidService();