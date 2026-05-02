'use client';

import { useEffect, useState } from 'react';
import type { SessionUser } from '@/lib/types';

const MULTI_AUTH_KEY = 'multi_auth_sessions';
const CURRENT_USER_KEY = 'current_user_id';
const AUTH_SESSION_EVENT = 'multi-auth-session-change';

interface StoredUser extends SessionUser {
  timestamp: number;
}

export const useMultiAuth = () => {
  const [users, setUsers] = useState<SessionUser[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const stored = localStorage.getItem(MULTI_AUTH_KEY);
        const currentId = localStorage.getItem(CURRENT_USER_KEY);
        
        if (stored) {
          const allUsers: StoredUser[] = JSON.parse(stored);
          const validUsers = allUsers.filter(u => u.id && u.email); // Filter out invalid entries
          
          if (validUsers.length > 0) {
            const sessionUsers = validUsers.map(({ timestamp, ...user }) => user);
            setUsers(sessionUsers);

            // Set current user
            const current = (
              currentId
                ? sessionUsers.find(u => u.id === currentId)
                : null
            ) ?? sessionUsers[sessionUsers.length - 1];
            
            if (current) {
              setCurrentUser(current);
              localStorage.setItem(CURRENT_USER_KEY, current.id);
            }
          } else {
            // Fallback to fetching current user
            const response = await fetch('/api/auth/me', { cache: 'no-store' });
            const data = (await response.json()) as { user: SessionUser | null };
            if (data.user) {
              addUser(data.user);
            }
          }
        } else {
          // No stored sessions, fetch current user
          const response = await fetch('/api/auth/me', { cache: 'no-store' });
          const data = (await response.json()) as { user: SessionUser | null };
          if (data.user) {
            addUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
    window.addEventListener(AUTH_SESSION_EVENT, loadUsers);
    window.addEventListener('storage', loadUsers);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, loadUsers);
      window.removeEventListener('storage', loadUsers);
    };
  }, []);

  const addUser = (user: SessionUser) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) return prev;
      
      const updated = [...prev, user];
      localStorage.setItem(MULTI_AUTH_KEY, JSON.stringify(
        updated.map(u => ({ ...u, timestamp: Date.now() }))
      ));
      
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      
      return updated;
    });
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, userId);
    }
  };

  const removeUser = (userId: string) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== userId);
      localStorage.setItem(MULTI_AUTH_KEY, JSON.stringify(
        updated.map(u => ({ ...u, timestamp: Date.now() }))
      ));
      
      if (currentUser?.id === userId) {
        const newCurrent = updated[updated.length - 1] || null;
        setCurrentUser(newCurrent);
        if (newCurrent) {
          localStorage.setItem(CURRENT_USER_KEY, newCurrent.id);
        } else {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }
      
      return updated;
    });
  };

  const logout = async (userId?: string) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors
    }

    removeUser(targetId);
    
    if (users.length <= 1) {
      localStorage.removeItem(MULTI_AUTH_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      window.location.href = '/';
    }
  };

  return {
    users,
    currentUser,
    isLoading,
    addUser,
    switchUser,
    removeUser,
    logout,
  };
};
