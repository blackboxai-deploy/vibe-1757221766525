'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/chat';
import { mockUsers } from '@/data/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  login: (username: string, avatar?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleTheme: () => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('chatApp_currentUser', null);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('chatApp_theme', 'light');
  
  const [currentUser, setCurrentUser] = useState<User | null>(storedUser);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Update theme on document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const login = (username: string, avatar?: string) => {
    // Check if user already exists or create new one
    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      // Create new user
      user = {
        id: `user_${Date.now()}`,
        username,
        avatar: avatar || `https://placehold.co/100x100?text=${encodeURIComponent(username)}+profile+photo`,
        status: 'online',
        bio: 'New user'
      };
      
      // Add to users list
      setUsers(prev => [...prev, user!]);
    } else {
      // Update existing user status
      user = { ...user, status: 'online' as const };
      setUsers(prev => prev.map(u => u.id === user!.id ? user! : u));
    }

    setCurrentUser(user);
    setStoredUser(user);
  };

  const logout = () => {
    if (currentUser) {
      // Update user status to offline
      setUsers(prev => prev.map(u => 
        u.id === currentUser.id 
          ? { ...u, status: 'offline' as const, lastSeen: new Date() }
          : u
      ));
    }
    
    setCurrentUser(null);
    setStoredUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setStoredUser(updatedUser);
    
    // Update in users list
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: currentUser !== null,
    theme,
    users,
    login,
    logout,
    updateUser,
    toggleTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}