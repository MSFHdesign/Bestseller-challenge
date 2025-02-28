<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
    class="fixed bottom-0 right-0 z-50 p-4 space-y-4"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-500"
      :class="[getToastClass(toast.type)]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <span v-if="toast.type === 'success'" class="text-2xl">✅</span>
        <span v-else-if="toast.type === 'error'" class="text-2xl">❌</span>
        <span v-else-if="toast.type === 'warning'" class="text-2xl">⚠️</span>
        <span v-else class="text-2xl">ℹ️</span>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <p class="text-sm font-medium">
          {{ toast.message }}
        </p>
      </div>

      <!-- Action Button -->
      <div v-if="toast.action" class="flex-shrink-0">
        <button
          @click="toast.action.onClick"
          class="ml-3 px-3 py-1 text-sm font-medium rounded-md bg-black/10 hover:bg-black/20 
            transition-colors duration-200"
        >
          {{ toast.action.label }}
        </button>
      </div>

      <!-- Close Button -->
      <button
        @click="removeToast(toast.id)"
        class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

const { toasts, removeToast } = useToast();

const getToastClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800 border-l-4 border-green-500';
    case 'error':
      return 'bg-red-50 text-red-800 border-l-4 border-red-500';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500';
    default:
      return 'bg-blue-50 text-blue-800 border-l-4 border-blue-500';
  }
};
</script> 