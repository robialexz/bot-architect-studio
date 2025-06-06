import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

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
}

export interface WaitlistSubmission {
  email: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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

  /**
   * Validates email format using a comprehensive regex
   */
  private validateEmail(email: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim().toLowerCase());
  }

  /**
   * Normalizes email address (lowercase, trim)
   */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Gets client information for tracking
   */
  private getClientInfo(): Partial<WaitlistSubmission> {
    if (typeof window === 'undefined') {
      return {};
    }

    const urlParams = new URLSearchParams(window.location.search);

    return {
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
    };
  }

  /**
   * Submits an email to the waitlist
   */
  async submitEmail(
    email: string
  ): Promise<{ success: boolean; message: string; data?: WaitlistEmail }> {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.',
        };
      }

      const normalizedEmail = this.normalizeEmail(email);
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
