import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Zap,
  DollarSign,
} from 'lucide-react';
import { WorkflowExecution, ExecutionStatus } from '@/types/execution';
import { workflowExecutionService } from '@/services/workflowExecutionInstance';
import { logger } from '@/lib/logger';

interface WorkflowExecutionDashboardProps {
  workflowId: string;
  onExecutionSelect?: (execution: WorkflowExecution) => void;
}

export const WorkflowExecutionDashboard: React.FC<WorkflowExecutionDashboardProps> = ({
  workflowId,
  onExecutionSelect,
}) => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExecutions();
  }, [workflowId]);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const executionHistory = await workflowExecutionService.getExecutionHistory(workflowId, 20);
      setExecutions(executionHistory);

      if (executionHistory.length > 0 && !selectedExecution) {
        setSelectedExecution(executionHistory[0]);
        onExecutionSelect?.(executionHistory[0]);
      }
    } catch (error) {
      logger.error('Failed to load executions', { error });
    } finally {
      setLoading(false);
    }
  };

  const refreshExecutions = async () => {
    try {
      setRefreshing(true);
      await loadExecutions();
    } finally {
      setRefreshing(false);
    }
  };

  const handleExecutionSelect = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    onExecutionSelect?.(execution);
  };

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ExecutionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return 'N/A';
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Activity className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading executions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workflow Executions</CardTitle>
            <CardDescription>Recent execution history for this workflow</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshExecutions} disabled={refreshing}>
            {refreshing ? (
              <Activity className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No executions found for this workflow</p>
              <p className="text-sm">Execute the workflow to see results here</p>
            </div>
          ) : (
            <Tabs defaultValue="list" className="w-full">
              <TabsList>
                <TabsTrigger value="list">Execution List</TabsTrigger>
                <TabsTrigger value="details">Execution Details</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-2">
                <ScrollArea className="h-64">
                  {executions.map(execution => (
                    <Card
                      key={execution.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedExecution?.id === execution.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleExecutionSelect(execution)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(execution.status)}
                            <div>
                              <p className="font-medium text-sm">
                                {execution.id.substring(0, 8)}...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {execution.createdAt.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(execution.status)}>
                              {execution.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(execution.startedAt, execution.completedAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="details">
                {selectedExecution ? (
                  <ExecutionDetails execution={selectedExecution} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Select an execution to view details</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ExecutionDetailsProps {
  execution: WorkflowExecution;
}

const ExecutionDetails: React.FC<ExecutionDetailsProps> = ({ execution }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">{execution.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {execution.startedAt && execution.completedAt
                    ? `${((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000).toFixed(1)}s`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">Inputs</p>
                <p className="font-medium">{Object.keys(execution.inputs).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Outputs</p>
                <p className="font-medium">{Object.keys(execution.outputs).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Execution Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <pre className="text-xs bg-muted p-2 rounded">
                {JSON.stringify(execution.inputs, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Execution Outputs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <pre className="text-xs bg-muted p-2 rounded">
                {JSON.stringify(execution.outputs, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {execution.errorMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-red-600">Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{execution.errorMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowExecutionDashboard;
