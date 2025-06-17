
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Settings, Plus } from 'lucide-react';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  icon?: string;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  requirements?: string[];
  outputs?: string[];
  pricing?: {
    tier: 'free' | 'premium' | 'enterprise';
    credits?: number;
  };
}

interface AIAgentModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWorkflow?: (agent: AIAgent) => void;
}

const AIAgentModal = ({ agent, isOpen, onClose, onAddToWorkflow }: AIAgentModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!agent) return null;

  const handleAddToWorkflow = () => {
    if (onAddToWorkflow) {
      onAddToWorkflow(agent);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            {agent.name}
            <Badge variant="secondary">{agent.category}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{agent.description}</p>
                </CardContent>
              </Card>

              {agent.complexity && (
                <Card>
                  <CardHeader>
                    <CardTitle>Complexity Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge 
                      variant={
                        agent.complexity === 'beginner' ? 'default' :
                        agent.complexity === 'intermediate' ? 'secondary' : 'destructive'
                      }
                    >
                      {agent.complexity}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="capabilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {agent.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>
                    Set up this agent for your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    <span>Configuration options will be available after adding to workflow</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {onAddToWorkflow && (
            <Button onClick={handleAddToWorkflow} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to Workflow
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAgentModal;
