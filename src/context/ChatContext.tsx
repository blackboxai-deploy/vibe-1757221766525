'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatRoom, Message, ChatState } from '@/types/chat';
import { mockChatRooms, mockMessages } from '@/data/mockData';
import { generateMessageId } from '@/lib/chatUtils';
import { useAuth } from './AuthContext';
import { useChat } from '@/hooks/useChat';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ChatContextType {
  chatRooms: ChatRoom[];
  messages: { [chatRoomId: string]: Message[] };
  activeChat: string | null;
  typingIndicators: any[];
  onlineUsers: string[];
  searchQuery: string;
  sendMessage: (content: string, type?: 'text' | 'emoji') => void;
  markAsRead: (chatRoomId: string) => void;
  setActiveChat: (chatRoomId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { generateAutoResponse, simulateTyping, getTypingUsers } = useChat();
  
  // Local storage for persistence
  const [storedMessages, setStoredMessages] = useLocalStorage<{ [chatRoomId: string]: Message[] }>('chatApp_messages', mockMessages);
  const [storedChatRooms, setStoredChatRooms] = useLocalStorage<ChatRoom[]>('chatApp_chatRooms', mockChatRooms);
  
  // State
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(storedChatRooms);
  const [messages, setMessages] = useState<{ [chatRoomId: string]: Message[] }>(storedMessages);
  const [activeChat, setActiveChatState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync with localStorage
  useEffect(() => {
    setStoredMessages(messages);
  }, [messages, setStoredMessages]);

  useEffect(() => {
    setStoredChatRooms(chatRooms);
  }, [chatRooms, setStoredChatRooms]);

  const setActiveChat = useCallback((chatRoomId: string | null) => {
    setActiveChatState(chatRoomId);
    
    // Mark messages as read when opening a chat
    if (chatRoomId) {
      markAsRead(chatRoomId);
    }
  }, []);

  const sendMessage = useCallback((content: string, type: 'text' | 'emoji' = 'text') => {
    if (!currentUser || !activeChat || !content.trim()) return;

    const newMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      senderId: currentUser.id,
      chatRoomId: activeChat.startsWith('direct-') ? undefined : activeChat,
      receiverId: activeChat.startsWith('direct-') ? activeChat.replace('direct-', '') : undefined,
      timestamp: new Date(),
      type,
      status: 'sent',
      reactions: []
    };

    // Add message to state
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));

    // Update chat room last message and timestamp
    setChatRooms(prev => prev.map(room => {
      if (room.id === activeChat) {
        return {
          ...room,
          lastMessage: newMessage,
          unreadCount: 0 // Reset unread count for sender
        };
      }
      return room;
    }));

    // Simulate auto response for demonstration
    setTimeout(() => {
      const response = generateAutoResponse(content, currentUser.id);
      if (response && Math.random() < 0.4) { // 40% chance of response
        const responseMessage: Message = {
          id: generateMessageId(),
          content: response,
          senderId: activeChat.startsWith('direct-') ? activeChat.replace('direct-', '') : 'user2',
          chatRoomId: activeChat.startsWith('direct-') ? undefined : activeChat,
          receiverId: activeChat.startsWith('direct-') ? currentUser.id : undefined,
          timestamp: new Date(),
          type: 'text',
          status: 'delivered',
          reactions: []
        };

        setMessages(prev => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), responseMessage]
        }));

        // Update chat room
        setChatRooms(prev => prev.map(room => {
          if (room.id === activeChat) {
            return {
              ...room,
              lastMessage: responseMessage,
              unreadCount: room.unreadCount + 1
            };
          }
          return room;
        }));
      }
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds

    // Simulate typing indicators
    setTimeout(() => {
      if (activeChat) {
        simulateTyping(activeChat, currentUser.id);
      }
    }, 500);

  }, [currentUser, activeChat, generateAutoResponse, simulateTyping]);

  const markAsRead = useCallback((chatRoomId: string) => {
    setChatRooms(prev => prev.map(room => 
      room.id === chatRoomId ? { ...room, unreadCount: 0 } : room
    ));

    // Update message status to read
    setMessages(prev => ({
      ...prev,
      [chatRoomId]: (prev[chatRoomId] || []).map(msg => 
        msg.senderId !== currentUser?.id ? { ...msg, status: 'read' } : msg
      )
    }));
  }, [currentUser?.id]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUser) return;

    setMessages(prev => {
      const newMessages = { ...prev };
      
      Object.keys(newMessages).forEach(chatId => {
        newMessages[chatId] = newMessages[chatId].map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions?.find(r => r.emoji === emoji && r.userId === currentUser.id);
            
            if (existingReaction) {
              // Remove reaction if already exists
              return {
                ...msg,
                reactions: msg.reactions?.filter(r => !(r.emoji === emoji && r.userId === currentUser.id)) || []
              };
            } else {
              // Add new reaction
              return {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  {
                    emoji,
                    userId: currentUser.id,
                    timestamp: new Date()
                  }
                ]
              };
            }
          }
          return msg;
        });
      });
      
      return newMessages;
    });
  }, [currentUser]);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (!currentUser) return;

    setMessages(prev => {
      const newMessages = { ...prev };
      
      Object.keys(newMessages).forEach(chatId => {
        newMessages[chatId] = newMessages[chatId].map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => !(r.emoji === emoji && r.userId === currentUser.id)) || []
            };
          }
          return msg;
        });
      });
      
      return newMessages;
    });
  }, [currentUser]);

  const typingIndicators = getTypingUsers(
    activeChat?.startsWith('direct-') ? undefined : activeChat || undefined,
    activeChat?.startsWith('direct-') ? currentUser?.id : undefined,
    currentUser?.id
  );

  const onlineUsers = ['user1', 'user3', 'user5']; // Mock online users

  const value: ChatContextType = {
    chatRooms,
    messages,
    activeChat,
    typingIndicators,
    onlineUsers,
    searchQuery,
    sendMessage,
    markAsRead,
    setActiveChat,
    setSearchQuery,
    addReaction,
    removeReaction
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}