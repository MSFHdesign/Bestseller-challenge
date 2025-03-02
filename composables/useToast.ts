import { ref } from 'vue';

/**
 * Toast notification interface
 * 
 * @interface Toast
 */
interface Toast {
  /** Unique identifier for the toast */
  id: number;
  /** Message to display */
  message: string;
  /** Type of toast affecting styling and icon */
  type: 'success' | 'error' | 'info' | 'warning';
  /** Optional action button configuration */
  action?: {
    /** Button label */
    label: string;
    /** Function to call when button is clicked */
    onClick: () => void;
  };
}

/**
 * Shared toast state that persists across component instances
 */
const toasts = ref<Toast[]>([]);
let toastId = 0;

/**
 * useToast composable
 * 
 * Provides toast notification functionality for displaying temporary messages.
 * Supports different types of notifications and optional action buttons.
 * 
 * @returns {Object} Toast state and methods for toast manipulation
 * 
 * @example
 * const { addToast, removeToast } = useToast()
 * 
 * // Show a success message
 * const handleSuccess = () => {
 *   addToast('Item added to cart', 'success')
 * }
 * 
 * // Show an error with an action button
 * const handleError = () => {
 *   addToast('Failed to process payment', 'error', 10000, {
 *     label: 'Try Again',
 *     onClick: () => retryPayment()
 *   })
 * }
 */
export function useToast() {
  /**
   * Add a new toast notification
   * 
   * @param {string} message - The message to display
   * @param {Toast['type']} type - The type of toast (success, error, info, warning)
   * @param {number} duration - Duration in milliseconds before auto-removing (0 for no auto-remove)
   * @param {Toast['action']} action - Optional action button configuration
   * @returns {number} The ID of the created toast
   */
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
    
    return id;
  };

  /**
   * Remove a toast notification by ID
   * 
   * @param {number} id - The ID of the toast to remove
   */
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