/**
 * Simple Waitlist Service - No database dependencies
 * Stores emails in localStorage for demo purposes
 */

export interface WaitlistEmail {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  created_at: string;
  updated_at: string;
  registration_source?: string;
  timestamp: number;
}

export interface WaitlistSubmission {
  email: string;
  registration_source?: string;
  timestamp?: number;
}

export interface WaitlistStats {
  total_emails: number;
  active_emails: number;
  unsubscribed_emails: number;
  signups_today: number;
  signups_this_week: number;
  signups_this_month: number;
}

class SimpleWaitlistService {
  private readonly STORAGE_KEY = 'flowsyai_waitlist_emails';
  private emails: Map<string, WaitlistEmail> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load emails from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const emailArray = JSON.parse(stored) as WaitlistEmail[];
        this.emails.clear();
        emailArray.forEach(email => {
          this.emails.set(email.email, email);
        });
        console.log(`📧 Loaded ${this.emails.size} emails from storage`);
      }
    } catch (error) {
      console.warn('Failed to load emails from storage:', error);
      this.emails.clear();
    }
  }

  /**
   * Save emails to localStorage
   */
  private saveToStorage(): void {
    try {
      const emailArray = Array.from(this.emails.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emailArray));
      console.log(`💾 Saved ${emailArray.length} emails to storage`);
    } catch (error) {
      console.error('Failed to save emails to storage:', error);
    }
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;

    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || trimmedEmail.length > 254) return false;

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail.toLowerCase())) return false;

    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domainPart] = parts;
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (domainPart.length === 0 || domainPart.length > 253) return false;

    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;

    return true;
  }

  /**
   * Normalize email address
   */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Submit email to waitlist
   */
  async submitEmail(email: string): Promise<{ success: boolean; message: string; data?: WaitlistEmail }> {
    try {
      // Validate email format
      if (!this.validateEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.',
        };
      }

      const normalizedEmail = this.normalizeEmail(email);

      // Check if email already exists
      if (this.emails.has(normalizedEmail)) {
        const existingEmail = this.emails.get(normalizedEmail)!;
        if (existingEmail.status === 'active') {
          return {
            success: false,
            message: 'This email is already on our waitlist!',
          };
        } else {
          // Reactivate unsubscribed email
          existingEmail.status = 'active';
          existingEmail.updated_at = new Date().toISOString();
          this.emails.set(normalizedEmail, existingEmail);
          this.saveToStorage();
          
          return {
            success: true,
            message: "Welcome back! You're now on our waitlist.",
            data: existingEmail,
          };
        }
      }

      // Create new email record
      const newEmail: WaitlistEmail = {
        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: normalizedEmail,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        registration_source: window.location.pathname || 'unknown',
        timestamp: Date.now(),
      };

      this.emails.set(normalizedEmail, newEmail);
      this.saveToStorage();

      console.log('✅ Email added to waitlist:', normalizedEmail);
      
      return {
        success: true,
        message: "Success! You're now on our waitlist. We'll notify you when we launch!",
        data: newEmail,
      };
    } catch (error) {
      console.error('Error submitting email:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  /**
   * Get waitlist statistics
   */
  async getStats(): Promise<{ success: boolean; data?: WaitlistStats; message?: string }> {
    try {
      const emails = Array.from(this.emails.values());
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const activeEmails = emails.filter(e => e.status === 'active');
      const todaySignups = emails.filter(e => new Date(e.created_at) >= today);
      const weekSignups = emails.filter(e => new Date(e.created_at) >= weekAgo);
      const monthSignups = emails.filter(e => new Date(e.created_at) >= monthAgo);

      const stats: WaitlistStats = {
        total_emails: emails.length,
        active_emails: activeEmails.length,
        unsubscribed_emails: emails.filter(e => e.status === 'unsubscribed').length,
        signups_today: todaySignups.length,
        signups_this_week: weekSignups.length,
        signups_this_month: monthSignups.length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        success: false,
        message: 'Failed to load statistics.',
      };
    }
  }

  /**
   * Unsubscribe email from waitlist
   */
  async unsubscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const normalizedEmail = this.normalizeEmail(email);
      
      if (this.emails.has(normalizedEmail)) {
        const emailRecord = this.emails.get(normalizedEmail)!;
        emailRecord.status = 'unsubscribed';
        emailRecord.updated_at = new Date().toISOString();
        this.emails.set(normalizedEmail, emailRecord);
        this.saveToStorage();
      }

      return {
        success: true,
        message: 'You have been successfully unsubscribed from our waitlist.',
      };
    } catch (error) {
      console.error('Error unsubscribing email:', error);
      return {
        success: false,
        message: 'An error occurred while unsubscribing.',
      };
    }
  }

  /**
   * Get all emails (for admin purposes)
   */
  async getAllEmails(): Promise<{ success: boolean; data?: WaitlistEmail[]; message?: string }> {
    try {
      const emails = Array.from(this.emails.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        success: true,
        data: emails,
      };
    } catch (error) {
      console.error('Error getting all emails:', error);
      return {
        success: false,
        message: 'Failed to load emails.',
      };
    }
  }
}

// Export singleton instance
export const simpleWaitlistService = new SimpleWaitlistService();
