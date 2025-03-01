import { ref } from 'vue'

// Simple event bus implementation
const listeners = ref<Record<string, Function[]>>({})

export function useEventBus() {
  const emit = (event: string, ...args: any[]) => {
    if (listeners.value[event]) {
      listeners.value[event].forEach(callback => callback(...args))
    }
  }

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