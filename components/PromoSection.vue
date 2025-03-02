
/**
 * PromoSection Component
 * 
 * Displays promotional content in a responsive grid layout with optional features.
 * Used on homepage and category pages to highlight special offers or collections.
 * 
 * @component
 */

<template>
  <section class="relative w-full">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 rounded-xl overflow-hidden">
      <!-- Promo Image (2x2) -->
      <div class="md:col-span-2 md:row-span-2 h-[300px] sm:h-[400px] md:h-[500px]">
        <div v-if="promo?.link" class="h-full w-full">
          <ProductPromo :promo="promo" class="h-full w-full" />
        </div>
        <div v-else class="w-full h-full bg-gray-100 animate-pulse rounded-xl"></div>
      </div>
      
      <!-- Promo Text Content -->
      <div class="md:col-span-2 bg-gray-50 p-6 sm:p-8 flex flex-col justify-center">
        <span class="text-sm font-medium text-indigo-600 mb-2">{{ promo?.tagline || tagline || 'Udvalgt Kollektion' }}</span>
        <h3 class="text-2xl sm:text-3xl font-bold mb-3">{{ promo?.title || title || promo?._alias || 'Premium Essentials' }}</h3>
        <p class="text-gray-600 mb-6">
          {{ promo?.description || description || 'Opdag vores udvalgte kollektion af premium essentials designet til komfort og stil. Tidløse stykker, der løfter din hverdagsgarderobe med enestående kvalitet og håndværk.' }}
        </p>
        <NuxtLink 
          :to="promo?.link || '/products'" 
          class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {{ promo?.ctaText || ctaText || 'Udforsk Kollektion' }} <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
      
      <!-- Additional Content Blocks -->
      <div class="hidden md:block md:col-span-1 bg-gray-100 p-6 flex flex-col justify-center">
        <span class="text-sm font-medium text-gray-800 mb-1">{{ promo?.feature1Title || feature1Title || 'Gratis Fragt' }}</span>
        <p class="text-gray-600 text-sm">{{ promo?.feature1Text || feature1Text || 'På alle ordrer over 500 kr' }}</p>
      </div>
      
      <div class="hidden md:block md:col-span-1 bg-gray-100 p-6 flex flex-col justify-center">
        <span class="text-sm font-medium text-gray-800 mb-1">{{ promo?.feature2Title || feature2Title || 'Nem Returnering' }}</span>
        <p class="text-gray-600 text-sm">{{ promo?.feature2Text || feature2Text || '30 dages returret' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  promo: {
    type: Object,
    default: null
  },
  tagline: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  ctaText: {
    type: String,
    default: ''
  },
  feature1Title: {
    type: String,
    default: ''
  },
  feature1Text: {
    type: String,
    default: ''
  },
  feature2Title: {
    type: String,
    default: ''
  },
  feature2Text: {
    type: String,
    default: ''
  }
});
</script> 