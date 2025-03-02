<template>
  <div class="relative overflow-hidden bg-gray-50">
    <div class="relative pt-8 pb-12 sm:pt-16 sm:pb-20">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 pattern-background"></div>
      </div>

      <div class="relative container mx-auto px-4 sm:px-6">
        <!-- Main Content -->
        <div class="space-y-8 sm:space-y-12">
          <!-- Header Section -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Opdag Din Stil
              <span class="block text-xl sm:text-2xl md:text-3xl mt-2 text-gray-600">Udforsk De Nyeste Trends</span>
            </h1>
            <p class="text-base sm:text-lg text-gray-600 mt-4 sm:mt-6">
              Udforsk vores håndplukkede kollektion af modeessentials. Fra afslappet komfort til elegante statements - find tøj, der udtrykker din unikke stil.
            </p>
          </div>

          <!-- Category Grid Component -->
          <CategoryGrid 
            :categories="featuredCategories"
            shopNowText="Shop nu"
          />

          <!-- Promo Section -->
          <PromoSection 
            :promo="mainPromo"
            :tagline="mainPromo?.tagline"
            :title="mainPromo?.title || mainPromo?._alias"
            :description="mainPromo?.description"
            :ctaText="mainPromo?.ctaText"
            :feature1Title="mainPromo?.feature1Title"
            :feature1Text="mainPromo?.feature1Text"
            :feature2Title="mainPromo?.feature2Title"
            :feature2Text="mainPromo?.feature2Text"
          />

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <NuxtLink 
              to="/products?category=adult" 
              class="bg-black text-white px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-gray-800 
                transition-all duration-300 hover:scale-105 hover:shadow-lg text-center"
            >
              Se Nyheder
            </NuxtLink>
            <NuxtLink 
              to="/products?category=adult" 
              class="bg-red-500 text-white px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-red-600 
                transition-all duration-300 hover:scale-105 hover:shadow-lg text-center"
            >
              Se Tilbud
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
import { computed } from 'vue';

/**
 * Helper function to get a random product image from a category
 * @param {string} categoryId - The category ID to find products from
 * @returns {string} - URL of a random product image or empty string if none found
 */
const getRandomImageFromCategory = (categoryId) => {
  const categoryProducts = data.products.filter(p => p.categories?.includes(categoryId));
  if (categoryProducts.length > 0) {
    const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
    return randomProduct.images[0];
  }
  return '';
};

const { promotionalSpots } = useProducts();

/**
 * Main promotional spot for the 2x2 grid layout
 * Finds a promotional spot with type '2x2' from the available promotional spots
 */
const mainPromo = computed(() => {
  return promotionalSpots.value?.find(p => p.type === '2x2') || null;
});

/**
 * Featured categories displayed in the category grid
 * Each category includes:
 * - id: Unique identifier for the category
 * - name: Display name in Danish
 * - image: Random product image from the category
 */
const featuredCategories = [
  {
    id: 'women_clothes',
    name: 'Kvinder',
    image: getRandomImageFromCategory('women_clothes')
  },
  {
    id: 'men_clothes',
    name: 'Mænd',
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