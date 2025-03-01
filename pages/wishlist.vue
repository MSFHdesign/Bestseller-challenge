<template>
  <div class="min-h-screen bg-gray-50 pt-32 pb-16">
    <div class="container mx-auto px-6">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Min Ønskeliste</h1>
        <p class="text-gray-600 mt-2">Gem dine favoritter til senere</p>
      </div>

      <!-- Wishlist Content -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Indlæser ønskeliste...</p>
      </div>

      <div v-else-if="wishlistProducts.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="text-gray-300 text-6xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900">Din ønskeliste er tom</h3>
        <p class="mt-2 text-gray-500 max-w-md mx-auto">
          Udforsk vores produkter og tilføj dine favoritter til din ønskeliste
        </p>
        <NuxtLink 
          to="/products"
          class="mt-6 inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 
            transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Se Produkter
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in wishlistProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useWishlist } from '~/composables/useWishlist';
import { useToast } from '~/composables/useToast';

const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
const { addToast } = useToast();

const allProducts = ref([]);
const loading = ref(true);

// Get products that are in the wishlist
const wishlistProducts = computed(() => {
  return allProducts.value.filter(product => isInWishlist(product.id));
});

// Fetch all products
const fetchProducts = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/products');
    const data = await response.json();
    
    if (data && data.products) {
      allProducts.value = data.products;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    addToast('Der opstod en fejl ved indlæsning af produkter', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
