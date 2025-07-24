'use client';

import { useState } from 'react';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { Message } from '@/types/chat';

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: "Hello! I'm Anubhav AI, powered by Google's Gemini. How can I help you today?",
            role: 'assistant',
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error. Please try again.',
                role: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
            <ChatHeader />
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <ChatMessages messages={messages} isLoading={isLoading} />
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
}