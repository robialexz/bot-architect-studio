import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crtferpmhnrdvnaypgzo.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydGZlcnBtaG5yZHZuYXlwZ3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODc3MzksImV4cCI6MjA2Mzc2MzczOX0.WGBfLo4UYTzHUCuHEa_MVWi0n7f1-U15Xlmw7XZben4';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Missing Supabase environment variables');
}

console.log('🔧 Supabase configuration:', {
  url: supabaseUrl,
  keyPresent: !!supabaseAnonKey,
  environment: import.meta.env.MODE,
});

// Configuration for session persistence
const ENABLE_SESSION_PERSISTENCE = import.meta.env.VITE_ENABLE_SESSION_PERSISTENCE !== 'false';

console.log('🔧 Auth configuration:', {
  sessionPersistence: ENABLE_SESSION_PERSISTENCE,
  environment: import.meta.env.MODE,
});

// Create optimized Supabase client with configurable session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: ENABLE_SESSION_PERSISTENCE, // Configurable session persistence
    detectSessionInUrl: false, // Disable to prevent URL issues
    flowType: 'implicit', // Use implicit flow for faster auth
    storage: ENABLE_SESSION_PERSISTENCE
      ? undefined
      : {
          // Custom storage that doesn't persist if persistence is disabled
          getItem: (key: string) => {
            return sessionStorage.getItem(key);
          },
          setItem: (key: string, value: string) => {
            sessionStorage.setItem(key, value);
          },
          removeItem: (key: string) => {
            sessionStorage.removeItem(key);
          },
        },
  },
  global: {
    headers: {
      'x-client-info': 'bot-architect-studio@1.0.0',
    },
  },
});

// Test connection on initialization
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.warn('⚠️ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  } catch (err) {
    console.warn('⚠️ Supabase connection test error:', err);
  }
};

// Run test in development
if (import.meta.env.DEV) {
  testConnection();
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist_emails: {
        Row: {
          id: string;
          email: string;
          ip_address: string | null;
          user_agent: string | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          status: 'active' | 'unsubscribed' | 'bounced';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          ip_address?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          status?: 'active' | 'unsubscribed' | 'bounced';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          status?: 'active' | 'unsubscribed' | 'bounced';
          created_at?: string;
          updated_at?: string;
        };
      };
      workflows: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          data: Record<string, unknown>;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          data: Record<string, unknown>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          data?: Record<string, unknown>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          configuration: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          configuration: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          configuration?: Record<string, unknown>;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type DatabaseWorkflow = Database['public']['Tables']['workflows']['Row'];
export type AIAgent = Database['public']['Tables']['ai_agents']['Row'];
