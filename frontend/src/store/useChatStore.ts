import { create } from 'zustand';
import api, { getApiErrorMessage } from '@/lib/api';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  clearMessages: () => void;
}

const mapChatMessage = (raw: unknown): ChatMessage => {
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const id = record.id ?? record._id;
  const role = record.role === 'user' ? 'user' : 'assistant';
  const timestamp = record.createdAt ?? record.timestamp;

  return {
    id: typeof id === 'string' ? id : `msg-${Date.now()}`,
    role,
    content: typeof record.content === 'string' ? record.content : '',
    timestamp: typeof timestamp === 'string' ? timestamp : new Date().toISOString(),
  };
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Salom! Men TrimAgent — sizning AI yordamchingizman. Bron qilish, uslub tavsiyasi yoki jadval haqida savol bering!",
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  isOpen: false,

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await api.post('/chat', { message: content });
      const aiMessage = mapChatMessage(response.data.data.message);

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        role: 'assistant',
        content: getApiErrorMessage(error, 'AI xizmatida xatolik yuz berdi. Keyinroq urinib ko\'ring.'),
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
      }));
    }
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  clearMessages: () =>
    set({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: "Salom! Men TrimAgent — sizning AI yordamchingizman. Bron qilish, uslub tavsiyasi yoki jadval haqida savol bering!",
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
