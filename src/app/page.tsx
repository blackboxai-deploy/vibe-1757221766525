'use client';

import { useAuth } from '@/context/AuthContext';
import AuthLogin from '@/components/AuthLogin';
import ChatApp from '@/components/ChatApp';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated ? <ChatApp /> : <AuthLogin />}
    </div>
  );
}