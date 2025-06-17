import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Globe, Play, Calendar } from 'lucide-react';
import { NodeTemplate } from '@/types/nodeTemplates';
import { NodeStatus } from '@/types/workflow';

interface TriggerNodeData {
  label: string;
  template: NodeTemplate;
  config: Record<string, unknown>;
  status?: NodeStatus;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const TriggerNodeComponent: React.FC<NodeProps<TriggerNodeData>> = ({ data, selected }) => {
  const getNodeIcon = () => {
    switch (data.template.type) {
      case 'manual_trigger':
        return <Play className="w-5 h-5" />;
      case 'schedule_trigger':
        return <Calendar className="w-5 h-5" />;
      case 'webhook_trigger':
        return <Globe className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
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
      {/* Output Handles only for triggers */}
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
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">{getNodeIcon()}</div>
          <div>
            <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
            <Badge
              variant="outline"
              className="text-xs mt-1 bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Trigger
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {data.template.description}
        </p>

        {/* Trigger status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.template.outputs.length} output{data.template.outputs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(TriggerNodeComponent);
