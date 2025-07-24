'use client';

import { useState, useEffect } from 'react';
import { MessageBubbleProps } from '@/types/chat';
import { User, Bot, Volume2, VolumeX } from 'lucide-react';

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const isUser = message.role === 'user';

  useEffect(() => {
    const formatTime = () => {
      const hours = message.timestamp.getHours();
      const minutes = message.timestamp.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };
    setFormattedTime(formatTime());
  }, [message.timestamp]);

  const speakText = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold">{boldText}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`p-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block max-w-sm ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        <div className="flex items-start gap-2">
          {!isUser && (
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="flex flex-col">
            <div className={`relative px-4 py-3 rounded-lg ${isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-white'
              }`}>
              <div className="text-sm leading-relaxed">
                {renderFormattedText(message.content)}
              </div>

              {!isUser && (
                <button
                  onClick={speakText}
                  className={`absolute top-2 right-2 p-1 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-purple-600 opacity-0 hover:opacity-100'
                    } transition-opacity`}
                >
                  {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              )}
            </div>

            <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {formattedTime}
            </div>
          </div>

          {isUser && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}