<template>
    <div>
        <div class="container mx-auto px-6 py-16">
            <!-- Loading state -->
            <div v-if="loading" class="text-center py-16">
                <p class="text-gray-500 text-lg">Indlæser produkter...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="text-center py-16">
                <p class="text-red-500 text-lg">Der opstod en fejl ved indlæsning af produkter</p>
                <button 
                    @click="fetchData" 
                    class="mt-4 text-blue-600 hover:underline"
                >
                    Prøv igen
                </button>
            </div>

            <!-- Content when loaded -->
            <div v-else>
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold mb-2">{{ pageTitle }}</h1>
                        <p class="text-gray-600">{{ productCount }} produkter</p>
                    </div>
                    
                    <button 
                        @click="showFilters = !showFilters"
                        class="mt-4 md:mt-0 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        {{ showFilters ? 'Skjul filtre' : 'Vis filtre' }}
                    </button>
                </div>

                <!-- Search and Filters -->
                <SearchProducts 
                    v-show="showFilters"
                    :initial-products="categoryFilteredProducts"
                    @filtered="handleFilteredProducts"
                />

                <!-- Product Grid with Promotions -->
                <div v-if="productCount > 0" 
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <template v-for="item in mixedItems" :key="item.id || `promo-${item.position}`">
                        <!-- Promotion Spot -->
                        <div
                            v-if="item.isPromo"
                            :class="getPromoContainerClass(item)"
                        >
                            <ProductPromo 
                                :promo="item"
                                class="h-full w-full"
                            />
                        </div>
                        <!-- Product Card -->
                        <ProductCard 
                            v-else 
                            :product="item"
                            class="h-full w-full"
                        />
                    </template>
                </div>
                
                <!-- Show this when we have 0 products -->
                <div v-else class="space-y-12">
                    <!-- First show any promos if they exist -->
                    <div v-if="promotionalSpots.value && promotionalSpots.value.length > 0" 
                         class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div
                            v-for="promo in promotionalSpots.value" 
                            :key="`promo-${promo.position}`"
                            :class="getPromoContainerClass(promo)"
                        >
                            <ProductPromo 
                                :promo="promo"
                                class="h-full w-full"
                            />
                        </div>
                    </div>
                    
                    <!-- Show message that no products were found -->
                    <div class="text-center py-8">
                        <p class="text-gray-500 text-lg">Ingen produkter fundet i denne kategori</p>
                        <button 
                            @click="clearFilters" 
                            class="mt-4 text-blue-600 hover:underline"
                        >
                            Se alle produkter
                        </button>
                    </div>
                    
                    <!-- Show popular products instead -->
                    <div class="mt-12">
                        <h2 class="text-2xl font-bold mb-6">Populære produkter</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <ProductCard 
                                v-for="product in popularProducts" 
                                :key="product.id" 
                                :product="product"
                                class="h-full w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '~/composables/useProducts';
import SearchProducts from '~/components/SearchProducts.vue';
import ProductCard from '~/components/ProductCard.vue';
import ProductPromo from '~/components/ProductPromo.vue';


const route = useRoute();
const showFilters = ref(false);

// Get all products from the composable with loading state
const { products: allProducts, promotionalSpots, loading, error, fetchData } = useProducts();
const filteredItems = ref([]);

// Get category from route
const currentCategory = computed(() => route.query.category);

// Filter products based on category
const categoryFilteredProducts = computed(() => {
    if (!allProducts.value?.length) return [];
    if (!currentCategory.value) return allProducts.value;
    return allProducts.value.filter(product => 
        product.categories?.includes(currentCategory.value)
    );
});

// Watch for changes in categoryFilteredProducts
watch(categoryFilteredProducts, (newProducts) => {
    if (currentCategory.value && newProducts.length > 0) {
        filteredItems.value = newProducts;
    }
}, { immediate: true });

// Page title based on category
const pageTitle = computed(() => {
    if (!currentCategory.value) return 'Alle Produkter';
    const category = currentCategory.value.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return category;
});

// Product count (excluding promos)
const productCount = computed(() => 
    filteredItems.value.length > 0 
        ? filteredItems.value.length 
        : categoryFilteredProducts.value.length
);

// Mix products with promotions
const mixedItems = computed(() => {
    // Start with either filtered products or category filtered products
    let items = filteredItems.value.length > 0 
        ? [...filteredItems.value] 
        : [...categoryFilteredProducts.value];
    
    // Track if we have any actual products (not promos)
    const hasRealProducts = items.length > 0;
    
    // Ensure we have valid promotionalSpots array
    if (Array.isArray(promotionalSpots.value)) {
        // Sort promotions by position to ensure correct order
        const sortedPromos = [...promotionalSpots.value].sort((a, b) => a.position - b.position);
        
        // Insert each promotion at its specified position
        sortedPromos.forEach(promo => {
            // Ensure position is within bounds and valid
            const position = Math.min(Math.max(0, promo.position), items.length);
            
            // Create promo item with all necessary properties
            const promoItem = {
                ...promo,
                id: `promo-${promo.position}`,
                isPromo: true,
                image: {
                    ...promo.image,
                    imageUrl: promo.image.imageUrl,
                    alt: promo.image.alt || 'Promotional image'
                }
            };
            
            // Insert promo at calculated position
            items.splice(position, 0, promoItem);
        });
    }
    
    // Store whether we have only promos for use in the template
    onlyPromosShowing.value = items.length > 0 && items.every(item => item.isPromo === true);
    
    return items;
});

// Add this ref to track if we're only showing promos
const onlyPromosShowing = ref(false);

const handleFilteredProducts = (filtered) => {
    filteredItems.value = filtered;
};

const clearFilters = () => {
    filteredItems.value = [];
    // Reset route query if there's a category
    if (currentCategory.value) {
        navigateTo('/products');
    }
};

// Initialize with route category
onMounted(() => {
    // Ensure we have products before setting filtered items
    if (currentCategory.value && allProducts.value?.length > 0) {
        filteredItems.value = categoryFilteredProducts.value;
    }
});

// Helper function to calculate promo container classes
const getPromoContainerClass = (promo) => {
    const baseClasses = {
        'relative': true,
        'h-full': true,
        'w-full': true,
    };
    
    // Calculate grid span based on promo type
    switch (promo.type) {
        case '2x2':
            return {
                ...baseClasses,
                'sm:col-span-2 row-span-2': true,
            };
        case '2x1':
            return {
                ...baseClasses,
                'sm:col-span-2 row-span-1': true,
            };
        case '1x2':
            return {
                ...baseClasses,
                'col-span-1 row-span-2': true,
            };
        case '1x1':
        default:
            return {
                ...baseClasses,
                'col-span-1 row-span-1': true,
            };
    }
};

// Apply URL filters to products
const applyUrlFilters = () => {
    let results = [...allProducts.value];
    
    // Apply category filter
    if (currentCategory.value) {
        results = results.filter(product => 
            product.categories && product.categories.includes(currentCategory.value)
        );
    }
    
    // Apply search query
    if (route.query.q) {
        const query = route.query.q.toLowerCase();
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
    if (route.query.minPrice) {
        results = results.filter(product => product.price >= Number(route.query.minPrice));
    }
    
    if (route.query.maxPrice) {
        results = results.filter(product => product.price <= Number(route.query.maxPrice));
    }
    
    // Apply size filters
    if (route.query.sizes) {
        const sizes = route.query.sizes.split(',');
        results = results.filter(product => {
            if (!product.size || !Array.isArray(product.size)) return false;
            return sizes.some(size => product.size.includes(size));
        });
    }
    
    // Apply brand filters
    if (route.query.brands) {
        const brands = route.query.brands.split(',');
        results = results.filter(product => brands.includes(product.brand));
    }
    
    filteredItems.value = results;
};

// Initialize
onMounted(async () => {
    // Refresh products if needed
    if (allProducts.value.length === 0) {
        await fetchData();
    }
    
    // Apply URL filters
    applyUrlFilters();
});

// Watch for route changes to update filters
watch(() => route.query, () => {
    applyUrlFilters();
}, { deep: true });

// Watch for changes in all products to reapply filters
watch(() => allProducts.value, () => {
    if (allProducts.value.length > 0) {
        applyUrlFilters();
    }
}, { deep: true });

// Replace the existing recommendedProducts computed property with this improved version
const recommendedProducts = computed(() => {
    // Only show recommendations when we have no actual products (only promos or nothing)
    const hasActualProducts = mixedItems.value.some(item => !item.isPromo);
    if (hasActualProducts) return [];
    if (!allProducts.value?.length) return [];
    
    // Get products based on current category if possible
    let recommendations = [];
    
    if (currentCategory.value) {
        // First try to get other products from the same category
        // that might not match the current filters
        recommendations = allProducts.value.filter(product => 
            product.categories?.includes(currentCategory.value)
        ).slice(0, 4);
        
        // If no products in this category, get products from parent category if possible
        if (recommendations.length === 0 && currentCategory.value.includes('_')) {
            const parentCategory = currentCategory.value.split('_')[0];
            recommendations = allProducts.value.filter(product => 
                product.categories?.some(cat => cat.startsWith(parentCategory))
            ).slice(0, 4);
        }
    }
    
    // If we still don't have recommendations or not enough, add popular products
    if (recommendations.length < 4) {
        // Sort by stock as a simple popularity metric and get products
        // that aren't already in recommendations
        const popularProducts = [...allProducts.value]
            .sort((a, b) => {
                const stockA = typeof a.stock === 'number' ? a.stock : 0;
                const stockB = typeof b.stock === 'number' ? b.stock : 0;
                return stockB - stockA;
            })
            .filter(product => !recommendations.some(p => p.id === product.id))
            .slice(0, 4 - recommendations.length);
            
        recommendations = [...recommendations, ...popularProducts];
    }
    
    return recommendations;
});

// Add a computed property for popular products
const popularProducts = computed(() => {
    if (!allProducts.value?.length) return [];
    
    // Get the top 4 products by stock level
    return [...allProducts.value]
        .sort((a, b) => {
            const stockA = typeof a.stock === 'number' ? a.stock : 0;
            const stockB = typeof b.stock === 'number' ? b.stock : 0;
            return stockB - stockA;
        })
        .slice(0, 4);
});
</script>

<style scoped>
.grid {
    grid-auto-flow: dense;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-auto-rows: 500px;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 1280px) {
    .grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

/* Responsive adjustments for mobile */
@media (max-width: 639px) {
    .grid > * {
        grid-column: 1 / -1 !important;
        grid-row: span 1 !important;
        height: 500px !important;
    }
    
    /* Make 2x2 promos taller on mobile */
    .grid > div[class*="row-span-2"] {
        grid-row: span 2 !important;
        height: 1000px !important;
    }
}
</style> 