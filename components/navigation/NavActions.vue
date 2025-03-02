<template>
  <div class="flex items-center space-x-1 sm:space-x-4">
    <!-- Search Button (Desktop) -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="hidden md:block p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      aria-label="Search"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
    
    <!-- Wishlist -->
    <NuxtLink to="/wishlist" class="p-1 sm:p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <!-- Wishlist Count Badge -->
      <span 
        v-if="wishlistCount > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
      >
        {{ wishlistCount }}
      </span>
    </NuxtLink>
    
    <!-- Cart -->
    <button 
      @click="$emit('toggle-cart')"
      class="p-1 sm:p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
      aria-label="Shopping cart"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span v-if="cartItems.length" 
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
        {{ cartItems.length }}
      </span>
    </button>
    
    <!-- Mobile Menu Toggle -->
    <button 
      @click="$emit('toggle-mobile-menu')"
      class="lg:hidden p-1 sm:p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      aria-label="Toggle mobile menu"
    >
      <svg v-if="!isMobileMenuOpen" class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
      <svg v-else class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  wishlistCount: {
    type: Number,
    required: true
  },
  isMobileMenuOpen: {
    type: Boolean,
    required: true
  }
});

defineEmits(['toggle-cart', 'toggle-sidebar', 'toggle-mobile-menu']);
</script> 