'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We encountered an error while loading Anubhav AI. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}