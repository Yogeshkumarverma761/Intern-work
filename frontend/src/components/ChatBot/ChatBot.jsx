import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import './ChatBot.css';
import { getChatbotResponse } from '../../api/chatbotApi.js';
import { UserDataContext } from '../../context/UserContext.jsx';

const QUICK_ACTIONS = [
  'What is SmartStitch?',
  'Show me clothing',
  'AI Try-On help',
  'Shipping info',
];

export default function ChatBot() {
  const { user } = useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi${user?.fullname ? `, ${user.fullname.firstname}` : ''}! 👋 Welcome to SmartStitch! I'm your AI fashion assistant. Ask me anything about our products, features, or let me help you find the perfect outfit!`,
      sender: 'bot',
      timestamp: new Date(),
      showQuickActions: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(text);

      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        products: response.products || [],
        relatedProducts: response.relatedProducts || [],
        suggestions: response.suggestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => sendMessage(inputValue);
  const handleQuickAction = (action) => sendMessage(action);

  return (
    <div className="cb-container">
      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cb-fab"
          aria-label="Open chat assistant"
        >
          <Sparkles size={22} />
          <span className="cb-fab-pulse" />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="cb-window" role="dialog" aria-label="SmartStitch Chat Assistant">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-info">
              <div className="cb-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="cb-title">SmartStitch AI</h3>
                <p className="cb-subtitle">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="cb-close" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`cb-msg cb-msg--${msg.sender}`}>
                <div className={`cb-bubble cb-bubble--${msg.sender}`}>
                  <p className="cb-text">{msg.text}</p>

                  {/* Quick Actions on welcome */}
                  {msg.showQuickActions && (
                    <div className="cb-quick-actions">
                      {QUICK_ACTIONS.map((action, i) => (
                        <button key={i} onClick={() => handleQuickAction(action)} className="cb-chip">
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="cb-products">
                      {msg.products.map((product) => (
                        <a key={product._id} href={`/product/${product._id}`} className="cb-product-card">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="cb-product-img" />
                          )}
                          <div className="cb-product-info">
                            <span className="cb-product-name">{product.name}</span>
                            <span className="cb-product-cat">{product.category}</span>
                            <span className="cb-product-price">₹{product.price?.toLocaleString()}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Related Products */}
                  {msg.relatedProducts && msg.relatedProducts.length > 0 && (
                    <div className="cb-related">
                      <p className="cb-related-title">You may also like</p>
                      <div className="cb-related-scroll">
                        {msg.relatedProducts.map((rp) => (
                          <a key={rp._id} href={`/product/${rp._id}`} className="cb-related-card">
                            {rp.image && (
                              <img src={rp.image} alt={rp.name} className="cb-related-img" />
                            )}
                            <span className="cb-related-name">{rp.name}</span>
                            <span className="cb-related-price">₹{rp.price?.toLocaleString()}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="cb-suggestions">
                      {msg.suggestions.map((s, idx) => (
                        <button key={idx} onClick={() => handleQuickAction(s)} className="cb-chip cb-chip--suggestion">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="cb-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="cb-msg cb-msg--bot">
                <div className="cb-bubble cb-bubble--bot">
                  <div className="cb-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="cb-input-area">
            <div className="cb-input-row">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="cb-input"
                disabled={isLoading}
                aria-label="Type your message"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="cb-send"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="cb-footer-text">Powered by SmartStitch AI ✨</p>
          </div>
        </div>
      )}
    </div>
  );
}
