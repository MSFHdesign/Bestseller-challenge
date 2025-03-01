<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Din Kurv</h2>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Luk kurv"
        >
          <span class="sr-only">Luk</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <p class="text-sm text-gray-500 mt-1">{{ itemCount }} {{ itemCount === 1 ? 'vare' : 'varer' }}</p>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <TransitionGroup 
        name="list" 
        tag="div" 
        class="space-y-6"
      >
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="group relative flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
        >
          <!-- Product Image -->
          <div class="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              :src="item.images[0]" 
              :alt="item.name.dk"
              class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            <div 
              v-if="item.selectedVariant"
              class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
              :style="{ backgroundColor: item.selectedVariant.color }"
            />
          </div>

          <!-- Product Info -->
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between">
              <div>
                <h3 class="font-medium text-gray-900 group-hover:text-black transition-colors">
                  {{ item.name.dk }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ item.brand }}
                </p>
              </div>
              <p class="font-medium">
                {{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>

            <!-- Variant & Size -->
            <div class="mt-2 text-sm text-gray-500">
              <p v-if="item.selectedVariant" class="flex items-center gap-1">
                <span>Farve:</span> 
                <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: item.selectedVariant.color }"></span>
                <span>{{ item.selectedVariant.color }}</span>
              </p>
              <p v-if="item.selectedSize">
                Størrelse: <span class="font-medium">{{ item.selectedSize }}</span>
              </p>
              <p v-else-if="!item.size || item.size.length === 0">
                <span class="font-medium">One Size</span>
              </p>
            </div>

            <!-- Quantity Controls -->
            <div class="mt-4 flex items-center gap-2">
              <div class="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button 
                  @click="updateQuantity(item, -1)"
                  :disabled="item.quantity <= 1"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  aria-label="Reducer antal"
                >
                  −
                </button>
                <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                <button 
                  @click="updateQuantity(item, 1)"
                  :disabled="!isInStock(item)"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  aria-label="Forøg antal"
                >
                  +
                </button>
              </div>
              <span v-if="!isInStock(item) && item.quantity > 0" class="text-xs text-amber-600">
                Max antal på lager
              </span>
            </div>
          </div>

          <!-- Remove Button -->
          <button 
            @click="removeItem(item)"
            class="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg 
              opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label="Fjern produkt"
          >
            <span class="sr-only">Fjern</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div 
        v-if="cartItems.length === 0" 
        class="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div class="text-gray-300 text-6xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900">Din kurv er tom</h3>
        <p class="mt-2 text-gray-500 max-w-xs mx-auto">
          Udforsk vores produkter og find noget du elsker
        </p>
        <button 
          @click="$emit('close')"
          class="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 
            transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Se Produkter
        </button>
      </div>
    </div>

    <!-- Footer with Summary -->
    <div 
      v-if="cartItems.length > 0"
      class="border-t bg-gray-50 p-6 space-y-4"
    >
      <!-- Summary -->
      <div class="space-y-3">
        <div class="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Levering</span>
          <span v-if="shipping === 0" class="text-green-600 font-medium">Gratis</span>
          <span v-else>{{ formatPrice(shipping) }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-green-600">
          <span>Rabat</span>
          <span>-{{ formatPrice(discount) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-3 border-t">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>

      <!-- Free Shipping Progress -->
      <div 
        v-if="freeShippingThreshold > subtotal"
        class="bg-gray-100 p-4 rounded-lg border border-gray-200"
      >
        <div class="flex justify-between text-sm mb-2">
          <span class="font-medium">Fri fragt ved</span>
          <span>{{ formatPrice(freeShippingThreshold) }}</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-green-500 transition-all duration-500 ease-out"
            :style="{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }"
          />
        </div>
        <p class="text-sm text-gray-600 mt-2 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Tilføj <span class="font-medium">{{ formatPrice(freeShippingThreshold - subtotal) }}</span> mere for fri fragt</span>
        </p>
      </div>

      <!-- Checkout Button -->
      <button 
        @click="checkout"
        class="w-full py-4 bg-black text-white rounded-full hover:bg-gray-800 
          transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
          flex items-center justify-center gap-2 font-medium"
      >
        <span>Gå til checkout</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useToast } from '~/composables/useToast';

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'update:cartItems']);
const toast = useToast();

// Constants
const freeShippingThreshold = 500;
const baseShipping = 49;

// Computed
const itemCount = computed(() => 
  props.cartItems.reduce((sum, item) => sum + item.quantity, 0)
);

const subtotal = computed(() => 
  props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
);

const shipping = computed(() => 
  subtotal.value >= freeShippingThreshold ? 0 : baseShipping
);

const discount = computed(() => {
  // Example: 10% off when buying 3 or more items
  if (itemCount.value >= 3) {
    return subtotal.value * 0.1;
  }
  return 0;
});

const total = computed(() => 
  subtotal.value + shipping.value - discount.value
);

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);
};

const updateQuantity = (item, change) => {
  const updatedItems = props.cartItems.map(cartItem => {
    if (cartItem.id === item.id) {
      const newQuantity = cartItem.quantity + change;
      
      // Check if we're decreasing quantity or if there's enough stock
      if (change < 0 && newQuantity > 0) {
        return { ...cartItem, quantity: newQuantity };
      } else if (change > 0 && isInStock({ ...cartItem, quantity: newQuantity })) {
        return { ...cartItem, quantity: newQuantity };
      }
    }
    return cartItem;
  });
  
  emit('update:cartItems', updatedItems);
};

const removeItem = (item) => {
  const updatedItems = props.cartItems.filter(cartItem => cartItem.id !== item.id);
  emit('update:cartItems', updatedItems);
  
  toast.addToast('Produkt fjernet fra kurv', 'info', 3000, {
    label: 'Fortryd',
    onClick: () => {
      emit('update:cartItems', [...updatedItems, item]);
    }
  });
};

const isInStock = (item) => {
  // Check if variant is selected and has stock
  if (item.selectedVariant) {
    return item.selectedVariant.stock > item.quantity;
  }
  // Otherwise check main product stock
  return item.stock > item.quantity;
};

const checkout = () => {
  // Implement checkout logic
  navigateTo('/checkout');
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}
</style> 