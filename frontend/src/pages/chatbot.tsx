import React from 'react';
import Layout from '@theme/Layout';
import Chatbot from '../components/Chatbot/Chatbot';

export default function ChatbotPage(): JSX.Element {
  return (
    <Layout title="AI Assistant" description="Physical AI & Humanoid Robotics Chatbot">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Physical AI & Humanoid Robotics Assistant</h1>
            <p>Ask me anything about the book content, Physical AI, or Humanoid Robotics!</p>
            <div style={{ marginTop: '20px' }}>
              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}