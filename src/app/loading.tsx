import { Bot, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="relative mb-8">
        <Bot className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-pulse" />
        <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-spin" />
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
        Anubhav AI
      </h2>
      <p className="text-gray-600 dark:text-gray-400 animate-pulse">
        Initializing AI assistant...
      </p>
    </div>
  );
}