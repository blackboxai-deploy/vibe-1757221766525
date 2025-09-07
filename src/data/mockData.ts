import { User, ChatRoom, Message } from '@/types/chat';

export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'Alex Chen',
    avatar: 'https://placehold.co/100x100?text=Alex+Chen+professional+headshot+smiling',
    status: 'online',
    bio: 'Frontend Developer | React Enthusiast'
  },
  {
    id: 'user2',
    username: 'Sarah Wilson',
    avatar: 'https://placehold.co/100x100?text=Sarah+Wilson+professional+portrait+friendly',
    status: 'away',
    bio: 'UX Designer | Coffee Lover'
  },
  {
    id: 'user3',
    username: 'Mike Johnson',
    avatar: 'https://placehold.co/100x100?text=Mike+Johnson+casual+profile+photo',
    status: 'online',
    bio: 'Backend Engineer | Python & Node.js'
  },
  {
    id: 'user4',
    username: 'Emma Davis',
    avatar: 'https://placehold.co/100x100?text=Emma+Davis+creative+professional+headshot',
    status: 'offline',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    bio: 'Product Manager | Tech Startup'
  },
  {
    id: 'user5',
    username: 'David Kim',
    avatar: 'https://placehold.co/100x100?text=David+Kim+software+engineer+portrait',
    status: 'online',
    bio: 'Full Stack Developer | Open Source Contributor'
  }
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion for everyone',
    type: 'group',
    participants: ['user1', 'user2', 'user3', 'user4', 'user5'],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    avatar: 'https://placehold.co/100x100?text=General+Chat+Room+Icon+Community'
  },
  {
    id: 'tech-talk',
    name: 'Tech Talk',
    description: 'Discuss latest in technology',
    type: 'group',
    participants: ['user1', 'user3', 'user5'],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    avatar: 'https://placehold.co/100x100?text=Tech+Talk+Programming+Discussion+Group'
  },
  {
    id: 'random',
    name: 'Random',
    description: 'Random conversations and fun',
    type: 'group',
    participants: ['user2', 'user4', 'user5'],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    avatar: 'https://placehold.co/100x100?text=Random+Chat+Fun+Casual+Conversation'
  },
  {
    id: 'direct-user2',
    name: 'Sarah Wilson',
    type: 'direct',
    participants: ['user1', 'user2'],
    unreadCount: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'direct-user3',
    name: 'Mike Johnson',
    type: 'direct',
    participants: ['user1', 'user3'],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const mockMessages: { [chatRoomId: string]: Message[] } = {
  'general': [
    {
      id: 'msg1',
      content: 'Hey everyone! How\'s everyone doing today?',
      senderId: 'user2',
      chatRoomId: 'general',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg2',
      content: 'Doing great! Just finished a big project. Feeling accomplished! 🎉',
      senderId: 'user3',
      chatRoomId: 'general',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
      reactions: [
        { emoji: '🎉', userId: 'user1', timestamp: new Date(Date.now() - 1.4 * 60 * 60 * 1000) },
        { emoji: '👏', userId: 'user2', timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000) }
      ]
    },
    {
      id: 'msg3',
      content: 'Congrats Mike! What kind of project was it?',
      senderId: 'user4',
      chatRoomId: 'general',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg4',
      content: 'It was a React dashboard with real-time analytics. Took me 3 weeks but finally deployed! 🚀',
      senderId: 'user3',
      chatRoomId: 'general',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg5',
      content: 'That sounds amazing! Would love to see it sometime.',
      senderId: 'user1',
      chatRoomId: 'general',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      status: 'delivered'
    }
  ],
  'tech-talk': [
    {
      id: 'tech1',
      content: 'Anyone tried the new Next.js 15 features yet?',
      senderId: 'user1',
      chatRoomId: 'tech-talk',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'tech2',
      content: 'Yes! The new caching system is incredible. Performance improvements are noticeable.',
      senderId: 'user5',
      chatRoomId: 'tech-talk',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'tech3',
      content: 'I\'m still learning React 19. The new hooks are confusing me a bit 😅',
      senderId: 'user3',
      chatRoomId: 'tech-talk',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  ],
  'random': [
    {
      id: 'random1',
      content: 'Just had the best coffee ever ☕',
      senderId: 'user2',
      chatRoomId: 'random',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'random2',
      content: 'What kind? I\'m always looking for new coffee recommendations!',
      senderId: 'user4',
      chatRoomId: 'random',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'random3',
      content: 'It was a Colombian single-origin from a local roaster. Amazing floral notes!',
      senderId: 'user2',
      chatRoomId: 'random',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  ],
  'direct-user2': [
    {
      id: 'dm1',
      content: 'Hey Alex! Ready for the team meeting tomorrow?',
      senderId: 'user2',
      receiverId: 'user1',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: 'dm2',
      content: 'Yeah, I\'ve prepared all the mockups you requested. They look great!',
      senderId: 'user1',
      receiverId: 'user2',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'dm3',
      content: 'Perfect! Can\'t wait to see them. You always deliver amazing work 🎨',
      senderId: 'user2',
      receiverId: 'user1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      status: 'sent'
    }
  ],
  'direct-user3': [
    {
      id: 'dm_mike1',
      content: 'Thanks for the code review earlier!',
      senderId: 'user1',
      receiverId: 'user3',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: 'dm_mike2',
      content: 'No problem! Your code was really clean. Just a few minor suggestions.',
      senderId: 'user3',
      receiverId: 'user1',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  ]
};

export const popularEmojis = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
  '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
  '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
  '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🎃', '🎄', '🎅', '🎆'
];