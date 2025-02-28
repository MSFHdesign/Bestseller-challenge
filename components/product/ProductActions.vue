<template>
  <div class="space-y-4">
    <!-- Stock Status -->
    <p class="text-sm" :class="{'text-red-500': stock === 0, 'text-green-500': stock > 0}">
      {{ stock === 0 ? '❌ Ikke på lager' : stock <= 5 ? `⚠️ Kun ${stock} stk tilbage` : '✅ På lager' }}
    </p>

    <div class="flex gap-4">
      <!-- Add to Cart -->
      <button
        @click="handleAddToCart"
        :disabled="!canAddToCart"
        class="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium
          transition-all duration-200 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ stock === 0 ? 'Ikke på lager' : !canAddToCart ? 'Vælg størrelse' : '🛒 Læg i kurv' }}
      </button>

      <!-- Wishlist -->
      <button
        @click="handleToggleWishlist"
        class="p-3 rounded-lg border-2 transition-all duration-200"
        :class="isInWishlist ? 'border-red-500 text-red-500' : 'border-gray-200 hover:border-gray-400'"
      >
        {{ isInWishlist ? '❤️' : '🤍' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast';

const { addToast } = useToast();

const props = defineProps({
  stock: { type: Number, required: true },
  canAddToCart: { type: Boolean, required: true },
  isInWishlist: { type: Boolean, required: true }
});

const emit = defineEmits(['add-to-cart', 'toggle-wishlist']);

const handleAddToCart = () => {
  if (!props.canAddToCart) return;
  
  emit('add-to-cart');
  
  addToast('Produkt tilføjet til kurven! 🛍️', 'success', 5000, {
    label: 'Gå til kurv',
    onClick: () => navigateTo('/cart')
  });
};

const handleToggleWishlist = () => {
  emit('toggle-wishlist');
  
  if (props.isInWishlist) {
    addToast('Tilføjet til favoritter ❤️', 'success', 3000);
  } else {
    addToast('Fjernet fra favoritter 🤍', 'info', 3000);
  }
};
</script> 