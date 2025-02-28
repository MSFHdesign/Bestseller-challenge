<template>
    <div class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        <!-- Wishlist Button -->
        <button @click.prevent="toggleWishlist" 
            class="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:scale-110 transition-transform">
            <span v-if="isInWishlist" class="text-red-500">❤️</span>
            <span v-else class="text-gray-400 hover:text-red-500">🤍</span>
        </button>

        <!-- Sale Badge -->
        <div v-if="product.onSale" 
            class="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            SALE
        </div>

        <!-- Stock Badge -->
        <div v-if="product.stock <= 5 && product.stock > 0" 
            class="absolute top-14 left-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
            Kun {{ product.stock }} tilbage
        </div>

        <!-- Main Content Area -->
        <div class="flex flex-col h-full">
            <!-- Image Section - Fixed Height -->
            <div class="relative overflow-hidden h-[300px] flex-shrink-0">
                <img :src="product.images[0]"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    :alt="product.name.dk || product.name.en"
                />
                <!-- Secondary Image on Hover -->
                <img v-if="product.images[1]"
                    :src="product.images[1]"
                    class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    :alt="product.name.dk || product.name.en"
                />
            </div>

            <!-- Product Info -->
            <NuxtLink :to="`/product/${product.id}`" class="flex flex-col flex-grow p-4">
                <div class="flex flex-col h-full">
                    <!-- Brand if exists -->
                    <p v-if="product.brand" class="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
                        {{ product.brand }}
                    </p>

                    <!-- Product Name - Limited to 2 lines -->
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                        {{ product.name.dk || product.name.en }}
                    </h2>

                    <!-- Price Section -->
                    <div class="flex items-center gap-2">
                        <span v-if="product.originalPrice && product.originalPrice > product.price" 
                            class="text-sm text-gray-400 line-through">
                            {{ product.originalPrice }} DKK
                        </span>
                        <span class="text-lg font-bold" :class="{'text-red-500': product.onSale}">
                            {{ product.price }} DKK
                        </span>
                    </div>
                </div>
            </NuxtLink>

            <!-- CTA Button - Always at Bottom -->
            <div class="mt-auto">
                <NuxtLink 
                    :to="`/product/${product.id}`"
                    class="block w-full bg-black dark:bg-white text-white dark:text-black h-[50px] font-medium 
                        hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300
                        disabled:bg-gray-300 disabled:cursor-not-allowed text-center leading-[50px]"
                >
                    Se produkt →
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWishlist } from '~/composables/useWishlist';
import { useCart } from '~/composables/useCart';

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const { isInWishlist, toggleWishlist } = useWishlist();
const { cart, addToCart } = useCart();

// Check if product is in wishlist
const isProductInWishlist = computed(() => {
    return isInWishlist(props.product.id);
});

// Handle add to cart
const handleAddToCart = () => {
    addToCart(props.product);
    // Optional: Add notification or feedback here
    console.log('Added to cart:', props.product.name.dk || props.product.name.en);
};
</script>

<style scoped>
/* Optional: Add custom transitions */
.group:hover .hover\:scale-110 {
    transform: scale(1.1);
}

/* Optional: Add loading skeleton animation */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
