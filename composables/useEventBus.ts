import { ref } from 'vue'

/**
 * Simple event bus implementation for Vue 3 applications
 * 
 * This composable provides a lightweight pub/sub pattern for cross-component communication
 * without requiring prop drilling or complex state management.
 * 
 * @example
 * // In component A (emitting events)
 * const { emit } = useEventBus()
 * const sendMessage = () => {
 *   emit('message:sent', { text: 'Hello', timestamp: Date.now() })
 * }
 * 
 * // In component B (listening for events)
 * const { on } = useEventBus()
 * onMounted(() => {
 *   // Store the unsubscribe function
 *   const unsubscribe = on('message:sent', (message) => {
 *     console.log('Received message:', message)
 *   })
 *   
 *   // Clean up listener when component unmounts
 *   onUnmounted(() => {
 *     unsubscribe()
 *   })
 * })
 */

// Shared state for event listeners across all instances
const listeners = ref<Record<string, Function[]>>({})

export function useEventBus() {
  /**
   * Emit an event with optional arguments
   * 
   * @param {string} event - The event name to emit
   * @param {...any[]} args - Arguments to pass to the event listeners
   */
  const emit = (event: string, ...args: any[]) => {
    if (listeners.value[event]) {
      listeners.value[event].forEach(callback => callback(...args))
    }
  }

  /**
   * Register a callback function for a specific event
   * 
   * @param {string} event - The event name to listen for
   * @param {Function} callback - The function to call when the event is emitted
   * @returns {Function} An unsubscribe function to remove this listener
   */
  const on = (event: string, callback: Function) => {
    if (!listeners.value[event]) {
      listeners.value[event] = []
    }
    listeners.value[event].push(callback)

    // Return unsubscribe function
    return () => {
      const idx = listeners.value[event].indexOf(callback)
      if (idx > -1) {
        listeners.value[event].splice(idx, 1)
      }
    }
  }

  return {
    emit,
    on
  }
} 