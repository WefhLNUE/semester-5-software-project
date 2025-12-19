// Simple toast notification utility without React Context
// Can be used from any component or function

export type ToastType = 'success' | 'error' | 'warning' | 'info';

let toastContainer: HTMLDivElement | null = null;
let toastIdCounter = 0;

function getOrCreateContainer(): HTMLDivElement {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function getToastStyles(type: ToastType): string {
  const baseStyles = `
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 320px;
    animation: slideIn 0.3s ease-out;
    backdrop-filter: blur(8px);
    pointer-events: auto;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
  `;

  const typeStyles: Record<ToastType, string> = {
    success: 'background-color: rgba(16, 185, 129, 0.95); border: 1px solid rgba(5, 150, 105, 0.3);',
    error: 'background-color: rgba(239, 68, 68, 0.95); border: 1px solid rgba(220, 38, 38, 0.3);',
    warning: 'background-color: rgba(245, 158, 11, 0.95); border: 1px solid rgba(217, 119, 6, 0.3);',
    info: 'background-color: rgba(59, 130, 246, 0.95); border: 1px solid rgba(37, 99, 235, 0.3);',
  };

  return baseStyles + typeStyles[type];
}

function getIcon(type: ToastType): string {
  const icons: Record<ToastType, string> = {
    success: '<svg style="width: 1.5rem; height: 1.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    error: '<svg style="width: 1.5rem; height: 1.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    warning: '<svg style="width: 1.5rem; height: 1.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    info: '<svg style="width: 1.5rem; height: 1.5rem; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  };
  return icons[type];
}

// Add keyframe animation
if (typeof document !== 'undefined') {
  const styleId = 'toast-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 5000) {
  const container = getOrCreateContainer();
  const id = `toast-${Date.now()}-${toastIdCounter++}`;

  const toastEl = document.createElement('div');
  toastEl.id = id;
  toastEl.style.cssText = getToastStyles(type);
  
  toastEl.innerHTML = `
    ${getIcon(type)}
    <span style="flex: 1;">${message}</span>
    <button 
      class="toast-close-btn"
      style="
        background: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        opacity: 0.7;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
      "
    >
      <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

  const closeBtn = toastEl.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => removeToast(id));
    closeBtn.addEventListener('mouseenter', (e) => {
      (e.target as HTMLElement).style.opacity = '1';
    });
    closeBtn.addEventListener('mouseleave', (e) => {
      (e.target as HTMLElement).style.opacity = '0.7';
    });
  }

  container.appendChild(toastEl);

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
}

function removeToast(id: string) {
  const toastEl = document.getElementById(id);
  if (toastEl) {
    toastEl.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      toastEl.remove();
      // Clean up container if empty
      if (toastContainer && toastContainer.children.length === 0) {
        toastContainer.remove();
        toastContainer = null;
      }
    }, 300);
  }
}

// Add slideOut animation
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('toast-animations');
  if (existingStyle) {
    existingStyle.textContent += `
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
  }
}