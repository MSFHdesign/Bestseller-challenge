<template>
  <div v-if="variants?.length" class="space-y-4">
    <h3 class="text-lg font-semibold">Farve</h3>
    <div class="flex gap-2">
      <button
        v-for="variant in variants"
        :key="variant.color"
        @click="$emit('select-variant', variant)"
        class="relative w-12 h-12 rounded-full border-2 transition-all duration-200 p-0.5"
        :class="selectedVariant?.color === variant.color ? 'border-black scale-110' : 'border-gray-200'"
      >
        <span 
          class="block w-full h-full rounded-full"
          :style="`background-color: ${variant.colorHex || variant.color}`"
        />
        <span v-if="selectedVariant?.color === variant.color" 
          class="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
          ✓
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variants: { type: Array, required: true },
  selectedVariant: { type: Object, default: null }
});

defineEmits(['select-variant']);
</script> 