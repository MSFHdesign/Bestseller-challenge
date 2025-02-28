<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Størrelse</h3>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="size in sizes"
        :key="size"
        @click="$emit('select-size', size)"
        :disabled="!isSizeInStock(size)"
        class="p-3 text-center rounded-lg border-2 transition-all duration-200"
        :class="{
          'border-black bg-black text-white': selectedSize === size,
          'border-gray-200 hover:border-gray-400': selectedSize !== size && isSizeInStock(size),
          'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed': !isSizeInStock(size)
        }"
      >
        {{ size }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sizes: { type: Array, required: true },
  selectedSize: { type: String, default: null },
  isSizeInStock: { type: Function, required: true }
});

defineEmits(['select-size']);
</script> 