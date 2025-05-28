import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService, Conversation, Message } from '../services/chat';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  startConversation: (productId: string, sellerId: string) => Promise<string | null>;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      markAsRead(activeConversation.id);
    }
  }, [activeConversation?.id]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const startConversation = async (productId: string, sellerId: string) => {
    try {
      const conversationId = await chatService.startConversation(productId, sellerId);
      if (conversationId) {
        await loadConversations();
        return conversationId;
      }
      return null;
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Ошибка при создании диалога');
      return null;
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeConversation) return;

    try {
      const message = await chatService.sendMessage(activeConversation.id, content);
      if (message) {
        setMessages(prev => [...prev, message]);
        await loadConversations(); // Refresh conversations to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка при отправке сообщения');
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await chatService.markAsRead(conversationId);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isLoading,
        startConversation,
        setActiveConversation,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};