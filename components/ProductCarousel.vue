<template>
  <div class="relative">
    <!-- Products Row -->
    <div class="flex overflow-x-auto gap-3 sm:gap-6 scrollbar-hide snap-x snap-mandatory pb-4">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="flex-none w-[200px] sm:w-[240px] md:w-[280px] snap-start h-[400px] sm:h-[450px] md:h-[500px]"
      >
        <ProductCard :product="product" class="h-full w-full" />
      </div>
    </div>
    
    <!-- Navigation Arrows -->
    <button 
      v-if="showNavigation"
      @click="scroll(-1)"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 p-1 sm:p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 z-10 hidden sm:block"
    >
      ←
    </button>
    <button 
      v-if="showNavigation"
      @click="scroll(1)"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 p-1 sm:p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 z-10 hidden sm:block"
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

const showNavigation = computed(() => props.products.length > 2);

const scroll = (direction) => {
  const container = document.querySelector('.overflow-x-auto');
  if (container) {
    const scrollAmount = window.innerWidth < 640 ? 210 : window.innerWidth < 768 ? 250 : 300;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
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