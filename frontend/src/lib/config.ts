/**
 * Application configuration
 * Centralizes environment variables and configuration constants
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const config = {
  apiUrl: API_URL,
} as const;
