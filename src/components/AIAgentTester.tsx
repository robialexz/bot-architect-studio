import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Clock, Play, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIAgentExecution {
  id: string;
  status: 'completed' | 'failed';
  execution_time_ms?: number;
  tokens_used?: number;
  output_data?: any;
  error_message?: string | undefined;
}

interface AIAgentTesterProps {
  agentName: string;
  onClose: () => void;
}

const AIAgentTester = ({ agentName, onClose }: AIAgentTesterProps) => {
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<AIAgentExecution[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<AIAgentExecution | null>(null);
  const [testMode, setTestMode] = useState<'single' | 'batch' | 'performance'>('single');
  const [batchInputs, setBatchInputs] = useState<string>('');
  const [performanceSettings, setPerformanceSettings] = useState({
    iterations: 10,
    concurrency: 3,
    timeout: 30000,
  });

  const executeAgent = async (): Promise<AIAgentExecution> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccess = Math.random() > 0.2;
    const mockExecution: AIAgentExecution = {
      id: `exec_${Date.now()}`,
      status: isSuccess ? 'completed' : 'failed',
      execution_time_ms: Math.floor(Math.random() * 5000) + 500,
      tokens_used: Math.floor(Math.random() * 1000) + 100,
      output_data: isSuccess ? { result: 'Mock successful output', confidence: 0.85 } : undefined,
      error_message: isSuccess ? undefined : 'Mock error: Processing failed',
    };

    return mockExecution;
  };

  const handleSingleTest = async () => {
    setIsExecuting(true);
    try {
      const result = await executeAgent();
      setTestResults(prev => [result, ...prev]);
      setSelectedExecution(result);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agent Tester</h2>
          <p className="text-muted-foreground">Testing agent: {agentName}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs value={testMode} onValueChange={(value) => setTestMode(value as typeof testMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single Test</TabsTrigger>
          <TabsTrigger value="batch">Batch Test</TabsTrigger>
          <TabsTrigger value="performance">Performance Test</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Configure inputs for single test execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="input-text">Input Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter test input..."
                    value={testInputs.text || ''}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, text: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="context">Context (Optional)</Label>
                  <Input
                    id="context"
                    placeholder="Additional context..."
                    value={testInputs.context || ''}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, context: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSingleTest} disabled={isExecuting} className="w-full">
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Test Configuration</CardTitle>
              <CardDescription>Run multiple tests with different inputs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batch-inputs">Batch Inputs (JSON)</Label>
                <Textarea
                  id="batch-inputs"
                  placeholder="[{&quot;text&quot;: &quot;input1&quot;}, {&quot;text&quot;: &quot;input2&quot;}]"
                  value={batchInputs}
                  onChange={(e) => setBatchInputs(e.target.value)}
                  rows={6}
                />
              </div>
              <Button disabled={isExecuting} className="w-full">
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Batch...
                  </>
                ) : (
                  'Run Batch Test'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Test Configuration</CardTitle>
              <CardDescription>Test agent performance under load</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="iterations">Iterations</Label>
                  <Input
                    id="iterations"
                    type="number"
                    value={performanceSettings.iterations}
                    onChange={(e) => setPerformanceSettings(prev => ({ 
                      ...prev, 
                      iterations: parseInt(e.target.value) || 10 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="concurrency">Concurrency</Label>
                  <Input
                    id="concurrency"
                    type="number"
                    value={performanceSettings.concurrency}
                    onChange={(e) => setPerformanceSettings(prev => ({ 
                      ...prev, 
                      concurrency: parseInt(e.target.value) || 3 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={performanceSettings.timeout}
                    onChange={(e) => setPerformanceSettings(prev => ({ 
                      ...prev, 
                      timeout: parseInt(e.target.value) || 30000 
                    }))}
                  />
                </div>
              </div>
              <Button disabled={isExecuting} className="w-full">
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Performance Test...
                  </>
                ) : (
                  'Run Performance Test'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            {testResults.length} test{testResults.length !== 1 ? 's' : ''} executed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No test results yet. Run a test to see results here.
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedExecution?.id === result.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedExecution(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {result.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={result.status === 'completed' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {result.execution_time_ms && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.execution_time_ms}ms
                          </span>
                        )}
                        {result.tokens_used && (
                          <span>{result.tokens_used} tokens</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Selected Execution Details */}
      {selectedExecution && (
        <Card>
          <CardHeader>
            <CardTitle>Execution Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedExecution.status === 'completed' && selectedExecution.output_data && (
              <div>
                <Label>Output</Label>
                <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-auto">
                  {JSON.stringify(selectedExecution.output_data, null, 2)}
                </pre>
              </div>
            )}
            {selectedExecution.status === 'failed' && selectedExecution.error_message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {selectedExecution.error_message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAgentTester;
