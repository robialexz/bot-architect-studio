import { supabase, type DatabaseWorkflow } from '@/lib/supabase';

export interface CreateWorkflowData {
  name: string;
  description?: string;
  data: Record<string, unknown>;
  isPublic?: boolean;
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  data?: Record<string, unknown>;
  isPublic?: boolean;
}

export class WorkflowService {
  // Create a new workflow
  static async createWorkflow(
    userId: string,
    workflowData: CreateWorkflowData
  ): Promise<DatabaseWorkflow> {
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        name: workflowData.name,
        description: workflowData.description,
        data: workflowData.data,
        is_public: workflowData.isPublic || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all workflows for a user
  static async getUserWorkflows(userId: string): Promise<DatabaseWorkflow[]> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get a specific workflow by ID
  static async getWorkflow(workflowId: string, userId?: string): Promise<DatabaseWorkflow | null> {
    let query = supabase.from('workflows').select('*').eq('id', workflowId);

    // If userId is provided, ensure the user owns the workflow or it's public
    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  // Update a workflow
  static async updateWorkflow(
    workflowId: string,
    userId: string,
    updates: UpdateWorkflowData
  ): Promise<DatabaseWorkflow> {
    const { data, error } = await supabase
      .from('workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workflowId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a workflow
  static async deleteWorkflow(workflowId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', workflowId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Get public workflows (for templates/inspiration)
  static async getPublicWorkflows(limit: number = 20): Promise<DatabaseWorkflow[]> {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Duplicate a workflow
  static async duplicateWorkflow(
    workflowId: string,
    userId: string,
    newName?: string
  ): Promise<DatabaseWorkflow> {
    // First get the original workflow
    const original = await this.getWorkflow(workflowId, userId);
    if (!original) throw new Error('Workflow not found');

    // Create a copy
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        data: original.data,
        is_public: false, // Copies are private by default
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Search workflows
  static async searchWorkflows(
    query: string,
    userId?: string,
    includePublic: boolean = true
  ): Promise<DatabaseWorkflow[]> {
    let supabaseQuery = supabase
      .from('workflows')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (userId && includePublic) {
      supabaseQuery = supabaseQuery.or(`user_id.eq.${userId},is_public.eq.true`);
    } else if (userId) {
      supabaseQuery = supabaseQuery.eq('user_id', userId);
    } else if (includePublic) {
      supabaseQuery = supabaseQuery.eq('is_public', true);
    }

    const { data, error } = await supabaseQuery.order('updated_at', { ascending: false }).limit(50);

    if (error) throw error;
    return data || [];
  }
}
