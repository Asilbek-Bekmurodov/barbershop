'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addMessage, setOpen, setLoading } from '../../store/chatSlice';
import { ChatMessage } from '../../types';
import api from '../../lib/api';
import styles from './TrimAgentChat.module.css';

let messageIdCounter = 0;
function generateId() {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

const TrimAgentChat: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, isOpen, isLoading } = useSelector((state: RootState) => state.chat);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    setInputValue('');
    dispatch(setLoading(true));

    try {
      const response = await api.post('/chat', { message: text });
      const data = response.data.data;

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        bookings: data.proposedBookings,
        recommendations: data.recommendations,
      };

      dispatch(addMessage(assistantMessage));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Kechirasiz, xatolik yuz berdi. Iltimos, qayta urinib koring.',
        timestamp: new Date(),
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div
        className={[styles.overlay, isOpen ? styles.overlayVisible : ''].join(' ')}
        onClick={() => dispatch(setOpen(false))}
      />
      <div className={[styles.sidebar, isOpen ? styles.sidebarOpen : ''].join(' ')}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>
            <div className={styles.aiIcon}>AI</div>
            <div>
              <div className={styles.titleText}>TrimAgent</div>
              <div className={styles.titleSub}>AI Yordamchi</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => dispatch(setOpen(false))}>
            x
          </button>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>*</div>
              <div className={styles.emptyText}>
                Salom! Men TrimAgent, sizning AI sartaroshxona yordamchingizman.
                Bron qilish, tavsiyalar va ko&apos;proq narsalar uchun so&apos;rang.
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={[
                  styles.message,
                  msg.role === 'user' ? styles.messageUser : styles.messageAssistant,
                ].join(' ')}
              >
                <div className={styles.messageBubble}>{msg.content}</div>

                {msg.bookings && msg.bookings.length > 0 && (
                  <div className={styles.bookingCard}>
                    <div className={styles.bookingCardTitle}>Bron ma&apos;lumotlari</div>
                    {msg.bookings.map((b, i) => (
                      <div key={i} className={styles.bookingCardItem}>
                        {b.service_name} — {new Date(b.time).toLocaleString('uz-UZ')}
                      </div>
                    ))}
                  </div>
                )}

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className={styles.recommendationCard}>
                    <div className={styles.recommendationTitle}>Tavsiyalar</div>
                    {msg.recommendations.map((r, i) => (
                      <div key={i} className={styles.recommendationItem}>
                        <div className={styles.recommendationStyle}>{r.style}</div>
                        <div className={styles.recommendationReason}>{r.reason}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
              </div>
            ))
          )}

          {isLoading && (
            <div className={styles.loadingDots}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.chatInput}
            placeholder="Xabar yozing..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default TrimAgentChat;
