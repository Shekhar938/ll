'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './ChatWidget.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_SUGGESTIONS = [
  'What changed in BNS 2023?',
  'How to claim RERA refund for delayed possession?',
  'What are my rights under DPDP Act 2023?',
  'How do I request a consultation?'
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Advocate Aastha\'s AI Legal Assistant. How can I guide you regarding Indian law or booking a consultation today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'No response received.' }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again or submit your query via the Client Portal.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button className={styles.floatingBtn} onClick={() => setIsOpen(true)} aria-label="Open Legal AI Assistant">
          <span className={styles.badge}></span>
          <span>⚖️ AI Legal Guide</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span style={{ fontSize: '1.2rem' }}>⚖️</span>
              <div>
                <div className={styles.headerTitle}>Legal Assistant</div>
                <div className={styles.headerSub}>
                  <span className={styles.badge}></span> Online • Indian Law AI
                </div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close Chat">
              ✕
            </button>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgAi}`}>
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.msgRow} ${styles.msgAi}`}>
                <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                  <span className={styles.typingDot}></span>{' '}
                  <span className={styles.typingDot} style={{ animationDelay: '0.2s' }}></span>{' '}
                  <span className={styles.typingDot} style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className={styles.suggestions}>
                {INITIAL_SUGGESTIONS.map((sug, i) => (
                  <button key={i} className={styles.chip} onClick={() => handleSend(sug)}>
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask about your legal query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button className={styles.sendBtn} onClick={() => handleSend()} disabled={loading || !input.trim()}>
              ➔
            </button>
          </div>

          <div className={styles.footerBar}>
            Informational guide. Need formal representation?
            <Link href="/consult" className={styles.footerLink} onClick={() => setIsOpen(false)}>
              Client Portal
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
