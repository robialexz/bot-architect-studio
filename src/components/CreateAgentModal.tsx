
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Brain,
  Bot,
  Database,
  MessageSquare,
  Code,
  FileText,
} from 'lucide-react';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'content' | 'analysis' | 'automation' | 'communication';
  capabilities: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

interface CreateAgentModalProps {
  onClose: () => void;
  onCreate: (agentData: Record<string, unknown>) => void;
}

const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Creates blog posts, articles, and marketing copy',
    icon: <FileText className="h-6 w-6" />,
    category: 'content',
    capabilities: ['Writing', 'SEO Optimization', 'Research'],
    complexity: 'beginner',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyzes data and generates insights',
    icon: <Database className="h-6 w-6" />,
    category: 'analysis',
    capabilities: ['Data Processing', 'Statistical Analysis', 'Visualization'],
    complexity: 'intermediate',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Handles customer inquiries and support tickets',
    icon: <MessageSquare className="h-6 w-6" />,
    category: 'communication',
    capabilities: ['Natural Language Processing', 'Ticket Management', 'FAQ'],
    complexity: 'beginner',
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Reviews code for quality and security issues',
    icon: <Code className="h-6 w-6" />,
    category: 'analysis',
    capabilities: ['Code Analysis', 'Security Scanning', 'Best Practices'],
    complexity: 'advanced',
  },
];

const CreateAgentModal = ({ onClose, onCreate }: CreateAgentModalProps) => {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    type: 'custom',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: '',
    isPublic: false,
    tags: [] as string[],
  });

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
    setAgentConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      type: template.id,
    }));
    setActiveTab('configure');
  };

  const handleCreate = () => {
    const agentData = {
      ...agentConfig,
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
    };
    onCreate(agentData);
  };

  const getCategoryIcon = (category: AgentTemplate['category']) => {
    switch (category) {
      case 'content': return <FileText className="h-4 w-4" />;
      case 'analysis': return <Database className="h-4 w-4" />;
      case 'automation': return <Bot className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getComplexityColor = (complexity: AgentTemplate['complexity']) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create AI Agent</h2>
              <p className="text-muted-foreground">Build a custom AI agent for your workflows</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template">Choose Template</TabsTrigger>
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="review">Review & Create</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select an Agent Template</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {AGENT_TEMPLATES.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-primary">{template.icon}</div>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                {getCategoryIcon(template.category)}
                                <span className="text-sm text-muted-foreground capitalize">
                                  {template.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getComplexityColor(template.complexity)}>
                            {template.complexity}
                          </Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {template.capabilities.map((capability) => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configure" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={agentConfig.name}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter agent name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={agentConfig.description}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this agent does"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">AI Model</Label>
                    <Select value={agentConfig.model} onValueChange={(value) => setAgentConfig(prev => ({ ...prev, model: value }))}>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Textarea
                      id="systemPrompt"
                      value={agentConfig.systemPrompt}
                      onChange={(e) => setAgentConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      placeholder="Define the agent's behavior and personality"
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublic">Make Public</Label>
                      <p className="text-sm text-muted-foreground">Allow others to use this agent</p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={agentConfig.isPublic}
                      onCheckedChange={(checked) => setAgentConfig(prev => ({ ...prev, isPublic: checked }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Agent</h3>
                {selectedTemplate && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{selectedTemplate.icon}</div>
                        <div>
                          <CardTitle>{agentConfig.name}</CardTitle>
                          <CardDescription>{agentConfig.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label>Template</Label>
                          <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
                        </div>
                        <div>
                          <Label>AI Model</Label>
                          <p className="text-sm text-muted-foreground">{agentConfig.model}</p>
                        </div>
                        <div>
                          <Label>Visibility</Label>
                          <p className="text-sm text-muted-foreground">
                            {agentConfig.isPublic ? 'Public' : 'Private'}
                          </p>
                        </div>
                      </div>
                      {agentConfig.systemPrompt && (
                        <div>
                          <Label>System Prompt</Label>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md mt-1">
                            {agentConfig.systemPrompt}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('configure')}>
                    Back to Configure
                  </Button>
                  <Button onClick={handleCreate} disabled={!agentConfig.name || !selectedTemplate}>
                    Create Agent
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentModal;
