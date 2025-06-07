import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Service for setting up database tables and ensuring they exist
 */
class DatabaseSetupService {
  /**
   * Creates the waitlist_emails table if it doesn't exist
   */
  async createWaitlistTable(): Promise<{ success: boolean; message: string }> {
    try {
      // First check if table exists
      const { error: checkError } = await supabase.from('waitlist_emails').select('id').limit(1);

      if (!checkError) {
        logger.info('Waitlist table already exists');
        return {
          success: true,
          message: 'Waitlist table already exists',
        };
      }

      // If table doesn't exist, try to create it using RPC
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.waitlist_emails (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          ip_address INET,
          user_agent TEXT,
          referrer TEXT,
          utm_source TEXT,
          utm_medium TEXT,
          utm_campaign TEXT,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON public.waitlist_emails(email);
        CREATE INDEX IF NOT EXISTS idx_waitlist_emails_created_at ON public.waitlist_emails(created_at);
        CREATE INDEX IF NOT EXISTS idx_waitlist_emails_status ON public.waitlist_emails(status);

        -- Enable Row Level Security
        ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY IF NOT EXISTS "Anyone can insert waitlist emails" ON public.waitlist_emails
          FOR INSERT WITH CHECK (true);

        CREATE POLICY IF NOT EXISTS "Authenticated users can view waitlist emails" ON public.waitlist_emails
          FOR SELECT USING (auth.role() = 'authenticated');

        CREATE POLICY IF NOT EXISTS "Anyone can update waitlist email status" ON public.waitlist_emails
          FOR UPDATE USING (true) WITH CHECK (status IN ('active', 'unsubscribed'));

        -- Create trigger for updated_at
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER IF NOT EXISTS update_waitlist_emails_updated_at
          BEFORE UPDATE ON public.waitlist_emails
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
      `;

      // Note: This requires the SQL to be executed manually in Supabase dashboard
      // or through a database function. For now, we'll log the SQL for manual execution.

      logger.warn(
        'Waitlist table does not exist. Please execute the following SQL in your Supabase dashboard:'
      );
      logger.warn(createTableSQL);

      return {
        success: false,
        message: 'Waitlist table needs to be created manually. Check console for SQL.',
      };
    } catch (error) {
      logger.error('Error setting up waitlist table:', error);
      return {
        success: false,
        message: 'Failed to setup waitlist table',
      };
    }
  }

  /**
   * Verifies all required tables exist
   */
  async verifyTables(): Promise<{ success: boolean; missingTables: string[] }> {
    const requiredTables = ['profiles', 'workflows', 'ai_agents', 'waitlist_emails'];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);

        if (error && error.code === 'PGRST106') {
          missingTables.push(table);
        }
      } catch {
        missingTables.push(table);
      }
    }

    return {
      success: missingTables.length === 0,
      missingTables,
    };
  }

  /**
   * Initializes the database with required tables
   */
  async initializeDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      logger.info('Checking database setup...');

      const { success, missingTables } = await this.verifyTables();

      if (success) {
        logger.info('All required tables exist');
        return {
          success: true,
          message: 'Database is properly configured',
        };
      }

      logger.warn('Missing tables:', missingTables);

      // If only waitlist_emails is missing, try to create it
      if (missingTables.length === 1 && missingTables[0] === 'waitlist_emails') {
        return await this.createWaitlistTable();
      }

      return {
        success: false,
        message: `Missing required tables: ${missingTables.join(', ')}. Please run the setup SQL script.`,
      };
    } catch (error) {
      logger.error('Error initializing database:', error);
      return {
        success: false,
        message: 'Failed to initialize database',
      };
    }
  }
}

export const databaseSetupService = new DatabaseSetupService();
