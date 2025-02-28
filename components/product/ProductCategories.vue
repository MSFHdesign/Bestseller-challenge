<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Kategorier</h3>
    <div class="flex flex-wrap gap-2">
      <NuxtLink 
        v-for="category in formattedCategories" 
        :key="category.id"
        :to="`/products?category=${category.id}`"
        class="group relative px-4 py-2 bg-gray-100 hover:bg-gray-200 
          rounded-full text-sm text-gray-600 transition-all duration-200
          hover:scale-105 hover:shadow-sm"
      >
        {{ category.name }}
        <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
          flex items-center justify-center bg-black/5 rounded-full">
          Se alle →
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: { type: Object, required: true }
});

// Category name mappings
const categoryNames = {
  'women': 'Kvinder',
  'men': 'Mænd',
  'kids': 'Børn',
  'adults': 'Voksne',
  'clothes': 'Tøj',
  'accessories': 'Tilbehør',
  'shoes': 'Sko',
  'sales': 'Udsalg',
  'newin': 'Nyheder',
  'trend': 'Trending',
  'inspiration': 'Inspiration',
  'last_week_sales': 'Sidste Uges Tilbud'
};

const formattedCategories = computed(() => {
  if (!props.product.categories) return [];
  
  return props.product.categories.map(category => {
    const parts = category.split('_');
    const id = category;
    
    // Handle special cases first
    if (category === 'last_week_sales') {
      return { id, name: 'Sidste Uges Tilbud' };
    }
    
    // Build the name from parts
    const name = parts
      .map(part => categoryNames[part] || part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    
    return { id, name };
  }).sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<style scoped>
.group:hover .absolute {
  backdrop-filter: blur(2px);
}
</style> 