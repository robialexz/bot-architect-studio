import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { databaseSetupService } from './databaseSetupService';

export interface WaitlistEmail {
  id: string;
  email: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  created_at: string;
  updated_at: string;
  registration_source?: string;
  timestamp?: number;
}

export interface WaitlistSubmission {
  email: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  registration_source?: string;
  timestamp?: number;
}

export interface WaitlistStats {
  total_emails: number;
  active_emails: number;
  unsubscribed_emails: number;
  bounced_emails: number;
  signups_today: number;
  signups_this_week: number;
  signups_this_month: number;
}

class WaitlistService {
  private readonly TABLE_NAME = 'waitlist_emails';
  private readonly DEMO_MODE = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';
  private readonly JSON_STORAGE_KEY = 'flowsyai_waitlist_emails';
  private demoEmails: Set<string> = new Set();
  private jsonEmails: Map<string, WaitlistEmail> = new Map();
  private initialized = false;

  /**
   * Initializes the waitlist service and ensures database is set up
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const { success, message } = await databaseSetupService.initializeDatabase();
      if (!success) {
        logger.warn('Database setup incomplete:', message);
      }

      // Load JSON storage data
      this.loadJsonStorage();

      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize waitlist service:', error);
      this.initialized = true; // Continue with demo mode
    }
  }

  /**
   * Loads email data from localStorage JSON storage
   */
  private loadJsonStorage(): void {
    try {
      const stored = localStorage.getItem(this.JSON_STORAGE_KEY);
      if (stored) {
        const emailArray = JSON.parse(stored) as WaitlistEmail[];
        this.jsonEmails.clear();
        emailArray.forEach(email => {
          this.jsonEmails.set(email.email, email);
        });
        logger.info(`Loaded ${this.jsonEmails.size} emails from JSON storage`);
      }
    } catch (error) {
      logger.warn('Failed to load JSON storage:', error);
      this.jsonEmails.clear();
    }
  }

  /**
   * Saves email data to localStorage JSON storage
   */
  private saveJsonStorage(): void {
    try {
      const emailArray = Array.from(this.jsonEmails.values());
      localStorage.setItem(this.JSON_STORAGE_KEY, JSON.stringify(emailArray));
      logger.info(`Saved ${emailArray.length} emails to JSON storage`);
    } catch (error) {
      logger.error('Failed to save JSON storage:', error);
    }
  }

  /**
   * Validates email format using a comprehensive regex with additional checks
   */
  private validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || trimmedEmail.length > 254) return false;

    // Comprehensive email regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail.toLowerCase())) return false;

    // Additional validation checks
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domainPart] = parts;
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (domainPart.length === 0 || domainPart.length > 253) return false;

    // Check for common invalid patterns
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;

    return true;
  }

  /**
   * Normalizes email address (lowercase, trim)
   */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Checks if the waitlist table exists and is accessible
   */
  private async checkTableExists(): Promise<boolean> {
    try {
      const { error } = await supabase.from(this.TABLE_NAME).select('id').limit(1);

      return !error || error.code !== 'PGRST106'; // PGRST106 = table not found
    } catch {
      return false;
    }
  }

  /**
   * Demo mode storage for development with JSON persistence
   */
  private handleDemoMode(
    email: string,
    action: 'add' | 'check' | 'remove'
  ): { success: boolean; message: string; exists?: boolean; data?: WaitlistEmail } {
    const normalizedEmail = this.normalizeEmail(email);

    switch (action) {
      case 'check':
        return {
          success: true,
          message: '',
          exists: this.jsonEmails.has(normalizedEmail) || this.demoEmails.has(normalizedEmail),
        };
      case 'add': {
        if (this.jsonEmails.has(normalizedEmail) || this.demoEmails.has(normalizedEmail)) {
          return {
            success: false,
            message: 'This email is already on our waitlist!',
          };
        }

        // Create email record with metadata
        const newEmail: WaitlistEmail = {
          id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: normalizedEmail,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          registration_source: 'demo_mode',
          timestamp: Date.now(),
          ...this.getClientInfo(),
        };

        this.jsonEmails.set(normalizedEmail, newEmail);
        this.demoEmails.add(normalizedEmail);
        this.saveJsonStorage();

        logger.info('Demo: Email added to waitlist:', {
          email: normalizedEmail,
          total: this.jsonEmails.size,
        });

        return {
          success: true,
          message: "Success! You're now on our waitlist. We'll notify you when we launch!",
          data: newEmail,
        };
      }
      case 'remove': {
        if (this.jsonEmails.has(normalizedEmail)) {
          const email = this.jsonEmails.get(normalizedEmail)!;
          email.status = 'unsubscribed';
          email.updated_at = new Date().toISOString();
          this.jsonEmails.set(normalizedEmail, email);
          this.saveJsonStorage();
        }
        this.demoEmails.delete(normalizedEmail);

        return {
          success: true,
          message: 'You have been successfully unsubscribed from our waitlist.',
        };
      }
      default:
        return {
          success: false,
          message: 'Invalid action',
        };
    }
  }

  /**
   * Gets client information for tracking
   */
  private getClientInfo(): Partial<WaitlistSubmission> {
    if (typeof window === 'undefined') {
      return {
        registration_source: 'server_side',
        timestamp: Date.now(),
      };
    }

    const urlParams = new URLSearchParams(window.location.search);

    return {
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      registration_source: window.location.pathname || 'unknown',
      timestamp: Date.now(),
      // Note: IP address would need to be set server-side for security
    };
  }

  /**
   * Submits an email to the waitlist
   */
  async submitEmail(
    email: string
  ): Promise<{ success: boolean; message: string; data?: WaitlistEmail }> {
    try {
      // Initialize service if not already done
      await this.initialize();

      // Validate email format
      if (!this.validateEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.',
        };
      }

      const normalizedEmail = this.normalizeEmail(email);

      // Check if table exists, if not use demo mode
      const tableExists = await this.checkTableExists();
      if (!tableExists || this.DEMO_MODE) {
        logger.warn('Waitlist table not accessible, using demo mode');
        return this.handleDemoMode(normalizedEmail, 'add');
      }

      const clientInfo = this.getClientInfo();

      // Check if email already exists
      const { data: existingEmail, error: checkError } = await supabase
        .from(this.TABLE_NAME)
        .select('id, email, status')
        .eq('email', normalizedEmail)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new emails
        logger.error('Error checking existing email:', checkError);
        return {
          success: false,
          message: 'An error occurred. Please try again.',
        };
      }

      if (existingEmail) {
        if (existingEmail.status === 'active') {
          return {
            success: false,
            message: 'This email is already on our waitlist!',
          };
        } else if (existingEmail.status === 'unsubscribed') {
          // Reactivate unsubscribed email
          const { data: updatedEmail, error: updateError } = await supabase
            .from(this.TABLE_NAME)
            .update({
              status: 'active',
              ...clientInfo,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingEmail.id)
            .select()
            .single();

          if (updateError) {
            logger.error('Error reactivating email:', updateError);
            return {
              success: false,
              message: 'An error occurred. Please try again.',
            };
          }

          logger.info('Email reactivated on waitlist:', { email: normalizedEmail });
          return {
            success: true,
            message: "Welcome back! You're now on our waitlist.",
            data: updatedEmail,
          };
        }
      }

      // Insert new email
      const { data: newEmail, error: insertError } = await supabase
        .from(this.TABLE_NAME)
        .insert({
          email: normalizedEmail,
          ...clientInfo,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) {
        logger.error('Error inserting email:', insertError);

        // Handle unique constraint violation
        if (insertError.code === '23505') {
          return {
            success: false,
            message: 'This email is already on our waitlist!',
          };
        }

        return {
          success: false,
          message: 'An error occurred. Please try again.',
        };
      }

      logger.info('New email added to waitlist:', { email: normalizedEmail });
      return {
        success: true,
        message: "Success! You're now on our waitlist. We'll notify you when we launch!",
        data: newEmail,
      };
    } catch (error) {
      logger.error('Unexpected error in submitEmail:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Gets waitlist statistics
   */
  async getStats(): Promise<{ success: boolean; data?: WaitlistStats; message?: string }> {
    try {
      // Check if table exists, if not use demo mode with JSON storage
      const tableExists = await this.checkTableExists();
      if (!tableExists || this.DEMO_MODE) {
        logger.warn('Waitlist table not accessible, using demo stats with JSON storage');

        const emails = Array.from(this.jsonEmails.values());
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const activeEmails = emails.filter(e => e.status === 'active');
        const todaySignups = emails.filter(e => new Date(e.created_at) >= today);
        const weekSignups = emails.filter(e => new Date(e.created_at) >= weekAgo);
        const monthSignups = emails.filter(e => new Date(e.created_at) >= monthAgo);

        const demoStats: WaitlistStats = {
          total_emails: emails.length,
          active_emails: activeEmails.length,
          unsubscribed_emails: emails.filter(e => e.status === 'unsubscribed').length,
          bounced_emails: emails.filter(e => e.status === 'bounced').length,
          signups_today: todaySignups.length,
          signups_this_week: weekSignups.length,
          signups_this_month: monthSignups.length,
        };

        return {
          success: true,
          data: demoStats,
        };
      }
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get total counts by status
      const { data: statusCounts, error: statusError } = await supabase
        .from(this.TABLE_NAME)
        .select('status')
        .then(result => {
          if (result.error) throw result.error;

          const counts = {
            total_emails: result.data.length,
            active_emails: result.data.filter(item => item.status === 'active').length,
            unsubscribed_emails: result.data.filter(item => item.status === 'unsubscribed').length,
            bounced_emails: result.data.filter(item => item.status === 'bounced').length,
          };

          return { data: counts, error: null };
        });

      if (statusError) {
        throw statusError;
      }

      // Get time-based counts
      const { data: todayCount, error: todayError } = await supabase
        .from(this.TABLE_NAME)
        .select('id', { count: 'exact' })
        .gte('created_at', today.toISOString());

      const { data: weekCount, error: weekError } = await supabase
        .from(this.TABLE_NAME)
        .select('id', { count: 'exact' })
        .gte('created_at', weekAgo.toISOString());

      const { data: monthCount, error: monthError } = await supabase
        .from(this.TABLE_NAME)
        .select('id', { count: 'exact' })
        .gte('created_at', monthAgo.toISOString());

      if (todayError || weekError || monthError) {
        throw todayError || weekError || monthError;
      }

      const stats: WaitlistStats = {
        ...statusCounts.data,
        signups_today: todayCount?.length || 0,
        signups_this_week: weekCount?.length || 0,
        signups_this_month: monthCount?.length || 0,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      logger.error('Error getting waitlist stats:', error);
      return {
        success: false,
        message: 'Failed to load statistics.',
      };
    }
  }

  /**
   * Gets all waitlist emails (admin function)
   */
  async getAllEmails(
    limit = 100,
    offset = 0
  ): Promise<{ success: boolean; data?: WaitlistEmail[]; count?: number; message?: string }> {
    try {
      const { data, error, count } = await supabase
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || [],
        count: count || 0,
      };
    } catch (error) {
      logger.error('Error getting all emails:', error);
      return {
        success: false,
        message: 'Failed to load emails.',
      };
    }
  }

  /**
   * Exports waitlist emails as CSV
   */
  async exportEmails(): Promise<{ success: boolean; csv?: string; message?: string }> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('email, status, created_at, utm_source, utm_medium, utm_campaign')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No active emails found.',
        };
      }

      // Generate CSV
      const headers = [
        'Email',
        'Status',
        'Signup Date',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
      ];
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          [
            row.email,
            row.status,
            new Date(row.created_at).toLocaleDateString(),
            row.utm_source || '',
            row.utm_medium || '',
            row.utm_campaign || '',
          ]
            .map(field => `"${field}"`)
            .join(',')
        ),
      ];

      return {
        success: true,
        csv: csvRows.join('\n'),
      };
    } catch (error) {
      logger.error('Error exporting emails:', error);
      return {
        success: false,
        message: 'Failed to export emails.',
      };
    }
  }

  /**
   * Unsubscribes an email from the waitlist
   */
  async unsubscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const normalizedEmail = this.normalizeEmail(email);

      // Check if table exists, if not use demo mode
      const tableExists = await this.checkTableExists();
      if (!tableExists || this.DEMO_MODE) {
        logger.warn('Waitlist table not accessible, using demo mode');
        return this.handleDemoMode(normalizedEmail, 'remove');
      }

      const { error } = await supabase
        .from(this.TABLE_NAME)
        .update({
          status: 'unsubscribed',
          updated_at: new Date().toISOString(),
        })
        .eq('email', normalizedEmail);

      if (error) {
        throw error;
      }

      logger.info('Email unsubscribed from waitlist:', { email: normalizedEmail });
      return {
        success: true,
        message: 'You have been successfully unsubscribed from our waitlist.',
      };
    } catch (error) {
      logger.error('Error unsubscribing email:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }
}

export const waitlistService = new WaitlistService();
