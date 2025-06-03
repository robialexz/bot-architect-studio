import React, { useState } from 'react';
import { useAssistant } from '../contexts/AssistantContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaperPlaneIcon } from '@radix-ui/react-icons'; // Or any other send icon

const NexusAssistantUI: React.FC = () => {
  const { conversation, processCommand } = useAssistant();
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      processCommand(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-background border border-border rounded-lg shadow-xl p-4 flex flex-col space-y-3 z-50">
      <h3 className="text-lg font-semibold text-foreground">Nexus Assistant</h3>
      <ScrollArea className="h-60 w-full p-3 border border-input rounded-md">
        {conversation.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Ask me something, e.g., "Show me pricing".
          </p>
        )}
        {conversation.map((msg, index) => (
          <div key={index} className="mb-3">
            <p className="text-sm font-medium text-primary">You: {msg.user}</p>
            <p className="text-sm text-foreground bg-muted p-2 rounded-md mt-1">
              Assistant: {msg.assistant}
            </p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Ask the Nexus..."
          className="flex-grow"
        />
        <Button type="submit" size="icon">
          <PaperPlaneIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default NexusAssistantUI;
