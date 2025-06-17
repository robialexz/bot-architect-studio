import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Database, 
  Mail, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  description: string;
}

const WorkflowVisualization: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const workflowNodes: WorkflowNode[] = [
    {
      id: 'trigger',
      title: 'Data Input',
      icon: <Database className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      status: 'idle',
      description: 'Receive customer data from CRM'
    },
    {
      id: 'process',
      title: 'AI Analysis',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      status: 'idle',
      description: 'Analyze customer behavior patterns'
    },
    {
      id: 'generate',
      title: 'Content Creation',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      status: 'idle',
      description: 'Generate personalized email content'
    },
    {
      id: 'send',
      title: 'Email Delivery',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      status: 'idle',
      description: 'Send personalized emails to customers'
    },
    {
      id: 'complete',
      title: 'Complete',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      status: 'idle',
      description: 'Track engagement and results'
    }
  ];

  const [nodes, setNodes] = useState(workflowNodes);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = (prev + 1) % nodes.length;
          
          // Update node statuses
          setNodes(prevNodes => 
            prevNodes.map((node, index) => ({
              ...node,
              status: index < nextStep ? 'completed' : 
                     index === nextStep ? 'processing' : 'idle'
            }))
          );
          
          return nextStep;
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, nodes.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setNodes(workflowNodes);
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'ring-2 ring-blue-400 ring-opacity-75 animate-pulse';
      case 'completed':
        return 'ring-2 ring-green-400 ring-opacity-75';
      case 'error':
        return 'ring-2 ring-red-400 ring-opacity-75';
      default:
        return 'ring-1 ring-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Pause' : 'Play'} Demo
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Workflow Visualization */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center w-full max-w-5xl">
            {nodes.slice(0, -1).map((_, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div className="flex-1" />
                <ArrowRight 
                  className={`w-6 h-6 mx-4 transition-colors duration-300 ${
                    index < currentStep ? 'text-green-400' : 'text-gray-600'
                  }`} 
                />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Nodes */}
        <div className="flex justify-between items-center relative z-10">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex flex-col items-center max-w-xs">
              <Card className={`mb-4 transition-all duration-300 ${getNodeStatusColor(node.status)}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${node.color} flex items-center justify-center transition-transform duration-300 ${
                    node.status === 'processing' ? 'scale-110' : 'scale-100'
                  }`}>
                    {node.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{node.title}</h3>
                  <p className="text-sm text-gray-400">{node.description}</p>
                  
                  {/* Status Indicator */}
                  <div className="mt-3">
                    {node.status === 'processing' && (
                      <div className="text-blue-400 text-sm font-medium">Processing...</div>
                    )}
                    {node.status === 'completed' && (
                      <div className="text-green-400 text-sm font-medium">✓ Completed</div>
                    )}
                    {node.status === 'idle' && (
                      <div className="text-gray-500 text-sm">Waiting</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Description */}
      <div className="mt-8 text-center">
        <div className="max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-2">
            {isPlaying ? `Step ${currentStep + 1}: ${nodes[currentStep]?.title}` : 'Ready to Start'}
          </h4>
          <p className="text-gray-400">
            {isPlaying 
              ? nodes[currentStep]?.description 
              : 'Click Play to see how AI workflows automate complex business processes'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowVisualization;
