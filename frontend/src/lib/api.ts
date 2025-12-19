/**
 * API utility for making authenticated requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Get the JWT token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token');
    
    // Check if token is valid (not null, not undefined string, not empty)
    if (!token) {
      console.warn('⚠️ No token in localStorage');
      return null;
    }
    
    // Check for invalid token values
    if (token === 'undefined' || token === 'null' || token.trim().length === 0) {
      // Silently clear invalid token without flooding console
      localStorage.removeItem('token');
      return null;
    }
    
    // Basic JWT validation (should have 3 parts)
    if (token.split('.').length !== 3) {
      console.error('❌ Invalid token format in localStorage');
      console.error('Token preview:', token.substring(0, 50));
      localStorage.removeItem('token');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
export async function api<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Validate token before using it
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  if (token === 'undefined' || token === 'null' || typeof token !== 'string') {
    localStorage.removeItem('token');
    throw new Error('Invalid token stored. Please log in again.');
  }
  
  // Clean the token (remove any whitespace or extra characters)
  const cleanToken = token.trim();
  
  // Validate token format (JWT should have 3 parts: header.payload.signature)
  const tokenParts = cleanToken.split('.');
  if (tokenParts.length !== 3) {
    localStorage.removeItem('token');
    throw new Error('Invalid token format. Please log in again.');
  }
  
  // Validate token length (JWT tokens are typically 100+ characters)
  if (cleanToken.length < 50) {
    localStorage.removeItem('token');
    throw new Error('Invalid token (too short). Please log in again.');
  }
  
  headers['Authorization'] = `Bearer ${cleanToken}`;

  // Handle absolute URLs
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for fallback authentication
    });
    
    // Log only in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 API Request:', {
        method: options.method || 'GET',
        url,
        hasAuth: !!headers['Authorization'],
        status: response.status,
      });
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || 'An unknown error occurred');
  }
}

/**
 * GET request
 */
api.get = <T = any>(endpoint: string): Promise<T> => {
  return api<T>(endpoint, { method: 'GET' });
};

/**
 * POST request
 */
api.post = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return api<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request
 */
api.put = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return api<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH request
 */
api.patch = <T = any>(endpoint: string, data?: any): Promise<T> => {
  return api<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request
 */
api.delete = <T = any>(endpoint: string): Promise<T> => {
  return api<T>(endpoint, { method: 'DELETE' });
};

