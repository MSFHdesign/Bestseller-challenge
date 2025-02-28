<template>
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Din Indkøbskurv</h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ itemCount }} {{ itemCount === 1 ? 'vare' : 'varer' }}
      </p>
    </div>
    
    <button 
      @click="$emit('continue-shopping')"
      class="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>Fortsæt med at handle</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  itemCount: {
    type: Number,
    required: true,
    default: 0
  }
});
</script> 