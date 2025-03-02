<template>
  <div class="bg-white rounded-lg border p-6 space-y-6 sticky top-8">
    <h2 class="text-lg font-semibold">Ordreoversigt</h2>
    
    <!-- Price Details -->

    
    <div class="space-y-4 text-sm">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      
      <div class="flex justify-between text-gray-500">
        <span>Fragt</span>
        <span>{{ shipping === 0 ? 'Gratis' : formatPrice(shipping) }}</span>
      </div>
      
      <div v-if="discount" class="flex justify-between text-green-600">
        <span>Rabat</span>
        <span>-{{ formatPrice(discount) }}</span>
      </div>
      
      <div class="pt-4 border-t flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
    
    <!-- Free Shipping Progress -->
    <div v-if="subtotal < freeShippingThreshold" class="bg-gray-100 p-4 rounded-lg border border-gray-200">
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
        <span>Køb for <span class="font-medium">{{ formatPrice(freeShippingThreshold - subtotal) }}</span> mere og få fri fragt</span>
      </p>
    </div>
    
    <!-- Coupon Code -->
    <div class="space-y-2">
      <input
        v-model="couponCode"
        type="text"
        placeholder="Rabatkode"
        class="w-full px-4 py-2 border rounded-lg"
      />
      <button 
        @click="applyCoupon(couponCode)"
        class="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        Anvend rabatkode
      </button>
    </div>
    
    <!-- Checkout Button -->
    <button 
      @click="$emit('checkout')"
      class="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800"
    >
      Gå til checkout
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  applyCoupon: Function
});

const couponCode = ref('');
const freeShippingThreshold = 500;

const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);
};
</script> 