import { Message, User, ChatRoom } from '@/types/chat';

export const formatMessageTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatDetailedTime = (timestamp: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate());
  
  const timeString = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  if (messageDate.getTime() === today.getTime()) {
    return `Today ${timeString}`;
  }

  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (messageDate.getTime() === yesterday.getTime()) {
    return `Yesterday ${timeString}`;
  }

  const daysDiff = Math.floor((today.getTime() - messageDate.getTime()) / (24 * 60 * 60 * 1000));
  if (daysDiff < 7) {
    const dayName = timestamp.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} ${timeString}`;
  }

  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  }) + ` ${timeString}`;
};

export const getLastMessagePreview = (message: Message): string => {
  if (message.type === 'image') return '📷 Photo';
  if (message.type === 'file') return '📁 File';
  if (message.type === 'emoji') return message.content;
  
  const maxLength = 50;
  return message.content.length > maxLength 
    ? message.content.substring(0, maxLength) + '...'
    : message.content;
};

export const getUserDisplayName = (user: User): string => {
  return user.username;
};

export const getChatDisplayName = (chatRoom: ChatRoom, currentUserId: string, users: User[]): string => {
  if (chatRoom.type === 'group') {
    return chatRoom.name;
  }
  
  // For direct messages, show the other user's name
  const otherUserId = chatRoom.participants.find(id => id !== currentUserId);
  const otherUser = users.find(user => user.id === otherUserId);
  return otherUser?.username || 'Unknown User';
};

export const getChatAvatar = (chatRoom: ChatRoom, currentUserId: string, users: User[]): string => {
  if (chatRoom.type === 'group') {
    return chatRoom.avatar || 'https://placehold.co/100x100?text=Group+Chat+Default+Avatar';
  }
  
  // For direct messages, show the other user's avatar
  const otherUserId = chatRoom.participants.find(id => id !== currentUserId);
  const otherUser = users.find(user => user.id === otherUserId);
  return otherUser?.avatar || 'https://placehold.co/100x100?text=User+Default+Avatar+Profile';
};

export const sortChatsByLastActivity = (chatRooms: ChatRoom[], messages: { [chatRoomId: string]: Message[] }): ChatRoom[] => {
  return [...chatRooms].sort((a, b) => {
    const aMessages = messages[a.id] || [];
    const bMessages = messages[b.id] || [];
    const aLastMessage = aMessages[aMessages.length - 1];
    const bLastMessage = bMessages[bMessages.length - 1];
    
    if (!aLastMessage && !bLastMessage) return 0;
    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;
    
    return bLastMessage.timestamp.getTime() - aLastMessage.timestamp.getTime();
  });
};

export const filterChatsBySearch = (chatRooms: ChatRoom[], searchQuery: string, currentUserId: string, users: User[]): ChatRoom[] => {
  if (!searchQuery.trim()) return chatRooms;
  
  const query = searchQuery.toLowerCase();
  return chatRooms.filter(room => {
    const displayName = getChatDisplayName(room, currentUserId, users).toLowerCase();
    return displayName.includes(query);
  });
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const isMessageFromCurrentUser = (message: Message, currentUserId: string): boolean => {
  return message.senderId === currentUserId;
};

export const getUnreadMessageCount = (chatRooms: ChatRoom[]): number => {
  return chatRooms.reduce((total, room) => total + room.unreadCount, 0);
};

export const getOnlineUsers = (users: User[]): User[] => {
  return users.filter(user => user.status === 'online');
};

export const getUserStatus = (user: User): string => {
  switch (user.status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Away';
    case 'offline':
      if (user.lastSeen) {
        return `Last seen ${formatMessageTime(user.lastSeen)}`;
      }
      return 'Offline';
    default:
      return 'Unknown';
  }
};

export const shouldShowDateSeparator = (currentMessage: Message, previousMessage: Message | null): boolean => {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.timestamp).toDateString();
  const previousDate = new Date(previousMessage.timestamp).toDateString();
  
  return currentDate !== previousDate;
};

export const getDateSeparatorText = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (messageDate.getTime() === todayDate.getTime()) {
    return 'Today';
  } else if (messageDate.getTime() === yesterdayDate.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};