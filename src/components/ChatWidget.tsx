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

function FormattedText({ content }: { content: string }) {
  const paragraphs = content.split('\n\n');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n');
        return (
          <div key={pIdx}>
            {lines.map((line, lIdx) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
              const cleanLine = isBullet ? line.trim().replace(/^[\*\-]\s*/, '• ') : line;
              
              return (
                <div key={lIdx} style={{ marginTop: lIdx > 0 ? '4px' : '0' }}>
                  {parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIdx} style={{ color: '#FFFFFF', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
                    }
                    return isBullet ? cleanLine : part;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
      const timer = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, loading, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const payloadMessages = [...messages, userMsg];
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages })
      });
      
      const data = await res.json();
      const replyText = data.reply || 'No response received. Please try again.';

      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection issue. Please check your internet or submit your query via the Client Portal.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className={styles.floatingBtn}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open Legal AI Assistant"
        >
          <span className={styles.badge}></span>
          <span>⚖️ AI Legal Guide</span>
        </button>
      )}

      {isOpen && isMinimized && (
        <div className={styles.minimizedBar} onClick={() => setIsMinimized(false)} title="Click to expand chat">
          <div className={styles.headerInfo}>
            <span className={styles.badge}></span>
            <span className={styles.minimizedTitle}>⚖️ Legal Assistant</span>
            {messages.length > 0 && <span className={styles.countBadge}>{messages.length}</span>}
          </div>
          <div className={styles.headerControls}>
            <button
              className={styles.headerControlBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              aria-label="Expand Chat"
              title="Expand"
            >
              🗖
            </button>
            <button
              className={styles.headerControlBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
              aria-label="Close Chat"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isOpen && !isMinimized && (
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
            <div className={styles.headerControls}>
              <button
                className={styles.headerControlBtn}
                onClick={() => setIsMinimized(true)}
                aria-label="Minimize Chat"
                title="Minimize"
              >
                –
              </button>
              <button
                className={styles.headerControlBtn}
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                aria-label="Close Chat"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {/* Welcome message */}
            <div className={`${styles.msgRow} ${styles.msgAi}`}>
              <div className={`${styles.bubble} ${styles.bubbleAi}`}>
                Hello! I am Advocate Aastha&apos;s AI Legal Assistant. How can I guide you regarding Indian law or booking a consultation today?
              </div>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgAi}`}>
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.role === 'assistant' ? <FormattedText content={msg.content} /> : msg.content}
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

            {messages.length === 0 && !loading && (
              <div className={styles.suggestions}>
                {INITIAL_SUGGESTIONS.map((sug, i) => (
                  <button key={i} className={styles.chip} onClick={() => handleSend(sug)}>
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className={styles.input}
              placeholder="Ask about your legal query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
              ➔
            </button>
          </form>

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
