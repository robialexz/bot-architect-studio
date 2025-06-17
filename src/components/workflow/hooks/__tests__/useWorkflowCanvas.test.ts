import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkflowCanvas } from '../useWorkflowCanvas';

// Mock dependencies
vi.mock('reactflow', () => ({
  useNodesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
  useEdgesState: vi.fn(() => [[], vi.fn(), vi.fn()]),
  useReactFlow: vi.fn(() => ({
    project: vi.fn(coords => coords),
  })),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    workflow: {
      execute: vi.fn(),
      error: vi.fn(),
    },
  },
}));

const mockToast = vi.mocked(await import('@/hooks/use-toast')).toast;

describe('useWorkflowCanvas', () => {
  const defaultProps = {
    initialNodes: [
      {
        id: 'node-1',
        type: 'text_generator',
        position: { x: 100, y: 100 },
        data: { label: 'Test Node', name: 'Test Node' },
        status: 'idle' as const,
      },
      {
        id: 'node-2',
        type: 'data_analyzer',
        position: { x: 300, y: 100 },
        data: { label: 'Test Node 2', name: 'Test Node 2' },
        status: 'idle' as const,
      },
    ],
    initialEdges: [],
    onUpdateNode: vi.fn(),
    onConnect: vi.fn(),
    onDeleteNode: vi.fn(),
    selectedNodeId: null,
    isTeaser: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useWorkflowCanvas(defaultProps));

    expect(result.current.isRunning).toBe(false);
    expect(result.current.activeNodeId).toBeNull();
    expect(result.current.flowDirection).toBe('horizontal');
  });

  it('should handle workflow execution successfully', async () => {
    const { result } = renderHook(() => useWorkflowCanvas(defaultProps));

    await act(async () => {
      await result.current.runWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Workflow Completed',
      description: 'Processed 2 nodes.',
      duration: 3000,
    });
  });

  it('should prevent workflow execution in teaser mode', async () => {
    const teaserProps = { ...defaultProps, isTeaser: true };
    const { result } = renderHook(() => useWorkflowCanvas(teaserProps));

    await act(async () => {
      await result.current.runWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Interaction Disabled',
      description: 'This is a visual teaser.',
      duration: 2000,
    });
  });

  it('should prevent workflow execution with insufficient nodes', async () => {
    const singleNodeProps = {
      ...defaultProps,
      initialNodes: [defaultProps.initialNodes[0]],
    };
    const { result } = renderHook(() => useWorkflowCanvas(singleNodeProps));

    await act(async () => {
      await result.current.runWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Cannot Run Workflow',
      description: 'Add at least two agents.',
      variant: 'destructive',
    });
  });

  it('should handle save workflow', () => {
    const { result } = renderHook(() => useWorkflowCanvas(defaultProps));

    act(() => {
      result.current.saveWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Workflow Saved',
      description: 'Workflow saved successfully.',
      duration: 3000,
    });
  });

  it('should prevent save in teaser mode', () => {
    const teaserProps = { ...defaultProps, isTeaser: true };
    const { result } = renderHook(() => useWorkflowCanvas(teaserProps));

    act(() => {
      result.current.saveWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Interaction Disabled',
      duration: 2000,
    });
  });

  it('should prevent save with empty workflow', () => {
    const emptyProps = { ...defaultProps, initialNodes: [] };
    const { result } = renderHook(() => useWorkflowCanvas(emptyProps));

    act(() => {
      result.current.saveWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Cannot Save Empty Workflow',
      variant: 'destructive',
    });
  });

  it('should toggle flow direction', () => {
    const { result } = renderHook(() => useWorkflowCanvas(defaultProps));

    expect(result.current.flowDirection).toBe('horizontal');

    act(() => {
      result.current.toggleFlowDirection();
    });

    expect(result.current.flowDirection).toBe('vertical');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Flow Direction Changed',
      description: 'Direction: vertical.',
      duration: 2000,
    });

    act(() => {
      result.current.toggleFlowDirection();
    });

    expect(result.current.flowDirection).toBe('horizontal');
  });

  it('should prevent flow direction toggle in teaser mode', () => {
    const teaserProps = { ...defaultProps, isTeaser: true };
    const { result } = renderHook(() => useWorkflowCanvas(teaserProps));

    const initialDirection = result.current.flowDirection;

    act(() => {
      result.current.toggleFlowDirection();
    });

    expect(result.current.flowDirection).toBe(initialDirection);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should handle workflow execution errors', async () => {
    // Mock setTimeout to throw an error
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn(() => {
      throw new Error('Execution failed');
    });

    const { result } = renderHook(() => useWorkflowCanvas(defaultProps));

    await act(async () => {
      await result.current.runWorkflow();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Workflow Failed',
      description: 'An error occurred during execution.',
      variant: 'destructive',
    });

    // Restore original setTimeout
    global.setTimeout = originalSetTimeout;
  });
});
