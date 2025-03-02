<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto p-6 pt-32 max-w-6xl">
      <!-- Cart Header -->
      <CartHeader 
        :item-count="cart.length"
        @continue-shopping="navigateTo('/products')"
        class="animate-fade-in"
      />

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Cart Content -->
        <div class="lg:col-span-2">
          <CartEmpty 
            v-if="!cart.length"
            @continue-shopping="navigateTo('/products')"
            class="animate-fade-in"
          />
          
          <div v-else class="space-y-6">
            <div 
              v-for="(item, index) in cart" 
              :key="item.id"
              class="bg-white rounded-xl border border-gray-100 p-5 flex gap-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :class="['animate-slide-in-right']"
            >
              <!-- Product Image -->
              <NuxtLink :to="`/product/${item.id}`" class="w-28 h-36 flex-shrink-0 overflow-hidden rounded-lg group">
                <img 
                  :src="item.images[0]" 
                  :alt="item.name.dk"
                  class="w-full h-full object-cover rounded-lg transform transition-transform duration-500 group-hover:scale-110"
                />
              </NuxtLink>

              <!-- Product Info -->
              <div class="flex-1 flex flex-col">
                <div class="flex justify-between">
                  <div>
                    <h3 class="font-medium text-lg">
                      {{ item.name.dk }}
                    </h3>
                  </div>
                  <p class="font-semibold text-lg">
                    {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>

                <!-- Brand, Size & Color Info -->
                <div class="mt-2 text-sm text-gray-600 space-y-1.5">
                  <p class="font-medium text-gray-600">{{ item.brand }}</p>
                  
                  <div style="min-height: 24px;" class="flex items-center">
                    <p v-if="item.selectedSize">
                      <span class="text-gray-500">Størrelse:</span> <span class="font-medium ml-1">{{ item.selectedSize }}</span>
                    </p>
                    <p v-else-if="!item.size || item.size.length === 0">
                      <span class="text-gray-500">Størrelse:</span> <span class="font-medium ml-1">One Size</span>
                    </p>
                  </div>
                  
                  <div style="min-height: 24px;" class="flex items-center">
                    <p v-if="item.selectedVariant" class="flex items-center gap-2">
                      <span class="text-gray-500">Farve:</span>
                      <span class="inline-block w-4 h-4 rounded-full border border-gray-200 shadow-sm" :style="{ backgroundColor: item.selectedVariant.color }"></span>
                      <span class="font-medium">{{ item.selectedVariant.color }}</span>
                    </p>
                  </div>
                </div>

                <!-- Quantity Controls -->
                <div class="mt-auto flex items-center justify-between pt-3">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <button 
                        @click="updateQuantity(item, -1)"
                        :disabled="item.quantity <= 1"
                        class="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none active:bg-gray-200"
                        aria-label="Reducer antal"
                      >
                        −
                      </button>
                      <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                      <button 
                        @click="updateQuantity(item, 1)"
                        :disabled="!isInStock(item)"
                        class="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none active:bg-gray-200"
                        aria-label="Forøg antal"
                      >
                        +
                      </button>
                    </div>
                    <span v-if="!isInStock(item) && item.quantity > 0" class="text-xs text-amber-600 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Max antal på lager
                    </span>
                  </div>
                  <button 
                    @click="removeItem(item, index)"
                    class="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Fjern
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <CartSummary
            v-if="cart.length"
            :subtotal="subtotal"
            :shipping="shipping"
            :discount="discount"
            :total="total"
            :apply-coupon="applyCoupon"
            @checkout="handleCheckout"
            class="animate-fade-in sticky top-32"
          />
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length" class="mt-20 mb-12 animate-fade-in">
        <h2 class="text-2xl font-bold mb-8 text-center">Du vil måske også kunne lide</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard 
            v-for="(product, index) in relatedProducts" 
            :key="product.id" 
            :product="product"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="animate-slide-in-up"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCart } from '~/composables/useCart';
import { useProducts } from '~/composables/useProducts';
import { useToast } from '~/composables/useToast';

const { cart, removeItem: originalRemoveItem } = useCart();
const { products } = useProducts();
const toast = useToast();

// Constants
const SHIPPING_THRESHOLD = 500;
const BASE_SHIPPING = 49;

// Add a ref to track the coupon discount
const couponDiscount = ref(0);

// Computed
const subtotal = computed(() => 
  cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
);

const shipping = computed(() => 
  subtotal.value >= SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING
);

const discount = computed(() => {
  // 10% off when buying 3 or more items
  const totalItems = cart.value.reduce((sum, item) => sum + item.quantity, 0);
  const quantityDiscount = totalItems >= 3 ? subtotal.value * 0.1 : 0;
  
  // Add the coupon discount to the quantity discount
  return quantityDiscount + couponDiscount.value;
});

const total = computed(() => 
  subtotal.value + shipping.value - discount.value
);

// Custom updateQuantity function for the cart page
const updateQuantity = (item, change) => {
  const index = cart.value.findIndex(cartItem => cartItem.id === item.id);
  if (index !== -1) {
    const newQuantity = cart.value[index].quantity + change;
    if (newQuantity > 0 && (change < 0 || isInStock(item, newQuantity))) {
      // Create a new cart array with the updated item
      const updatedCart = [...cart.value];
      updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
      cart.value = updatedCart;
      
      // Show toast notification
      if (change > 0) {
        toast.addToast('Antal opdateret', 'success');
      }
    }
  }
};

// Check if item is in stock with the new quantity
const isInStock = (item, newQuantity = item.quantity + 1) => {
  if (item.selectedVariant) {
    return item.selectedVariant.stock >= newQuantity;
  }
  return item.stock >= newQuantity;
};

const relatedProducts = computed(() => {
  if (!cart.value.length) return [];
  
  const categories = new Set(
    cart.value.flatMap(item => item.categories || [])
  );
  
  return products.value
    .filter(p => 
      !cart.value.find(item => item.id === p.id) && 
      p.categories?.some(c => categories.has(c))
    )
    .slice(0, 4);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);
};

const applyCoupon = async (code) => {
  try {
    if (code === 'SUMMER10') {
      // Apply a 10% discount
      couponDiscount.value = subtotal.value * 0.1;
      toast.addToast('Rabatkode anvendt!', 'success');
    } else {
      // Reset coupon discount if invalid code
      couponDiscount.value = 0;
      toast.addToast('Ugyldig rabatkode', 'error');
    }
  } catch (error) {
    toast.addToast('Der opstod en fejl', 'error');
  }
};

const handleCheckout = () => {
  if (cart.value.length === 0) {
    toast.addToast('Din kurv er tom', 'error');
    return;
  }
  navigateTo('/checkout');
};

// Override the removeItem function to use the index directly
const removeItem = (item, index) => {
  // Create a new cart array without the item at the specified index
  const updatedCart = [...cart.value];
  updatedCart.splice(index, 1);
  cart.value = updatedCart;
  
  // Show toast notification
  toast.addToast('Vare fjernet fra kurven', 'success');
};

onMounted(() => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out forwards;
}

.animate-slide-in-up {
  animation: slideInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { 
    opacity: 0;
    transform: translateX(-20px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
