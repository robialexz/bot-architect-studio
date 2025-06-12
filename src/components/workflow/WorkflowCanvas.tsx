import { useState, useEffect, useCallback, useMemo, useRef, DragEvent } from 'react'; // Added useRef, DragEvent
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  NodeChange, // Not generic
  EdgeChange,
  Connection as RFConnection,
  Edge as RFEdge, // React Flow's Edge type
  Node as RFNodeType, // React Flow's Node type, aliased
  OnConnect,
  BackgroundVariant,
  NodeProps, // For custom node component props
  useReactFlow, // Import useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import { toast } from '@/hooks/use-toast';
// Import local types
import {
  type WorkflowNode as LocalWorkflowNode,
  type WorkflowNodeData,
  type Connection as LocalConnection,
  type Edge as LocalEdge, // This is our project's Edge type from types/workflow.ts
} from '@/types/workflow';
import { type WorkflowCanvasProps } from './types';
import WorkflowNodeComponent from './WorkflowNode';
import WorkflowControlsComponent from './WorkflowControls';
import EmptyCanvas from './EmptyCanvas';
import StatusIndicator from './StatusIndicator';

// Define nodeTypes for React Flow, mapping our custom node component
const nodeTypes = { custom: WorkflowNodeComponent };

const WorkflowCanvas = ({
  nodes: initialNodes,
  edges: initialEdges,
  onUpdateNode,
  onConnect: onConnectProp,
  onNodeClick,
  isTeaser = false,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onAgentDrop, // Added new prop
}: WorkflowCanvasProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [flowDirection, setFlowDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const reactFlowInstance = useReactFlow();
  const dropTargetRef = useRef<HTMLDivElement>(null);

  const [rfNodes, setRfNodes, onRfNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [rfEdges, setRfEdges, onRfEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setRfNodes(
      initialNodes.map(n => ({
        id: n.id,
        type: n.type || 'custom',
        position: n.position,
        data: n.data, // data is WorkflowNodeData
        selected: n.id === selectedNodeId,
      })) as RFNodeType<WorkflowNodeData>[] // Ensure this cast is correct
    );
  }, [initialNodes, setRfNodes, selectedNodeId]);

  useEffect(() => {
    setRfEdges(
      initialEdges.map(e => ({
        // e is LocalEdge
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type, // LocalEdge from types/workflow.ts has optional type
        animated: e.animated,
        label: e.label, // LocalEdge from types/workflow.ts has optional label
      })) as RFEdge[] // Cast to React Flow's Edge type
    );
  }, [initialEdges, setRfEdges]);

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
          // initialNodes is a dependency here. If it changes often, this callback will be recreated.
          // This is acceptable if node positions are updated externally based on initialNodes.
          const originalNode = initialNodes.find(n => n.id === change.id);
          if (originalNode) {
            onUpdateNode(change.id, { ...originalNode, position: change.position });
          }
        }
        // For 'remove', onDeleteNode is already memoized if it's a prop, or stable if from useState.
        if (change.type === 'remove' && onDeleteNode) {
          onDeleteNode(change.id);
        }
      });
    },
    [onRfNodesChange, onUpdateNode, onDeleteNode, initialNodes] // initialNodes is kept as it's used to find original node
  );

  const handleRfEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onRfEdgesChange(changes);
    },
    [onRfEdgesChange] // onRfEdgesChange from useEdgesState is stable
  );

  const handleRfConnect: OnConnect = useCallback(
    params => {
      if (onConnectProp && params.source && params.target) {
        const newConnection: LocalConnection = {
          id: `conn-${params.source}-${params.target}-${Date.now()}`, // Date.now() makes this impure for memo if called often
          from: params.source,
          to: params.target,
        };
        onConnectProp(newConnection);
      }
    },
    [onConnectProp] // onConnectProp is a prop, should be memoized by parent if necessary
  );

  const handleRfNodeClick = useCallback(
    (_event: React.MouseEvent, node: RFNodeType<WorkflowNodeData>) => {
      if (isTeaser) return;
      // onNodeClick and onSelectNode are props, should be memoized by parent.
      // initialNodes is used here.
      if (onNodeClick) {
        const originalNode = initialNodes.find(n => n.id === node.id);
        if (originalNode) {
          onNodeClick(originalNode); // Prop
        }
      }
      if (onSelectNode) {
        onSelectNode(node.id); // Prop
      }
    },
    [isTeaser, onNodeClick, onSelectNode, initialNodes] // initialNodes is kept
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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
    for (const node of initialNodes) {
      setActiveNodeId(node.id);
      await new Promise(r => setTimeout(r, 1500));
    }
    setIsRunning(false);
    setActiveNodeId(null);
    toast({
      title: 'Workflow Completed',
      description: `Processed ${initialNodes.length} nodes.`,
      duration: 3000,
    });
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
    toast({ title: 'Workflow Saved', description: 'Workflow saved successfully.', duration: 3000 });
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

  const handleUpdateNodeDataInternal = useCallback(
    (nodeId: string, dataChanges: Partial<WorkflowNodeData>) => {
      if (onUpdateNode) {
        const nodeToUpdate = initialNodes.find(n => n.id === nodeId);
        if (nodeToUpdate) {
          const newData = { ...nodeToUpdate.data, ...dataChanges };
          onUpdateNode(nodeId, { data: newData });
        }
      }
    },
    [initialNodes, onUpdateNode]
  );

  const onRemoveNodeCb = useCallback(
    (nodeId: string) => {
      if (onDeleteNode) {
        onDeleteNode(nodeId);
      }
    },
    [onDeleteNode]
  );

  const onNodeClickCb = useCallback(
    (node: LocalWorkflowNode) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  const onSelectNodeCb = useCallback(
    (nodeId: string | null) => {
      if (onSelectNode) {
        onSelectNode(nodeId);
      }
    },
    [onSelectNode]
  );

  const memoizedNodeTypes = useMemo(
    () => ({
      custom: (rfNodeProps: NodeProps<WorkflowNodeData>) => (
        <WorkflowNodeComponent
          {...rfNodeProps}
          isActive={!isTeaser && activeNodeId === rfNodeProps.id}
          onRemove={onRemoveNodeCb} // Use memoized callback
          onNodeClick={nodeFromComponent => {
            // This internal callback structure is fine
            if (onNodeClickCb) {
              // Use memoized callback
              onNodeClickCb(nodeFromComponent);
            }
            if (onSelectNodeCb) {
              // Use memoized callback
              onSelectNodeCb(nodeFromComponent.id);
            }
          }}
          onUpdateNodeData={handleUpdateNodeDataInternal} // Already memoized
          isTeaser={isTeaser}
        />
      ),
    }),
    [
      activeNodeId,
      isTeaser,
      onRemoveNodeCb,
      onNodeClickCb,
      onSelectNodeCb,
      handleUpdateNodeDataInternal,
    ]
  );
  // Removed initialNodes from dependency array of memoizedNodeTypes as it's a common source of re-renders.
  // The individual WorkflowNodeComponent instances will update based on their own props.

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const agentId = event.dataTransfer.getData('text/plain');
      if (!agentId) {
        console.warn('Dropped item has no agent ID.');
        toast({
          title: 'Drop Error',
          description: 'No agent ID found in dropped item.',
          variant: 'destructive',
        });
        return;
      }

      if (!reactFlowInstance || !dropTargetRef.current) {
        console.error('React Flow instance or wrapper not available for drop.');
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
    [reactFlowInstance, onAgentDrop]
  );

  if (initialNodes.length === 0 && !isTeaser) {
    return <EmptyCanvas />;
  }

  // Dummy handlers for WorkflowControlsComponent props that are now known to be required
  const handleDummySave = () =>
    toast({ title: 'Save Element', description: 'This action is not implemented in this canvas.' });
  const handleDummyRunNode = () =>
    toast({ title: 'Run Node', description: 'This action is not implemented in this canvas.' });
  const handleDummyLoadWorkflow = () =>
    toast({
      title: 'Load Workflow',
      description: 'This action is not implemented in this canvas.',
    });

  return (
    <div
      className="space-y-4"
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {!isTeaser && (
        <WorkflowControlsComponent
          flowDirection={flowDirection}
          agentsCount={initialNodes.length}
          isRunning={isRunning}
          onToggleDirection={toggleFlowDirection}
          onSaveWorkflow={saveWorkflow}
          onRunWorkflow={runWorkflow}
          onLoadWorkflow={handleDummyLoadWorkflow} // Required by types.tsx (actual)
          onRun={handleDummyRunNode} // Required by types.tsx (actual)
        />
      )}
      <div
        className={`workflow-canvas-rf relative rounded-xl border border-border overflow-hidden bg-card/30 ${isTeaser ? 'h-full cursor-default' : 'h-full'}`}
        style={{ flexGrow: 1, minHeight: isTeaser ? '300px' : '400px' }}
        ref={dropTargetRef}
        onDragOver={isTeaser ? undefined : handleDragOver}
        onDrop={isTeaser ? undefined : handleDrop}
      >
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={isTeaser ? undefined : handleRfNodesChange}
          onEdgesChange={isTeaser ? undefined : handleRfEdgesChange}
          onConnect={isTeaser ? undefined : handleRfConnect}
          onNodeClick={isTeaser ? undefined : handleRfNodeClick}
          onPaneClick={isTeaser ? undefined : () => onSelectNodeCb && onSelectNodeCb(null)}
          nodeTypes={memoizedNodeTypes}
          fitView
          panOnScroll={!isTeaser}
          zoomOnScroll={!isTeaser}
          zoomOnDoubleClick={!isTeaser}
          zoomOnPinch={!isTeaser}
          nodesDraggable={!isTeaser}
          nodesConnectable={!isTeaser}
          elementsSelectable={!isTeaser}
        >
          <Controls style={{ display: isTeaser ? 'none' : 'flex' }} />
          <MiniMap
            style={{ display: isTeaser ? 'none' : 'flex' }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Background gap={16} color="#ccc" variant={BackgroundVariant.Dots} />
          {!isTeaser && (
            <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 4 }}>
              <StatusIndicator status={isRunning ? 'running' : 'idle'} />
            </div>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowCanvasWrapper = (props: WorkflowCanvasProps) => (
  <ReactFlowProvider>
    <WorkflowCanvas {...props} />
  </ReactFlowProvider>
);

export default WorkflowCanvasWrapper;
