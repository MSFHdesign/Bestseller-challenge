<template>
  <div class="relative">
    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
      />
    </div>
    
    <!-- Navigation Arrows -->
    <button 
      v-if="showNavigation"
      @click="scroll(-1)"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
    >
      ←
    </button>
    <button 
      v-if="showNavigation"
      @click="scroll(1)"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
    >
      →
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const showNavigation = computed(() => props.products.length > 4);

const scroll = (direction) => {
  // Implement smooth scrolling logic here if needed
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 