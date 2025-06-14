
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Sliders,
  Zap,
  TestTube,
  Save,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface AIModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  customInstructions: string;
  enableStreaming: boolean;
  enableLogging: boolean;
}

interface AIModelConfigWizardProps {
  initialConfig?: Partial<AIModelConfig>;
  onSave: (config: AIModelConfig) => void;
  onClose: () => void;
}

const AIModelConfigWizard = ({ initialConfig, onSave, onClose }: AIModelConfigWizardProps) => {
  const [config, setConfig] = useState<AIModelConfig>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    systemPrompt: '',
    customInstructions: '',
    enableStreaming: true,
    enableLogging: false,
    ...initialConfig,
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isTestingModel, setIsTestingModel] = useState(false);

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
    { id: 'claude-3', name: 'Claude 3', description: 'Anthropic model' },
  ];

  const presets = [
    {
      name: 'Creative Writing',
      config: { temperature: 0.9, topP: 0.9, frequencyPenalty: 0.5 },
    },
    {
      name: 'Analytical',
      config: { temperature: 0.2, topP: 0.8, frequencyPenalty: 0.0 },
    },
    {
      name: 'Balanced',
      config: { temperature: 0.7, topP: 1.0, frequencyPenalty: 0.0 },
    },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setConfig(prev => ({
      ...prev,
      ...preset.config,
    }));
  };

  const handleSave = () => {
    onSave(config);
  };

  const testModel = async () => {
    setIsTestingModel(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingModel(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AI Model Configuration</h2>
              <p className="text-muted-foreground">Fine-tune your AI model settings</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="model">AI Model</Label>
                    <Select value={config.model} onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-muted-foreground">{model.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 1000 }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Temperature: {config.temperature}</Label>
                    <Slider
                      value={[config.temperature]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, temperature: value[0] }))}
                      max={2}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Controls randomness in responses</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="streaming">Enable Streaming</Label>
                      <p className="text-sm text-muted-foreground">Stream responses as they generate</p>
                    </div>
                    <Switch
                      id="streaming"
                      checked={config.enableStreaming}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableStreaming: checked }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Top P: {config.topP}</Label>
                    <Slider
                      value={[config.topP]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, topP: value[0] }))}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Nucleus sampling parameter</p>
                  </div>

                  <div>
                    <Label>Frequency Penalty: {config.frequencyPenalty}</Label>
                    <Slider
                      value={[config.frequencyPenalty]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, frequencyPenalty: value[0] }))}
                      max={2}
                      min={-2}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Penalizes frequent tokens</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Presence Penalty: {config.presencePenalty}</Label>
                    <Slider
                      value={[config.presencePenalty]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, presencePenalty: value[0] }))}
                      max={2}
                      min={-2}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Penalizes repeated topics</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="logging">Enable Logging</Label>
                      <p className="text-sm text-muted-foreground">Log requests and responses</p>
                    </div>
                    <Switch
                      id="logging"
                      checked={config.enableLogging}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableLogging: checked }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={config.systemPrompt}
                    onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    placeholder="Define the AI's behavior and personality..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="customInstructions">Custom Instructions</Label>
                  <Textarea
                    id="customInstructions"
                    value={config.customInstructions}
                    onChange={(e) => setConfig(prev => ({ ...prev, customInstructions: e.target.value }))}
                    placeholder="Additional instructions for the AI..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Configuration Presets</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {presets.map((preset) => (
                    <Card
                      key={preset.name}
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{preset.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Temperature:</span>
                            <span>{preset.config.temperature}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Top P:</span>
                            <span>{preset.config.topP}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frequency:</span>
                            <span>{preset.config.frequencyPenalty}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-3">
              <Button variant="outline" onClick={testModel} disabled={isTestingModel}>
                {isTestingModel ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Configuration
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelConfigWizard;
