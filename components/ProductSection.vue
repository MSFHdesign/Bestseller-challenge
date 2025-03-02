
<template>
  <section class="space-y-4 sm:space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">{{ title }}</h2>
      <NuxtLink 
        :to="`/products?category=${category}`" 
        class="group text-xs sm:text-sm font-medium hover:underline flex items-center gap-1 transition-all duration-300 ease-in-out"
      >
        {{ viewAllText || 'Se alle' }}
        <span class="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
      </NuxtLink>
    </div>
    
    <ProductCarousel 
      :products="products" 
      :category="category"
    />
  </section>
</template>

<script setup>
defineProps({
  /**
   * The title to display for this product section
   */
  title: {
    type: String,
    required: true
  },
  
  /**
   * The products to display in the carousel
   */
  products: {
    type: Array,
    required: true
  },
  
  /**
   * The category identifier used for filtering and navigation
   */
  category: {
    type: String,
    required: true
  },
  
  /**
   * Custom text for the "view all" link
   */
  viewAllText: {
    type: String,
    default: 'Se alle'
  }
});
</script>

<style scoped>
/* Enhanced styling for the section */
section {
  position: relative;
}

h2 {
  position: relative;
  overflow: hidden;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

section:hover h2::after {
  width: 60px;
}
</style> 