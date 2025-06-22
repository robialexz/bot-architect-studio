/**
 * WebSocket Service for FlowsyAI Frontend
 * Real-time communication with Python backend
 */

import { io, Socket } from 'socket.io-client';
import { apiConfig } from '@/lib/env';
import { logger } from '@/lib/logger';

// Types
export interface WorkflowProgress {
  current: number;
  total: number;
  status: string;
  step: number;
  total_steps: number;
  step_name: string;
  step_type: string;
}

export interface WorkflowEvent {
  workflow_id: number;
  execution_id: number;
  status: string;
  timestamp: string;
  progress?: WorkflowProgress;
  result?: any;
  error?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  lastConnected?: Date;
  lastDisconnected?: Date;
  reconnectAttempts: number;
}

// Event types
export type WebSocketEventType = 
  | 'connected'
  | 'disconnected'
  | 'workflow_started'
  | 'workflow_progress'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'error';

export type EventCallback = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private eventListeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private connectionStatus: ConnectionStatus = {
    connected: false,
    authenticated: false,
    reconnectAttempts: 0,
  };
  private reconnectTimer: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    // Initialize event listener maps
    const eventTypes: WebSocketEventType[] = [
      'connected', 'disconnected', 'workflow_started', 'workflow_progress',
      'workflow_completed', 'workflow_failed', 'error'
    ];
    
    eventTypes.forEach(type => {
      this.eventListeners.set(type, new Set());
    });
  }

  /**
   * Connect to WebSocket server
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket?.connected) {
          logger.debug('WebSocket already connected');
          resolve();
          return;
        }

        this.token = token || this.token;
        
        const wsUrl = apiConfig.baseUrl.replace(/^http/, 'ws') + '/ws';
        
        logger.info('Connecting to WebSocket:', wsUrl);

        this.socket = io(wsUrl, {
          auth: {
            token: this.token
          },
          transports: ['websocket'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        this.setupEventHandlers();

        // Connection success
        this.socket.on('connect', () => {
          this.connectionStatus.connected = true;
          this.connectionStatus.lastConnected = new Date();
          this.connectionStatus.reconnectAttempts = 0;
          
          logger.info('WebSocket connected successfully');
          this.emit('connected', { timestamp: new Date().toISOString() });
          resolve();
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
          logger.error('WebSocket connection error:', error);
          this.connectionStatus.connected = false;
          this.emit('error', { message: 'Connection failed', error });
          reject(error);
        });

        // Connection timeout
        setTimeout(() => {
          if (!this.socket?.connected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

      } catch (error) {
        logger.error('Failed to initialize WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.connectionStatus.connected = false;
    this.connectionStatus.authenticated = false;
    this.connectionStatus.lastDisconnected = new Date();

    logger.info('WebSocket disconnected');
    this.emit('disconnected', { timestamp: new Date().toISOString() });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Authentication success
    this.socket.on('connected', (data) => {
      this.connectionStatus.authenticated = true;
      logger.info('WebSocket authenticated:', data);
      this.emit('connected', data);
    });

    // Disconnection
    this.socket.on('disconnect', (reason) => {
      this.connectionStatus.connected = false;
      this.connectionStatus.authenticated = false;
      this.connectionStatus.lastDisconnected = new Date();
      
      logger.warn('WebSocket disconnected:', reason);
      this.emit('disconnected', { reason, timestamp: new Date().toISOString() });

      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        return;
      }

      this.scheduleReconnect();
    });

    // Workflow events
    this.socket.on('workflow_started', (data: WorkflowEvent) => {
      logger.info('Workflow started:', data);
      this.emit('workflow_started', data);
    });

    this.socket.on('workflow_progress', (data: WorkflowEvent) => {
      logger.debug('Workflow progress:', data);
      this.emit('workflow_progress', data);
    });

    this.socket.on('workflow_completed', (data: WorkflowEvent) => {
      logger.info('Workflow completed:', data);
      this.emit('workflow_completed', data);
    });

    this.socket.on('workflow_failed', (data: WorkflowEvent) => {
      logger.error('Workflow failed:', data);
      this.emit('workflow_failed', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      logger.error('WebSocket error:', error);
      this.emit('error', error);
    });

    // Pong response
    this.socket.on('pong', (data) => {
      logger.debug('WebSocket pong received:', data);
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.connectionStatus.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.connectionStatus.reconnectAttempts);
    this.connectionStatus.reconnectAttempts++;

    logger.info(`Scheduling reconnect attempt ${this.connectionStatus.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      if (this.token) {
        this.connect(this.token).catch(error => {
          logger.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  /**
   * Join workflow room for updates
   */
  joinWorkflow(workflowId: number): void {
    if (!this.socket?.connected) {
      logger.warn('Cannot join workflow: WebSocket not connected');
      return;
    }

    this.socket.emit('join_workflow', { workflow_id: workflowId });
    logger.info(`Joined workflow ${workflowId} for updates`);
  }

  /**
   * Leave workflow room
   */
  leaveWorkflow(workflowId: number): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('leave_workflow', { workflow_id: workflowId });
    logger.info(`Left workflow ${workflowId} updates`);
  }

  /**
   * Send ping to server
   */
  ping(): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('ping', { timestamp: new Date().toISOString() });
  }

  /**
   * Add event listener
   */
  on(event: WebSocketEventType, callback: EventCallback): () => void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Remove event listener
   */
  off(event: WebSocketEventType, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: WebSocketEventType, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logger.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.connectionStatus.authenticated;
  }

  /**
   * Update authentication token
   */
  updateToken(token: string): void {
    this.token = token;
    
    // Reconnect with new token if currently connected
    if (this.socket?.connected) {
      this.disconnect();
      this.connect(token).catch(error => {
        logger.error('Failed to reconnect with new token:', error);
      });
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export default
export default websocketService;
