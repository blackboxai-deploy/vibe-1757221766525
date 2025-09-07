export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  bio?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string; // for direct messages
  chatRoomId?: string; // for group chats
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'emoji';
  reactions?: MessageReaction[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string; // message ID being replied to
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'group' | 'direct';
  participants: string[]; // user IDs
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  avatar?: string;
}

export interface TypingIndicator {
  userId: string;
  chatRoomId?: string;
  receiverId?: string;
  timestamp: Date;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

export interface ChatState {
  chatRooms: ChatRoom[];
  messages: { [chatRoomId: string]: Message[] };
  activeChat: string | null;
  typingIndicators: TypingIndicator[];
  onlineUsers: string[];
  searchQuery: string;
}

export type MessageInputType = {
  text: string;
  replyTo?: Message;
}

export type EmojiData = {
  emoji: string;
  name: string;
  category: string;
}