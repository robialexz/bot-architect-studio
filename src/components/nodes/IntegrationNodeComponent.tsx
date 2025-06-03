import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, MessageSquare, FileText, Globe } from 'lucide-react';
import { NodeTemplate } from '@/types/nodeTemplates';
import { NodeStatus } from '@/types/workflow';

interface IntegrationNodeData {
  label: string;
  template: NodeTemplate;
  config: Record<string, unknown>;
  status?: NodeStatus;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const IntegrationNodeComponent: React.FC<NodeProps<IntegrationNodeData>> = ({ data, selected }) => {
  const getNodeIcon = () => {
    switch (data.template.type) {
      case 'slack_connector':
        return <MessageSquare className="w-5 h-5" />;
      case 'email_sender':
        return <Mail className="w-5 h-5" />;
      case 'webhook':
        return <Globe className="w-5 h-5" />;
      case 'file_processor':
        return <FileText className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
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

  return (
    <Card className={`min-w-[240px] shadow-lg transition-all duration-200 ${getStatusColor()}`}>
      {/* Input Handles */}
      {data.template.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: 50 + index * 20,
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
            top: 50 + index * 20,
            background: '#f59e0b',
          }}
          className="w-3 h-3"
        />
      ))}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${data.template.color}20`, color: data.template.color }}
          >
            {getNodeIcon()}
          </div>
          <div>
            <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              Integration
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {data.template.description}
        </p>

        {/* Connection status indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.template.inputs.length}→{data.template.outputs.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(IntegrationNodeComponent);
