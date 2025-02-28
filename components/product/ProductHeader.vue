<template>
  <div class="space-y-4">
    <h1 class="text-3xl font-bold text-gray-900">
      {{ name?.dk || name?.en }}
    </h1>
    <p class="text-gray-500">{{ brand }}</p>
    
    <div class="flex items-center gap-4">
      <span class="text-2xl font-bold" :class="{'text-red-500': onSale}">
        {{ price }} DKK
      </span>
      <span v-if="originalPrice && onSale" class="text-lg text-gray-400 line-through">
        {{ originalPrice }} DKK
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: Object, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  onSale: { type: Boolean, default: false }
});
</script> 