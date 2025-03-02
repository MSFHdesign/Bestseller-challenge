<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="$emit('close')"
    ></div>

    <!-- Cart Drawer -->
    <div 
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Cart Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Din indkøbskurv ({{ cartItems.length }})</h2>
          <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Cart Content -->
        <div class="flex-grow overflow-y-auto p-4">
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <p class="text-gray-500">Din indkøbskurv er tom</p>
            <button 
              @click="$emit('close')" 
              class="mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Forsæt med at handle
            </button>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(item, index) in cartItems.slice(0, 3)" :key="item.id" class="flex items-center gap-3 py-3">
              <img :src="item.images[0]" :alt="item.name" class="w-12 h-16 object-cover rounded">
              <div class="flex-grow">
                <h3 class="font-medium">{{ item.name.dk || item.name.en }}</h3>
                <p v-if="item.selectedSize" class="text-sm text-gray-500">
                  Størrelse: {{ item.selectedSize }}
                </p>
                <p v-else-if="!item.size || item.size.length === 0" class="text-sm text-gray-500">
                  One Size
                </p>
                <div class="flex items-center justify-between mt-1">
                  <div class="flex items-center gap-2">
                    <button @click="$emit('decrease-quantity', index)" class="text-gray-400 hover:text-gray-600">-</button>
                    <span class="text-sm">{{ item.quantity || 1 }}</span>
                    <button @click="$emit('increase-quantity', index)" class="text-gray-400 hover:text-gray-600">+</button>
                  </div>
                  <span class="text-sm font-medium">{{ item.price }} kr.</span>
                </div>
              </div>
              <button @click="$emit('remove-from-cart', index)" class="text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Cart Footer -->
        <div v-if="cartItems.length > 0" class="border-t p-4">
          <div class="flex justify-between mb-4">
            <span>Total</span>
            <span class="font-semibold">{{ formatPrice(cartTotal) }}</span>
          </div>
          <button 
            @click="$emit('navigate-to-cart')"
            class="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Gå til kassen
          </button>
          <button 
            @click="$emit('close')" 
            class="w-full py-2 mt-2 text-gray-700 hover:text-black transition-colors"
          >
            Forsæt med at handle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  cartItems: {
    type: Array,
    required: true
  },
  cartTotal: {
    type: Number,
    required: true
  }
});

defineEmits(['close', 'increase-quantity', 'decrease-quantity', 'remove-from-cart', 'navigate-to-cart']);

// Format price
const formatPrice = (price) => {
  return `${price.toFixed(2)} kr`;
};
</script> 