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
      text: "Hello! I'm Anubhav AI, powered by Open AI API. How can I help you today?",
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b p-4 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Anubhav AI
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Powered by OpenAI API</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-2 max-w-md ${message.isUser ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col">
                <div className={`relative px-4 py-3 rounded-2xl ${message.isUser
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-md'
                  }`}>
                  <div className="text-sm leading-relaxed pr-6">
                    {formatText(message.text)}
                  </div>

                  {!message.isUser && (
                    <button
                      onClick={() => speak(message.text, message.id)}
                      className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${playingId === message.id
                        ? 'bg-red-500 text-white'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                    >
                      {playingId === message.id ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-md">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

      {/* Input */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          {/* Voice Settings Button */}
          <button
            onClick={() => setShowVoiceSettings(true)}
            className="px-3 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-full transition-colors"
            title="Voice Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <button
            onClick={startListening}
            disabled={isLoading || isListening}
            className={`px-3 py-3 rounded-full transition-colors ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || isListening}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Current Voice Indicator */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Current Voice: {voiceOptions[selectedVoice].name}
          </span>
        </div>
      </div>
    </div>
  );
}