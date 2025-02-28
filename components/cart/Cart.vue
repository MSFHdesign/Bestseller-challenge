<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold">Din Kurv</h2>
        <button 
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <span class="sr-only">Luk</span>
          ✕
        </button>
      </div>
      <p class="text-sm text-gray-500 mt-1">{{ itemCount }} varer</p>
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
          class="group relative flex gap-4 p-4 bg-white rounded-lg border hover:border-gray-300 transition-colors"
        >
          <!-- Product Image -->
          <div class="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              :src="item.images[0]" 
              :alt="item.name.dk"
              class="h-full w-full object-cover object-center"
            />
            <div 
              v-if="item.selectedVariant"
              class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
              :style="{ backgroundColor: item.selectedVariant.color }"
            />
          </div>

          <!-- Product Info -->
          <div class="flex-1 flex flex-col">
            <div class="flex justify-between">
              <div>
                <h3 class="font-medium text-gray-900">
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
              <p v-if="item.selectedVariant">
                Farve: {{ item.selectedVariant.color }}
              </p>
              <p v-if="item.selectedSize">
                Størrelse: {{ item.selectedSize }}
              </p>
            </div>

            <!-- Quantity Controls -->
            <div class="mt-4 flex items-center gap-2">
              <button 
                @click="updateQuantity(item, -1)"
                :disabled="item.quantity <= 1"
                class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item, 1)"
                :disabled="!isInStock(item)"
                class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          <!-- Remove Button -->
          <button 
            @click="removeItem(item)"
            class="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg 
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
          >
            <span class="sr-only">Fjern</span>
            🗑️
          </button>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div 
        v-if="cartItems.length === 0" 
        class="text-center py-12"
      >
        <div class="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 class="text-lg font-medium text-gray-900">Din kurv er tom</h3>
        <p class="mt-2 text-gray-500">
          Udforsk vores produkter og find noget du elsker
        </p>
        <button 
          @click="$emit('close')"
          class="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 
            transition-colors duration-200"
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
      <div class="space-y-2">
        <div class="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Levering</span>
          <span>{{ shipping === 0 ? 'Gratis' : formatPrice(shipping) }}</span>
        </div>
        <div v-if="discount > 0" class="flex justify-between text-green-600">
          <span>Rabat</span>
          <span>-{{ formatPrice(discount) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>

      <!-- Free Shipping Progress -->
      <div 
        v-if="freeShippingThreshold > subtotal"
        class="bg-gray-100 p-4 rounded-lg"
      >
        <div class="flex justify-between text-sm mb-2">
          <span>Fri fragt ved</span>
          <span>{{ formatPrice(freeShippingThreshold) }}</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-green-500 transition-all duration-500"
            :style="{ width: `${(subtotal / freeShippingThreshold) * 100}%` }"
          />
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Tilføj {{ formatPrice(freeShippingThreshold - subtotal) }} mere for fri fragt
        </p>
      </div>

      <!-- Checkout Button -->
      <button 
        @click="checkout"
        class="w-full py-4 bg-black text-white rounded-full hover:bg-gray-800 
          transition-colors duration-200 flex items-center justify-center gap-2"
      >
        Gå til checkout
        <span>→</span>
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
      if (newQuantity > 0 && isInStock(item)) {
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