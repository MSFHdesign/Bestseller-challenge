import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  const addToast = (message: string, type: Toast['type'], duration = 5000, action?: Toast['action']) => {
    const id = toastId++;
    const toast: Toast = {
      id,
      message,
      type,
      action
    };
    
    toasts.value.push(toast);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    addToast,
    removeToast
  };
} 