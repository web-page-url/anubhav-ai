import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="p-4 text-left">
      <div className="inline-block max-w-sm mr-auto">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex flex-col">
            <div className="bg-gray-800 text-white px-4 py-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}