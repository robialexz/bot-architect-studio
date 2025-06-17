import { useCallback, useEffect, DragEvent } from 'react';
import { NodeChange, EdgeChange, OnConnect } from 'reactflow';
import { toast } from '@/hooks/use-toast';
import type { WorkflowNode, WorkflowNodeData, Connection } from '@/types/workflow';

interface UseWorkflowEventsProps {
  initialNodes: WorkflowNode[];
  onUpdateNode?: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onConnect?: (connection: Connection) => void;
  onDeleteNode?: (nodeId: string) => void;
  onNodeClick?: (node: WorkflowNode) => void;
  onSelectNode?: (nodeId: string | null) => void;
  onAgentDrop?: (agentId: string, position: { x: number; y: number }) => void;
  selectedNodeId?: string | null;
  isTeaser?: boolean;
  reactFlowInstance: {
    project: (position: { x: number; y: number }) => { x: number; y: number };
  } | null;
  dropTargetRef: React.RefObject<HTMLDivElement>;
  onRfNodesChange: (changes: NodeChange[]) => void;
  onRfEdgesChange: (changes: EdgeChange[]) => void;
}

export const useWorkflowEvents = ({
  initialNodes,
  onUpdateNode,
  onConnect,
  onDeleteNode,
  onNodeClick,
  onSelectNode,
  onAgentDrop,
  selectedNodeId,
  isTeaser,
  reactFlowInstance,
  dropTargetRef,
  onRfNodesChange,
  onRfEdgesChange,
}: UseWorkflowEventsProps) => {
  const handleRfNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onRfNodesChange(changes);

      changes.forEach(change => {
        if (
          change.type === 'position' &&
          typeof change.dragging === 'boolean' &&
          !change.dragging &&
          change.position &&
          onUpdateNode
        ) {
          const originalNode = initialNodes.find(n => n.id === change.id);
          if (originalNode) {
            onUpdateNode(change.id, { ...originalNode, position: change.position });
          }
        }

        if (change.type === 'remove' && onDeleteNode) {
          onDeleteNode(change.id);
        }
      });
    },
    [onRfNodesChange, onUpdateNode, onDeleteNode, initialNodes]
  );

  const handleRfEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onRfEdgesChange(changes);
    },
    [onRfEdgesChange]
  );

  const handleRfConnect: OnConnect = useCallback(
    params => {
      if (onConnect && params.source && params.target) {
        const newConnection: Connection = {
          id: `conn-${params.source}-${params.target}-${Date.now()}`,
          from: params.source,
          to: params.target,
        };
        onConnect(newConnection);
      }
    },
    [onConnect]
  );

  const handleRfNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      if (isTeaser) return;

      if (onNodeClick) {
        const originalNode = initialNodes.find(n => n.id === node.id);
        if (originalNode) {
          onNodeClick(originalNode);
        }
      }

      if (onSelectNode) {
        onSelectNode(node.id);
      }
    },
    [isTeaser, onNodeClick, onSelectNode, initialNodes]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isTeaser || !selectedNodeId || !onDeleteNode) return;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        const activeElement = document.activeElement as HTMLElement;
        if (
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable)
        ) {
          return;
        }
        onDeleteNode(selectedNodeId);
      }
    },
    [isTeaser, selectedNodeId, onDeleteNode]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const agentId = event.dataTransfer.getData('text/plain');
      if (!agentId) {
        toast({
          title: 'Drop Error',
          description: 'No agent ID found in dropped item.',
          variant: 'destructive',
        });
        return;
      }

      if (!reactFlowInstance || !dropTargetRef.current) {
        toast({
          title: 'Drop Error',
          description: 'Canvas not ready for drop.',
          variant: 'destructive',
        });
        return;
      }

      const bounds = dropTargetRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      if (onAgentDrop) {
        onAgentDrop(agentId, position);
      }
    },
    [reactFlowInstance, onAgentDrop, dropTargetRef]
  );

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    handleRfNodesChange,
    handleRfEdgesChange,
    handleRfConnect,
    handleRfNodeClick,
    handleDragOver,
    handleDrop,
  };
};
