<template>
  <div class="mb-8">
    <!-- Main Search Bar with Smart Dropdown -->
    <div class="relative" ref="searchContainer">
      <div class="flex gap-2">
        <div class="flex-1 relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Søg efter produkter..."
            class="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 bg-white"
            @focus="handleSearchFocus"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          
          <!-- Smart Search Suggestions -->
          <div v-if="showSuggestions && searchQuery" 
            class="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-100 z-50">
            <div v-for="(group, type) in searchSuggestions" :key="type" 
              class="p-2">
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ type }}</div>
              <button v-for="suggestion in group" :key="suggestion"
                @click="applySuggestion(type, suggestion)"
                class="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm">
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Smart Filter Button -->
        <button 
          @click="toggleFilters"
          class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 relative flex items-center gap-2"
        >
          <span class="hidden sm:inline">Filtre</span>
          <svg class="w-5 h-5" :class="{ 'rotate-180': isFilterOpen }" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <TransitionScale>
            <span v-if="activeFilterCount" 
              class="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </TransitionScale>
        </button>
      </div>

      <!-- Advanced Filter Panel -->
      <TransitionSlide>
        <div v-if="isFilterOpen" 
          v-click-outside="handleClickOutside"
          class="absolute w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          
          <!-- Filter Header -->
          <div class="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-medium">Filtrer produkter</h3>
            <button v-if="hasActiveFilters" 
              @click="clearAllFilters"
              class="text-sm text-red-500 hover:text-red-600">
              Nulstil alle
            </button>
          </div>

          <!-- Filter Content -->
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Price Range -->
            <div class="space-y-3">
              <label class="text-sm font-medium flex justify-between">
                Pris
                <span v-if="filters.minPrice || filters.maxPrice" 
                  class="text-xs text-gray-500">
                  {{ filters.minPrice || '0' }} - {{ filters.maxPrice || '∞' }} kr
                </span>
              </label>
              <div class="flex gap-2">
                <input 
                  type="number" 
                  v-model="filters.minPrice"
                  placeholder="Min" 
                  class="w-full p-2 rounded border text-sm"
                />
                <input 
                  type="number" 
                  v-model="filters.maxPrice"
                  placeholder="Max" 
                  class="w-full p-2 rounded border text-sm"
                />
              </div>
            </div>

            <!-- Size Matrix -->
            <div class="space-y-3">
              <label class="text-sm font-medium flex justify-between">
                Størrelse
                <span v-if="filters.sizes.length" 
                  class="text-xs text-gray-500">
                  {{ filters.sizes.length }} valgt
                </span>
              </label>
              <div class="grid grid-cols-4 gap-1">
                <button v-for="size in availableSizes" :key="size"
                  @click="toggleSize(size)"
                  :class="[
                    'p-2 text-sm rounded border transition-all',
                    filters.sizes.includes(size)
                      ? 'bg-black text-white border-black'
                      : 'hover:border-black'
                  ]">
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Brand Selection -->
            <div class="space-y-3">
              <label class="text-sm font-medium flex justify-between">
                Mærker
                <span v-if="filters.brands.length" 
                  class="text-xs text-gray-500">
                  {{ filters.brands.length }} valgt
                </span>
              </label>
              <div class="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                <label v-for="brand in availableBrands" :key="brand"
                  class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    v-model="filters.brands"
                    :value="brand"
                    class="form-checkbox"
                  />
                  {{ brand }}
                </label>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <TransitionScale group>
            <div v-if="hasActiveFilters" 
              class="border-t border-gray-100 p-4 bg-gray-50">
              <div class="flex flex-wrap gap-2">
                <span v-for="filter in activeFiltersDisplay" :key="filter.id"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm
                    bg-white border border-gray-200 shadow-sm">
                  {{ filter.label }}
                  <button @click="removeFilter(filter)" 
                    class="hover:text-red-500 transition-colors">
                    ×
                  </button>
                </span>
              </div>
            </div>
          </TransitionScale>
        </div>
      </TransitionSlide>
    </div>

    <!-- Results Summary -->
    <TransitionFade>
      <div v-if="hasActiveFilters" class="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <span>{{ filteredProducts.length }} produkter fundet</span>
        <span v-if="isFiltering" class="inline-block animate-spin">🔄</span>
      </div>
    </TransitionFade>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { TransitionScale, TransitionSlide, TransitionFade } from '~/components/transitions';
import debounce from 'lodash/debounce';

const props = defineProps({
  products: { type: Array, required: true }
});

const emit = defineEmits(['filtered']);
const searchContainer = ref(null);
const isFilterOpen = ref(false);
const showSuggestions = ref(false);
const isFiltering = ref(false);
const searchQuery = ref('');

// Filter state
const filters = reactive({
  minPrice: '',
  maxPrice: '',
  sizes: [],
  brands: [],
  colors: [],
  inStock: false,
  onSale: false
});

// Computed Properties
const availableBrands = computed(() => 
  Array.from(new Set(props.products.map(p => p.brand))).sort()
);

const availableSizes = computed(() => {
  const sizes = new Set();
  props.products.forEach(product => {
    // Handle both direct sizes and variant sizes
    if (product.sizes) {
      product.sizes.forEach(size => sizes.add(size));
    }
    // Check variants if they exist
    if (product.variant) {
      product.variant.forEach(variant => {
        if (variant.size) {
          variant.size.forEach(size => sizes.add(size));
        }
      });
    }
  });
  
  // Sort sizes in logical order
  return Array.from(sizes).sort((a, b) => {
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    
    // Handle numeric sizes
    if (aIndex === -1 && bIndex === -1) {
      return parseInt(a) - parseInt(b);
    }
    // Handle mixed sizes
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
});

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return {};
  
  const query = searchQuery.value.toLowerCase();
  const suggestions = {
    brands: [],
    products: [],
    categories: []
  };

  // Brand suggestions
  suggestions.brands = availableBrands.value
    .filter(brand => brand.toLowerCase().includes(query))
    .slice(0, 3);

  // Product suggestions
  suggestions.products = props.products
    .filter(product => 
      product.name.dk.toLowerCase().includes(query) || 
      product.name.en.toLowerCase().includes(query)
    )
    .slice(0, 3)
    .map(p => p.name.dk || p.name.en);

  return suggestions;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.minPrice || filters.maxPrice) count++;
  count += filters.sizes.length;
  count += filters.brands.length;
  count += filters.colors.length;
  if (filters.inStock) count++;
  if (filters.onSale) count++;
  return count;
});

const hasActiveFilters = computed(() => {
  return activeFilterCount.value > 0 || searchQuery.value.length > 0;
});

const filteredProducts = computed(() => {
  return props.products.filter(product => {
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesName = 
        product.name.dk.toLowerCase().includes(query) ||
        product.name.en.toLowerCase().includes(query);
      if (!matchesName) return false;
    }

    // Price filtering
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;

    // Enhanced size filtering
    if (filters.sizes.length > 0) {
      let hasSizes = false;
      
      // Check direct sizes
      if (product.sizes) {
        hasSizes = filters.sizes.some(size => product.sizes.includes(size));
      }
      
      // Check variant sizes
      if (!hasSizes && product.variant) {
        hasSizes = product.variant.some(variant => 
          variant.size && filters.sizes.some(size => variant.size.includes(size))
        );
      }
      
      if (!hasSizes) return false;
    }

    // Brand filtering
    if (filters.brands.length && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Stock filtering
    if (filters.inStock && product.stock <= 0) return false;

    // Sale filtering
    if (filters.onSale && !product.onSale) return false;

    return true;
  });
});

// Methods
const handleSearchFocus = () => {
  showSuggestions.value = true;
};

const applySuggestion = (type, value) => {
  if (type === 'brands') {
    filters.brands = [value];
  } else {
    searchQuery.value = value;
  }
  showSuggestions.value = false;
};

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
  showSuggestions.value = false;
};

const handleClickOutside = (event) => {
  if (!searchContainer.value?.contains(event.target)) {
    showSuggestions.value = false;
    isFilterOpen.value = false;
  }
};

const toggleSize = (size) => {
  const index = filters.sizes.indexOf(size);
  if (index === -1) {
    filters.sizes.push(size);
  } else {
    filters.sizes.splice(index, 1);
  }
};

const clearAllFilters = () => {
  searchQuery.value = '';
  Object.assign(filters, {
    minPrice: '',
    maxPrice: '',
    sizes: [],
    brands: [],
    colors: [],
    inStock: false,
    onSale: false
  });
};

const removeFilter = (filter) => {
  switch (filter.type) {
    case 'price':
      filters.minPrice = '';
      filters.maxPrice = '';
      break;
    case 'size':
      filters.sizes = filters.sizes.filter(s => s !== filter.value);
      break;
    case 'brand':
      filters.brands = filters.brands.filter(b => b !== filter.value);
      break;
    case 'search':
      searchQuery.value = '';
      break;
  }
};

// Watch for changes and emit filtered products
watch(
  [searchQuery, filters],
  debounce(() => {
    isFiltering.value = true;
    nextTick(() => {
      emit('filtered', filteredProducts.value);
      isFiltering.value = false;
    });
  }, 300),
  { deep: true }
);
</script>

<style scoped>
/* Transitions */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Micro-interactions */
@keyframes scale {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Custom scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.gray.300');
  border-radius: 4px;
}

/* Form element focus states */
input:focus, select:focus {
  @apply ring-2 ring-black/5 outline-none;
}

/* Checkbox custom styling */
.form-checkbox {
  @apply rounded border-gray-300 text-black focus:ring-black/5;
}
</style>
