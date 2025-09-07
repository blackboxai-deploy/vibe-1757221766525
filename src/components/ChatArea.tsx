'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import { useChatScroll } from '@/hooks/useChat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatDisplayName, getChatAvatar, shouldShowDateSeparator, getDateSeparatorText, getUserStatus } from '@/lib/chatUtils';

export default function ChatArea() {
  const { currentUser, users } = useAuth();
  const { activeChat, chatRooms, messages, typingIndicators } = useChatContext();
  const { scrollRef, scrollToBottom, handleScroll } = useChatScroll();

  const currentRoom = chatRooms.find(room => room.id === activeChat);
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom(true);
  }, [currentMessages.length, scrollToBottom]);

  if (!currentUser || !activeChat || !currentRoom) {
    return null;
  }

  const displayName = getChatDisplayName(currentRoom, currentUser.id, users);
  const avatar = getChatAvatar(currentRoom, currentUser.id, users);
  
  // Get other user for direct messages
  const otherUser = currentRoom.type === 'direct' 
    ? users.find(u => u.id === currentRoom.participants.find(id => id !== currentUser.id))
    : null;

  const participantUsers = currentRoom.participants
    .map(id => users.find(u => u.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={displayName} />
            <AvatarFallback>
              {currentRoom.type === 'group' ? '👥' : displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {displayName}
            </h2>
            <div className="flex items-center space-x-2">
              {currentRoom.type === 'direct' && otherUser ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getUserStatus(otherUser)}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {participantUsers.length} members
                </p>
              )}
              
              {/* Online indicators for group chats */}
              {currentRoom.type === 'group' && (
                <div className="flex items-center space-x-1">
                  {participantUsers
                    .filter(user => user.status === 'online' && user.id !== currentUser.id)
                    .slice(0, 3)
                    .map(user => (
                      <Avatar key={user.id} className="h-5 w-5">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="text-xs">{user.username[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  {participantUsers.filter(user => user.status === 'online' && user.id !== currentUser.id).length > 3 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      +{participantUsers.filter(user => user.status === 'online' && user.id !== currentUser.id).length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentRoom.type === 'group' && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentRoom.description}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea 
        className="flex-1 p-4" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">
                {currentRoom.type === 'group' ? '👥' : '💬'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentRoom.type === 'group' 
                  ? `Welcome to ${displayName}!` 
                  : `Start chatting with ${displayName}`
                }
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                {currentRoom.type === 'group'
                  ? currentRoom.description || "This is the beginning of your group conversation."
                  : "This is the beginning of your direct message conversation."
                }
              </p>
            </div>
          ) : (
            currentMessages.map((message, index) => {
              const previousMessage = index > 0 ? currentMessages[index - 1] : null;
              const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
              const sender = users.find(u => u.id === message.senderId);

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {getDateSeparatorText(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}
                  <MessageBubble 
                    message={message} 
                    sender={sender}
                    isOwn={message.senderId === currentUser.id}
                    showAvatar={currentRoom.type === 'group'}
                  />
                </div>
              );
            })
          )}

          {/* Typing Indicators */}
          {typingIndicators.length > 0 && (
            <div className="flex items-center space-x-2 pl-4">
              <div className="flex space-x-1">
                {typingIndicators.slice(0, 2).map((indicator) => {
                  const typingUser = users.find(u => u.id === indicator.userId);
                  return (
                    <Avatar key={indicator.userId} className="h-6 w-6">
                      <AvatarImage src={typingUser?.avatar} alt={typingUser?.username} />
                      <AvatarFallback className="text-xs">{typingUser?.username[0]}</AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {typingIndicators.length === 1 
                    ? `${users.find(u => u.id === typingIndicators[0].userId)?.username} is typing...`
                    : `${typingIndicators.length} people are typing...`
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <MessageInput />
      </div>
    </div>
  );
}