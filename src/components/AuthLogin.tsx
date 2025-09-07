'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const avatarOptions = [
  'https://placehold.co/100x100?text=Professional+Business+Avatar+Male',
  'https://placehold.co/100x100?text=Professional+Business+Avatar+Female',
  'https://placehold.co/100x100?text=Casual+Friendly+Avatar+Person',
  'https://placehold.co/100x100?text=Creative+Artistic+Avatar+Designer',
  'https://placehold.co/100x100?text=Tech+Professional+Avatar+Developer',
  'https://placehold.co/100x100?text=Modern+Minimalist+Avatar+User'
];

export default function AuthLogin() {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const { login, toggleTheme, theme } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatApp
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Join the conversation! Enter your name to start chatting.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Choose your username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
                minLength={2}
                maxLength={30}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Select your avatar
              </label>
              <div className="grid grid-cols-3 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative rounded-full p-1 transition-all ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2 dark:hover:ring-offset-gray-800'
                    }`}
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!username.trim()}
            >
              Start Chatting
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>🚀 Experience modern real-time messaging</p>
            <p>💬 Join group chats or send direct messages</p>
            <p>🎨 Beautiful dark/light themes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}