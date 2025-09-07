'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getChatDisplayName, getChatAvatar, getLastMessagePreview, formatMessageTime, sortChatsByLastActivity, filterChatsBySearch } from '@/lib/chatUtils';

export default function ChatSidebar() {
  const { currentUser, logout, toggleTheme, theme, users } = useAuth();
  const { chatRooms, messages, activeChat, setActiveChat, searchQuery, setSearchQuery } = useChatContext();
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');

  if (!currentUser) return null;

  const sortedChats = sortChatsByLastActivity(chatRooms, messages);
  const filteredChats = filterChatsBySearch(sortedChats, searchQuery, currentUser.id, users);
  const onlineUsers = users.filter(user => user.status === 'online' && user.id !== currentUser.id);

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {currentUser.username}
              </h2>
              <p className="text-xs text-green-600 dark:text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            >
              ↗
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-2 border-b dark:border-gray-700">
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
          <Button
            variant={activeTab === 'chats' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('chats')}
            className="flex-1"
          >
            Chats
            {chatRooms.reduce((acc, room) => acc + room.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {chatRooms.reduce((acc, room) => acc + room.unreadCount, 0)}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('contacts')}
            className="flex-1"
          >
            Contacts
            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {activeTab === 'chats' ? (
          <div className="p-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((room) => {
                  const lastMessage = messages[room.id]?.[messages[room.id]?.length - 1];
                  const displayName = getChatDisplayName(room, currentUser.id, users);
                  const avatar = getChatAvatar(room, currentUser.id, users);
                  const isActive = activeChat === room.id;

                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveChat(room.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        isActive 
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatar} alt={displayName} />
                            <AvatarFallback>
                              {room.type === 'group' ? '👥' : displayName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {room.type === 'direct' && users.find(u => u.id === room.participants.find(id => id !== currentUser.id))?.status === 'online' && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {displayName}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {lastMessage && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatMessageTime(lastMessage.timestamp)}
                                </span>
                              )}
                              {room.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                              {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                              {getLastMessagePreview(lastMessage)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            <div className="space-y-1">
              {onlineUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    // Find or create direct chat with this user
                    const existingChat = chatRooms.find(
                      room => room.type === 'direct' && room.participants.includes(user.id)
                    );
                    if (existingChat) {
                      setActiveChat(existingChat.id);
                    }
                    setActiveTab('chats');
                  }}
                  className="w-full p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </h3>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {user.bio || 'Online'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="px-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                All Contacts
              </h4>
              <div className="space-y-1">
                {users
                  .filter(user => user.id !== currentUser.id)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback className="text-xs">{user.username[0]}</AvatarFallback>
                        </Avatar>
                        {user.status === 'online' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}