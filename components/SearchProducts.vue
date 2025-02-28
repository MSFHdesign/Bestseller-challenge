<template>
  <div class="mb-8">
    <!-- Main Search Bar with Smart Dropdown -->
    <div 
      ref="searchContainer" 
      v-click-outside="handleClickOutside"
      class="relative"
    >
      <div class="flex gap-2">
        <div class="flex-1 relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Søg efter produkter..."
            class="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 bg-white"
            @focus="handleSearchFocus"
            @input="debounceSearch"
            @keyup.enter="navigateToSearch"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          
          <!-- Clear search button -->
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Search Results Count -->
          <div v-if="filteredProducts.length && searchQuery && !showSuggestions" 
               class="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {{ filteredProducts.length }} resultater
          </div>
          
          <!-- Smart Search Suggestions -->
          <div v-if="showSuggestions && searchQuery && searchSuggestions" 
               class="absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-100 z-50 max-h-80 overflow-y-auto custom-scrollbar">
            <div v-for="(group, type) in searchSuggestions" :key="type" 
                 class="p-2" v-show="group.length > 0">
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ type }}</div>
              <button v-for="suggestion in group" :key="suggestion"
                      @click="applySuggestion(type, suggestion)"
                      class="block w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm">
                {{ suggestion }}
              </button>
            </div>
            <div v-if="Object.values(searchSuggestions).every(group => group.length === 0)" class="p-4 text-center text-gray-500">
              Ingen forslag fundet
            </div>
          </div>
        </div>

        <!-- Search Button -->
        <button 
          @click="navigateToSearch"
          class="p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          aria-label="Søg efter produkter"
        >
          Søg
        </button>

        <!-- Smart Filter Button -->
        <button 
          @click="toggleFilter"
          class="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors relative"
          aria-label="Vis filtre"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          
          <!-- Filter count badge -->
          <span v-if="activeFiltersCount" 
                class="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>
      
      <!-- Compact Filter Panel -->
      <transition name="fade">
        <div v-if="isFilterOpen" class="absolute w-full bg-white mt-2 rounded-lg shadow-lg border border-gray-100 z-50 animate-scale">
          <!-- Active Filters Bar -->
          <div v-if="activeFiltersCount > 0" class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <div class="flex flex-wrap gap-1 items-center">
              <span class="text-xs font-medium text-gray-500">Filtre:</span>
              <button v-if="filters.minPrice || filters.maxPrice" 
                     @click="clearPriceFilter"
                     class="px-2 py-0.5 bg-gray-100 rounded-full text-xs flex items-center gap-1 hover:bg-gray-200">
                <span>{{ filters.minPrice || '0' }}-{{ filters.maxPrice || '∞' }} kr</span>
                <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <button v-for="size in filters.sizes" :key="`size-${size}`"
                     @click="toggleSize(size)"
                     class="px-2 py-0.5 bg-gray-100 rounded-full text-xs flex items-center gap-1 hover:bg-gray-200">
                <span>{{ size }}</span>
                <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <button v-for="brand in filters.brands" :key="`brand-${brand}`"
                     @click="toggleBrand(brand)"
                     class="px-2 py-0.5 bg-gray-100 rounded-full text-xs flex items-center gap-1 hover:bg-gray-200">
                <span>{{ brand }}</span>
                <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <button @click="clearAllFilters" class="text-xs text-gray-500 hover:text-black">
              Ryd alle
            </button>
          </div>
          
          <!-- Filter Sections -->
          <div class="p-3 grid grid-cols-3 gap-3">
            <!-- Price Filter -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Pris</h3>
              <div class="flex items-center gap-2">
                <input 
                  type="number" 
                  v-model="filters.minPrice" 
                  placeholder="Min" 
                  class="w-full p-1.5 text-sm rounded border border-gray-200"
                  @input="debounceSearch"
                />
                <span class="text-gray-400">-</span>
                <input 
                  type="number" 
                  v-model="filters.maxPrice" 
                  placeholder="Max" 
                  class="w-full p-1.5 text-sm rounded border border-gray-200"
                  @input="debounceSearch"
                />
              </div>
            </div>
            
            <!-- Size Filter -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Størrelse</h3>
              <div class="flex flex-wrap gap-1">
                <!-- Letter sizes -->
                <button 
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']" 
                  :key="size"
                  @click="toggleSize(size)"
                  :class="[
                    'w-8 h-8 rounded-full text-xs flex items-center justify-center',
                    filters.sizes.includes(size) 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
              
              <!-- Numeric sizes in a scrollable container -->
              <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                <button 
                  v-for="size in ['26', '27', '28', '29', '30', '32', '33', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60', '65', '70', '75', '80', '85', '90', '92', '98', '104', '110', '116', '122', '128', '134', '140']" 
                  :key="size"
                  @click="toggleSize(size)"
                  :class="[
                    'w-8 h-8 rounded-full text-xs flex items-center justify-center',
                    filters.sizes.includes(size) 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>
            
            <!-- Brands Filter -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Mærker</h3>
              <div class="max-h-32 overflow-y-auto custom-scrollbar pr-1">
                <div v-for="brand in availableBrands" :key="brand" class="flex items-center mb-1">
                  <input 
                    type="checkbox" 
                    :id="`brand-${brand}`" 
                    :value="brand" 
                    v-model="filters.brands"
                    class="form-checkbox"
                    @change="debounceSearch"
                  />
                  <label :for="`brand-${brand}`" class="ml-2 text-xs">{{ brand }}</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="p-3 border-t border-gray-100 flex justify-end">
            <button 
              @click="navigateToSearch"
              class="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Se resultater ({{ filteredProducts.length }})
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { vClickOutside } from '~/directives/clickOutside';

const props = defineProps({
  initialProducts: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filtered']);
const router = useRouter();

// Search state
const searchContainer = ref(null);
const searchQuery = ref('');
const searchTimeout = ref(null);
const showSuggestions = ref(false);
const isFilterOpen = ref(false);
const filteredProducts = ref([]);

// Filter state
const filters = ref({
  minPrice: '',
  maxPrice: '',
  sizes: [],
  brands: []
});

// Computed properties
const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.minPrice || filters.value.maxPrice) count++;
  count += filters.value.sizes.length;
  count += filters.value.brands.length;
  return count;
});

const availableBrands = computed(() => {
  const brands = new Set();
  props.initialProducts.forEach(product => {
    if (product.brand) brands.add(product.brand);
  });
  return Array.from(brands).sort();
});

const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return null;
  
  const query = searchQuery.value.toLowerCase();
  const brands = new Set();
  const colors = new Set();
  const categories = new Set();
  
  props.initialProducts.forEach(product => {
    // Add brand suggestions
    if (product.brand && product.brand.toLowerCase().includes(query)) {
      brands.add(product.brand);
    }
    
    // Add color suggestions
    if (product.color && product.color.toLowerCase().includes(query)) {
      colors.add(product.color);
    }
    
    // Add category suggestions
    if (product.categories) {
      product.categories.forEach(category => {
        if (category.toLowerCase().includes(query)) {
          categories.add(category);
        }
      });
    }
  });
  
  return {
    'Mærker': Array.from(brands).slice(0, 5),
    'Farver': Array.from(colors).slice(0, 5),
    'Kategorier': Array.from(categories).slice(0, 5)
  };
});

// Methods
const handleSearchFocus = () => {
  if (searchQuery.value.length >= 2) {
    showSuggestions.value = true;
  }
};

const handleClickOutside = () => {
  showSuggestions.value = false;
};

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
  showSuggestions.value = false;
};

const clearSearch = () => {
  searchQuery.value = '';
  applyFilters();
};

const clearPriceFilter = () => {
  filters.value.minPrice = '';
  filters.value.maxPrice = '';
  applyFilters();
};

const toggleSize = (size) => {
  const index = filters.value.sizes.indexOf(size);
  if (index === -1) {
    filters.value.sizes.push(size);
  } else {
    filters.value.sizes.splice(index, 1);
  }
  applyFilters();
};

const toggleBrand = (brand) => {
  const index = filters.value.brands.indexOf(brand);
  if (index === -1) {
    filters.value.brands.push(brand);
  } else {
    filters.value.brands.splice(index, 1);
  }
  applyFilters();
};

const clearAllFilters = () => {
  filters.value = {
    minPrice: '',
    maxPrice: '',
    sizes: [],
    brands: []
  };
  applyFilters();
};

const formatFilterLabel = (key, value) => {
  switch (key) {
    case 'sizes':
      return `Størrelse: ${value.join(', ')}`;
    case 'brands':
      return `Mærker: ${value.join(', ')}`;
    default:
      return `${key}: ${value}`;
  }
};

const applySuggestion = (type, value) => {
  switch (type) {
    case 'Mærker':
      filters.value.brands = [value];
      break;
    case 'Farver':
      searchQuery.value = value;
      break;
    case 'Kategorier':
      searchQuery.value = value;
      break;
  }
  
  showSuggestions.value = false;
  applyFilters();
};

// New method to navigate to the products page with filters
const navigateToSearch = () => {
  const query = {};
  
  // Add search query if present
  if (searchQuery.value) {
    query.q = searchQuery.value;
  }
  
  // Add price filters if present
  if (filters.value.minPrice) {
    query.minPrice = filters.value.minPrice;
  }
  
  if (filters.value.maxPrice) {
    query.maxPrice = filters.value.maxPrice;
  }
  
  // Add size filters if present
  if (filters.value.sizes.length) {
    query.sizes = filters.value.sizes.join(',');
  }
  
  // Add brand filters if present
  if (filters.value.brands.length) {
    query.brands = filters.value.brands.join(',');
  }
  
  // Navigate to products page with query params
  router.push({ path: '/products', query });
};

// Debounce search to improve performance
const debounceSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    applyFilters();
  }, 300);
};

const applyFilters = () => {
  let results = [...props.initialProducts];
  
  // Apply text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(product => {
      return (
        (product.name?.dk?.toLowerCase().includes(query)) ||
        (product.name?.en?.toLowerCase().includes(query)) ||
        (product.brand?.toLowerCase().includes(query)) ||
        (product.color?.toLowerCase().includes(query)) ||
        (product.categories?.some(cat => cat.toLowerCase().includes(query)))
      );
    });
  }
  
  // Apply price filters
  if (filters.value.minPrice) {
    results = results.filter(product => product.price >= Number(filters.value.minPrice));
  }
  
  if (filters.value.maxPrice) {
    results = results.filter(product => product.price <= Number(filters.value.maxPrice));
  }
  
  // Apply size filters
  if (filters.value.sizes.length) {
    results = results.filter(product => {
      if (!product.size || !Array.isArray(product.size)) return false;
      return filters.value.sizes.some(size => product.size.includes(size));
    });
  }
  
  // Apply brand filters
  if (filters.value.brands.length) {
    results = results.filter(product => filters.value.brands.includes(product.brand));
  }
  
  filteredProducts.value = results;
  emit('filtered', results);
};

// Initialize
onMounted(() => {
  filteredProducts.value = props.initialProducts;
  emit('filtered', props.initialProducts);
});

// Watch for changes in initial products
watch(() => props.initialProducts, (newProducts) => {
  if (newProducts.length && !filteredProducts.value.length) {
    filteredProducts.value = newProducts;
    emit('filtered', newProducts);
  }
}, { deep: true });
</script>

<style scoped>
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

.animate-scale {
  animation: scale 0.2s ease-out forwards;
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
