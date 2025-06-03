import { useMemo } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  ReactFlowProvider,
  BackgroundVariant,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowCanvas } from './hooks/useWorkflowCanvas';
import { useWorkflowEvents } from './hooks/useWorkflowEvents';
import type { WorkflowNodeData } from '@/types/workflow';
import { type WorkflowCanvasProps } from './types';
import WorkflowNodeComponent from './WorkflowNode';
import WorkflowControlsComponent from './WorkflowControls';
import EmptyCanvas from './EmptyCanvas';
import StatusIndicator from './StatusIndicator';
import { toast } from '@/hooks/use-toast';

const WorkflowCanvasRefactored = (props: WorkflowCanvasProps) => {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    onUpdateNode,
    onConnect: onConnectProp,
    onNodeClick,
    isTeaser = false,
    selectedNodeId,
    onSelectNode,
    onDeleteNode,
    onAgentDrop,
  } = props;

  // Use custom hooks for state management and logic
  const {
    isRunning,
    activeNodeId,
    flowDirection,
    rfNodes,
    rfEdges,
    dropTargetRef,
    runWorkflow,
    saveWorkflow,
    toggleFlowDirection,
    // setRfNodes,
    // setRfEdges,
    onRfNodesChange,
    onRfEdgesChange,
    reactFlowInstance,
  } = useWorkflowCanvas({
    initialNodes,
    initialEdges,
    onUpdateNode,
    onConnect: onConnectProp || (() => {}),
    onDeleteNode: onDeleteNode || (() => {}),
    selectedNodeId: selectedNodeId || null,
    isTeaser,
  });

  // Use custom hook for event handling
  const {
    handleRfNodesChange,
    handleRfEdgesChange,
    handleRfConnect,
    handleRfNodeClick,
    handleDragOver,
    handleDrop,
  } = useWorkflowEvents({
    initialNodes,
    onUpdateNode,
    onConnect: onConnectProp || (() => {}),
    onDeleteNode: onDeleteNode || (() => {}),
    onNodeClick: onNodeClick || (() => {}),
    onSelectNode: onSelectNode || (() => {}),
    onAgentDrop: onAgentDrop || (() => {}),
    selectedNodeId: selectedNodeId || null,
    isTeaser,
    reactFlowInstance,
    dropTargetRef,
    onRfNodesChange,
    onRfEdgesChange,
  });

  // Memoized node types for performance
  const memoizedNodeTypes = useMemo(
    () => ({
      custom: (rfNodeProps: NodeProps<WorkflowNodeData>) => (
        <WorkflowNodeComponent
          {...rfNodeProps}
          isActive={!isTeaser && activeNodeId === rfNodeProps.id}
          onRemove={(nodeId: string) => {
            if (onDeleteNode) {
              onDeleteNode(nodeId);
            }
          }}
          onNodeClick={nodeFromComponent => {
            if (onNodeClick) {
              onNodeClick(nodeFromComponent);
            }
            if (onSelectNode) {
              onSelectNode(nodeFromComponent.id);
            }
          }}
          onUpdateNodeData={(nodeId: string, dataChanges: Partial<WorkflowNodeData>) => {
            if (onUpdateNode) {
              const nodeToUpdate = initialNodes.find(n => n.id === nodeId);
              if (nodeToUpdate) {
                const newData = { ...nodeToUpdate.data, ...dataChanges };
                onUpdateNode(nodeId, { data: newData });
              }
            }
          }}
          isTeaser={isTeaser}
        />
      ),
    }),
    [activeNodeId, isTeaser, onDeleteNode, onNodeClick, onSelectNode, onUpdateNode, initialNodes]
  );

  // Dummy handlers for required props
  const handleDummyLoadWorkflow = () =>
    toast({
      title: 'Load Workflow',
      description: 'This action is not implemented in this canvas.',
    });

  const handleDummyRunNode = () =>
    toast({
      title: 'Run Node',
      description: 'This action is not implemented in this canvas.',
    });

  // Early return for empty canvas
  if (initialNodes.length === 0 && !isTeaser) {
    return <EmptyCanvas />;
  }

  return (
    <div className="space-y-4 workflow-canvas-container">
      {!isTeaser && (
        <WorkflowControlsComponent
          flowDirection={flowDirection}
          agentsCount={initialNodes.length}
          isRunning={isRunning}
          onToggleDirection={toggleFlowDirection}
          onSaveWorkflow={saveWorkflow}
          onRunWorkflow={runWorkflow}
          onLoadWorkflow={handleDummyLoadWorkflow}
          onRun={handleDummyRunNode}
        />
      )}

      <div
        className={`workflow-canvas-rf workflow-canvas-main relative rounded-xl border border-border overflow-hidden bg-card/30 ${
          isTeaser ? 'h-full cursor-default workflow-canvas-teaser' : 'h-full workflow-canvas-full'
        }`}
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
          onPaneClick={isTeaser ? undefined : () => onSelectNode && onSelectNode(null)}
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
          <Controls className={isTeaser ? 'minimap-hidden' : 'minimap-visible'} />
          <MiniMap
            className={isTeaser ? 'minimap-hidden' : 'minimap-visible'}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          <Background gap={16} color="#ccc" variant={BackgroundVariant.Dots} />
          {!isTeaser && (
            <div className="workflow-status-indicator">
              <StatusIndicator status={isRunning ? 'running' : 'idle'} />
            </div>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

const WorkflowCanvasRefactoredWrapper = (props: WorkflowCanvasProps) => (
  <ReactFlowProvider>
    <WorkflowCanvasRefactored {...props} />
  </ReactFlowProvider>
);

export default WorkflowCanvasRefactoredWrapper;
