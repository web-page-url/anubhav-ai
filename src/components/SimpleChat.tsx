'use client';

import React, { useState, useEffect } from 'react';
import { Send, Volume2, VolumeX, Bot, User, Mic, MicOff, Settings } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Anubhav AI, How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Voice options for AI output: 2 female, 1 male
  const [voiceOptions, setVoiceOptions] = useState([
    { name: 'Voice Female 1', gender: 'female', systemVoice: null as SpeechSynthesisVoice | null, pitch: 1.0, rate: 0.9 },
    { name: 'Voice Female 2', gender: 'female', systemVoice: null as SpeechSynthesisVoice | null, pitch: 1.1, rate: 0.85 },
    { name: 'Voice Male 1', gender: 'male', systemVoice: null as SpeechSynthesisVoice | null, pitch: 0.9, rate: 0.9 }
  ]);

  // Load available voices and map them to our voice options
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);

    // Filter English voices
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));

    // Find female voices with comprehensive detection
    const femaleVoices = englishVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      // Explicit female voice names
      const explicitFemale = name.includes('female') ||
        name.includes('woman') ||
        name.includes('samantha') ||
        name.includes('victoria') ||
        name.includes('karen') ||
        name.includes('susan') ||
        name.includes('zira') ||
        name.includes('hazel') ||
        name.includes('kate') ||
        name.includes('anna') ||
        name.includes('emma') ||
        name.includes('sarah') ||
        name.includes('lisa') ||
        name.includes('mary') ||
        name.includes('helen') ||
        name.includes('fiona') ||
        name.includes('moira') ||
        name.includes('tessa') ||
        name.includes('veena') ||
        name.includes('aria') ||
        name.includes('nora') ||
        name.includes('ava') ||
        name.includes('allison');

      // Exclude clearly male voices
      const notMale = !name.includes('male') &&
        !name.includes('man') &&
        !name.includes('daniel') &&
        !name.includes('alex') &&
        !name.includes('david') &&
        !name.includes('mark') &&
        !name.includes('tom') &&
        !name.includes('james') &&
        !name.includes('fred') &&
        !name.includes('jorge');

      return explicitFemale || notMale;
    });

    // Find male voices
    const maleVoices = englishVoices.filter(voice => {
      const name = voice.name.toLowerCase();
      return name.includes('male') ||
        name.includes('man') ||
        name.includes('daniel') ||
        name.includes('alex') ||
        name.includes('david') ||
        name.includes('mark');
    });

    // Update voice options with actual system voices
    setVoiceOptions(prev => [
      {
        ...prev[0],
        systemVoice: femaleVoices[0] || englishVoices[0] || null,
        name: `Voice Female 1${femaleVoices[0] ? ` (${femaleVoices[0].name.split(' ')[0]})` : ''}`
      },
      {
        ...prev[1],
        systemVoice: femaleVoices[1] || femaleVoices[0] || englishVoices[1] || null,
        name: `Voice Female 2${femaleVoices[1] ? ` (${femaleVoices[1].name.split(' ')[0]})` : femaleVoices[0] ? ` (${femaleVoices[0].name.split(' ')[0]})` : ''}`
      },
      {
        ...prev[2],
        systemVoice: maleVoices[0] || englishVoices[2] || null,
        name: `Voice Male 1${maleVoices[0] ? ` (${maleVoices[0].name.split(' ')[0]})` : ''}`
      }
    ]);
  };

  // Initialize voices when component mounts
  useEffect(() => {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Voice input functionality
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Speech recognition error. Please try again.');
    };

    recognition.start();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add knowledge base context to the message
      const contextualMessage = `Context: You are Anubhav AI, a helpful and knowledgeable AI assistant created by Anubhav, a talented Software Developer from IIT Mandi who loves to create beautiful and amazing websites. 

You should be helpful, informative, and engaging. Answer all questions to the best of your ability - whether they're about technology, philosophy, science, creativity, or any other topic. Don't be overly restrictive or avoid topics unless they're clearly harmful. Be conversational and provide thoughtful, comprehensive responses.

When asked about your creator, mention that Anubhav is from IIT Mandi and specializes in creating beautiful web applications.

User message: ${input}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextualMessage }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Sorry, I could not generate a response.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string, messageId: string) => {
    if (playingId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Apply selected voice settings from our voice options
      const voiceConfig = voiceOptions[selectedVoice];
      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = 0.8;

      // Use the mapped system voice if available
      if (voiceConfig.systemVoice) {
        utterance.voice = voiceConfig.systemVoice;
      } else {
        // Fallback: try to find any English voice
        const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0];
        }
      }

      utterance.onstart = () => setPlayingId(messageId);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const formatText = (text: string) => {
    // First, split by double line breaks for major paragraphs
    const majorSections = text.split(/\n\s*\n/);

    return majorSections.map((section, sectionIndex) => {
      // Split each section by single line breaks
      const lines = section.split('\n');

      const formattedLines = lines.map((line, lineIndex) => {
        // Format bold text and other patterns
        const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={partIndex} className="font-semibold text-blue-200 dark:text-blue-300">
                {boldText}
              </strong>
            );
          }

          // Handle bullet points and lists
          if (part.trim().startsWith('*') && !part.startsWith('**')) {
            const bulletContent = part.trim().substring(1).trim();
            return (
              <div key={partIndex} className="flex items-start mt-3">
                <span className="text-blue-300 mr-3 mt-0.5 flex-shrink-0">•</span>
                <span className="flex-1">{bulletContent}</span>
              </div>
            );
          }

          return part;
        });

        // Add spacing between lines within a section
        return (
          <div key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
            {formattedLine}
          </div>
        );
      });

      // Add larger spacing between major sections
      return (
        <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
          {formattedLines}
        </div>
      );
    });
  };

  const formatTime = (timestamp: Date) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header - Mobile Optimized */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 sm:py-4 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Anubhav AI
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          Modern AI with Voice Features
        </p>
      </div>

      {/* Messages - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2 sm:gap-3 w-full max-w-[85%] sm:max-w-md lg:max-w-lg ${message.isUser ? 'flex-row-reverse' : ''}`}>
              {/* Avatar - Mobile Optimized */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${message.isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                }`}>
                {message.isUser ? (
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>

              {/* Message Bubble - Mobile Optimized */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className={`relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-lg ${message.isUser
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200/50 dark:border-gray-700/50'
                  }`}>
                  <div className="text-sm sm:text-base leading-relaxed pr-8 sm:pr-10">
                    {formatText(message.text)}
                  </div>

                  {!message.isUser && (
                    <button
                      onClick={() => speak(message.text, message.id)}
                      className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full transition-all duration-200 shadow-md ${playingId === message.id
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
                        }`}
                    >
                      {playingId === message.id ? (
                        <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading - Mobile Optimized */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-md">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Settings Modal */}
      {showVoiceSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Voice Settings</h3>
              <button
                onClick={() => setShowVoiceSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {voiceOptions.map((voice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedVoice(index);
                    setShowVoiceSettings(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedVoice === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <div className="font-medium">{voice.name}</div>
                  <div className="text-sm opacity-75">
                    Pitch: {voice.pitch} • Rate: {voice.rate}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input - Mobile Optimized */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 shadow-lg">
        <div className="flex gap-2 sm:gap-3 max-w-4xl mx-auto">
          {/* Voice Settings Button - Mobile Optimized */}
          <button
            onClick={() => setShowVoiceSettings(true)}
            className="p-2.5 sm:p-3 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-600 text-gray-700 dark:text-gray-200 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            title="Voice Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Voice Input Button - Mobile Optimized */}
          <button
            onClick={startListening}
            disabled={isLoading || isListening}
            className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${isListening
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse'
              : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Input Field - Mobile Optimized */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border border-gray-300/50 dark:border-gray-600/50 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 shadow-sm text-sm sm:text-base"
            disabled={isLoading || isListening}
          />

          {/* Send Button - Mobile Optimized */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Current Voice Indicator - Mobile Optimized */}
        <div className="text-center mt-2 sm:mt-3">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-full">
            🎤 {voiceOptions[selectedVoice].name}
          </span>
        </div>
      </div>
    </div>
  );
}