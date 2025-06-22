/**
 * Backend Authentication Service
 * JWT-based authentication with Python FastAPI backend
 */

import { apiClient } from './apiClient';
import { logger } from '@/lib/logger';

// Types
export interface User {
  id: number;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  is_active: boolean;
  is_verified: boolean;
  subscription_tier: string;
  subscription_expires_at?: string;
  api_calls_count: number;
  workflows_count: number;
  storage_used: number;
  created_at: string;
  last_login_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface UserUpdate {
  full_name?: string;
  username?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

class BackendAuthService {
  private readonly baseUrl = '/auth';
  private user: User | null = null;
  private authListeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.setupEventListeners();
    this.loadUserFromToken();
  }

  private setupEventListeners() {
    // Listen for auth events from API client
    window.addEventListener('auth:unauthorized', () => {
      this.handleLogout();
    });

    window.addEventListener('auth:forbidden', () => {
      logger.warn('Access forbidden - insufficient permissions');
    });
  }

  private async loadUserFromToken() {
    if (apiClient.isAuthenticated()) {
      try {
        await this.getCurrentUser();
      } catch (error) {
        logger.warn('Failed to load user from token:', error);
        this.handleLogout();
      }
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      logger.info('Registering new user:', userData.email);

      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, userData);

      // Set token and user
      apiClient.setToken(response.access_token);
      this.user = response.user;
      this.notifyAuthListeners();

      logger.info('User registered successfully:', response.user.email);
      return response;
    } catch (error) {
      logger.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      logger.info('Logging in user:', credentials.email);

      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login/json`, credentials);

      // Set token and user
      apiClient.setToken(response.access_token);
      this.user = response.user;
      this.notifyAuthListeners();

      logger.info('User logged in successfully:', response.user.email);
      return response;
    } catch (error) {
      logger.error('Login failed:', error);
      throw new Error('Invalid email or password');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.handleLogout();
    logger.info('User logged out');
  }

  private handleLogout() {
    apiClient.clearToken();
    this.user = null;
    this.notifyAuthListeners();
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    try {
      if (!apiClient.isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      const user = await apiClient.get<User>(`${this.baseUrl}/me`);
      this.user = user;
      this.notifyAuthListeners();

      return user;
    } catch (error) {
      logger.error('Failed to get current user:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UserUpdate): Promise<User> {
    try {
      logger.info('Updating user profile');

      const user = await apiClient.put<User>('/users/me', updates);
      this.user = user;
      this.notifyAuthListeners();

      logger.info('Profile updated successfully');
      return user;
    } catch (error) {
      logger.error('Failed to update profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      logger.info('Changing user password');

      await apiClient.post(`${this.baseUrl}/change-password`, passwordData);

      logger.info('Password changed successfully');
    } catch (error) {
      logger.error('Failed to change password:', error);
      throw new Error('Failed to change password');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      if (!apiClient.isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/refresh`);

      // Update token
      apiClient.setToken(response.access_token);
      this.user = response.user;
      this.notifyAuthListeners();

      logger.debug('Token refreshed successfully');
      return response;
    } catch (error) {
      logger.error('Failed to refresh token:', error);
      this.handleLogout();
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      logger.info('Requesting password reset for:', email);

      await apiClient.post(`${this.baseUrl}/password-reset`, { email });

      logger.info('Password reset email sent');
    } catch (error) {
      logger.error('Failed to request password reset:', error);
      throw new Error('Failed to request password reset');
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      logger.info('Verifying email with token');

      await apiClient.post(`${this.baseUrl}/verify-email`, { token });

      // Refresh user data
      if (this.user) {
        await this.getCurrentUser();
      }

      logger.info('Email verified successfully');
    } catch (error) {
      logger.error('Failed to verify email:', error);
      throw new Error('Failed to verify email');
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(): Promise<void> {
    try {
      logger.info('Deleting user account');

      await apiClient.delete('/users/me');
      this.handleLogout();

      logger.info('Account deleted successfully');
    } catch (error) {
      logger.error('Failed to delete account:', error);
      throw new Error('Failed to delete account');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!this.user;
  }

  /**
   * Get current user (cached)
   */
  getUser(): User | null {
    return this.user;
  }

  /**
   * Check if user has premium subscription
   */
  isPremium(): boolean {
    return this.user?.subscription_tier === 'premium' || this.user?.subscription_tier === 'enterprise';
  }

  /**
   * Check if user is verified
   */
  isVerified(): boolean {
    return this.user?.is_verified || false;
  }

  /**
   * Add authentication state listener
   */
  onAuthStateChange(listener: (user: User | null) => void): () => void {
    this.authListeners.push(listener);
    
    // Call immediately with current state
    listener(this.user);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  private notifyAuthListeners() {
    this.authListeners.forEach(listener => listener(this.user));
  }
}

// Create singleton instance
export const backendAuthService = new BackendAuthService();

// Export default
export default backendAuthService;
