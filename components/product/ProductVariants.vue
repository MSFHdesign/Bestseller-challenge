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
        <!-- Multi-color support -->
        <div class="block w-full h-full rounded-full overflow-hidden">
          <template v-if="hasMultipleColors(variant.color)">
            <div 
              v-for="(color, index) in getColorParts(variant.color)" 
              :key="index"
              class="absolute top-0 bottom-0"
              :style="{
                backgroundColor: getColorHex(color),
                width: `${100 / getColorParts(variant.color).length}%`,
                left: `${(100 / getColorParts(variant.color).length) * index}%`
              }"
            ></div>
          </template>
          <div 
            v-else
            class="w-full h-full"
            :style="`background-color: ${getColorHex(variant.color)}`"
          ></div>
        </div>
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

// Check if color name contains multiple colors
function hasMultipleColors(colorName) {
  if (!colorName) return false;
  return colorName.includes('/');
}

// Split color name into parts
function getColorParts(colorName) {
  if (!colorName) return ['#CCCCCC'];
  return colorName.split('/').map(part => part.trim());
}

// Color mapping function to convert color names to hex codes
function getColorHex(colorName) {
  if (!colorName) return '#CCCCCC'; // Default gray for empty color
  
  // Use colorHex if it exists
  if (typeof colorName === 'object' && colorName.colorHex) {
    return colorName.colorHex;
  }
  
  // Color mapping for specific named colors
  const colorMap = {
    // Basic colors
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Green': '#008000',
    'Blue': '#0000FF',
    'Yellow': '#FFFF00',
    
    // Special colors from your data
    'Dark Grey': '#444444',
    'Light Grey': '#CCCCCC',
    'Silver Mink': '#C0C0C0',
    'Potting Soil': '#5D4037',
    'Forest Night': '#1B3409',
    'Blue': '#4169E1',
    'Grey': '#808080',
    'Blue / Grey': '#4682B4',
    'Dark Earth': '#5D4037',
    'Chili': '#C41E3A',
    'Blue Heaven': '#6495ED',
  };
  
  // Return the mapped color or try to use the color name directly
  return colorMap[colorName] || colorName;
}
</script> 