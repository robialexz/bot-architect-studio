import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Filter, Shuffle, FileText } from 'lucide-react';
import { NodeTemplate } from '@/types/nodeTemplates';
import { NodeStatus } from '@/types/workflow';

interface DataNodeData {
  label: string;
  template: NodeTemplate;
  config: Record<string, unknown>;
  status?: NodeStatus;
  onConfigChange: (config: Record<string, unknown>) => void;
}

const DataNodeComponent: React.FC<NodeProps<DataNodeData>> = ({ data, selected }) => {
  const getNodeIcon = () => {
    switch (data.template.type) {
      case 'data_transformer':
        return <Shuffle className="w-5 h-5" />;
      case 'data_filter':
        return <Filter className="w-5 h-5" />;
      case 'csv_parser':
      case 'json_parser':
        return <FileText className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
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
            background: '#8b5cf6',
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
              Data Processing
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {data.template.description}
        </p>

        {/* Input/Output indicators */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {data.template.inputs.length} input{data.template.inputs.length !== 1 ? 's' : ''}
          </span>
          <span>
            {data.template.outputs.length} output{data.template.outputs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(DataNodeComponent);
