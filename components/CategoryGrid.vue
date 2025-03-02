<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Optional Section Title -->
    <div v-if="title" class="flex justify-between items-center">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">{{ title }}</h2>
      <NuxtLink 
        v-if="viewAllLink"
        :to="viewAllLink" 
        class="group text-xs sm:text-sm font-medium hover:underline flex items-center gap-1 transition-all duration-300 ease-in-out"
      >
        {{ viewAllText }}
        <span class="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
      </NuxtLink>
    </div>
    
    <!-- Category Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
      <NuxtLink 
        v-for="category in categories" 
        :key="category.id"
        :to="`/products?category=${category.id}`"
        class="group relative overflow-hidden rounded-xl aspect-[4/5] shadow-md hover:shadow-xl transition-all duration-500"
      >
        <!-- Category Image with Hover Effect -->
        <img 
          :src="category.image" 
          :alt="category.name"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 
            group-hover:scale-110 group-hover:filter group-hover:brightness-110"
        />
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        <!-- Text Content -->
        <div class="absolute bottom-0 left-0 p-3 sm:p-4 w-full transform transition-transform duration-500">
          <h3 class="text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{{ category.name }}</h3>
          <span class="inline-flex items-center text-xs sm:text-sm text-white/90 group-hover:text-white transition-colors duration-300">
            {{ shopNowText }} <span class="ml-1 sm:ml-2 transform transition-all duration-500 group-hover:translate-x-1">→</span>
          </span>
        </div>
        
        <!-- Shine Effect on Hover -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Optional title for the category section
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * Array of category objects with id, name, and image
   */
  categories: {
    type: Array,
    required: true
  },
  
  /**
   * Optional link for "view all" button
   */
  viewAllLink: {
    type: String,
    default: ''
  },
  
  /**
   * Text for "view all" link
   */
  viewAllText: {
    type: String,
    default: 'Se alle'
  },
  
  /**
   * Text for "shop now" link
   */
  shopNowText: {
    type: String,
    default: 'Shop nu'
  }
});
</script>

<style scoped>
/* Enhanced styling for hover effects */
.group:hover .absolute.bottom-0 {
  transform: translateY(-4px);
}

/* Add subtle pulse animation to the arrow on hover */
@keyframes pulse-arrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

.group:hover .group-hover\:translate-x-1 {
  animation: pulse-arrow 1.5s ease-in-out infinite;
}
</style> 