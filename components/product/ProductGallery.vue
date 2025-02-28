<template>
  <div class="relative">
    <div class="sticky top-32">
      <!-- Main Image -->
      <div class="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
        <img 
          :src="images[selectedImageIndex]" 
          :alt="productName"
          class="w-full h-full object-cover transition-opacity duration-300"
        />
        <span 
          v-if="onSale" 
          class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
        >
          SALE
        </span>
      </div>

      <!-- Thumbnails -->
      <div class="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="selectedImageIndex = index"
          class="relative w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0 
            transition-all duration-200 hover:opacity-80 hover:scale-105"
          :class="{ 
            'ring-2 ring-black ring-offset-2': selectedImageIndex === index,
            'opacity-50': selectedImageIndex !== index
          }"
        >
          <img 
            :src="image" 
            :alt="`${productName} - Billede ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  images: { type: Array, required: true },
  productName: { type: String, required: true },
  onSale: { type: Boolean, default: false }
});

const selectedImageIndex = ref(0);

// Watch for external changes
watch(() => props.images, () => {
  selectedImageIndex.value = 0;
}, { immediate: true });
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Active thumbnail effect */
.ring-offset-2 {
  --tw-ring-offset-width: 2px;
}
</style> 