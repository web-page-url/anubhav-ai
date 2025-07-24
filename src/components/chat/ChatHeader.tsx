import { Sparkles, Bot } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Anubhav AI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Powered by Open AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}