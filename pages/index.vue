<template>
  <div>
    <div v-if="loading" class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="h-[400px] bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    </div>
    
    <div v-else class="container mx-auto px-6 py-16 space-y-24">
      <!-- Hero Section -->
      <HeroSection />

      <!-- Main Content -->
      <div class="container mx-auto px-6 py-16 space-y-24">
        <!-- Women's Section -->
        <section class="space-y-8">
          <div class="flex justify-between items-center">
            <h2 class="text-3xl font-bold">Kvinder</h2>
            <NuxtLink 
              to="/products?category=women_clothes" 
              class="text-sm font-medium hover:underline"
            >
              Se alle →
            </NuxtLink>
          </div>
          
          <ProductCarousel 
            :products="womenProducts" 
            category="women_clothes"
          />
        </section>

        <!-- Main Promo (2x2) -->
        <section v-if="mainPromo" class="w-full">
          <ProductPromo :promo="mainPromo" />
        </section>

        <!-- Men's Section -->
        <section class="space-y-8">
          <div class="flex justify-between items-center">
            <h2 class="text-3xl font-bold">Mænd</h2>
            <NuxtLink 
              to="/products?category=men_clothes" 
              class="text-sm font-medium hover:underline"
            >
              Se alle →
            </NuxtLink>
          </div>
          
          <ProductCarousel 
            :products="menProducts" 
            category="men_clothes"
          />
        </section>

   

      
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useProducts } from '~/composables/useProducts';
import ProductPromo from '~/components/ProductPromo.vue';
import ProductCard from '~/components/ProductCard.vue';

const { products, promotionalSpots, loading } = useProducts();

// Mix products and promos in a smart way
const mixedContent = computed(() => {
  const mixed = [];
  let productIndex = 0;

  if (promotionalSpots.value) {
    promotionalSpots.value.forEach(promo => {
      // Add products until we reach the promo position
      while (productIndex < promo.position && productIndex < products.value?.length) {
        mixed.push({ ...products.value[productIndex], type: 'product' });
        productIndex++;
      }
      // Add the promo
      mixed.push({ ...promo, type: promo.type || '1x1' });
    });
  }

  // Add remaining products
  if (products.value) {
    while (productIndex < products.value.length) {
      mixed.push({ ...products.value[productIndex], type: 'product' });
      productIndex++;
    }
  }

  return mixed;
});

// Get promotions for different sections
const mainPromo = computed(() => 
  promotionalSpots.value?.find(p => p.type === '2x2')
);

const otherPromos = computed(() => 
  promotionalSpots.value
    ?.filter(p => p.type !== '2x2')
    ?.sort((a, b) => a.position - b.position) || []
);

// Filter products by category
const womenProducts = computed(() => 
  products.value
    ?.filter(p => p.categories?.includes('women_clothes'))
    ?.slice(0, 8) || []
);

const menProducts = computed(() => 
  products.value
    ?.filter(p => p.categories?.includes('men_clothes'))
    ?.slice(0, 8) || []
);
</script>

<style scoped>
/* Tilføj spacing mellem navbar og indhold */
.pt-32 {
  padding-top: 8rem;
}

/* Grid-container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Standard Produktkort */
.product-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-light);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  min-height: 400px;
}

/* Promotion Styles */
.promo-1x1 {
  grid-column: span 1;
  grid-row: span 1;
  min-height: 400px;
}

.promo-2x1 {
  grid-column: span 2;
  grid-row: span 1;
  min-height: 400px;
}

.promo-2x2 {
  grid-column: span 2;
  grid-row: span 2;
  min-height: 800px;
}

/* Ensartet størrelse på alle produkter */
.product-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

/* Also add this style for promotion images */
.promo-1x1 img,
.promo-2x1 img,
.promo-2x2 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Light & Dark Mode Support */
.text-gray-900 {
  color: var(--color-text-light);
}

.dark .text-gray-100 {
  color: var(--color-text-dark);
}
</style>
