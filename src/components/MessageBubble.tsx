'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import { Message, User } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDetailedTime } from '@/lib/chatUtils';
import EmojiPicker from './EmojiPicker';

interface MessageBubbleProps {
  message: Message;
  sender?: User;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageBubble({ message, sender, isOwn, showAvatar }: MessageBubbleProps) {
  const { currentUser } = useAuth();
  const { addReaction } = useChatContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    addReaction(message.id, emoji);
    setShowEmojiPicker(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  const reactionCounts = message.reactions?.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar - Only show for others in group chats */}
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mb-1">
          <AvatarImage src={sender?.avatar} alt={sender?.username} />
          <AvatarFallback className="text-xs">{sender?.username[0] || '?'}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Container */}
      <div className={`flex flex-col space-y-1 max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name - Only show for others in group chats */}
        {!isOwn && showAvatar && sender && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
            {sender.username}
          </span>
        )}

        {/* Message Bubble */}
        <div 
          className={`group relative px-4 py-2 rounded-2xl transition-all hover:shadow-sm ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {/* Message Content */}
          <div className="break-words">
            {message.type === 'emoji' ? (
              <span className="text-2xl">{message.content}</span>
            ) : (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
          </div>

          {/* Message Time & Status */}
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-xs">{formatDetailedTime(message.timestamp)}</span>
            {isOwn && (
              <span className={`text-xs ${
                message.status === 'read' ? 'text-blue-200' : 
                message.status === 'delivered' ? 'text-blue-300' : 
                'text-blue-400'
              }`}>
                {getStatusIcon(message.status)}
              </span>
            )}
          </div>

          {/* Quick Reaction Button - Appears on hover */}
          {showReactions && (
            <div className={`absolute -top-8 ${isOwn ? 'right-0' : 'left-0'} z-10`}>
              <div className="bg-white dark:bg-gray-700 rounded-full shadow-lg border dark:border-gray-600 px-2 py-1">
                <div className="flex items-center space-x-1">
                  {['❤️', '👍', '😂', '😮', '😢', '😡'].map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      <span className="text-sm">{emoji}</span>
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setShowEmojiPicker(true)}
                  >
                    <span className="text-sm">➕</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Reactions */}
        {Object.keys(reactionCounts).length > 0 && (
          <div className={`flex flex-wrap gap-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(reactionCounts).map(([emoji, count]) => {
              const userReacted = message.reactions?.some(r => r.emoji === emoji && r.userId === currentUser?.id);
              return (
                <Button
                  key={emoji}
                  variant="outline"
                  size="sm"
                  className={`h-6 px-2 py-1 text-xs rounded-full transition-colors ${
                    userReacted 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' 
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => addReaction(message.id, emoji)}
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="ml-1">{count}</span>}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Spacer for own messages to balance avatar space */}
      {isOwn && showAvatar && <div className="w-8" />}

      {/* Emoji Picker Modal */}
      {showEmojiPicker && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}