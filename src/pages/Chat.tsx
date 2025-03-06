import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
// Removed unused import

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your RenoLoop assistant. How can I help you today with your renovation or housing needs?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call OpenRouter API
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "RenoLoop Assistant",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-pro-exp-02-05:free",
            messages: [
              {
                role: "system",
                content: `You are an AI assistant for RenoLoop, a platform that connects property owners with renovation funding and future tenants in Marseille, France. 
              The platform aims to transform deteriorating buildings into homes.
              
              Property owners can register their properties, apply for renovation funding, and connect with pre-screened tenants.
              Tenants can browse available properties, apply for housing, and track their applications.
              
              Be helpful, concise, and informative. Focus on providing accurate information about renovation processes, housing applications, and the RenoLoop platform.`,
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: input,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="text-slate-400">Get help with your renovation and housing questions</p>
        </div>
      </div>
      
      <Card className="h-[calc(100vh-12rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-orange-500/20 text-white ml-12'
                    : 'bg-white/5 text-white mr-12'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`p-1 rounded-full ${message.role === 'user' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                    {message.role === 'user' ? (
                      <User size={16} className="text-orange-500" />
                    ) : (
                      <Bot size={16} className="text-blue-500" />
                    )}
                  </div>
                  <span className="text-sm ml-2 font-medium">
                    {message.role === 'user' ? 'You' : 'RenoLoop Assistant'}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-white/10 pt-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-white/5 backdrop-blur-lg text-white px-4 py-3 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 pr-12 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <Button
              variant="primary"
              className="absolute right-2 bottom-2 p-2 h-auto w-auto rounded-full"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Powered by OpenRouter AI. Your conversations help us improve our service.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
