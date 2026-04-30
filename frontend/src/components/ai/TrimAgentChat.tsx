'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from '@/types';

// ─── Extended message type with optional action ───────────────────────────────
interface ChatMessageWithAction extends ChatMessage {
  action?: { type: string; text: string } | null;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#753991] animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const quickActions = [
  { label: "Bo'sh vaqt top", prompt: "Bugun qaysi ustalarda bo'sh joy bor?" },
  { label: 'Stil tavsiya', prompt: "Menga saç uslubi tavsiya bering" },
  { label: 'Bugungi jadval', prompt: "Mening bugungi jadvalim qanday?" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function TrimAgentChat() {
  const { messages, isLoading, isOpen, sendMessage, toggleChat, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px] transition-opacity"
          onClick={toggleChat}
        />
      )}

      {/* Tab (visible when closed) */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 bg-[#753991] hover:bg-[#8a4aaa] text-white px-2 py-4 rounded-l-xl shadow-lg transition-all duration-200 group"
          aria-label="TrimAgent chat ochish"
        >
          <span className="text-lg">🤖</span>
          <span
            className="text-[10px] font-bold mono tracking-wider"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            TrimAgent
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ecad0a] animate-pulse" />
        </button>
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed right-0 top-0 h-full w-[380px] max-w-[100vw] z-50
          bg-[#0d1117] border-l border-[#21262d]
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d] bg-[#161b22] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#753991] to-[#a371c5] flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#e6edf3] mono">TrimAgent ⚡</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ecad0a] animate-pulse" />
                <span className="text-[10px] text-[#ecad0a] mono">LIVE</span>
              </div>
              <p className="text-[10px] text-[#484f58]">AI yordamchingiz</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearMessages}
              className="p-1.5 text-[#484f58] hover:text-[#8b949e] hover:bg-[#21262d] rounded-md transition-colors"
              title="Tozalash"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={toggleChat}
              className="p-1.5 text-[#484f58] hover:text-[#e6edf3] hover:bg-[#21262d] rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1.5 px-3 py-2.5 border-b border-[#21262d] shrink-0 overflow-x-auto">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 text-[10px] mono rounded-md border border-[#753991]/40 text-[#a371c5] bg-[#753991]/5 hover:bg-[#753991]/15 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {(messages as ChatMessageWithAction[]).map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#753991] to-[#a371c5] flex items-center justify-center text-[10px] shrink-0 mr-2 mt-1">
                  🤖
                </div>
              )}

              <div className={`max-w-[75%] flex flex-col gap-1.5`}>
                {/* Bubble */}
                <div
                  className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#753991] text-white rounded-br-sm'
                      : 'bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Action Badge */}
                {msg.role === 'assistant' && msg.action && (
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] mono border ${
                      msg.action.type === 'booking'
                        ? 'bg-[#3fb950]/10 border-[#3fb950]/30 text-[#3fb950]'
                        : 'bg-[#ecad0a]/10 border-[#ecad0a]/30 text-[#ecad0a]'
                    }`}
                  >
                    {msg.action.text}
                  </div>
                )}

                {/* Timestamp */}
                <span className={`text-[10px] text-[#484f58] mono ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {mounted ? new Date(msg.timestamp).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-[#209dd7] flex items-center justify-center text-[10px] font-bold text-white shrink-0 ml-2 mt-1">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#753991] to-[#a371c5] flex items-center justify-center text-[10px] shrink-0 mr-2 mt-1">
                🤖
              </div>
              <div className="bg-[#161b22] border border-[#21262d] rounded-xl rounded-bl-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-[#21262d] bg-[#161b22] shrink-0">
          <div className="flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Xabar yozing..."
              disabled={isLoading}
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#753991] disabled:opacity-50 transition-colors resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#753991] hover:bg-[#8a4aaa] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-[#30363d] mono mt-1.5 text-center">
            TrimAgent · AI yordamchi
          </p>
        </div>
      </div>
    </>
  );
}
