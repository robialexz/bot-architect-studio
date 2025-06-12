import { type AIAgent } from '../AIAgentCard';
import { type WorkflowNode, type Connection, type NodeStatus, type Edge } from '@/types/workflow';

export interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: Edge[];
  onRemoveNode: (id: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void; // Added
  onConnect?: (connection: Connection) => void; // Added for edge creation
  isTeaser?: boolean; // Added for teaser mode
  onNodeClick?: (node: WorkflowNode) => void;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  onDeleteNode?: (nodeId: string) => void;
  onAgentDrop: (agentId: string, position: { x: number; y: number }) => void;
}

export interface WorkflowNodeProps {
  node: WorkflowNode;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onRemove: (id: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void; // Added
  isLastNode: boolean;
  onStartConnectorDrag?: (
    nodeId: string,
    handleType: 'source' | 'target',
    e: React.MouseEvent<HTMLDivElement>
  ) => void;
  onNodeClick?: () => void;
  isTeaser?: boolean; // Added for teaser mode
  isSelected?: boolean;
}

export interface ConnectionRendererProps {
  connections: Connection[];
  agents: WorkflowNode[];
  flowDirection: 'horizontal' | 'vertical';
  isRunning: boolean;
  activeNodeId: string | null;
}

export interface WorkflowControlsProps {
  flowDirection: 'horizontal' | 'vertical';
  isRunning: boolean;
  agentsCount: number;
  onToggleDirection: () => void;
  onSave?: () => void; // Added back as optional
  onRun: () => void;
  onRunWorkflow: () => Promise<void>;
  onSaveWorkflow: () => void;
  onLoadWorkflow: () => void;
}
export type EmptyCanvasProps = Record<string, never>;
