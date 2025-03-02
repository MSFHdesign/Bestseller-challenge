<template>
  <div class="flex items-center gap-2 sm:gap-4">
    <!-- Sidebar Toggle Button -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="p-1 sm:p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      aria-label="Toggle sidebar navigation"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Logo -->
    <NuxtLink to="/" class="flex-shrink-0" @click="$emit('refresh-data')">
      <img src="https://bestseller.com/media/jvnn3xxh/bestseller_logo_black_2021-1.png" 
           alt="Bestseller" 
           class="h-5 sm:h-6 md:h-8 w-auto"
      />
    </NuxtLink>
  </div>
</template>

<script setup>
defineEmits(['toggle-sidebar', 'refresh-data']);
</script> 