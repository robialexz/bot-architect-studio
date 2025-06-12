import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Simple mock for Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { WorkflowService } from '../workflowService';

describe('WorkflowService', () => {
  const mockUserId = 'test-user-id';
  const mockWorkflowData = {
    name: 'Test Workflow',
    description: 'Test Description',
    data: { nodes: [], edges: [] },
    isPublic: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createWorkflow', () => {
    it('should create a workflow successfully', async () => {
      const mockCreatedWorkflow = {
        id: 'workflow-id',
        user_id: mockUserId,
        ...mockWorkflowData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock the Supabase chain
      const { supabase } = await vi.importMock('@/lib/supabase');
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockCreatedWorkflow,
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      const result = await WorkflowService.createWorkflow(mockUserId, mockWorkflowData);

      expect(result).toEqual(mockCreatedWorkflow);
      expect(supabase.from).toHaveBeenCalledWith('workflows');
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Database error');

      // Mock the Supabase chain for error case
      const { supabase } = await vi.importMock('@/lib/supabase');
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      supabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: mockSingle,
          }),
        }),
      });

      await expect(WorkflowService.createWorkflow(mockUserId, mockWorkflowData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getUserWorkflows', () => {
    it('should fetch user workflows', async () => {
      const mockWorkflows = [
        { id: '1', name: 'Workflow 1', user_id: mockUserId },
        { id: '2', name: 'Workflow 2', user_id: mockUserId },
      ];

      const { supabase } = await vi.importMock('@/lib/supabase');
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockWorkflows,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: mockOrder,
          }),
        }),
      });

      const result = await WorkflowService.getUserWorkflows(mockUserId);

      expect(result).toEqual(mockWorkflows);
      expect(supabase.from).toHaveBeenCalledWith('workflows');
    });

    it('should return empty array when no workflows found', async () => {
      const { supabase } = await vi.importMock('@/lib/supabase');
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: mockOrder,
          }),
        }),
      });

      const result = await WorkflowService.getUserWorkflows(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('basic functionality', () => {
    it('should have basic CRUD operations', () => {
      expect(WorkflowService.createWorkflow).toBeDefined();
      expect(WorkflowService.getUserWorkflows).toBeDefined();
      expect(WorkflowService.getWorkflow).toBeDefined();
      expect(WorkflowService.updateWorkflow).toBeDefined();
      expect(WorkflowService.deleteWorkflow).toBeDefined();
    });
  });
});
