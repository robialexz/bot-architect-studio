import React from 'react';
import AIAgentCard, { AIAgent } from '@/components/AIAgentCard'; // Corrected import
import { allAiAgents } from '@/data/aiAgents';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AgentPaletteProps {
  onAddNodeToCanvas: (agent: AIAgent) => void;
}

const AgentPalette: React.FC<AgentPaletteProps> = ({ onAddNodeToCanvas }) => {
  return (
    <div className="w-full md:w-72 lg:w-80 border-r border-border-alt bg-card-alt p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Agent Library</h2>
      <ScrollArea className="flex-grow">
        <div className="grid grid-cols-1 gap-4">
          {allAiAgents.map((agent, index) => (
            <AIAgentCard
              key={agent.id}
              agent={agent}
              onClick={() => {
                // This onClick is for "View Details" which is handled by a button inside AIAgentCard.
                // If we want the whole card to be clickable for details, this could call a different prop.
                // For now, it does nothing here as "Add to Workflow" is the primary action from the palette.
              }}
              onAddToWorkflow={onAddNodeToCanvas}
              index={index}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AgentPalette;
