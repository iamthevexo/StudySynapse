import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getStudyAdvice } from '../services/gemini';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export const AIChatTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getStudyAdvice(input, messages);
    const aiMsg: ChatMessage = { role: 'model', content: response };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-4 lg:p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue/30">
            <Bot className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="font-bold text-sm lg:text-base text-cyber-blue neon-text">StudySynapse AI</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Always Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/20">
          <Sparkles className="w-3 h-3 text-cyber-blue" />
          <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-tighter">Pro Tutor</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Bot className="w-8 h-8 text-cyber-blue opacity-50" />
            </div>
            <h4 className="text-lg font-bold mb-2">Ready to learn?</h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Ask me to explain a concept, summarize a topic, or help you solve a problem. I'm here to support your academic journey.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 lg:gap-4 max-w-[90%] lg:max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' 
                  ? "bg-cyber-purple border-cyber-purple/50 shadow-[0_0_10px_rgba(188,19,254,0.3)]" 
                  : "bg-cyber-blue border-cyber-blue/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-black" />}
              </div>
              <div className={cn(
                "p-3 lg:p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
                msg.role === 'user' 
                  ? "bg-cyber-purple/10 border border-cyber-purple/20 rounded-tr-none text-white/90" 
                  : "bg-white/5 border border-white/10 rounded-tl-none text-white/90"
              )}>
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-cyber-blue" />
            </div>
            <div className="bg-white/5 border border-white/10 p-3 lg:p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue/50 transition-all placeholder:text-white/20"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyber-blue hover:bg-cyber-blue/80 text-black px-4 lg:px-6 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-white/20 mt-3 uppercase tracking-widest">Powered by StudySynapse Memory Engine</p>
      </div>
    </div>
  );
};
