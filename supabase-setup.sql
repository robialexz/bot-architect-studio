-- Bot Architect Studio Database Setup
-- Run this script in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    data JSONB NOT NULL DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_agents table
CREATE TABLE IF NOT EXISTS public.ai_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    configuration JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS workflows_user_id_idx ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS workflows_is_public_idx ON public.workflows(is_public);
CREATE INDEX IF NOT EXISTS workflows_updated_at_idx ON public.workflows(updated_at DESC);
CREATE INDEX IF NOT EXISTS ai_agents_user_id_idx ON public.ai_agents(user_id);
CREATE INDEX IF NOT EXISTS ai_agents_type_idx ON public.ai_agents(type);
CREATE INDEX IF NOT EXISTS ai_agents_is_active_idx ON public.ai_agents(is_active);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for workflows
CREATE POLICY "Users can view own workflows" ON public.workflows
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public workflows" ON public.workflows
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own workflows" ON public.workflows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON public.workflows
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON public.workflows
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ai_agents
CREATE POLICY "Users can view own ai_agents" ON public.ai_agents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai_agents" ON public.ai_agents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai_agents" ON public.ai_agents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ai_agents" ON public.ai_agents
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON public.workflows
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at
    BEFORE UPDATE ON public.ai_agents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data (optional)
-- You can remove this section if you don't want sample data

-- Sample workflow templates (public workflows)
INSERT INTO public.workflows (user_id, name, description, data, is_public) VALUES
(
    '00000000-0000-0000-0000-000000000000', -- System user ID (you may need to adjust this)
    'Customer Support Bot',
    'A template for creating customer support automation workflows',
    '{"nodes": [{"id": "1", "type": "trigger", "data": {"label": "Customer Message"}}], "edges": []}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'Content Generation Pipeline',
    'Automated content creation and publishing workflow',
    '{"nodes": [{"id": "1", "type": "input", "data": {"label": "Content Brief"}}], "edges": []}',
    true
),
(
    '00000000-0000-0000-0000-000000000000',
    'Data Analysis Workflow',
    'Automated data processing and insight generation',
    '{"nodes": [{"id": "1", "type": "data", "data": {"label": "Raw Data Input"}}], "edges": []}',
    true
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create execution status enum
CREATE TYPE execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'paused', 'cancelled');

-- Create workflow executions table
CREATE TABLE IF NOT EXISTS public.workflow_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status execution_status DEFAULT 'pending',
    inputs JSONB DEFAULT '{}',
    outputs JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create node executions table
CREATE TABLE IF NOT EXISTS public.node_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES public.workflow_executions(id) ON DELETE CASCADE NOT NULL,
    node_id TEXT NOT NULL,
    node_type TEXT NOT NULL,
    status execution_status DEFAULT 'pending',
    inputs JSONB DEFAULT '{}',
    outputs JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    execution_id UUID REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
    node_execution_id UUID REFERENCES public.node_executions(id) ON DELETE CASCADE,
    service_provider TEXT NOT NULL, -- 'openai', 'anthropic', etc.
    model_name TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,6) DEFAULT 0,
    request_data JSONB DEFAULT '{}',
    response_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS workflow_executions_workflow_id_idx ON public.workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS workflow_executions_user_id_idx ON public.workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS workflow_executions_status_idx ON public.workflow_executions(status);
CREATE INDEX IF NOT EXISTS workflow_executions_created_at_idx ON public.workflow_executions(created_at DESC);

CREATE INDEX IF NOT EXISTS node_executions_execution_id_idx ON public.node_executions(execution_id);
CREATE INDEX IF NOT EXISTS node_executions_node_id_idx ON public.node_executions(node_id);
CREATE INDEX IF NOT EXISTS node_executions_status_idx ON public.node_executions(status);

CREATE INDEX IF NOT EXISTS ai_usage_user_id_idx ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS ai_usage_execution_id_idx ON public.ai_usage(execution_id);
CREATE INDEX IF NOT EXISTS ai_usage_created_at_idx ON public.ai_usage(created_at DESC);

-- Enable Row Level Security on new tables
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflow_executions
CREATE POLICY "Users can view own workflow executions" ON public.workflow_executions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workflow executions" ON public.workflow_executions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflow executions" ON public.workflow_executions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for node_executions
CREATE POLICY "Users can view own node executions" ON public.node_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workflow_executions we
            WHERE we.id = execution_id AND we.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own node executions" ON public.node_executions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflow_executions we
            WHERE we.id = execution_id AND we.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own node executions" ON public.node_executions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workflow_executions we
            WHERE we.id = execution_id AND we.user_id = auth.uid()
        )
    );

-- Create RLS policies for ai_usage
CREATE POLICY "Users can view own AI usage" ON public.ai_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage" ON public.ai_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_workflow_executions_updated_at
    BEFORE UPDATE ON public.workflow_executions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for tables (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.node_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_usage;
