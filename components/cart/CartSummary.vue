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
const props = defineProps({
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true }
});

const couponCode = ref('');

const formatPrice = (price) => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(price);
};
</script> 