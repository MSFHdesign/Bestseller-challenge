<template>
  <aside class="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-100 z-[51]">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-100">
      <NuxtLink to="/" class="block">
        <img src="https://bestseller.com/media/jvnn3xxh/bestseller_logo_black_2021-1.png" 
             alt="Bestseller" 
             class="h-8 w-auto"
        />
      </NuxtLink>
    </div>

    <!-- Search and Filters -->
    <div class="p-4">
      <SearchProducts 
        :initial-products="allProducts"
        @filtered="handleFilteredProducts"
        class="!mb-0"
      />
    </div>

    <!-- Categories Navigation -->
    <div class="overflow-y-auto h-[calc(100vh-220px)] custom-scrollbar">
      <nav class="p-4 space-y-6">
        <!-- Featured Categories -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Featured</h3>
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink 
              v-for="category in featuredCategories"
              :key="category.id"
              :to="`/products?category=${category.id}`"
              class="relative group overflow-hidden rounded-lg aspect-square"
              @click="$emit('close')"
            >
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img :src="getCategoryImage(category)" 
                   :alt="category.name.dk"
                   class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span class="absolute bottom-2 left-2 text-white text-sm font-medium z-20">
                {{ category.name.dk }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- All Categories -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Categories</h3>
          <div class="space-y-1">
            <div v-for="category in mainCategories" 
                 :key="category.id"
                 class="space-y-1">
              <!-- Main Category -->
              <button 
                @click="toggleCategory(category.id)"
                class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span class="text-sm font-medium">{{ category.name.dk }}</span>
                <svg 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': expandedCategories.includes(category.id) }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Subcategories -->
              <TransitionSlide>
                <div v-if="expandedCategories.includes(category.id)" class="pl-4 space-y-1">
                  <NuxtLink
                    v-for="subCategory in category.categories"
                    :key="subCategory.id"
                    :to="`/products?category=${subCategory.id}`"
                    class="block p-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    @click="$emit('close')"
                  >
                    {{ subCategory.name.dk }}
                  </NuxtLink>
                </div>
              </TransitionSlide>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Close Button -->
    <button 
      @click="$emit('close')"
      class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { TransitionSlide } from '~/components/transitions';
import data from '@/server/data/data.json';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  allProducts: {
    type: Array,
    required: true
  }
});

defineEmits(['close']);

const expandedCategories = ref([]);
const filteredProducts = ref([]);

// Get main categories (excluding root) with safer data handling
const mainCategories = computed(() => {
  // Check if data and categories exist before accessing
  if (!data?.categories?.categories) {
    return [];
  }
  return data.categories.categories.filter(cat => cat.id !== 'root');
});

// Featured categories (first 4 main categories)
const featuredCategories = computed(() => {
  return mainCategories.value.slice(0, 4);
});

// Toggle category expansion
const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index === -1) {
    expandedCategories.value.push(categoryId);
  } else {
    expandedCategories.value.splice(index, 1);
  }
};

// Handle filtered products from SearchProducts component
const handleFilteredProducts = (products) => {
  filteredProducts.value = products;
};

// Get a random product image for category preview with null checks
const getCategoryImage = (category) => {
  if (!props.allProducts) return '/placeholder-image.jpg';
  
  const categoryProducts = props.allProducts.filter(p => 
    p?.categories?.includes(category.id) && p?.images?.length > 0
  );
  
  if (categoryProducts.length > 0) {
    const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
    return randomProduct.images[0];
  }
  return '/placeholder-image.jpg';
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.gray.300');
  border-radius: 4px;
}

/* Override SearchProducts styles */
:deep(.mb-8) {
  margin-bottom: 0;
}
</style> 