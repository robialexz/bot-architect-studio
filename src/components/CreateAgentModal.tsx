import React, { useState, FC, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AIAgent } from '@/pages/MyAgents'; // Assuming MyAgents.tsx exports this
import { Cpu, Book, Zap, LucideIcon } from 'lucide-react'; // Example icons

// Simplified agent data for creation, id and usageTokens will be handled outside
export type NewAgentData = Omit<AIAgent, 'id' | 'usageTokens' | 'icon'> & { iconName: string }; // Kept for clarity, though AIAgent now uses iconName
export type AgentFormData = Omit<AIAgent, 'id' | 'usageTokens'>; // Data for create/update

interface AgentModalProps {
  // Renamed for clarity
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreate?: (agentData: AgentFormData) => void; // Optional for edit mode
  onAgentUpdate?: (agentId: string, agentData: AgentFormData) => void; // Optional for create mode
  agentToEdit?: AIAgent | null; // Agent data for editing
}

// A simple map for icon selection demonstration
const availableIcons: { name: string; component: LucideIcon }[] = [
  { name: 'Cpu', component: Cpu },
  { name: 'Book', component: Book },
  { name: 'Zap', component: Zap },
  // Add more icons as needed
];

const AgentModal: FC<AgentModalProps> = ({
  // Renamed component
  open,
  onOpenChange,
  onAgentCreate,
  onAgentUpdate,
  agentToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState(availableIcons[0].name);
  const [category, setCategory] = useState('');
  const [agentType, setAgentType] = useState<AIAgent['type']>('custom');
  const [isActive, setIsActive] = useState(true);

  const isEditMode = !!agentToEdit;

  useEffect(() => {
    if (isEditMode && agentToEdit) {
      setName(agentToEdit.name);
      setDescription(agentToEdit.description);
      setIconName(agentToEdit.iconName || availableIcons[0].name); // Fallback if iconName is somehow missing
      setCategory(agentToEdit.category);
      setAgentType(agentToEdit.type);
      setIsActive(agentToEdit.isActive);
    } else {
      // Reset form for create mode or when modal is re-opened without agentToEdit
      setName('');
      setDescription('');
      setIconName(availableIcons[0].name);
      setCategory('');
      setAgentType('custom');
      setIsActive(true);
    }
  }, [agentToEdit, open, isEditMode]); // Rerun effect if agentToEdit or open status changes

  const handleSubmit = () => {
    if (!name || !description || !category || !iconName) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const formData: AgentFormData = {
      name,
      description,
      iconName,
      category,
      type: agentType,
      isActive,
    };

    if (isEditMode && agentToEdit && onAgentUpdate) {
      onAgentUpdate(agentToEdit.id, formData);
    } else if (onAgentCreate) {
      onAgentCreate(formData);
    }
    // onOpenChange(false); // Parent component will handle closing the modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card-alt border-border-alt">
        <DialogHeader>
          <DialogTitle className="text-h3">
            {isEditMode ? 'Edit AI Agent' : 'Create New AI Agent'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the details for this AI agent.'
              : 'Configure the details for your new AI agent.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Marketing Assistant"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe what this agent does"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iconName" className="text-right">
              Icon
            </Label>
            <Select value={iconName} onValueChange={setIconName}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map(icon => (
                  <SelectItem key={icon.name} value={icon.name}>
                    <div className="flex items-center">
                      <icon.component className="w-4 h-4 mr-2" />
                      {icon.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Content Generation"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agentType" className="text-right">
              Agent Type
            </Label>
            <Select
              value={agentType}
              onValueChange={(value: AIAgent['type']) => setAgentType(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Active
            </Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              className="col-span-3 justify-self-start"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Agent'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentModal; // Renamed export
