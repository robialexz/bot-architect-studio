import React, { createContext, useState, useCallback, ReactNode } from 'react';

interface Message {
  user: string;
  assistant: string;
}

interface AssistantContextType {
  highlightedDataType: string | null;
  setHighlightedDataType: (dataType: string | null) => void;
  conversation: Message[];
  addMessageToConversation: (userQuery: string, assistantResponse: string) => void;
  processCommand: (userInput: string) => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

interface AssistantProviderProps {
  children: ReactNode;
}

const predefinedResponses: Record<string, { response: string; dataType?: string }> = {
  'show me pricing': {
    response: "Certainly! Here's a look at our pricing options.",
    dataType: 'pricing',
  },
  'highlight testimonials': {
    response: 'Happy to! Check out what our users are saying.',
    dataType: 'testimonials',
  },
  'tell me about features': {
    response: 'Our platform is packed with features. Let me show you the highlights.',
    dataType: 'features',
  },
  default: {
    response:
      "I'm sorry, I can only respond to a few specific phrases right now, like 'Show me pricing', 'Highlight testimonials', or 'Tell me about features'.",
  },
};

export const AssistantProvider: React.FC<AssistantProviderProps> = ({ children }) => {
  const [highlightedDataType, setHighlightedDataType] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);

  const addMessageToConversation = useCallback((userQuery: string, assistantResponse: string) => {
    setConversation(prev => [...prev, { user: userQuery, assistant: assistantResponse }]);
  }, []);

  const processCommand = useCallback(
    (userInput: string) => {
      const command = userInput.toLowerCase().trim();
      const matchedResponse = predefinedResponses[command] || predefinedResponses['default'];

      addMessageToConversation(userInput, matchedResponse.response);

      if (matchedResponse.dataType) {
        setHighlightedDataType(matchedResponse.dataType);
        // Optionally, clear highlight after some time
        // setTimeout(() => setHighlightedDataType(null), 5000);
      } else {
        // If it's a default response or no specific data type, clear any highlight
        setHighlightedDataType(null);
      }
    },
    [addMessageToConversation]
  );

  return (
    <AssistantContext.Provider
      value={{
        highlightedDataType,
        setHighlightedDataType,
        conversation,
        addMessageToConversation,
        processCommand,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = (): AssistantContextType => {
  const context = React.useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
