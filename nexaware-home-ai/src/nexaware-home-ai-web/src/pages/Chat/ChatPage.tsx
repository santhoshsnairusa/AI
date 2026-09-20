import { Bot, MessageSquare, PlusCircle, Send, Menu, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api, { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from '../../services/api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(clsx(classes));
}

interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedOn: string;
  messages?: Message[];
}

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConvList, setShowConvList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await api.get(`/conversations?householdId=${DEMO_HOUSEHOLD_ID}&userId=${DEMO_USER_ID}`);
      setConversations(res.data);
      // Wait for user to either select a conversation or create a new one!
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setShowConvList(false);
    try {
      const res = await api.get(`/conversations/${conv.id}?householdId=${DEMO_HOUSEHOLD_ID}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const createNewConversation = async () => {
    try {
      const res = await api.post(`/conversations`, {
        householdId: DEMO_HOUSEHOLD_ID,
        userId: DEMO_USER_ID,
        title: 'New Conversation'
      });
      const newConv = res.data;
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv);
      setMessages([]);
      setShowConvList(false);
    } catch (err) {
      console.error('Failed to create conversation', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // 1. Send the user message
      await api.post(`/conversations/${activeConversation.id}/messages`, {
        householdId: DEMO_HOUSEHOLD_ID,
        role: 'user',
        content: userMsg
      });

      // 2. Start SSE Stream
      const sseUrl = `${api.defaults.baseURL}/conversations/${activeConversation.id}/stream?householdId=${DEMO_HOUSEHOLD_ID}`;
      const eventSource = new EventSource(sseUrl);

      // Add empty assistant message to append to
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      eventSource.onmessage = (event) => {
        const text = event.data;
        if (text === '[DONE]') {
          eventSource.close();
          setIsLoading(false);
          return;
        }

        // Unescape newlines
        const decoded = text.replace(/\\n/g, '\n');

        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + decoded
          };
          return newMessages;
        });
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error', error);
        eventSource.close();
        setIsLoading(false);
      };

    } catch (err) {
      console.error('Failed to send message', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6 relative z-10 overflow-hidden">

      {/* Mobile Backdrop */}
      {showConvList && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setShowConvList(false)}
        />
      )}

      {/* Sidebar for conversations */}
      <div className={cn(
        "absolute inset-y-0 left-0 z-40 w-72 glass-panel flex flex-col transition-transform duration-300 md:relative md:flex md:translate-x-0",
        showConvList ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-surfaceHighlight flex justify-between items-center gap-2">
          <button
            onClick={createNewConversation}
            className="primary-button flex-1"
          >
            <PlusCircle size={18} />
            New Chat
          </button>
          <button onClick={() => setShowConvList(false)} className="md:hidden p-2 text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3',
                activeConversation?.id === conv.id
                  ? 'bg-primary/20 text-text border border-primary/30'
                  : 'text-text-muted hover:bg-surfaceHighlight hover:text-text'
              )}
            >
              <MessageSquare size={16} className="shrink-0" />
              <span className="truncate text-sm font-medium">{conv.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-panel flex flex-col relative overflow-hidden min-w-0">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="px-4 md:px-6 py-4 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-md flex items-center gap-3">
              <button
                onClick={() => setShowConvList(true)}
                className="md:hidden p-2 text-text-muted hover:text-text hover:bg-surfaceHighlight rounded-lg"
              >
                <Menu size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg text-text truncate">{activeConversation.title}</h2>
                <p className="text-xs text-text-muted">Powered by local AI</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[90%] md:max-w-[80%] rounded-2xl px-5 py-4 shadow-sm",
                    msg.role === 'user'
                      ? "bg-primary text-white shadow-primary/20 rounded-tr-sm"
                      : "bg-surfaceHighlight/50 border border-surfaceHighlight text-text rounded-tl-sm"
                  )}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Bot size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wider">NexAware</span>
                      </div>
                    )}
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-surfaceHighlight text-sm md:text-base">
                      {msg.role === 'assistant' && isLoading && msg.content === '' ? (
                        <div className="flex items-center gap-2 py-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          <span className="ml-2 text-sm text-primary animate-pulse font-medium">Preparing answer...</span>
                        </div>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-surfaceHighlight bg-surface/50 backdrop-blur-md">
              <form onSubmit={sendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-full pl-5 pr-12 md:pl-6 md:pr-14 py-3 md:py-4 text-sm md:text-base text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 md:right-2 p-2 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} className="md:w-5 md:h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted relative">
            <div className="absolute top-4 left-4 md:hidden">
              <button onClick={() => setShowConvList(true)} className="p-2 text-text-muted hover:text-text hover:bg-surfaceHighlight rounded-lg">
                <Menu size={24} />
              </button>
            </div>
            <Bot size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg md:text-xl font-medium text-text mb-2">How can I help you today?</h3>
            <p className="text-sm md:text-base text-center px-4">Select a conversation or start a new one to begin.</p>
            <button
              onClick={createNewConversation}
              className="mt-6 primary-button text-sm md:text-base"
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
