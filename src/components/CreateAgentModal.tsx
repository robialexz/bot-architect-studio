
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Bot, Zap, Settings, Save } from 'lucide-react';

interface AgentFormData {
  name: string;
  description: string;
  category: string;
  type: 'custom' | 'template';
  capabilities: string[];
  configuration: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agentData: AgentFormData) => void;
}

const AGENT_CATEGORIES = [
  'Data Processing',
  'Content Generation',
  'Analysis',
  'Communication',
  'Automation',
  'Custom',
];

const AGENT_TEMPLATES = [
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Generates high-quality written content',
    category: 'Content Generation',
    capabilities: ['Writing', 'Editing', 'SEO Optimization'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyzes data and provides insights',
    category: 'Analysis',
    capabilities: ['Data Analysis', 'Visualization', 'Reporting'],
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Handles customer inquiries and support',
    category: 'Communication',
    capabilities: ['Customer Service', 'Problem Solving', 'Documentation'],
  },
];

const CreateAgentModal = ({ isOpen, onClose, onCreateAgent }: CreateAgentModalProps) => {
  const [agentData, setAgentData] = useState<AgentFormData>({
    name: '',
    description: '',
    category: '',
    type: 'custom',
    capabilities: [],
    configuration: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '',
    },
  });

  const [currentCapability, setCurrentCapability] = useState('');

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setAgentData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (field: keyof AgentFormData['configuration'], value: any) => {
    setAgentData(prev => ({
      ...prev,
      configuration: { ...prev.configuration, [field]: value },
    }));
  };

  const addCapability = () => {
    if (currentCapability.trim() && !agentData.capabilities.includes(currentCapability.trim())) {
      setAgentData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, currentCapability.trim()],
      }));
      setCurrentCapability('');
    }
  };

  const removeCapability = (capability: string) => {
    setAgentData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability),
    }));
  };

  const handleTemplateSelect = (template: typeof AGENT_TEMPLATES[0]) => {
    setAgentData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category,
      type: 'template',
      capabilities: [...template.capabilities],
    }));
  };

  const handleSubmit = () => {
    const form = document.forms.namedItem('agent-form') as HTMLFormElement;
    if (form?.checkValidity()) {
      onCreateAgent(agentData);
      onClose();
      // Reset form
      setAgentData({
        name: '',
        description: '',
        category: '',
        type: 'custom',
        capabilities: [],
        configuration: {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: '',
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Create New AI Agent
          </DialogTitle>
          <DialogDescription>
            Build a custom AI agent or start from a template
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <form name="agent-form" className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Templates</CardTitle>
                <CardDescription>Choose a template to get started quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {AGENT_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        agentData.name === template.name
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {template.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="agent-name">Agent Name *</Label>
                  <Input
                    id="agent-name"
                    value={agentData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter agent name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="agent-description">Description *</Label>
                  <Textarea
                    id="agent-description"
                    value={agentData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this agent does"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="agent-category">Category *</Label>
                  <Select
                    value={agentData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capabilities</CardTitle>
                <CardDescription>Define what this agent can do</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentCapability}
                    onChange={(e) => setCurrentCapability(e.target.value)}
                    placeholder="Add a capability"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                  />
                  <Button type="button" onClick={addCapability} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {agentData.capabilities.map((capability) => (
                    <Badge
                      key={capability}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeCapability(capability)}
                    >
                      {capability} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Configuration</CardTitle>
                <CardDescription>Configure the AI model settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="model">AI Model</Label>
                  <Select
                    value={agentData.configuration.model}
                    onValueChange={(value) => handleConfigChange('model', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={agentData.configuration.systemPrompt}
                    onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
                    placeholder="Define the agent's behavior and role"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </ScrollArea>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentModal;
