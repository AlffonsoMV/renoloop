import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2, Maximize2 } from 'lucide-react';
import Button from './ui/Button';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FloatingChatbot = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your RenoLoop assistant. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };
  
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
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
      // Prepare context about the user and platform
      const userContext = user ? `
        User Information:
        - Name: ${user.name}
        - Email: ${user.email}
        - Role: ${user.role === 'property-owner' ? 'Property Owner' : user.role === 'tenant' ? 'Tenant' : 'Administrator'}
      ` : 'User is not logged in';
      
      // Call OpenRouter API
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
            "HTTP-Referer": window.location.origin,
            "X-Title": "RenoLoop Assistant",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-pro-exp-02-05:free",
            messages: [
              {
                role: "system",
                content: `You are an AI assistant for RenoLoop, a platform that connects property owners with renovation funding and future tenants in Marseille, France. 
              
              The platform aims to transform deteriorating buildings into homes through a unique process:
              1. Property owners register their properties on the platform
              2. They apply for renovation funding through our partnerships
              3. Pre-screened tenants can browse and apply for these properties
              4. Once renovations are complete, tenants can move in
              
              ${userContext}
              
              Current page: ${window.location.pathname}
              
              Be helpful, concise, and informative. Focus on providing accurate information about:
              - The renovation process and funding options
              - Housing applications and tenant screening
              - Property registration and management
              - The RenoLoop platform features and navigation
              - User account management
              
              If asked about specific user data like their properties or applications, reference the user context provided.
              If the user asks how to perform a specific action on the platform, provide step-by-step instructions.
              
              Your tone should be friendly, professional, and encouraging. Use emojis occasionally to add warmth.`,
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
            max_tokens: 500,
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
  
  const getSuggestions = () => {
    if (user?.role === 'property-owner') {
      return [
        'How do I register a property?',
        'What funding options are available?',
        'How does the tenant screening work?',
      ];
    } else if (user?.role === 'tenant') {
      return [
        'How do I apply for housing?',
        'What documents do I need to apply?',
        'How long does the application process take?',
      ];
    } else if (user?.role === 'administrator') {
      return [
        'How do I approve properties?',
        'How do I manage users?',
        'How do I review applications?',
      ];
    } else {
      return [
        'What is RenoLoop?',
        'How do I create an account?',
        'What services do you offer?',
      ];
    }
  };
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-40 transition-all duration-300 shadow-2xl ${
            isMinimized
              ? 'bottom-20 right-6 w-72 h-14'
              : 'bottom-20 right-6 w-96 h-[500px] max-h-[80vh]'
          }`}
        >
          <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-800">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Bot size={20} className="text-white mr-2" />
                <h3 className="text-white font-medium">RenoLoop Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              </div>
            </div>
            
            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.role === 'user'
                            ? 'bg-orange-500/20 text-white'
                            : 'bg-white/5 text-white'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <div className={`p-1 rounded-full ${message.role === 'user' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                            {message.role === 'user' ? (
                              <User size={12} className="text-orange-500" />
                            ) : (
                              <Bot size={12} className="text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs ml-1 font-medium">
                            {message.role === 'user' ? 'You' : 'Assistant'}
                          </span>
                          <span className="text-xs text-slate-400 ml-auto">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Suggestions */}
                  {messages.length === 1 && (
                    <div className="mt-4">
                      <p className="text-slate-400 text-xs mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            className="bg-white/5 hover:bg-white/10 text-white text-xs py-1 px-2 rounded-full transition-colors"
                            onClick={() => {
                              setInput(suggestion);
                              inputRef.current?.focus();
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-3 border-t border-white/10">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full bg-white/5 text-white text-sm px-3 py-2 rounded-xl border border-white/10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 pr-10 resize-none"
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      variant="primary"
                      className="absolute right-1 bottom-1 p-1.5 h-auto w-auto rounded-full"
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                    >
                      {isLoading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
