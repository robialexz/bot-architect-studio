import { supabase, type AIAgent } from '@/lib/supabase';

export interface CreateAIAgentData {
  name: string;
  type: string;
  configuration: Record<string, unknown>;
  isActive?: boolean;
}

export interface UpdateAIAgentData {
  name?: string;
  type?: string;
  configuration?: Record<string, unknown>;
  isActive?: boolean;
}

export class AIAgentService {
  // Create a new AI agent
  static async createAIAgent(userId: string, agentData: CreateAIAgentData): Promise<AIAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .insert({
        user_id: userId,
        name: agentData.name,
        type: agentData.type,
        configuration: agentData.configuration,
        is_active: agentData.isActive || true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all AI agents for a user
  static async getUserAIAgents(userId: string): Promise<AIAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get active AI agents for a user
  static async getActiveAIAgents(userId: string): Promise<AIAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get a specific AI agent by ID
  static async getAIAgent(agentId: string, userId: string): Promise<AIAgent | null> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  // Update an AI agent
  static async updateAIAgent(
    agentId: string,
    userId: string,
    updates: UpdateAIAgentData
  ): Promise<AIAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', agentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete an AI agent
  static async deleteAIAgent(agentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', agentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Toggle AI agent active status
  static async toggleAIAgentStatus(agentId: string, userId: string): Promise<AIAgent> {
    // First get the current status
    const agent = await this.getAIAgent(agentId, userId);
    if (!agent) throw new Error('AI Agent not found');

    // Toggle the status
    return this.updateAIAgent(agentId, userId, { isActive: !agent.is_active });
  }

  // Get AI agents by type
  static async getAIAgentsByType(userId: string, type: string): Promise<AIAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Search AI agents
  static async searchAIAgents(userId: string, query: string): Promise<AIAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,type.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get AI agent statistics for a user
  static async getAIAgentStats(userId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
  }> {
    const agents = await this.getUserAIAgents(userId);

    const stats = {
      total: agents.length,
      active: agents.filter(agent => agent.is_active).length,
      inactive: agents.filter(agent => !agent.is_active).length,
      byType: {} as Record<string, number>,
    };

    // Count by type
    agents.forEach(agent => {
      stats.byType[agent.type] = (stats.byType[agent.type] || 0) + 1;
    });

    return stats;
  }

  // Duplicate an AI agent
  static async duplicateAIAgent(
    agentId: string,
    userId: string,
    newName?: string
  ): Promise<AIAgent> {
    // First get the original agent
    const original = await this.getAIAgent(agentId, userId);
    if (!original) throw new Error('AI Agent not found');

    // Create a copy
    const { data, error } = await supabase
      .from('ai_agents')
      .insert({
        user_id: userId,
        name: newName || `${original.name} (Copy)`,
        type: original.type,
        configuration: original.configuration,
        is_active: false, // Copies are inactive by default
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
