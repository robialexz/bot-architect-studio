import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function checkDatabaseSetup(): Promise<{
  success: boolean;
  tables: Record<string, boolean>;
  errors: string[];
}> {
  const result = {
    success: true,
    tables: {} as Record<string, boolean>,
    errors: [] as string[]
  };

  const requiredTables = [
    'profiles',
    'workflows', 
    'ai_agents',
    'workflow_executions',
    'node_executions',
    'ai_usage'
  ];

  // Check each table
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        result.tables[table] = false;
        result.errors.push(`Table ${table}: ${error.message}`);
        result.success = false;
      } else {
        result.tables[table] = true;
      }
    } catch (error) {
      result.tables[table] = false;
      result.errors.push(`Table ${table}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.success = false;
    }
  }

  return result;
}

export async function createMissingTables(): Promise<{
  success: boolean;
  created: string[];
  errors: string[];
}> {
  const result = {
    success: true,
    created: [] as string[],
    errors: [] as string[]
  };

  try {
    // Check if execution status enum exists
    const { error: enumError } = await supabase.rpc('check_enum_exists', { enum_name: 'execution_status' });
    
    if (enumError) {
      // Create execution status enum
      const { error: createEnumError } = await supabase.rpc('create_execution_status_enum');
      if (createEnumError) {
        result.errors.push(`Failed to create execution_status enum: ${createEnumError.message}`);
        result.success = false;
      } else {
        result.created.push('execution_status enum');
      }
    }

    // Create workflow_executions table if it doesn't exist
    const { error: workflowExecError } = await supabase.rpc('create_workflow_executions_table');
    if (workflowExecError) {
      result.errors.push(`Failed to create workflow_executions table: ${workflowExecError.message}`);
      result.success = false;
    } else {
      result.created.push('workflow_executions table');
    }

    // Create node_executions table if it doesn't exist
    const { error: nodeExecError } = await supabase.rpc('create_node_executions_table');
    if (nodeExecError) {
      result.errors.push(`Failed to create node_executions table: ${nodeExecError.message}`);
      result.success = false;
    } else {
      result.created.push('node_executions table');
    }

    // Create ai_usage table if it doesn't exist
    const { error: aiUsageError } = await supabase.rpc('create_ai_usage_table');
    if (aiUsageError) {
      result.errors.push(`Failed to create ai_usage table: ${aiUsageError.message}`);
      result.success = false;
    } else {
      result.created.push('ai_usage table');
    }

  } catch (error) {
    result.errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    result.success = false;
  }

  return result;
}

export async function setupDatabase(): Promise<void> {
  logger.info('Checking database setup...');
  
  const checkResult = await checkDatabaseSetup();
  
  if (checkResult.success) {
    logger.info('Database setup is complete', { tables: checkResult.tables });
    return;
  }

  logger.warn('Database setup incomplete', { 
    tables: checkResult.tables, 
    errors: checkResult.errors 
  });

  // Try to create missing tables
  logger.info('Attempting to create missing tables...');
  const createResult = await createMissingTables();
  
  if (createResult.success) {
    logger.info('Successfully created missing tables', { created: createResult.created });
  } else {
    logger.error('Failed to create some tables', { 
      created: createResult.created,
      errors: createResult.errors 
    });
  }
}
