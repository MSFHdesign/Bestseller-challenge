<template>
  <div class="overflow-hidden rounded-xl h-full">
    <NuxtLink v-if="promo?.link" :to="promo.link" class="group relative block h-full">
      <img 
        :src="promo.image?.imageUrl" 
        :alt="promo.imageAltText || 'Promotional image'"
        :style="{
          aspectRatio: getAspectRatio,
          objectPosition: getFocalPoint
        }"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div class="absolute bottom-0 left-0 p-6 text-white">
          <h3 class="text-xl font-bold mb-2">{{ promo._alias || 'Shop Now' }}</h3>
          <span class="inline-flex items-center text-sm font-medium">
            Se mere <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </NuxtLink>
    <div v-else class="w-full h-full bg-gray-100 animate-pulse rounded-xl"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  promo: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const getAspectRatio = computed(() => {
  if (!props.promo?.type) return '1/1';
  
  switch (props.promo.type) {
    case '2x2': return '2/1'; // Ændret fra 2/2 til 2/1 for at gøre det mindre højt
    case '2x1': return '2/1';
    case '1x2': return '1/2';
    default: return '1/1';
  }
});

const getFocalPoint = computed(() => {
  const x = props.promo?.image?.focalPoint?.x || 0.5;
  const y = props.promo?.image?.focalPoint?.y || 0.5;
  return `${x * 100}% ${y * 100}%`;
});
</script>

<style scoped>
.promo-2x2 {
  grid-column: span 2;
  grid-row: span 2;
  max-height: calc(2 * var(--product-card-height, 400px));
}

.promo-2x1 {
  grid-column: span 2;
  max-height: var(--product-card-height, 400px);
}

.promo-1x2 {
  grid-row: span 2;
  max-height: calc(2 * var(--product-card-height, 400px));
}
</style>