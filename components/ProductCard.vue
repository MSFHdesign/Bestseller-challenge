<template>
    <div class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[400px] flex flex-col">
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

        <NuxtLink :to="`/product/${product.id}`" class="flex-grow">
            <!-- Image Container -->
            <div class="relative overflow-hidden aspect-square">
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
            <div class="p-4 flex flex-col flex-grow">
                <!-- Brand if exists -->
                <p v-if="product.brand" class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {{ product.brand }}
                </p>

                <!-- Product Name -->
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {{ product.name.dk || product.name.en }}
                </h2>

                <!-- Price Section -->
                <div class="flex items-center gap-2 mb-3">
                    <span v-if="product.originalPrice && product.originalPrice > product.price" 
                        class="text-sm text-gray-400 line-through">
                        {{ product.originalPrice }} DKK
                    </span>
                    <span class="text-lg font-bold" :class="{'text-red-500': product.onSale}">
                        {{ product.price }} DKK
                    </span>
                </div>

                <!-- Color & Size -->
                <div class="flex gap-2 mb-3">
                    <span v-if="product.color" 
                        class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {{ product.color }}
                    </span>
                    <span v-if="product.size" 
                        class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {{ product.size }}
                    </span>
                </div>
            </div>
        </NuxtLink>

        <!-- Quick Add to Cart - Fixed onClick handler -->
        <button @click="handleAddToCart" 
            class="w-full bg-black dark:bg-white text-white dark:text-black py-3 font-medium 
                hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300
                disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="product.stock === 0">
            {{ product.stock === 0 ? 'Udsolgt' : 'Læg i kurv' }}
        </button>
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
