import { 
  Transaction, 
  Account, 
  Budget, 
  BudgetSuggestion, 
  FinancialAnalysis, 
  AIInsight,
  TransactionCategory 
} from '../types/financial';
import { databaseService } from './database';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

class AIService {
  private baseUrl = 'http://localhost:8080';

  private async makeRequest(endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async generateBudgetSuggestions(userId?: string): Promise<BudgetSuggestion[]> {
    try {
      const analysis = await this.analyzeFinancialData();
      const response = await this.makeRequest('/ai/recommendations', {
        type: 'budget_suggestions',
        analysis
      });
      
      return response.suggestions || [];
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      return [];
    }
  }

  async analyzeSpendingPatterns(): Promise<AIInsight[]> {
    try {
      const analysis = await this.analyzeFinancialData();
      const response = await this.makeRequest('/ai/analyze', {
        type: 'spending_patterns',
        analysis
      });
      
      return response.insights || [];
    } catch (error) {
      console.error('Error analyzing spending patterns:', error);
      return [];
    }
  }

  async generateFinancialAdvice(query: string): Promise<string> {
    try {
      const analysis = await this.analyzeFinancialData();
      const response = await this.makeRequest('/ai/chat', {
        query,
        analysis
      });
      
      return response.advice || 'I apologize, but I couldn\'t generate a response at this time.';
    } catch (error) {
      console.error('Error generating financial advice:', error);
      return 'AI features are currently unavailable. Please try again later.';
    }
  }

  private async analyzeFinancialData(): Promise<FinancialAnalysis> {
    // Ensure database is initialized first
    await databaseService.initialize();
    
    const accounts = await databaseService.getAccounts();
    const transactions = await databaseService.getTransactions(1000); // Last 1000 transactions
    
    // Calculate date ranges
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    const threeMonthsAgo = subMonths(currentMonth, 3);
    
    // Filter transactions by date ranges
    const currentMonthTransactions = transactions.filter(t => 
      t.date >= startOfMonth(currentMonth) && t.date <= endOfMonth(currentMonth)
    );
    
    const lastThreeMonthsTransactions = transactions.filter(t => 
      t.date >= threeMonthsAgo
    );

    // Calculate totals
    const totalIncome = lastThreeMonthsTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = lastThreeMonthsTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryMap = new Map<TransactionCategory, number>();
    lastThreeMonthsTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const category_breakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100
    }));

    // Monthly spending trends
    const spending_trends = [];
    for (let i = 2; i >= 0; i--) {
      const monthDate = subMonths(currentMonth, i);
      const monthTransactions = transactions.filter(t => 
        t.date >= startOfMonth(monthDate) && 
        t.date <= endOfMonth(monthDate) && 
        t.type === 'expense'
      );
      
      spending_trends.push({
        month: format(monthDate, 'MMM yyyy'),
        amount: monthTransactions.reduce((sum, t) => sum + t.amount, 0)
      });
    }

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_flow: totalIncome - totalExpenses,
      category_breakdown,
      spending_trends,
      budget_suggestions: [] // Will be filled by generateBudgetSuggestions
    };
  }


  async createAIBudgets(suggestions: BudgetSuggestion[]): Promise<string[]> {
    const budgetIds: string[] = [];
    
    for (const suggestion of suggestions) {
      if (suggestion.priority === 'low') continue; // Skip low priority suggestions
      
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(startDate);
      
      const budgetId = await databaseService.createBudget({
        name: `AI Budget: ${suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)}`,
        category: suggestion.category,
        limit: suggestion.suggested_amount,
        spent: 0,
        period: 'monthly',
        startDate,
        endDate,
        isActive: true,
        is_ai_generated: true,
        ai_reasoning: suggestion.reasoning
      });
      
      budgetIds.push(budgetId);
    }
    
    return budgetIds;
  }
}

export const aiService = new AIService();