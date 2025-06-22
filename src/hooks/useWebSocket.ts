/**
 * WebSocket Hook for React Components
 * Provides real-time workflow updates and connection management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService, WebSocketEventType, WorkflowEvent, ConnectionStatus } from '@/services/websocketService';
import { useIntegratedAuth } from './useIntegratedAuth';
import { logger } from '@/lib/logger';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  workflowId?: number;
  onWorkflowStarted?: (event: WorkflowEvent) => void;
  onWorkflowProgress?: (event: WorkflowEvent) => void;
  onWorkflowCompleted?: (event: WorkflowEvent) => void;
  onWorkflowFailed?: (event: WorkflowEvent) => void;
  onError?: (error: any) => void;
}

export interface WorkflowExecutionState {
  isExecuting: boolean;
  progress: number;
  status: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  stepType: string;
  error?: string;
  result?: any;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    autoConnect = true,
    workflowId,
    onWorkflowStarted,
    onWorkflowProgress,
    onWorkflowCompleted,
    onWorkflowFailed,
    onError
  } = options;

  const { user, isAuthenticated } = useIntegratedAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    websocketService.getConnectionStatus()
  );
  const [workflowState, setWorkflowState] = useState<WorkflowExecutionState>({
    isExecuting: false,
    progress: 0,
    status: 'idle',
    currentStep: 0,
    totalSteps: 0,
    stepName: '',
    stepType: '',
  });

  const unsubscribersRef = useRef<Array<() => void>>([]);
  const currentWorkflowIdRef = useRef<number | undefined>(workflowId);

  // Update workflow ID reference
  useEffect(() => {
    currentWorkflowIdRef.current = workflowId;
  }, [workflowId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!autoConnect || !isAuthenticated) {
      return;
    }

    const connectWebSocket = async () => {
      try {
        // Get token from auth service (this would need to be implemented)
        const token = 'mock-token'; // Replace with actual token
        await websocketService.connect(token);
      } catch (error) {
        logger.error('Failed to connect WebSocket:', error);
        onError?.(error);
      }
    };

    connectWebSocket();

    return () => {
      websocketService.disconnect();
    };
  }, [autoConnect, isAuthenticated, onError]);

  // Setup event listeners
  useEffect(() => {
    const setupListeners = () => {
      // Clear existing listeners
      unsubscribersRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribersRef.current = [];

      // Connection status updates
      const unsubscribeConnected = websocketService.on('connected', () => {
        setConnectionStatus(websocketService.getConnectionStatus());
        
        // Join workflow room if specified
        if (currentWorkflowIdRef.current) {
          websocketService.joinWorkflow(currentWorkflowIdRef.current);
        }
      });

      const unsubscribeDisconnected = websocketService.on('disconnected', () => {
        setConnectionStatus(websocketService.getConnectionStatus());
      });

      // Workflow events
      const unsubscribeWorkflowStarted = websocketService.on('workflow_started', (event: WorkflowEvent) => {
        setWorkflowState(prev => ({
          ...prev,
          isExecuting: true,
          progress: 0,
          status: 'started',
          error: undefined,
          result: undefined,
        }));
        
        onWorkflowStarted?.(event);
      });

      const unsubscribeWorkflowProgress = websocketService.on('workflow_progress', (event: WorkflowEvent) => {
        if (event.progress) {
          setWorkflowState(prev => ({
            ...prev,
            progress: event.progress!.current,
            status: event.progress!.status,
            currentStep: event.progress!.step,
            totalSteps: event.progress!.total_steps,
            stepName: event.progress!.step_name,
            stepType: event.progress!.step_type,
          }));
        }
        
        onWorkflowProgress?.(event);
      });

      const unsubscribeWorkflowCompleted = websocketService.on('workflow_completed', (event: WorkflowEvent) => {
        setWorkflowState(prev => ({
          ...prev,
          isExecuting: false,
          progress: 100,
          status: 'completed',
          result: event.result,
        }));
        
        onWorkflowCompleted?.(event);
      });

      const unsubscribeWorkflowFailed = websocketService.on('workflow_failed', (event: WorkflowEvent) => {
        setWorkflowState(prev => ({
          ...prev,
          isExecuting: false,
          status: 'failed',
          error: event.error,
        }));
        
        onWorkflowFailed?.(event);
      });

      const unsubscribeError = websocketService.on('error', (error) => {
        logger.error('WebSocket error:', error);
        onError?.(error);
      });

      // Store unsubscribers
      unsubscribersRef.current = [
        unsubscribeConnected,
        unsubscribeDisconnected,
        unsubscribeWorkflowStarted,
        unsubscribeWorkflowProgress,
        unsubscribeWorkflowCompleted,
        unsubscribeWorkflowFailed,
        unsubscribeError,
      ];
    };

    setupListeners();

    return () => {
      unsubscribersRef.current.forEach(unsubscribe => unsubscribe());
    };
  }, [onWorkflowStarted, onWorkflowProgress, onWorkflowCompleted, onWorkflowFailed, onError]);

  // Join/leave workflow room when workflowId changes
  useEffect(() => {
    if (!websocketService.isConnected()) {
      return;
    }

    if (workflowId) {
      websocketService.joinWorkflow(workflowId);
      
      return () => {
        websocketService.leaveWorkflow(workflowId);
      };
    }
  }, [workflowId]);

  // Manual connection control
  const connect = useCallback(async () => {
    try {
      const token = 'mock-token'; // Replace with actual token
      await websocketService.connect(token);
      setConnectionStatus(websocketService.getConnectionStatus());
    } catch (error) {
      logger.error('Manual WebSocket connection failed:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnectionStatus(websocketService.getConnectionStatus());
  }, []);

  // Workflow room management
  const joinWorkflow = useCallback((id: number) => {
    websocketService.joinWorkflow(id);
  }, []);

  const leaveWorkflow = useCallback((id: number) => {
    websocketService.leaveWorkflow(id);
  }, []);

  // Reset workflow state
  const resetWorkflowState = useCallback(() => {
    setWorkflowState({
      isExecuting: false,
      progress: 0,
      status: 'idle',
      currentStep: 0,
      totalSteps: 0,
      stepName: '',
      stepType: '',
    });
  }, []);

  // Ping server
  const ping = useCallback(() => {
    websocketService.ping();
  }, []);

  return {
    // Connection state
    connectionStatus,
    isConnected: connectionStatus.connected,
    isAuthenticated: connectionStatus.authenticated,
    
    // Workflow execution state
    workflowState,
    isExecuting: workflowState.isExecuting,
    progress: workflowState.progress,
    status: workflowState.status,
    currentStep: workflowState.currentStep,
    totalSteps: workflowState.totalSteps,
    stepName: workflowState.stepName,
    stepType: workflowState.stepType,
    error: workflowState.error,
    result: workflowState.result,
    
    // Control methods
    connect,
    disconnect,
    joinWorkflow,
    leaveWorkflow,
    resetWorkflowState,
    ping,
    
    // Service instance (for advanced usage)
    websocketService,
  };
}

/**
 * Hook specifically for workflow execution monitoring
 */
export function useWorkflowExecution(workflowId?: number) {
  const [executionHistory, setExecutionHistory] = useState<WorkflowEvent[]>([]);

  const webSocket = useWebSocket({
    workflowId,
    onWorkflowStarted: (event) => {
      setExecutionHistory(prev => [...prev, event]);
    },
    onWorkflowProgress: (event) => {
      setExecutionHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].execution_id === event.execution_id) {
          updated[lastIndex] = event;
        } else {
          updated.push(event);
        }
        return updated;
      });
    },
    onWorkflowCompleted: (event) => {
      setExecutionHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].execution_id === event.execution_id) {
          updated[lastIndex] = event;
        } else {
          updated.push(event);
        }
        return updated;
      });
    },
    onWorkflowFailed: (event) => {
      setExecutionHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && updated[lastIndex].execution_id === event.execution_id) {
          updated[lastIndex] = event;
        } else {
          updated.push(event);
        }
        return updated;
      });
    },
  });

  const clearHistory = useCallback(() => {
    setExecutionHistory([]);
  }, []);

  return {
    ...webSocket,
    executionHistory,
    clearHistory,
  };
}
