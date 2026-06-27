import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Import CSS classes
import '../App.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI nutritionist 🥗 Ask me anything about food, macros, or nutrition!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState(null);

  const { user } = useAuth();
  
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch user context for nutritionist chatbot on mount
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await api.get('/dashboard');
        setUserContext({
          goal: user?.goal || 'maintain',
          dailyCalorieTarget: user?.dailyCalorieTarget || 2000,
          todayCalories: response.data.today?.totalCalories || 0
        });
      } catch (err) {
        console.error('Failed to fetch dashboard context for chat:', err);
        // Fallback context if API fails
        setUserContext({
          goal: user?.goal || 'maintain',
          dailyCalorieTarget: user?.dailyCalorieTarget || 2000,
          todayCalories: 0
        });
      }
    };
    fetchContext();
  }, [user]);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMessageText }];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Convert messages list to Gemini API format (model vs user, parts)
      const geminiMessages = updatedMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await api.post('/ai/chat', {
        messages: geminiMessages,
        userContext
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.reply }
      ]);
    } catch (err) {
      console.error('Nutritionist Chat Error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, I encountered an error. Please try asking again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents default newline behavior in textarea
      handleSend();
    }
  };

  const handleChipClick = (chipText) => {
    setInput(chipText);
    inputRef.current?.focus();
  };

  const chips = [
    "What should I eat post-workout?",
    "Is my protein intake enough?",
    "Suggest a high-protein snack under 200 kcal",
    "How much water should I drink today?",
    "What foods are high in protein?"
  ];

  return (
    <div 
      style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 220px)', // Fits perfectly in the layout viewports
        gap: '1rem',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🥗</span> AI Nutritionist
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Ask customized questions about your diet plan, food items, and nutrition.
        </p>
      </div>

      {/* Message Area */}
      <div 
        className="card"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius, 12px)'
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <div 
                className={isUser ? 'message-bubble-user' : 'message-bubble-assistant'}
                style={{
                  maxWidth: '75%',
                  padding: '0.75rem 1.1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div 
              className="message-bubble-assistant"
              style={{
                maxWidth: '75%',
                padding: '0.75rem 1.1rem',
                fontSize: '0.95rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>Gemini is thinking</span>
              <span className="pulse-text" style={{ fontWeight: '800' }}>●●●</span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div 
        className="chips-container"
        style={{ 
          display: 'flex', 
          gap: '0.6rem', 
          overflowX: 'auto', 
          paddingBottom: '0.5rem',
          userSelect: 'none'
        }}
      >
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            className="btn-secondary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.8rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              fontWeight: '500',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '0.5rem 0.75rem'
        }}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about food or nutrition..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.4',
            padding: '0.4rem 0.2rem'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{
            padding: '0.5rem 1.2rem',
            fontSize: '0.9rem',
            fontWeight: '700',
            borderRadius: '8px',
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem'
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}
