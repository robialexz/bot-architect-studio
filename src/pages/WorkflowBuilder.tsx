import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import '../styles/workflow-builder.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EnhancedWorkflowBuilder from '@/components/EnhancedWorkflowBuilder';
import VoiceCommandsPanel from '@/components/VoiceCommandsPanel';
import { EnhancedWorkflowService } from '@/services/enhancedWorkflowService';
import { Workflow, WorkflowCategory, WorkflowStatus } from '@/types/workflow';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';

const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id') || 'new';

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);

  const workflowService = EnhancedWorkflowService.getInstance();

  const loadWorkflow = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const loadedWorkflow = await workflowService.getWorkflow(id);
        if (loadedWorkflow) {
          setWorkflow(loadedWorkflow);
        } else {
          toast.error('Workflow not found');
          navigate('/workflows');
        }
      } catch (error) {
        toast.error('Failed to load workflow');
        console.error('Error loading workflow:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, workflowService]
  );

  useEffect(() => {
    if (workflowId && workflowId !== 'new') {
      loadWorkflow(workflowId);
    } else {
      // Create new workflow - always create it regardless of user state
      setWorkflow({
        id: 'new-workflow',
        name: 'Untitled Workflow',
        description: '',
        nodes: [],
        edges: [],
        userId: user?.id || 'anonymous',
        isPublic: false,
        tags: [],
        category: WorkflowCategory.CUSTOM,
        status: WorkflowStatus.DRAFT,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        executionCount: 0,
        settings: {
          autoSave: true,
          executionTimeout: 300,
          retryOnFailure: false,
          maxRetries: 3,
          enableLogging: true,
          enableAnalytics: true,
        },
      });
    }
  }, [workflowId, loadWorkflow, user?.id]);

  // Add/remove body class for full-screen workflow builder
  useEffect(() => {
    document.body.classList.add('workflow-builder-active');
    document.body.style.overflow = 'hidden'; // Prevent any scrolling
    document.documentElement.style.overflow = 'hidden'; // Prevent any scrolling on html element

    return () => {
      document.body.classList.remove('workflow-builder-active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleSaveWorkflow = async (updatedWorkflow: Workflow) => {
    try {
      setWorkflow(updatedWorkflow);
      toast.success('Workflow saved successfully');

      // Update URL if this was a new workflow
      if (workflowId === 'new') {
        navigate(`/workflow-builder?id=${updatedWorkflow.id}`, { replace: true });
      }
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Error saving workflow:', error);
    }
  };

  const handleExecuteWorkflow = async (workflowToExecute: Workflow) => {
    try {
      // Import the new execution service
      const { workflowExecutionService } = await import('@/services/workflowExecutionInstance');

      // Prepare execution inputs
      const inputs = {
        workflowId: workflowToExecute.id,
        triggeredBy: 'manual',
        timestamp: new Date().toISOString()
      };

      // Execute workflow using the new execution engine
      const result = await workflowExecutionService.executeWorkflow(workflowToExecute.id, inputs);

      toast.success(`Workflow executed successfully! Execution ID: ${result.executionId}`);
      console.log('Execution result:', result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute workflow';
      toast.error(errorMessage);
      console.error('Error executing workflow:', error);
    }
  };

  const handleWorkflowSettingsChange = (field: string, value: unknown) => {
    if (!workflow) return;

    setWorkflow({
      ...workflow,
      [field]: value,
    });
  };

  const handleWorkflowSettingsUpdate = (settings: Record<string, unknown>) => {
    if (!workflow) return;

    setWorkflow({
      ...workflow,
      settings: { ...workflow.settings, ...settings },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Workflow not found</p>
          <Button onClick={() => navigate('/workflows')} className="mt-4">
            Back to Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="workflow-builder-container h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden fixed inset-0">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]"></div>

      {/* Luxury Back Button - Floating */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/workflows')}
          className="bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-light rounded-full w-10 h-10 p-0"
          title="Back to Workflows"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Full-Screen Workflow Builder - No Scroll, Only Zoom/Pan */}
      <div className="h-full w-full overflow-hidden">
        <EnhancedWorkflowBuilder
          workflowId={workflow?.id && workflow.id !== 'new-workflow' ? workflow.id : undefined}
          onSave={handleSaveWorkflow}
          onExecute={handleExecuteWorkflow}
        />
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Workflow Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="execution">Execution</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  value={workflow.name}
                  onChange={e => handleWorkflowSettingsChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={workflow.description}
                  onChange={e => handleWorkflowSettingsChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={workflow.category}
                  onValueChange={value => handleWorkflowSettingsChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(WorkflowCategory).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="execution" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Execution Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={workflow.settings.executionTimeout}
                  onChange={e =>
                    handleWorkflowSettingsUpdate({
                      executionTimeout: parseInt(e.target.value) || 300,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retries">Max Retries</Label>
                <Input
                  id="retries"
                  type="number"
                  value={workflow.settings.maxRetries}
                  onChange={e =>
                    handleWorkflowSettingsUpdate({
                      maxRetries: parseInt(e.target.value) || 3,
                    })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logging">Enable Logging</Label>
                  <input
                    id="logging"
                    type="checkbox"
                    checked={workflow.settings.enableLogging}
                    onChange={e =>
                      handleWorkflowSettingsUpdate({
                        enableLogging: e.target.checked,
                      })
                    }
                    aria-label="Enable workflow logging"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Enable Analytics</Label>
                  <input
                    id="analytics"
                    type="checkbox"
                    checked={workflow.settings.enableAnalytics}
                    onChange={e =>
                      handleWorkflowSettingsUpdate({
                        enableAnalytics: e.target.checked,
                      })
                    }
                    aria-label="Enable workflow analytics"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Commands Panel */}
      <VoiceCommandsPanel
        isOpen={showVoiceCommands}
        onClose={() => setShowVoiceCommands(false)}
        onVoiceCommand={command => {
          // Handle voice commands for enhanced workflow builder
          switch (command) {
            case 'save workflow':
              if (workflow) {
                handleSaveWorkflow(workflow);
              }
              break;
            case 'run workflow':
            case 'execute workflow':
              if (workflow) {
                handleExecuteWorkflow(workflow);
              }
              break;
            case 'open settings':
              setShowSettings(true);
              break;
            default:
              toast.info(`Voice command received: ${command}`);
          }
        }}
      />
    </div>
  );
};

export default WorkflowBuilder;
