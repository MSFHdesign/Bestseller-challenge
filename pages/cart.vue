<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6 pt-32">
      <!-- Cart Header -->
      <CartHeader 
        :item-count="cart.length"
        @continue-shopping="navigateTo('/products')"
      />

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Cart Content -->
        <div class="lg:col-span-2">
          <CartEmpty 
            v-if="!cart.length"
            @continue-shopping="navigateTo('/products')"
          />
          
          <div v-else class="space-y-4">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="bg-white rounded-lg border p-4 flex gap-4"
            >
              <!-- Product Image -->
              <NuxtLink :to="`/product/${item.id}`" class="w-24 h-32 flex-shrink-0">
                <img 
                  :src="item.images[0]" 
                  :alt="item.name.dk"
                  class="w-full h-full object-cover rounded-md"
                />
              </NuxtLink>

              <!-- Product Info -->
              <div class="flex-1 flex flex-col">
                <div class="flex justify-between">
                  <div>
                    <h3 class="font-medium">
                      {{ item.name.dk }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ item.brand }}</p>
                  </div>
                  <p class="font-medium">
                    {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>

                <!-- Variant & Size Info -->
                <div class="mt-2 text-sm text-gray-500">
                  <p v-if="item.selectedVariant">
                    Farve: {{ item.selectedVariant.color }}
                  </p>
                  <p v-if="item.selectedSize">
                    Størrelse: {{ item.selectedSize }}
                  </p>
                </div>

                <!-- Quantity Controls -->
                <div class="mt-auto flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="updateQuantity(item, -1)"
                      :disabled="item.quantity <= 1"
                      class="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span class="w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item, 1)"
                      :disabled="!isInStock(item)"
                      class="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    @click="removeFromCart(item)"
                    class="text-red-500 hover:text-red-600"
                  >
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
            @apply-coupon="applyCoupon"
            @checkout="handleCheckout"
          />
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length" class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Du vil måske også kunne lide</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in relatedProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCart } from '~/composables/useCart';
import { useProducts } from '~/composables/useProducts';
import { useToast } from '~/composables/useToast';

const { cart, removeFromCart, updateQuantity } = useCart();
const { products } = useProducts();
const toast = useToast();

// Constants
const SHIPPING_THRESHOLD = 500;
const BASE_SHIPPING = 49;

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
  return totalItems >= 3 ? subtotal.value * 0.1 : 0;
});

const total = computed(() => 
  subtotal.value + shipping.value - discount.value
);

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

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);
};

const isInStock = (item) => {
  if (item.selectedVariant) {
    return item.selectedVariant.stock > item.quantity;
  }
  return item.stock > item.quantity;
};

const applyCoupon = async (code) => {
  try {
    if (code === 'SUMMER10') {
      toast.addToast('Rabatkode anvendt!', 'success');
    } else {
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
</script>
