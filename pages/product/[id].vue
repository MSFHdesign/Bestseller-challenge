<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <ProductLoader v-if="isLoading" />
    <ProductError v-else-if="error" :error="error" />

    <div v-else-if="product" class="container mx-auto p-6 pt-32">
      <TransitionFade>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Left Column: Image Gallery -->
          <ProductGallery
            :images="currentVariant?.images || product.images"
            :product-name="product.name?.dk || product.name?.en"
            :on-sale="product.onSale"
          />

          <!-- Right Column: Product Info -->
          <div class="space-y-8">
            <ProductHeader
              :name="product.name"
              :brand="product.brand"
              :price="product.price"
              :original-price="product.originalPrice"
              :on-sale="product.onSale"
            />

            <!-- Variants -->
            <ProductVariants
              v-if="product.variant"
              :variants="product.variant"
              :selected-variant="currentVariant"
              @select-variant="handleVariantSelect"
            />

            <!-- Size Selector -->
            <ProductSizes
              v-if="availableSizes.length"
              :sizes="availableSizes"
              :selected-size="selectedSize"
              :is-size-in-stock="isSizeInStock"
              @select-size="selectedSize = $event"
            />

            <!-- Add to Cart Section -->
            <ProductActions
              :stock="currentVariant?.stock || product.stock"
              :can-add-to-cart="canAddToCart"
              :is-in-wishlist="isInWishlist(product.id)"
              @add-to-cart="handleAddToCart"
              @toggle-wishlist="toggleWishlist(product.id)"
            />

            <!-- Stock Notification -->
            <StockNotification
              v-if="(currentVariant?.stock || product.stock) === 0"
              v-model:email="notificationEmail"
              :status="notificationStatus"
              :is-valid="isValidEmail"
              @submit="handleStockNotification"
            />

            <!-- Product Details -->
            <div class="space-y-6 pt-8 border-t">
              <ProductDetails :product="product" />
              <ProductCategories :product="product" />
            </div>
          </div>
        </div>

        <RelatedProducts 
          v-if="product.categories"
          :current-categories="product.categories"
          :all-products="allProducts"
          class="mt-16"
        />
      </TransitionFade>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useWishlist } from '~/composables/useWishlist';
import { useCart } from '~/composables/useCart';
import { TransitionFade, } from '~/components/transitions';

// Import components using @/ or ~/ for Nuxt path aliases
const ProductGallery = defineAsyncComponent(() => import('@/components/product/ProductGallery.vue'));
const ProductVariants = defineAsyncComponent(() => import('@/components/product/ProductVariants.vue'));
const ProductHeader = defineAsyncComponent(() => import('@/components/product/ProductHeader.vue'));
const ProductSizes = defineAsyncComponent(() => import('@/components/product/ProductSizes.vue'));
const ProductActions = defineAsyncComponent(() => import('@/components/product/ProductActions.vue'));
const ProductDetails = defineAsyncComponent(() => import('@/components/product/ProductDetails.vue'));
const ProductCategories = defineAsyncComponent(() => import('@/components/product/ProductCategories.vue'));
const StockNotification = defineAsyncComponent(() => import('@/components/product/StockNotification.vue'));
const ProductLoader = defineAsyncComponent(() => import('@/components/product/ProductLoader.vue'));
const ProductError = defineAsyncComponent(() => import('@/components/product/ProductError.vue'));

const route = useRoute();
const { isInWishlist, toggleWishlist } = useWishlist();
const { addToCart } = useCart();


// State
const product = ref(null);
const allProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentImageIndex = ref(0);
const selectedSize = ref(null);
const notificationEmail = ref('');
const notificationStatus = ref('');
const currentVariant = ref(null);

// Computed
const currentImage = computed(() => 
  (currentVariant.value?.images?.[currentImageIndex.value]) || 
  product.value?.images[currentImageIndex.value] || ''
);

const availableSizes = computed(() => {
  if (!product.value) return [];
  const sizes = new Set();
  
  if (currentVariant.value) {
    // Use sizes from selected variant
    currentVariant.value.size?.forEach(size => sizes.add(size));
  } else {
    // Add direct sizes from product
    if (product.value.size) {
      product.value.size.forEach(size => sizes.add(size));
    }
    // Add all variant sizes if no variant selected
    if (product.value.variant) {
      product.value.variant.forEach(v => {
        v.size?.forEach(size => sizes.add(size));
      });
    }
  }
  
  // Convert to array and sort
  // Handle both numeric and string sizes
  return Array.from(sizes).sort((a, b) => {
    // If both are numbers or can be converted to numbers
    if (!isNaN(Number(a)) && !isNaN(Number(b))) {
      return Number(a) - Number(b);
    }
    // Otherwise sort as strings
    return String(a).localeCompare(String(b));
  });
});

const getStockStatus = computed(() => {
  if (!product.value) return '';
  if (product.value.stock === 0) return '❌ Ikke på lager';
  if (product.value.stock <= 5) return `⚠️ Kun ${product.value.stock} stk tilbage`;
  return '✅ På lager';
});

const canAddToCart = computed(() => {
  if (!product.value) return false;
  
  // Check if product has sizes (either directly or through variants)
  const hasSizes = product.value.size?.length > 0 || product.value.variant?.some(v => v.size?.length > 0);
  
  // If product has sizes but none selected, disable add to cart
  if (hasSizes && !selectedSize.value) return false;
  
  // Check stock based on variant or main product
  const stockToCheck = currentVariant.value?.stock ?? product.value.stock;
  
  // Handle "Unlimited" stock case (some products have this as a string)
  if (stockToCheck === "Unlimited") return true;
  
  return stockToCheck > 0;
});

const getActionButtonText = computed(() => {
  if (!product.value) return '';
  if (product.value.stock === 0) return '❌ Ikke på lager';
  if (product.value.sizes && !selectedSize.value) return 'Vælg størrelse';
  return '🛒 Læg i kurv';
});

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(notificationEmail.value);
});

// Methods
const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const response = await fetch('/api/products');
    const data = await response.json();
    
    if (data && data.products) {
      allProducts.value = data.products;
      const foundProduct = data.products.find(p => String(p.id) === String(route.params.id));
      
      if (foundProduct) {
        // Ensure categories exist
        product.value = {
          ...foundProduct,
          categories: foundProduct.categories || ['clothes'] // Provide default category if none exists
        };
      } else {
        error.value = 'Produktet blev ikke fundet';
      }
    }
  } catch (err) {
    error.value = 'Der opstod en fejl ved indlæsning af produktet';
    console.error('Error fetching product:', err);
  } finally {
    isLoading.value = false;
  }
};

const isSizeInStock = (size) => {
  if (!product.value) return false;
  
  // If we have a selected variant, check only that variant's stock and sizes
  if (currentVariant.value) {
    return currentVariant.value.stock > 0 && currentVariant.value.size?.includes(size);
  }
  
  // Check direct product stock and sizes
  if (product.value.size && product.value.stock > 0) {
    // Handle "Unlimited" stock case
    if (product.value.stock === "Unlimited" || typeof product.value.stock === 'string') {
      return product.value.size.includes(size);
    }
    return product.value.size.includes(size);
  }
  
  // Check variant stock
  if (product.value.variant) {
    return product.value.variant.some(v => 
      v.size?.includes(size) && (v.stock === "Unlimited" || v.stock > 0)
    );
  }
  
  return false;
};

const handleVariantSelect = (variant) => {
  currentVariant.value = variant;
  currentImageIndex.value = 0; // Reset image index when changing variant
  selectedSize.value = null; // Reset size selection
};

const handleAddToCart = () => {
  if (!canAddToCart.value) return;
  
  // Determine which stock value to use
  const stockToUse = currentVariant.value?.stock ?? product.value.stock;
  
  const productToAdd = {
    ...product.value,
    selectedSize: selectedSize.value,
    selectedVariant: currentVariant.value,
    quantity: 1,
    // Ensure stock is properly passed to cart
    stock: stockToUse
  };
  
  console.log('Adding to cart with size:', selectedSize.value); // Debug log
  addToCart(productToAdd);
  
  
};

const handleStockNotification = async () => {
  if (!isValidEmail.value) return;
  
  try {
    notificationStatus.value = 'Sender...';
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    notificationStatus.value = '✅ Tilmeldt';
    
    setTimeout(() => {
      notificationStatus.value = '';
      notificationEmail.value = '';
    }, 2000);
  } catch (err) {
    notificationStatus.value = '❌ Fejl';
    console.error('Error subscribing to stock notification:', err);
  }
};

// Lifecycle
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.scale-102 {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
}

/* Custom scrollbar for thumbnail gallery */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
