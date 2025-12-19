'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, checkAuth, hasRole as checkRole, hasPermission as checkPermission } from './auth';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  refetch: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await checkAuth();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const hasRole = useCallback((role: string): boolean => {
    return checkRole(user, role);
  }, [user]);

  const hasPermission = useCallback((permission: string): boolean => {
    return checkPermission(user, permission);
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
    refetch: fetchUser,
  };
}
