// Simple utility to get user ID from JWT token

/**
 * Decode JWT token to get user information
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Get current user ID from stored token
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // The user ID is in the 'sub' field of the JWT
  return decoded.sub || null;
}

