import { useState, useCallback, useRef } from 'react';
import { useNodesState, useEdgesState, useReactFlow } from 'reactflow';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { WorkflowNode, WorkflowNodeData, Connection, Edge } from '@/types/workflow';

interface UseWorkflowCanvasProps {
  initialNodes: WorkflowNode[];
  initialEdges: Edge[];
  onUpdateNode?: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onConnect?: (connection: Connection) => void;
  onDeleteNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
  isTeaser?: boolean;
}

export const useWorkflowCanvas = ({
  initialNodes,
  initialEdges,
  onUpdateNode,
  onConnect,
  onDeleteNode,
  selectedNodeId,
  isTeaser = false,
}: UseWorkflowCanvasProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [flowDirection, setFlowDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const reactFlowInstance = useReactFlow();
  const dropTargetRef = useRef<HTMLDivElement>(null);

  const [rfNodes, setRfNodes, onRfNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [rfEdges, setRfEdges, onRfEdgesChange] = useEdgesState([]);

  const runWorkflow = useCallback(async () => {
    if (isTeaser) {
      toast({
        title: 'Interaction Disabled',
        description: 'This is a visual teaser.',
        duration: 2000,
      });
      return;
    }

    if (initialNodes.length < 2) {
      toast({
        title: 'Cannot Run Workflow',
        description: 'Add at least two agents.',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    setActiveNodeId(null);

    try {
      for (const node of initialNodes) {
        setActiveNodeId(node.id);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      toast({
        title: 'Workflow Completed',
        description: `Processed ${initialNodes.length} nodes.`,
        duration: 3000,
      });

      logger.workflow.execute('workflow-canvas', 1500 * initialNodes.length);
    } catch (error) {
      logger.workflow.error(
        'workflow-canvas',
        error instanceof Error ? error.message : 'Unknown error'
      );
      toast({
        title: 'Workflow Failed',
        description: 'An error occurred during execution.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
      setActiveNodeId(null);
    }
  }, [isTeaser, initialNodes]);

  const saveWorkflow = useCallback(() => {
    if (isTeaser) {
      toast({ title: 'Interaction Disabled', duration: 2000 });
      return;
    }

    if (initialNodes.length === 0) {
      toast({ title: 'Cannot Save Empty Workflow', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Workflow Saved',
      description: 'Workflow saved successfully.',
      duration: 3000,
    });
  }, [isTeaser, initialNodes.length]);

  const toggleFlowDirection = useCallback(() => {
    if (isTeaser) return;

    const newDirection = flowDirection === 'horizontal' ? 'vertical' : 'horizontal';
    setFlowDirection(newDirection);

    toast({
      title: 'Flow Direction Changed',
      description: `Direction: ${newDirection}.`,
      duration: 2000,
    });
  }, [isTeaser, flowDirection]);

  return {
    // State
    isRunning,
    activeNodeId,
    flowDirection,
    rfNodes,
    rfEdges,
    dropTargetRef,

    // Actions
    runWorkflow,
    saveWorkflow,
    toggleFlowDirection,
    setRfNodes,
    setRfEdges,
    onRfNodesChange,
    onRfEdgesChange,

    // React Flow instance
    reactFlowInstance,
  };
};
