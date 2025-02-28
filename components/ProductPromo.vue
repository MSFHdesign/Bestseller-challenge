<template>
  <div class="overflow-hidden rounded-xl h-full">
    <NuxtLink v-if="promo?.link" :to="promo.link" class="group relative block h-full">
      <img 
        :src="promo.image?.imageUrl" 
        :alt="promo.imageAltText || 'Promotional image'"
        :style="{
          aspectRatio: promo.image?.aspectRatio?.replace(':', '/') || '1/1',
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

const getFocalPoint = computed(() => {
  const x = props.promo?.image?.focalPoint?.x || 0.5;
  const y = props.promo?.image?.focalPoint?.y || 0.5;
  return `${x * 100}% ${y * 100}%`;
});
</script> 