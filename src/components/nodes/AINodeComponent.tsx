import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Settings,
  ChevronDown,
  ChevronUp,
  Bot,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { NodeTemplate, ConfigurationType } from '@/types/nodeTemplates';
import { NodeStatus } from '@/types/workflow';

interface AINodeData {
  label: string;
  template: NodeTemplate;
  config: Record<string, unknown>;
  status?: NodeStatus;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const AINodeComponent: React.FC<NodeProps<AINodeData>> = ({ data, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(data.config || {});

  const handleConfigChange = (key: string, value: unknown) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    data.onConfigChange(newConfig);
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bot className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'running':
        return 'border-blue-500 shadow-blue-500/20';
      case 'completed':
        return 'border-green-500 shadow-green-500/20';
      case 'error':
        return 'border-red-500 shadow-red-500/20';
      default:
        return selected ? 'border-primary shadow-primary/20' : 'border-border';
    }
  };

  const renderConfigField = (config: {
    id: string;
    type: ConfigurationType;
    defaultValue?: unknown;
    description?: string;
    options?: Array<{ value: string; label: string }>;
    validation?: Array<{ type: string; value?: unknown }>;
  }) => {
    const value = localConfig[config.id] || config.defaultValue;

    switch (config.type) {
      case ConfigurationType.TEXT:
        return (
          <Input
            value={value || ''}
            onChange={e => handleConfigChange(config.id, e.target.value)}
            placeholder={config.description}
          />
        );

      case ConfigurationType.TEXTAREA:
        return (
          <Textarea
            value={value || ''}
            onChange={e => handleConfigChange(config.id, e.target.value)}
            placeholder={config.description}
            rows={3}
          />
        );

      case ConfigurationType.NUMBER:
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={e => handleConfigChange(config.id, parseFloat(e.target.value) || 0)}
            placeholder={config.description}
          />
        );

      case ConfigurationType.BOOLEAN:
        return (
          <Switch
            checked={value || false}
            onCheckedChange={checked => handleConfigChange(config.id, checked)}
          />
        );

      case ConfigurationType.SELECT:
        return (
          <Select
            value={value || config.defaultValue}
            onValueChange={newValue => handleConfigChange(config.id, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option: { value: string; label: string }) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case ConfigurationType.SLIDER:
        return (
          <div className="space-y-2">
            <Slider
              value={[value || config.defaultValue || 0]}
              onValueChange={values => handleConfigChange(config.id, values[0])}
              min={config.validation?.find(v => v.type === 'min')?.value || 0}
              max={config.validation?.find(v => v.type === 'max')?.value || 100}
              step={0.1}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground text-center">
              {value || config.defaultValue || 0}
            </div>
          </div>
        );

      case ConfigurationType.PASSWORD:
        return (
          <Input
            type="password"
            value={value || ''}
            onChange={e => handleConfigChange(config.id, e.target.value)}
            placeholder={config.description}
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={e => handleConfigChange(config.id, e.target.value)}
            placeholder={config.description}
          />
        );
    }
  };

  return (
    <Card className={`min-w-[280px] shadow-lg transition-all duration-200 ${getStatusColor()}`}>
      {/* Input Handles */}
      {data.template.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: 60 + index * 20,
            background: input.required ? '#ef4444' : '#6b7280',
          }}
          className="w-3 h-3"
        />
      ))}

      {/* Output Handles */}
      {data.template.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: 60 + index * 20,
            background: '#10b981',
          }}
          className="w-3 h-3"
        />
      ))}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{data.template.icon}</div>
            <div>
              <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon()}
                <Badge variant="secondary" className="text-xs">
                  {data.template.category.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Node Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {data.template.description}
        </p>

        {/* Input/Output Summary */}
        <div className="space-y-2 mb-3">
          {data.template.inputs.slice(0, 2).map(input => (
            <div key={input.id} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{input.name}</span>
              {input.required && <span className="text-red-500">*</span>}
            </div>
          ))}
          {data.template.outputs.slice(0, 2).map(output => (
            <div key={output.id} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{output.name}</span>
            </div>
          ))}
        </div>

        {/* Configuration Panel */}
        <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <CollapsibleContent className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </h4>

              {data.template.configuration.map(config => (
                <div key={config.id} className="space-y-2">
                  <Label className="text-xs font-medium">
                    {config.label}
                    {config.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderConfigField(config)}
                  {config.description && (
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(AINodeComponent);
