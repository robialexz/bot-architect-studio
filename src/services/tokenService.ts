import { supabase } from '@/lib/supabase';

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  description: string;
  ai_agent_id?: string;
  workflow_id?: string;
  created_at: string;
}

export interface TokenBalance {
  user_id: string;
  balance: number;
  total_purchased: number;
  total_used: number;
  last_updated: string;
}

export class TokenService {
  // Get user's current token balance
  static async getUserTokenBalance(userId: string): Promise<number> {
    try {
      // In development, return mock balance
      if (import.meta.env.DEV) {
        return parseInt(import.meta.env.VITE_DEFAULT_TOKEN_BALANCE || '1000');
      }

      const { data, error } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching token balance:', error);
        return 0;
      }

      return data?.balance || 0;
    } catch (error) {
      console.error('Token balance fetch error:', error);
      return 0;
    }
  }

  // Deduct tokens for AI agent usage
  static async deductTokens(
    userId: string,
    amount: number,
    description: string,
    aiAgentId?: string,
    workflowId?: string
  ): Promise<boolean> {
    try {
      // In development, simulate token deduction
      if (import.meta.env.DEV) {
        console.log(`🪙 Mock token deduction: ${amount} tokens for ${description}`);
        return true;
      }

      // Check current balance
      const currentBalance = await this.getUserTokenBalance(userId);
      if (currentBalance < amount) {
        throw new Error('Insufficient token balance');
      }

      // Start transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: userId,
          amount: -amount,
          type: 'usage',
          description,
          ai_agent_id: aiAgentId,
          workflow_id: workflowId,
        })
        .select()
        .single();

      if (transactionError) {
        throw transactionError;
      }

      // Update balance
      const { error: balanceError } = await supabase.from('token_balances').upsert({
        user_id: userId,
        balance: currentBalance - amount,
        total_used: currentBalance - amount,
        last_updated: new Date().toISOString(),
      });

      if (balanceError) {
        throw balanceError;
      }

      return true;
    } catch (error) {
      console.error('Token deduction error:', error);
      return false;
    }
  }

  // Add tokens (for purchases or bonuses)
  static async addTokens(
    userId: string,
    amount: number,
    type: 'purchase' | 'bonus' = 'purchase',
    description: string
  ): Promise<boolean> {
    try {
      // In development, simulate token addition
      if (import.meta.env.DEV) {
        console.log(`🪙 Mock token addition: ${amount} tokens for ${description}`);
        return true;
      }

      const currentBalance = await this.getUserTokenBalance(userId);

      // Record transaction
      const { error: transactionError } = await supabase.from('token_transactions').insert({
        user_id: userId,
        amount,
        type,
        description,
      });

      if (transactionError) {
        throw transactionError;
      }

      // Update balance
      const { error: balanceError } = await supabase.from('token_balances').upsert({
        user_id: userId,
        balance: currentBalance + amount,
        total_purchased: type === 'purchase' ? currentBalance + amount : currentBalance,
        last_updated: new Date().toISOString(),
      });

      if (balanceError) {
        throw balanceError;
      }

      return true;
    } catch (error) {
      console.error('Token addition error:', error);
      return false;
    }
  }

  // Get token transaction history
  static async getTokenTransactions(
    userId: string,
    limit: number = 50
  ): Promise<TokenTransaction[]> {
    try {
      // In development, return mock transactions
      if (import.meta.env.DEV) {
        return [
          {
            id: '1',
            user_id: userId,
            amount: 1000,
            type: 'bonus',
            description: 'Welcome bonus',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            user_id: userId,
            amount: -10,
            type: 'usage',
            description: 'AI Agent: Data Analysis',
            ai_agent_id: 'agent-1',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ];
      }

      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Token transactions fetch error:', error);
      return [];
    }
  }

  // Calculate token cost for AI interaction
  static calculateTokenCost(
    interactionType: string,
    complexity: 'low' | 'medium' | 'high' = 'medium'
  ): number {
    const baseCost = parseInt(import.meta.env.VITE_TOKEN_COST_PER_AI_INTERACTION || '10');

    const complexityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 2,
    };

    const typeMultiplier = {
      text_generation: 1,
      data_analysis: 1.5,
      image_processing: 2,
      workflow_execution: 1.2,
      api_call: 0.8,
    };

    return Math.ceil(
      baseCost * complexityMultiplier[complexity] * (typeMultiplier[interactionType] || 1)
    );
  }

  // Check if user has sufficient tokens
  static async hasEnoughTokens(userId: string, requiredAmount: number): Promise<boolean> {
    const balance = await this.getUserTokenBalance(userId);
    return balance >= requiredAmount;
  }

  // Get token usage analytics
  static async getTokenUsageAnalytics(
    userId: string,
    days: number = 30
  ): Promise<{
    totalUsed: number;
    totalPurchased: number;
    dailyUsage: Array<{ date: string; amount: number }>;
    topCategories: Array<{ category: string; amount: number }>;
  }> {
    try {
      // In development, return mock analytics
      if (import.meta.env.DEV) {
        return {
          totalUsed: 450,
          totalPurchased: 1000,
          dailyUsage: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 100) + 20,
          })),
          topCategories: [
            { category: 'AI Agent Interactions', amount: 200 },
            { category: 'Workflow Executions', amount: 150 },
            { category: 'Data Analysis', amount: 100 },
          ],
        };
      }

      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data: transactions, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const totalUsed =
        transactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) ||
        0;

      const totalPurchased =
        transactions?.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0) || 0;

      // Group by date for daily usage
      const dailyUsage = transactions
        ?.filter(t => t.amount < 0)
        .reduce(
          (acc, t) => {
            const date = t.created_at.split('T')[0];
            acc[date] = (acc[date] || 0) + Math.abs(t.amount);
            return acc;
          },
          {} as Record<string, number>
        );

      const dailyUsageArray = Object.entries(dailyUsage || {})
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => b.date.localeCompare(a.date));

      return {
        totalUsed,
        totalPurchased,
        dailyUsage: dailyUsageArray,
        topCategories: [
          { category: 'AI Agent Interactions', amount: Math.floor(totalUsed * 0.4) },
          { category: 'Workflow Executions', amount: Math.floor(totalUsed * 0.35) },
          { category: 'Data Analysis', amount: Math.floor(totalUsed * 0.25) },
        ],
      };
    } catch (error) {
      console.error('Token analytics error:', error);
      return {
        totalUsed: 0,
        totalPurchased: 0,
        dailyUsage: [],
        topCategories: [],
      };
    }
  }

  // Get token usage for today
  static async getTokenUsageToday(userId: string): Promise<number> {
    try {
      if (import.meta.env.DEV) {
        return Math.floor(Math.random() * 100) + 50; // Mock data for development
      }

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('token_transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'usage')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (error) {
        console.error('Error fetching today token usage:', error);
        return 0;
      }

      return data?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    } catch (error) {
      console.error('Token usage today error:', error);
      return 0;
    }
  }

  // Get token usage for this month
  static async getTokenUsageThisMonth(userId: string): Promise<number> {
    try {
      if (import.meta.env.DEV) {
        return Math.floor(Math.random() * 1000) + 500; // Mock data for development
      }

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data, error } = await supabase
        .from('token_transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'usage')
        .gte('created_at', firstDay)
        .lte('created_at', lastDay);

      if (error) {
        console.error('Error fetching month token usage:', error);
        return 0;
      }

      return data?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    } catch (error) {
      console.error('Token usage month error:', error);
      return 0;
    }
  }

  // Get daily usage statistics
  static async getDailyUsageStats(
    userId: string,
    days: number = 7
  ): Promise<Array<{ date: string; tokens: number; executions: number }>> {
    try {
      if (import.meta.env.DEV) {
        // Mock data for development
        return Array.from({ length: days }, (_, i) => {
          const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
          return {
            date: date.toISOString().split('T')[0],
            tokens: Math.floor(Math.random() * 100) + 20,
            executions: Math.floor(Math.random() * 10) + 2,
          };
        });
      }

      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from('token_transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'usage')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching daily usage stats:', error);
        return [];
      }

      // Group by date
      const dailyStats: Record<string, { tokens: number; executions: number }> = {};

      // Initialize all days with 0
      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        dailyStats[dateStr] = { tokens: 0, executions: 0 };
      }

      // Fill with actual data
      data?.forEach(transaction => {
        const date = transaction.created_at.split('T')[0];
        if (dailyStats[date]) {
          dailyStats[date].tokens += Math.abs(transaction.amount);
          dailyStats[date].executions += 1;
        }
      });

      return Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        tokens: stats.tokens,
        executions: stats.executions,
      }));
    } catch (error) {
      console.error('Daily usage stats error:', error);
      return [];
    }
  }
}
