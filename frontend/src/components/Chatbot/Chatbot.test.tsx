// Simple test to verify the chatbot component structure
import React from 'react';
import { render, screen } from '@testing-library/react';
import Chatbot from './src/components/Chatbot/Chatbot';

describe('Chatbot Component', () => {
  test('renders chatbot header', () => {
    render(<Chatbot />);
    const headerElement = screen.getByText(/Physical AI Assistant/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('has input field for user messages', () => {
    render(<Chatbot />);
    const inputElement = screen.getByPlaceholderText(/Ask about Physical AI, Robotics, or the book content.../i);
    expect(inputElement).toBeInTheDocument();
  });

  test('has send button', () => {
    render(<Chatbot />);
    const sendButton = screen.getByText(/Send/i);
    expect(sendButton).toBeInTheDocument();
  });
});