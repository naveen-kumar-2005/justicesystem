
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatResponseStream } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { UserIcon } from './icons/UserIcon';
import { ScaleIcon } from './icons/ScaleIcon';

const LegalAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const stream = await getChatResponseStream(history, input);
      
      let modelResponse = '';
      const modelMessageId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '...' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: modelResponse + '...' } : msg
        ));
      }

      setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
      ));

    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[75vh] max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-lg shadow-2xl animate-fade-in">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-amber-400">AI Legal Assistant</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
             {msg.role === 'model' && <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-amber-400"><ScaleIcon className="w-5 h-5"/></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-amber-600/80 text-white' : 'bg-slate-700 text-slate-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-slate-300"><UserIcon /></div>}
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.role === 'user' && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center text-amber-400"><ScaleIcon className="w-5 h-5"/></div>
                <div className="max-w-md p-3 rounded-lg bg-slate-700 text-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question, e.g., 'Summarize IPC Section 420'"
            className="flex-1 w-full bg-slate-700 text-slate-200 border border-slate-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-amber-500 text-slate-900 rounded-full p-2.5 hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LegalAssistantChat;
