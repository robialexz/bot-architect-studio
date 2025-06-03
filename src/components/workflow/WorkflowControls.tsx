import { Button } from '@/components/ui/button';
import { ChevronRight, Save, Play, UploadCloud } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type WorkflowControlsProps } from './types';

const WorkflowControls = ({
  flowDirection,
  agentsCount,
  isRunning,
  onToggleDirection,
  // onSave, // Removed as "Save Flow Element" button is removed
  onRun,
  onRunWorkflow,
  onSaveWorkflow,
  onLoadWorkflow,
}: WorkflowControlsProps) => {
  return (
    <TooltipProvider>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Builder</h2>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={onToggleDirection}
                className="flex gap-1 items-center"
              >
                <ChevronRight
                  className={`w-4 h-4 ${flowDirection === 'vertical' ? 'rotate-90' : ''} transition-transform`}
                />
                <span>{flowDirection === 'horizontal' ? 'Horizontal' : 'Vertical'} Flow</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle between horizontal and vertical workflow layout.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onSaveWorkflow}>
                <Save className="w-4 h-4 mr-2" />
                Save Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save the current state of the entire workflow.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onLoadWorkflow}>
                <UploadCloud className="w-4 h-4 mr-2" />
                Load Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load a previously saved workflow.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" onClick={onRunWorkflow} disabled={isRunning || agentsCount === 0}>
                <Play className="w-4 h-4 mr-2" />
                Run Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Execute the entire workflow from start to finish.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" onClick={onRun} disabled={isRunning || agentsCount < 2}>
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Selected Node'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Execute the currently selected node.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WorkflowControls;
