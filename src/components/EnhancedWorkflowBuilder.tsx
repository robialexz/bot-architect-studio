import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  Save,
  Settings,
  Search,
  RefreshCw,
} from 'lucide-react';

import { NodeTemplateService } from '@/services/nodeTemplateService';
import { EnhancedWorkflowService } from '@/services/enhancedWorkflowService';
import { NodeTemplate, NodeCategory } from '@/types/nodeTemplates';
import { Workflow, WorkflowNode, NodeType, WorkflowCategory, WorkflowStatus } from '@/types/workflow';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import WorkflowOnboarding from './WorkflowOnboarding';
import AIModelConfigWizard from './AIModelConfigWizard';
import InteractiveWorkflowDemo from './InteractiveWorkflowDemo';
import InteractiveTutorial from './tutorial/InteractiveTutorial';
import ComprehensiveInteractiveTutorial from './tutorial/ComprehensiveInteractiveTutorial';
import TutorialProgressTracker from './tutorial/TutorialProgressTracker';
import ContextualHelp from './help/ContextualHelp';
import SmartOnboarding from './onboarding/SmartOnboarding';

// Custom node components
import AINodeComponent from './nodes/AINodeComponent';
import DataNodeComponent from './nodes/DataNodeComponent';
import IntegrationNodeComponent from './nodes/IntegrationNodeComponent';
import TriggerNodeComponent from './nodes/TriggerNodeComponent';

// Memoize nodeTypes to prevent ReactFlow warnings
const nodeTypes = {
  aiNode: AINodeComponent,
  dataNode: DataNodeComponent,
  integrationNode: IntegrationNodeComponent,
  triggerNode: TriggerNodeComponent,
};

interface EnhancedWorkflowBuilderProps {
  workflowId?: string | undefined;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (workflow: Workflow) => void;
}

const EnhancedWorkflowBuilder: React.FC<EnhancedWorkflowBuilderProps> = ({
  workflowId,
  onSave,
  onExecute,
}) => {
  const { user } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Services
  const nodeTemplateService = NodeTemplateService.getInstance();
  const workflowService = EnhancedWorkflowService.getInstance();

  // State
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory>(NodeCategory.AI_MODELS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAIConfigWizard, setShowAIConfigWizard] = useState(false);
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);

  // Smooth drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<{
    template: NodeTemplate | null;
    position: { x: number; y: number };
  }>({ template: null, position: { x: 0, y: 0 } });

  // Enhanced tutorial and help states
  const [showSmartOnboarding, setShowSmartOnboarding] = useState(false);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(false);
  const [showComprehensiveTutorial, setShowComprehensiveTutorial] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [tutorialType, setTutorialType] = useState<'beginner' | 'intermediate' | 'advanced'>(
    'beginner'
  );
  const [showContextualHelp, setShowContextualHelp] = useState(true);
  const [currentContext, setCurrentContext] = useState('node-library');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [completedExercises] = useState<string[]>([]);

  const handleNodeConfigChange = useCallback(
    (nodeId: string, config: Record<string, unknown>) => {
      setNodes(nds =>
        nds.map(node => (node.id === nodeId ? { ...node, data: { ...node.data, config } } : node))
      );
    },
    [setNodes]
  );

  const getReactFlowNodeType = useCallback(
    (nodeType: string): string => {
      if (Object.values(NodeType).includes(nodeType as NodeType)) {
        const template = nodeTemplateService.getTemplate(nodeType);
        if (template) {
          switch (template.category) {
            case NodeCategory.AI_MODELS:
              return 'aiNode';
            case NodeCategory.DATA_PROCESSING:
              return 'dataNode';
            case NodeCategory.INTEGRATIONS:
              return 'integrationNode';
            case NodeCategory.UTILITIES:
              return 'utilityNode';
            case NodeCategory.TRIGGERS:
              return 'triggerNode';
            default:
              return 'default';
          }
        }
      }
      return 'default';
    },
    [nodeTemplateService]
  );

  const mapWorkflowNodeToReactFlowNode = useCallback(
    (workflowNode: WorkflowNode): Node => {
      const template = nodeTemplateService.getTemplate(workflowNode.type);
      return {
        id: workflowNode.id,
        type: getReactFlowNodeType(workflowNode.type),
        position: workflowNode.position,
        data: {
          ...workflowNode.data,
          template,
          onConfigChange: (config: Record<string, unknown>) =>
            handleNodeConfigChange(workflowNode.id, config),
        },
      };
    },
    [nodeTemplateService, getReactFlowNodeType, handleNodeConfigChange]
  );

  const loadWorkflow = useCallback(
    async (id: string) => {
      try {
        const loadedWorkflow = await workflowService.getWorkflow(id);
        if (loadedWorkflow) {
          setWorkflow(loadedWorkflow);
          setNodes(loadedWorkflow.nodes.map(mapWorkflowNodeToReactFlowNode));
          setEdges(loadedWorkflow.edges);
          toast.success('Workflow loaded successfully');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error loading workflow:', error);
        // Don't show error toast for expected cases like new workflows
        if (!id.includes('new')) {
          toast.error(`Failed to load workflow: ${errorMessage}`);
        }
      }
    },
    [workflowService, setNodes, setEdges, mapWorkflowNodeToReactFlowNode]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    // Add visual feedback for drag over
    const target = event.currentTarget as HTMLElement;
    const pane = target.querySelector('.react-flow__pane') as HTMLElement;

    if (pane && !pane.classList.contains('drag-over')) {
      pane.classList.add('drag-over');
    }
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    const target = event.currentTarget as HTMLElement;
    const pane = target.querySelector('.react-flow__pane') as HTMLElement;

    if (pane) {
      pane.classList.remove('drag-over');
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Clean up drag visual feedback
      const target = event.currentTarget as HTMLElement;
      const pane = target.querySelector('.react-flow__pane') as HTMLElement;
      if (pane) {
        pane.classList.remove('drag-over');
      }

      const templateId = event.dataTransfer.getData('application/reactflow');

      if (typeof templateId === 'undefined' || !templateId || !reactFlowInstance) {
        return;
      }

      const template = nodeTemplateService.getTemplate(templateId);
      if (!template) return;

      // Get the sidebar width (w-80 = 320px)
      const sidebarWidth = 320;

      // Calculate position accounting for sidebar offset
      // The mouse position is relative to the viewport, so we subtract the sidebar width
      const position = reactFlowInstance.project({
        x: event.clientX - sidebarWidth,
        y: event.clientY,
      });

      const nodeId = `${template.type}_${Date.now()}`;
      const newNode: Node = {
        id: nodeId,
        type: getReactFlowNodeType(template.type),
        position,
        data: {
          label: template.name,
          template,
          config: {},
          onConfigChange: (config: Record<string, unknown>) =>
            handleNodeConfigChange(nodeId, config),
        },
      };

      setNodes(nds => nds.concat(newNode));

      // Show success message
      toast.success(`Added ${template.name} to workflow`);
    },
    [reactFlowInstance, nodeTemplateService, setNodes, getReactFlowNodeType, handleNodeConfigChange]
  );

  const handleSaveWorkflow = async () => {
    if (!user) {
      toast.error('Please log in to save workflows');
      return;
    }

    try {
      const workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name: workflow?.name || 'Untitled Workflow',
        description: workflow?.description || '',
        nodes: nodes.map(mapReactFlowNodeToWorkflowNode),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          label: typeof edge.label === 'string' ? edge.label : undefined,
        })),
        userId: user.id,
        isPublic: false,
        tags: [],
        category: WorkflowCategory.CUSTOM,
        status: WorkflowStatus.DRAFT,
        version: 1,
        lastExecuted: undefined,
        executionCount: 0,
        settings: {
          autoSave: true,
          executionTimeout: 300,
          retryOnFailure: false,
          maxRetries: 3,
          enableLogging: true,
          enableAnalytics: true,
        },
      };

      let savedWorkflow: Workflow;
      if (workflow?.id) {
        savedWorkflow = await workflowService.updateWorkflow(workflow.id, workflowData);
      } else {
        savedWorkflow = await workflowService.createWorkflow(workflowData);
      }

      setWorkflow(savedWorkflow);
      toast.success('Workflow saved successfully');
      onSave?.(savedWorkflow);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to save workflow: ${errorMessage}`);
      console.error('Error saving workflow:', error);
    }
  };

  const mapReactFlowNodeToWorkflowNode = (node: Node): WorkflowNode => {
    return {
      id: node.id,
      type: node.data.template?.type || node.type,
      position: node.position,
      data: {
        label: node.data.label,
        name: node.data.label,
        config: node.data.config,
      },
      status: 'idle',
    };
  };

  const handleExecuteWorkflow = async () => {
    if (!workflow?.id) {
      toast.error('Please save the workflow before executing');
      return;
    }

    setIsExecuting(true);
    try {
      // Import the new execution service
      const { workflowExecutionService } = await import('@/services/workflowExecutionInstance');

      // Prepare execution inputs
      const inputs = {
        workflowId: workflow.id,
        triggeredBy: 'manual',
        timestamp: new Date().toISOString(),
      };

      // Execute workflow using the new execution engine
      const result = await workflowExecutionService.executeWorkflow(workflow.id, inputs);

      toast.success(`Workflow executed successfully! Execution ID: ${result.executionId}`);
      console.log('Execution result:', result);

      onExecute?.(workflow);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to execute workflow: ${errorMessage}`);
      console.error('Error executing workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getFilteredTemplates = () => {
    try {
      let templates = nodeTemplateService.getTemplatesByCategory(selectedCategory);

      if (searchQuery) {
        templates = nodeTemplateService.searchTemplates(searchQuery);
      }

      return templates;
    } catch (error) {
      console.error('Error getting filtered templates:', error);
      return [];
    }
  };

  // Enhanced mouse tracking with smooth interpolation
  useEffect(() => {
    if (!isDragging) return;

    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };

      // Smooth interpolation for fluid movement
      const smoothUpdate = () => {
        setDragPreview(prev => ({
          ...prev,
          position: newPosition,
        }));
      };

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(smoothUpdate);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragPreview({ template: null, position: { x: 0, y: 0 } });
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('dragend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dragend', handleMouseUp);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDragging]);

  const onDragStart = useCallback((event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', template.id);
    event.dataTransfer.effectAllowed = 'move';

    // Set drag state for visual feedback
    setIsDragging(true);
    setDragPreview({
      template,
      position: { x: event.clientX, y: event.clientY },
    });

    // Use a small transparent image
    const dragImage = new Image();
    dragImage.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    event.dataTransfer.setDragImage(dragImage, 0, 0);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragPreview({ template: null, position: { x: 0, y: 0 } });
  }, []);

  // Load workflow if workflowId is provided - Fixed hoisting issue
  useEffect(() => {
    if (workflowId && workflowId !== 'new' && workflowId !== 'new-workflow') {
      loadWorkflow(workflowId);
    }
  }, [workflowId, loadWorkflow]);

  // Smart onboarding for new users - Disabled for now to allow direct access to workflow builder
  useEffect(() => {
    // Temporarily disable automatic onboarding to fix workflow builder access
    // if (!hasSeenOnboarding && !workflowId) {
    //   setShowSmartOnboarding(true);
    // }
  }, [workflowId]);

  // Context detection for contextual help
  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as Element;
      if (target.closest('.w-80.border-r')) {
        setCurrentContext('node-library');
      } else if (target.closest('[data-testid="rf__wrapper"]')) {
        setCurrentContext('canvas');
      } else if (target.closest('[data-context="properties"]')) {
        setCurrentContext('properties');
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  const handleStartTutorial = (type: 'beginner' | 'intermediate' | 'advanced') => {
    setTutorialType(type);
    setShowInteractiveTutorial(true);
    setUserLevel(type);
    localStorage.setItem('aiflow-user-level', type);
  };

  const handleCompleteTutorial = () => {
    setShowInteractiveTutorial(false);
    localStorage.setItem('aiflow-onboarding-completed', 'true');
    toast.success("Tutorial completed! You're ready to build amazing workflows.");
  };

  const handleCompleteComprehensiveTutorial = () => {
    setShowComprehensiveTutorial(false);
    localStorage.setItem('aiflow-comprehensive-tutorial-completed', 'true');
    toast.success("🎉 Comprehensive tutorial completed! You're now a workflow expert!");
  };

  const handleCompleteOnboarding = () => {
    setShowSmartOnboarding(false);
    localStorage.setItem('aiflow-onboarding-completed', 'true');
  };

  const handleStartLearningPath = () => {
    setShowProgressTracker(false);
    // Logic to start specific learning path
    setShowComprehensiveTutorial(true);
  };

  // Get current workflow state for tutorial validation
  const getWorkflowState = useCallback(() => {
    return {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type || 'default',
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };
  }, [nodes, edges]);

  return (
    <div className="h-screen w-screen flex bg-transparent overflow-hidden fixed inset-0">
      {/* Luxury Node Library Sidebar */}
      <div className="node-library-sidebar w-80 h-full bg-black/90 backdrop-blur-2xl border-r border-white/10 shadow-2xl relative overflow-hidden flex-shrink-0">
        {/* Subtle Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5"></div>

        <div className="p-8 relative z-10">
          {/* Luxury Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-light text-white/90 tracking-wide mb-2">Components</h2>
            <p className="text-sm text-white/60 font-light leading-relaxed">
              Drag components to build workflows
            </p>
          </div>

          {/* Luxury Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 rounded-lg h-12 font-light"
              />
            </div>
          </div>

          {/* Luxury Category Navigation */}
          <Tabs
            value={selectedCategory}
            onValueChange={value => setSelectedCategory(value as NodeCategory)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 border border-white/10 rounded-lg p-1">
              <TabsTrigger
                value={NodeCategory.AI_MODELS}
                className="text-sm text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 rounded-md font-light"
              >
                AI Models
              </TabsTrigger>
              <TabsTrigger
                value={NodeCategory.DATA_PROCESSING}
                className="text-sm text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 rounded-md font-light"
              >
                Data
              </TabsTrigger>
            </TabsList>

            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/5 border border-white/10 rounded-lg p-1">
              <TabsTrigger
                value={NodeCategory.INTEGRATIONS}
                className="text-sm text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 rounded-md font-light"
              >
                Apps
              </TabsTrigger>
              <TabsTrigger
                value={NodeCategory.UTILITIES}
                className="text-sm text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 rounded-md font-light"
              >
                Utils
              </TabsTrigger>
              <TabsTrigger
                value={NodeCategory.TRIGGERS}
                className="text-sm text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300 rounded-md font-light"
              >
                Triggers
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Luxury Node Templates */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-2">
              {getFilteredTemplates().length > 0 ? (
                getFilteredTemplates().map(template => (
                  <Card
                    key={template.id}
                    className="cursor-grab hover:bg-white/5 transition-all duration-300 bg-white/[0.02] border border-white/10 hover:border-white/20 group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                    draggable
                    onDragStart={event => onDragStart(event, template)}
                    onDragEnd={onDragEnd}
                    tabIndex={0}
                    role="button"
                    aria-label={`Drag ${template.name} component to workflow canvas. ${template.description}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Add component to center of canvas on keyboard activation
                        const centerPosition = { x: 400, y: 300 };
                        onDrop({
                          preventDefault: () => {},
                          clientX: centerPosition.x,
                          clientY: centerPosition.y,
                          dataTransfer: {
                            getData: () => template.id,
                          },
                        } as unknown as React.DragEvent<HTMLDivElement>);
                      }
                    }}
                  >
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="text-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-light text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                            {template.name}
                          </h3>
                          <p className="text-xs text-white/50 mt-1 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60 text-sm">No components found</p>
                  <p className="text-white/40 text-xs mt-1">
                    Try a different category or search term
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Luxury Workflow Canvas */}
      <div className="flex-1 h-screen relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Subtle Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]"></div>

        <ReactFlowProvider>
          <div className="h-screen w-full relative z-10 overflow-hidden" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              nodeTypes={nodeTypes}
              fitView
              preventScrolling={false}
              panOnScroll={false}
              zoomOnScroll={true}
              zoomOnPinch={true}
              panOnDrag={true}
              zoomActivationKeyCode={null}
              panActivationKeyCode="Space"
              className="bg-transparent"
            >
              <Controls className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg" />
              <Background
                variant={BackgroundVariant.Dots}
                gap={30}
                size={1}
                color="#ffffff"
                className="opacity-10"
              />

              {/* Minimal Floating Action Buttons - Luxury Design */}
              <Panel position="top-right" className="mt-6 mr-6">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleExecuteWorkflow}
                    disabled={isExecuting || !workflow?.id}
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-white/30"
                    title="Execute Workflow"
                    aria-label={isExecuting ? 'Executing workflow...' : 'Execute workflow'}
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveWorkflow}
                    disabled={!user}
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group"
                    title="Save Workflow"
                  >
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button
                    size="sm"
                    className="w-12 h-12 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 group"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </Panel>

              {/* Luxury Welcome Message */}
              {nodes.length === 0 && (
                <Panel position="top-center" className="pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 shadow-2xl max-w-md text-center">
                    <div className="relative z-10">
                      <h3 className="text-3xl font-light text-white/90 mb-4 tracking-wide">
                        Build Workflows
                      </h3>
                      <p className="text-white/60 leading-relaxed text-base font-light">
                        Drag components from the sidebar to create your automation workflow
                      </p>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <WorkflowOnboarding
          onComplete={template => {
            setShowOnboarding(false);
            if (template) {
              handleImportTemplate(template);
            }
          }}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      {/* AI Model Configuration Wizard */}
      {showAIConfigWizard && configNodeId && (
        <AIModelConfigWizard
          initialConfig={getNodeConfig(configNodeId)}
          onClose={() => {
            setShowAIConfigWizard(false);
            setConfigNodeId(null);
          }}
          onSave={config => {
            handleNodeConfigChange(configNodeId, config as Record<string, unknown>);
            setShowAIConfigWizard(false);
            setConfigNodeId(null);
          }}
        />
      )}

      {/* Smart Onboarding */}
      <SmartOnboarding
        isOpen={showSmartOnboarding}
        onClose={handleCompleteOnboarding}
        onStartTutorial={handleStartTutorial}
        userProfile={{
          experience:
            userLevel === 'beginner' ? 'none' : userLevel === 'intermediate' ? 'some' : 'expert',
          interests: ['ai', 'automation'],
          goals: ['learn', 'build'],
        }}
      />

      {/* Interactive Tutorial */}
      <InteractiveTutorial
        isOpen={showInteractiveTutorial}
        onClose={() => setShowInteractiveTutorial(false)}
        onComplete={handleCompleteTutorial}
        tutorialType={tutorialType}
      />

      {/* Comprehensive Interactive Tutorial */}
      <ComprehensiveInteractiveTutorial
        isOpen={showComprehensiveTutorial}
        onClose={() => setShowComprehensiveTutorial(false)}
        onComplete={handleCompleteComprehensiveTutorial}
        tutorialLevel={tutorialType}
        workflowBuilder={{
          getWorkflowState,
          testExecution: async () => {
            return { success: true, result: 'Tutorial execution successful' };
          },
        }}
      />

      {/* Tutorial Progress Tracker */}
      <TutorialProgressTracker
        isOpen={showProgressTracker}
        onClose={() => setShowProgressTracker(false)}
        currentLevel={userLevel}
        completedExercises={completedExercises}
        onStartPath={handleStartLearningPath}
      />

      {/* Contextual Help */}
      <ContextualHelp
        context={currentContext}
        userLevel={userLevel}
        isVisible={showContextualHelp}
        onToggle={() => setShowContextualHelp(!showContextualHelp)}
      />

      {/* Interactive Workflow Demo */}
      {showInteractiveDemo && (
        <InteractiveWorkflowDemo onClose={() => setShowInteractiveDemo(false)} />
      )}

      {/* Smooth Drag Preview */}
      {isDragging && dragPreview.template && (
        <div
          className="smooth-drag-preview"
          style={
            {
              '--drag-x': `${dragPreview.position.x - 150}px`,
              '--drag-y': `${dragPreview.position.y - 40}px`,
            } as React.CSSProperties
          }
        >
          <div className="drag-card">
            <div className="flex items-center gap-3">
              <div className="text-lg opacity-80">{dragPreview.template.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-light text-sm text-white/90">{dragPreview.template.name}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {dragPreview.template.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper functions
  function handleImportTemplate(template: NodeTemplate) {
    console.log('Importing template:', template);
  }

  function getNodeConfig(nodeId: string) {
    const node = nodes.find(n => n.id === nodeId);
    return node?.data?.config || {};
  }
};

export default EnhancedWorkflowBuilder;
