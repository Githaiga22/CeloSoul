import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_own: boolean;
}

// Mock data for MVP
const mockMessages: Record<string, Message[]> = {
  'match-1': [
    {
      id: 'msg-1',
      content: 'Hey! I saw your profile and loved your DeFi projects 🚀',
      sender_id: 'user-1',
      created_at: '2024-01-15T10:00:00Z',
      is_own: true
    },
    {
      id: 'msg-2',
      content: 'Thanks! I checked out your GitHub too - impressive work on that DEX!',
      sender_id: 'match-1',
      created_at: '2024-01-15T10:15:00Z',
      is_own: false
    },
    {
      id: 'msg-3',
      content: 'Hey! Thanks for the tip 😊',
      sender_id: 'match-1',
      created_at: '2024-01-15T10:30:00Z',
      is_own: false
    }
  ],
  'match-2': []
};

export function useChat(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchMessages = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(mockMessages[matchId] || []);
      setIsLoading(false);
    };

    if (matchId) {
      fetchMessages();
    }
  }, [matchId]);

  const sendMessage = async (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender_id: 'user-1',
      created_at: new Date().toISOString(),
      is_own: true
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Mock response after delay
    setTimeout(() => {
      const response: Message = {
        id: `msg-${Date.now() + 1}`,
        content: 'Thanks for your message! 😊',
        sender_id: matchId,
        created_at: new Date().toISOString(),
        is_own: false
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}