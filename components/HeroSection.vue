<template>
  <div class="relative overflow-hidden bg-gray-50">
    <div class="relative pt-16 pb-20">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 pattern-background"></div>
      </div>

      <div class="relative container mx-auto px-6">
        <!-- Main Content -->
        <div class="space-y-12">
          <!-- Header Section -->
          <div class="max-w-2xl">
            <h1 class="text-5xl font-bold tracking-tight">
              Discover Your Style
              <span class="block text-3xl mt-2 text-gray-600">Shop the Latest Trends</span>
            </h1>
            <p class="text-lg text-gray-600 mt-6">
              Explore our curated collection of fashion essentials. From casual comfort to elegant statements, find pieces that express your unique style.
            </p>
          </div>

          <!-- Category Links -->
          <div class="grid grid-cols-4 gap-6">
            <NuxtLink 
              v-for="category in featuredCategories" 
              :key="category.id"
              :to="`/products?category=${category.id}`"
              class="group relative overflow-hidden rounded-xl aspect-[4/5]"
            >
              <img 
                :src="category.image" 
                :alt="category.name"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 
                  group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4">
                <h3 class="text-white text-lg font-semibold mb-2">{{ category.name }}</h3>
                <span class="inline-flex items-center text-sm text-white/90">
                  Shop Now <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Promo Section -->
          <section class="relative w-full">
            <div v-if="mainPromo?.link" class="w-full">
              <ProductPromo :promo="mainPromo" />
            </div>
            <div v-else class="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl"></div>
          </section>

          <!-- Action Buttons -->
          <div class="flex gap-4 justify-center">
            <NuxtLink 
              to="/products?category=newin" 
              class="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 
                transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Shop New Arrivals
            </NuxtLink>
            <NuxtLink 
              to="/products?category=sales" 
              class="bg-red-500 text-white px-8 py-3 rounded-full font-medium hover:bg-red-600 
                transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View Sales
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import data from '@/server/data/data.json';
import { useProducts } from '~/composables/useProducts';

// Helper function to get a random product image from a category
const getRandomImageFromCategory = (categoryId) => {
  const categoryProducts = data.products.filter(p => p.categories?.includes(categoryId));
  if (categoryProducts.length > 0) {
    const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
    return randomProduct.images[0];
  }
  return '';
};

const { promotionalSpots } = useProducts();

const mainPromo = computed(() => {
  return promotionalSpots.value?.find(p => p.type === '2x2') || null;
});

const featuredCategories = [
  {
    id: 'women_clothes',
    name: 'Kvinder Tøj',
    image: getRandomImageFromCategory('women_clothes')
  },
  {
    id: 'men_clothes',
    name: 'Mænd Tøj',
    image: getRandomImageFromCategory('men_clothes')
  },
  {
    id: 'accessories',
    name: 'Tilbehør',
    // Get a random product that's not already used
    image: data.products
      .filter(p => p.images?.length > 0)
      .sort(() => Math.random() - 0.5)[0]?.images[0] || ''
  },
  {
    id: 'newin',
    name: 'Nyheder',
    // Get the newest product (assuming first in array is newest)
    image: data.products
      .filter(p => p.images?.length > 0 && !p.categories?.includes('women_clothes') && !p.categories?.includes('men_clothes'))
      [0]?.images[0] || data.products[0]?.images[0] || ''
  }
];
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.pattern-background {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

/* Add loading skeleton animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #f3f4f6;
}
</style> 