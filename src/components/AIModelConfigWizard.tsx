
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Settings, 
  Sparkles, 
  BookOpen,
  Save, 
  RotateCcw, 
  Download,
  Upload,
  AlertCircle,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIModelConfig {
  // Model Selection
  provider: 'openai' | 'anthropic' | 'cohere' | 'local';
  model: string;
  
  // Generation Parameters
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxTokens: number;
  
  // Prompts
  systemPrompt: string;
  userPrompt: string;
  
  // Advanced Settings
  responseFormat: 'json' | 'text' | 'structured';
  streaming: boolean;
  logprobs: boolean;
  
  // Safety & Moderation
  contentFilter: boolean;
  moderationLevel: 'low' | 'medium' | 'high';
  
  // Custom Settings
  customHeaders: Record<string, string>;
  timeout: number;
}

interface AIModelConfigWizardProps {
  onSave: (config: AIModelConfig) => void;
  onCancel: () => void;
  initialConfig?: Partial<AIModelConfig>;
}

const DEFAULT_CONFIG: AIModelConfig = {
  provider: 'openai',
  model: 'gpt-4',
  temperature: 0.7,
  topP: 1.0,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  maxTokens: 1000,
  systemPrompt: 'You are a helpful AI assistant.',
  userPrompt: '',
  responseFormat: 'text',
  streaming: false,
  logprobs: false,
  contentFilter: true,
  moderationLevel: 'medium',
  customHeaders: {},
  timeout: 30000,
};

const MODEL_OPTIONS = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4', description: 'Most capable model' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Faster and cheaper' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  ],
  anthropic: [
    { value: 'claude-3', label: 'Claude 3', description: 'Latest Claude model' },
    { value: 'claude-2', label: 'Claude 2', description: 'Previous generation' },
  ],
  cohere: [
    { value: 'command', label: 'Command', description: 'General purpose' },
    { value: 'command-nightly', label: 'Command Nightly', description: 'Latest features' },
  ],
  local: [
    { value: 'llama-2', label: 'Llama 2', description: 'Open source' },
    { value: 'mistral', label: 'Mistral', description: 'Efficient local model' },
  ],
};

const PROMPT_TEMPLATES = [
  {
    id: 'assistant',
    name: 'General Assistant',
    systemPrompt: 'You are a helpful AI assistant. Provide accurate, concise, and helpful responses.',
    userPrompt: '{user_input}',
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    systemPrompt: 'You are a data analyst. Analyze the provided data and give insights with clear explanations.',
    userPrompt: 'Analyze this data: {user_input}',
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    systemPrompt: 'You are a creative writer. Write engaging, original content based on the given prompt.',
    userPrompt: 'Write about: {user_input}',
  },
];

const AIModelConfigWizard = ({ onSave, onCancel, initialConfig }: AIModelConfigWizardProps) => {
  const [config, setConfig] = useState<AIModelConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [activeTab, setActiveTab] = useState('model');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateConfig = (updates: Partial<AIModelConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(config);
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_CONFIG, ...initialConfig });
  };

  const handleTemplateSelect = (template: typeof PROMPT_TEMPLATES[0]) => {
    updateConfig({
      systemPrompt: template.systemPrompt,
      userPrompt: template.userPrompt,
    });
  };

  const currentModels = MODEL_OPTIONS[config.provider] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Model Configuration
          </h2>
          <p className="text-muted-foreground">Configure your AI model settings and parameters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose your AI model provider and specific model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Select value={config.provider} onValueChange={(value: AIModelConfig['provider']) => updateConfig({ provider: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="cohere">Cohere</SelectItem>
                    <SelectItem value="local">Local Models</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={config.model} onValueChange={(value) => updateConfig({ model: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Different models have different capabilities and pricing. Choose based on your specific needs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation Parameters</CardTitle>
              <CardDescription>Fine-tune how the AI generates responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-muted-foreground">{config.temperature}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[config.temperature]}
                  onValueChange={([value]) => updateConfig({ temperature: value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls randomness. Lower values make output more focused and deterministic.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="topP">Top P</Label>
                  <span className="text-sm text-muted-foreground">{config.topP}</span>
                </div>
                <Slider
                  id="topP"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[config.topP]}
                  onValueChange={([value]) => updateConfig({ topP: value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls diversity by limiting token selection to top probability mass.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                  <span className="text-sm text-muted-foreground">{config.frequencyPenalty}</span>
                </div>
                <Slider
                  id="frequencyPenalty"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[config.frequencyPenalty]}
                  onValueChange={([value]) => updateConfig({ frequencyPenalty: value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Reduces repetition of frequently used tokens.
                </p>
              </div>

              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) || 1000 })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum number of tokens to generate.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Configuration</CardTitle>
              <CardDescription>Set up system and user prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Prompt Templates</Label>
                  <Badge variant="secondary">Quick Start</Badge>
                </div>
                <div className="grid gap-2">
                  {PROMPT_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect(template)}
                      className="justify-start"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={config.systemPrompt}
                  onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                  placeholder="Define the AI's role and behavior..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="userPrompt">User Prompt Template</Label>
                <Textarea
                  id="userPrompt"
                  value={config.userPrompt}
                  onChange={(e) => updateConfig({ userPrompt: e.target.value })}
                  placeholder="Template for user input. Use {user_input} as placeholder..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={config.responseFormat}
                onValueChange={(value: AIModelConfig['responseFormat']) => updateConfig({ responseFormat: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json">JSON</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="structured" id="structured" />
                  <Label htmlFor="structured">Structured</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="streaming">Enable Streaming</Label>
                  <p className="text-sm text-muted-foreground">Stream responses in real-time</p>
                </div>
                <Switch
                  id="streaming"
                  checked={config.streaming}
                  onCheckedChange={(checked) => updateConfig({ streaming: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contentFilter">Content Filtering</Label>
                  <p className="text-sm text-muted-foreground">Apply content moderation</p>
                </div>
                <Switch
                  id="contentFilter"
                  checked={config.contentFilter}
                  onCheckedChange={(checked) => updateConfig({ contentFilter: checked })}
                />
              </div>

              <div>
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.timeout}
                  onChange={(e) => updateConfig({ timeout: parseInt(e.target.value) || 30000 })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelConfigWizard;
