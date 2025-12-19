'use client';

import { showToast, ToastType } from './toast';

/**
 * Hook wrapper for toast functionality
 * Returns showToast function for use in components
 */
export function useToast() {
  return {
    showToast: (message: string, type: ToastType = 'info', duration?: number) => {
      showToast(message, type, duration);
    },
  };
}
