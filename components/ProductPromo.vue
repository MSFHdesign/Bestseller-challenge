<template>
  <div class="overflow-hidden rounded-xl h-full">
    <NuxtLink v-if="promo?.link" :to="promo.link" class="group relative block h-full">
      <img 
        :src="promo.image?.imageUrl" 
        :alt="promo.image?.alt || promo.imageAltText ||  'Promotional image'"
        :style="{
          aspectRatio: getAspectRatio,
          objectPosition: getFocalPoint
        }"
        class="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
      />
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div class="absolute bottom-0 left-0 p-3 sm:p-6 text-white">
          <h3 class="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{{ promo._alias || 'Shop Now' }}</h3>
          <span class="inline-flex items-center text-xs sm:text-sm font-medium">
            Se mere <span class="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform">→</span>
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
  
  // Responsive aspect ratios
  const isMobile = window?.innerWidth < 640;
  
  switch (props.promo.type) {
    case '2x2': return isMobile ? '1/1' : '2/1'; 
    case '2x1': return isMobile ? '3/2' : '2/1';
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
  height: auto;
  max-height: none;
  aspect-ratio: 2/1;
}

@media (max-width: 640px) {
  .promo-2x2 {
    aspect-ratio: 1/1;
  }
}

.promo-2x1 {
  grid-column: span 2;
  height: auto;
  max-height: none;
  aspect-ratio: 2/1;
}

@media (max-width: 640px) {
  .promo-2x1 {
    aspect-ratio: 3/2;
  }
}

.promo-1x2 {
  grid-row: span 2;
  height: auto;
  max-height: none;

  aspect-ratio: 1/2;
}
</style>