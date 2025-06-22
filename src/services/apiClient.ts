/**
 * API Client for FlowsyAI Backend
 * Centralized HTTP client for communicating with Python FastAPI backend
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '@/lib/logger';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: boolean;
  message: string;
  type: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}${API_VERSION}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        logger.debug('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });

        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        logger.error('API Response Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });

        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login or emit auth error event
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        // Handle 403 - Forbidden
        if (error.response?.status === 403) {
          window.dispatchEvent(new CustomEvent('auth:forbidden'));
        }

        return Promise.reject(error);
      }
    );
  }

  private loadTokenFromStorage() {
    try {
      const token = localStorage.getItem('flowsyai_token');
      if (token) {
        this.setToken(token);
      }
    } catch (error) {
      logger.warn('Failed to load token from storage:', error);
    }
  }

  public setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem('flowsyai_token', token);
    } catch (error) {
      logger.warn('Failed to save token to storage:', error);
    }
  }

  public clearToken() {
    this.token = null;
    try {
      localStorage.removeItem('flowsyai_token');
    } catch (error) {
      logger.warn('Failed to remove token from storage:', error);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  // Generic HTTP methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; environment: string; database: string }> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }

  // File upload
  public async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Batch requests
  public async batch<T = any>(requests: Array<{ method: string; url: string; data?: any }>): Promise<T[]> {
    const promises = requests.map(req => {
      switch (req.method.toLowerCase()) {
        case 'get':
          return this.get(req.url);
        case 'post':
          return this.post(req.url, req.data);
        case 'put':
          return this.put(req.url, req.data);
        case 'delete':
          return this.delete(req.url);
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
    });

    return Promise.all(promises);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export default
export default apiClient;
