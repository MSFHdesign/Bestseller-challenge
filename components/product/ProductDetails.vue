<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Produktdetaljer</h3>
    
    <!-- Brand & Price -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-gray-500">Brand</span>
        <p class="font-medium">{{ product.brand }}</p>
      </div>
      <div>
        <span class="text-gray-500">Varenummer</span>
        <p class="font-medium">#{{ product.id }}</p>
      </div>
    </div>

    <!-- Description -->
    <div v-if="product.description" class="prose prose-sm max-w-none">
      <p class="text-gray-600">{{ product.description }}</p>
    </div>

    <!-- Stock Info -->
    <div class="flex items-center gap-2 text-sm">
      <span class="w-3 h-3 rounded-full"
        :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"
      ></span>
      <span :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
        {{ product.stock > 0 ? 'På lager' : 'Ikke på lager' }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true }
});
</script> 