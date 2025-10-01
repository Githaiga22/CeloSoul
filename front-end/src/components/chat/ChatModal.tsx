import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchName: string;
}

export function ChatModal({ isOpen, onClose, matchId, matchName }: ChatModalProps) {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat(matchId);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-[600px] max-h-[70vh]">
        <div className="flex items-center gap-3 pb-4 border-b border-secondary-100">
          <div className="w-12 h-12 rounded-full bg-secondary-200 flex items-center justify-center text-xl">
            👤
          </div>
          <h3 className="text-lg font-semibold text-secondary-900">{matchName}</h3>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center px-4">
              <div className="space-y-2">
                <p className="text-secondary-600">Start the conversation!</p>
                <p className="text-sm text-secondary-500">Send a message to break the ice.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary-500 text-primary-950'
                        : 'bg-secondary-100 text-secondary-900'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-primary-900/70' : 'text-secondary-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-secondary-100">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              fullWidth
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              isLoading={isSending}
              className="px-4"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
