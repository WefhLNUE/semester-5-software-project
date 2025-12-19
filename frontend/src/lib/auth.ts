// Auth utilities for getting current user information
// Supports both cookie-based auth (via /auth/me) and localStorage JWT token

import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface TokenPayload {
  id?: string;
  sub?: string;
  _id?: string;
}

/**
 * Get current user ID from localStorage JWT token (if available)
 * Returns null if token is not found or invalid
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.id || decoded.sub || decoded._id || null;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Get current user ID asynchronously from /auth/me endpoint
 * This is more reliable for cookie-based authentication
 */
export async function getCurrentUserIdAsync(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });

    if (response.ok) {
      const userData = await response.json();
      return userData.id || userData._id || userData.sub || null;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch current user ID:', error);
    return null;
  }
}

// Re-export functions from app/lib/auth.tsx for convenience
export { checkAuth, hasRole, hasPermission, logout, type User } from '../app/lib/auth';