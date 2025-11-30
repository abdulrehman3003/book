import React, { useState, useEffect, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: 'Hello! I\'m your Physical AI & Humanoid Robotics assistant. Ask me anything about the book content.', role: 'assistant', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the backend API to get response
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Format the response from the backend
      let botResponse = "I found some relevant information:\n\n";
      data.results.forEach((result: any, index: number) => {
        botResponse += `${index + 1}. ${result.content.substring(0, 200)}...\n\n`;
      });
      
      if (data.results.length === 0) {
        botResponse = "I couldn't find relevant information in the book content. Please try rephrasing your question.";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${colorMode === 'dark' ? 'dark-theme' : 'light-theme'}`} 
         style={{
           border: '1px solid #ddd',
           borderRadius: '8px',
           height: '500px',
           display: 'flex',
           flexDirection: 'column',
           backgroundColor: colorMode === 'dark' ? '#1a1a1a' : '#ffffff'
         }}>
      <div className="chatbot-header" 
           style={{
             padding: '12px',
             backgroundColor: colorMode === 'dark' ? '#2d3748' : '#f7fafc',
             color: colorMode === 'dark' ? '#fff' : '#000',
             borderBottom: '1px solid #ddd',
             borderTopLeftRadius: '8px',
             borderTopRightRadius: '8px'
           }}>
        <h3>Physical AI Assistant</h3>
      </div>
      
      <div className="chatbot-messages" 
           style={{
             flex: 1,
             overflowY: 'auto',
             padding: '16px',
             display: 'flex',
             flexDirection: 'column',
             gap: '12px'
           }}>
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.role}`}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' 
                ? (colorMode === 'dark' ? '#4a5568' : '#e2e8f0')
                : (colorMode === 'dark' ? '#2d3748' : '#f7fafc'),
              borderRadius: '8px',
              padding: '10px 14px',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
            <div className="message-content" style={{ fontSize: '14px' }}>
              {message.content}
            </div>
            <div 
              className="timestamp" 
              style={{ 
                fontSize: '10px', 
                opacity: 0.7, 
                marginTop: '4px',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div 
            className="loading-message"
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colorMode === 'dark' ? '#2d3748' : '#f7fafc',
              borderRadius: '8px',
              padding: '10px 14px',
              maxWidth: '80%'
            }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                display: 'inline-block', 
                marginRight: '8px' 
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colorMode === 'dark' ? '#a0aec0' : '#718096',
                  margin: '0 2px',
                  animation: 'typing 1.4s infinite ease-in-out'
                }}></div>
                <div style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colorMode === 'dark' ? '#a0aec0' : '#718096',
                  margin: '0 2px',
                  animation: 'typing 1.4s infinite ease-in-out',
                  animationDelay: '0.2s'
                }}></div>
                <div style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colorMode === 'dark' ? '#a0aec0' : '#718096',
                  margin: '0 2px',
                  animation: 'typing 1.4s infinite ease-in-out',
                  animationDelay: '0.4s'
                }}></div>
              </div>
              <span style={{ color: colorMode === 'dark' ? '#a0aec0' : '#718096', fontSize: '12px' }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chatbot-input-form" style={{ padding: '12px', borderTop: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about Physical AI, Robotics, or the book content..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: colorMode === 'dark' ? '#2d3748' : '#ffffff',
              color: colorMode === 'dark' ? '#fff' : '#000'
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            style={{
              padding: '10px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#3182ce',
              color: 'white',
              cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (!inputValue.trim() || isLoading) ? 0.6 : 1
            }}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;