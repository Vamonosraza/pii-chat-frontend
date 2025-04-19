'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatPage() {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const messagesEndRef = useRef(null);

const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

useEffect(() => {
    scrollToBottom();
}, [messages]);

const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
    // Get chat history for context
    const history = messages.map(m => m.text);

    // Call backend API
    const response = await axios.post('/api/chat', { 
        message: userMessage,
        history
    });
    
    // Add AI response to chat
    setMessages((prev) => [...prev, { 
        text: response.data.response, 
        isUser: false 
    }]);
    } catch (error) {
    console.error('Error sending message:', error);
    setMessages((prev) => [...prev, { 
        text: 'Sorry, there was an error processing your request.', 
        isUser: false 
    }]);
    } finally {
    setIsLoading(false);
    }
};

return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
    <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">PII-Safe Chat</h1>
    </header>

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
        <div className="text-center text-gray-500 my-8">
            Start a conversation by sending a message.
        </div>
        ) : (
        messages.map((message, index) => (
            <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
            <div 
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
            >
                {message.text}
            </div>
            </div>
        ))
        )}
        {isLoading && (
        <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
            <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
            </div>
            </div>
        </div>
        )}
        <div ref={messagesEndRef} />
    </div>

    <form onSubmit={sendMessage} className="p-4 border-t flex">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
        />
        <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
        Send
        </button>
    </form>
    </div>
);
}