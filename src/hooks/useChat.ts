'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TypingIndicator } from '@/types/chat';
import { mockUsers } from '@/data/mockData';

export function useChat() {
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const typingTimeoutRef = useRef<{ [userId: string]: ReturnType<typeof setTimeout> }>({});

  const addTypingIndicator = useCallback((userId: string, chatRoomId?: string, receiverId?: string) => {
    const indicator: TypingIndicator = {
      userId,
      chatRoomId,
      receiverId,
      timestamp: new Date()
    };

    setTypingUsers(prev => {
      const filtered = prev.filter(t => 
        t.userId !== userId || 
        t.chatRoomId !== chatRoomId || 
        t.receiverId !== receiverId
      );
      return [...filtered, indicator];
    });

    // Clear existing timeout
    if (typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId]);
    }

    // Set new timeout
    typingTimeoutRef.current[userId] = setTimeout(() => {
      setTypingUsers(prev => prev.filter(t => 
        t.userId !== userId || 
        t.chatRoomId !== chatRoomId || 
        t.receiverId !== receiverId
      ));
      delete typingTimeoutRef.current[userId];
    }, 3000);
  }, []);

  const removeTypingIndicator = useCallback((userId: string, chatRoomId?: string, receiverId?: string) => {
    if (typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId]);
      delete typingTimeoutRef.current[userId];
    }

    setTypingUsers(prev => prev.filter(t => 
      t.userId !== userId || 
      t.chatRoomId !== chatRoomId || 
      t.receiverId !== receiverId
    ));
  }, []);

  const getTypingUsers = useCallback((chatRoomId?: string, receiverId?: string, currentUserId?: string) => {
    return typingUsers.filter(t => {
      if (t.userId === currentUserId) return false;
      if (chatRoomId && t.chatRoomId === chatRoomId) return true;
      if (receiverId && t.receiverId === receiverId) return true;
      return false;
    });
  }, [typingUsers]);

  const generateAutoResponse = useCallback((message: string, _senderId: string): string | null => {
    // Don't respond to messages from specific users to avoid loops
    const botUsers = ['user2', 'user4', 'user5'];
    const _randomUser = botUsers[Math.floor(Math.random() * botUsers.length)];
    
    // Only respond sometimes to make it feel natural
    if (Math.random() < 0.3) return null;

    const responses: { [key: string]: string[] } = {
      greeting: [
        "Hey there! 👋",
        "Hello! How's it going?",
        "Hi! Good to see you online!",
        "Hey! What's up?"
      ],
      question: [
        "That's an interesting question! 🤔",
        "Great point! I was wondering about that too.",
        "Hmm, let me think about that...",
        "Good question! Anyone else have thoughts on this?"
      ],
      positive: [
        "Awesome! 🎉",
        "That sounds great!",
        "Nice work! 👏",
        "Love it! ❤️"
      ],
      work: [
        "Work stuff can be tricky sometimes!",
        "I feel you on that work situation.",
        "Hope your project goes smoothly! 🤞",
        "Work-life balance is so important."
      ],
      default: [
        "Interesting! 🙂",
        "I see what you mean.",
        "Thanks for sharing that!",
        "Good to know!"
      ]
    };

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = responses.greeting;
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (lowerMessage.includes('?')) {
      const questions = responses.question;
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    if (lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('good')) {
      const positives = responses.positive;
      return positives[Math.floor(Math.random() * positives.length)];
    }
    
    if (lowerMessage.includes('work') || lowerMessage.includes('project') || lowerMessage.includes('job')) {
      const workResponses = responses.work;
      return workResponses[Math.floor(Math.random() * workResponses.length)];
    }
    
    const defaultResponses = responses.default;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, []);

  const simulateTyping = useCallback((chatRoomId: string, excludeUserId: string) => {
    // Get users who could be typing in this chat
    const possibleUsers = mockUsers.filter(u => u.id !== excludeUserId && u.status === 'online');
    
    if (possibleUsers.length === 0) return;
    
    const randomUser = possibleUsers[Math.floor(Math.random() * possibleUsers.length)];
    
    // Show typing indicator
    addTypingIndicator(randomUser.id, chatRoomId);
    
    // Remove after 2-3 seconds
    setTimeout(() => {
      removeTypingIndicator(randomUser.id, chatRoomId);
    }, 2000 + Math.random() * 1000);
  }, [addTypingIndicator, removeTypingIndicator]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    typingUsers,
    addTypingIndicator,
    removeTypingIndicator,
    getTypingUsers,
    generateAutoResponse,
    simulateTyping
  };
}

// Hook for message reactions
export function useMessageReactions() {
  const addReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    // This would update the message with the new reaction
    console.log('Adding reaction:', { messageId, emoji, userId });
    // Implementation would depend on your state management approach
  }, []);

  const removeReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    console.log('Removing reaction:', { messageId, emoji, userId });
    // Implementation would depend on your state management approach
  }, []);

  const toggleReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    // Check if user already reacted with this emoji and toggle
    console.log('Toggling reaction:', { messageId, emoji, userId });
    // Implementation would depend on your state management approach
  }, []);

  return {
    addReaction,
    removeReaction,
    toggleReaction
  };
}

// Hook for managing scroll position in chat
export function useChatScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      setShouldAutoScroll(isAtBottom);
    }
  }, []);

  return {
    scrollRef,
    shouldAutoScroll,
    scrollToBottom,
    handleScroll
  };
}