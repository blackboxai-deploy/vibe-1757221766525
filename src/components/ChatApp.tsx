'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/context/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import UserProfile from './UserProfile';
import { Button } from '@/components/ui/button';

export default function ChatApp() {
  const { currentUser, logout, toggleTheme, theme } = useAuth();
  const { activeChat } = useChatContext();
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
        >
          {sidebarOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Header - Mobile Only */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700 p-4 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3 ml-12">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            ChatApp
          </h1>
        </div>
        <div className="flex items-center space-x-2">
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
            onClick={() => setShowProfile(!showProfile)}
            className="rounded-full"
          >
            👤
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            ↗
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:relative z-30 w-80 h-full
        transition-transform duration-300 ease-in-out
      `}>
        <ChatSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:pt-0 pt-16">
        {activeChat ? (
          <ChatArea />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">💬</div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome to ChatApp
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Select a conversation from the sidebar to start chatting. You can join group discussions or send direct messages to your contacts.
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p>💡 Tip: Use emojis in your messages for more fun!</p>
                <p>🌙 Toggle dark mode anytime from the sidebar</p>
                <p>📱 Fully responsive - works great on mobile too</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Panel - Desktop Only */}
      {showProfile && (
        <div className="hidden lg:block w-80 border-l dark:border-gray-700">
          <UserProfile onClose={() => setShowProfile(false)} />
        </div>
      )}

      {/* User Profile Modal - Mobile Only */}
      {showProfile && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
}