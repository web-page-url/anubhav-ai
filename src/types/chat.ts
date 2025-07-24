export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageBubbleProps {
  message: Message;
}