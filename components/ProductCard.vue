<template>
    <div class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-[500px]">
        <!-- Wishlist Button -->
        <button @click.prevent="handleToggleWishlist" 
            class="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:scale-110 transition-transform">
            <span v-if="isProductInWishlist" class="text-red-500">❤️</span>
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
            <NuxtLink :to="`/product/${product.id}`" class="flex flex-col flex-grow p-4 overflow-hidden">
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
                    <div class="flex items-center gap-2 mt-auto">
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

            <!-- CTA Button Area - Always at Bottom -->
            <div class="mt-auto">
                <!-- Quick Add to Cart Button (when product has no sizes) -->
                <button v-if="product.stock > 0 && (!product.size || product.size.length === 0)"
                    @click.prevent="handleAddToCart"
                    class="block w-full bg-black dark:bg-white text-white dark:text-black h-[50px] font-medium 
                        hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300
                        text-center leading-[50px]"
                >
                    Læg i kurv
                </button>
                
                <!-- View Product Button (when product has sizes or is out of stock) -->
                <NuxtLink v-else
                    :to="`/product/${product.id}`"
                    class="block w-full bg-black dark:bg-white text-white dark:text-black h-[50px] font-medium 
                        hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300
                        disabled:bg-gray-300 disabled:cursor-not-allowed text-center leading-[50px]"
                >
                    {{ product.stock > 0 ? 'Vælg størrelse →' : 'Ikke på lager' }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWishlist } from '~/composables/useWishlist';
import { useCart } from '~/composables/useCart';
import { useToast } from '~/composables/useToast';

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const { isInWishlist, toggleWishlist } = useWishlist();
const { cart, addToCart } = useCart();
const toast = useToast();

// Check if product is in wishlist
const isProductInWishlist = computed(() => {
    return isInWishlist(props.product.id);
});

// Handle add to cart
const handleAddToCart = () => {
    // Only add to cart if product has no sizes
    if (props.product.stock > 0 && (!props.product.size || props.product.size.length === 0)) {
        addToCart(props.product);
        
        // Add notification feedback
        toast.addToast('Produkt tilføjet til kurven! 🛍️', 'success', 5000, {
            label: 'Gå til kurv',
            onClick: () => navigateTo('/cart')
        });
    }
};

const handleToggleWishlist = () => {
    // First check current state
    const wasInWishlist = isProductInWishlist.value;
    
    // Then toggle the state
    toggleWishlist(props.product.id);
    
    // Show appropriate message based on the previous state
    if (wasInWishlist) {
        // If it was in wishlist before toggling, it's now removed
        toast.addToast('Fjernet fra favoritter 🤍', 'info', 3000);
    } else {
        // If it wasn't in wishlist before toggling, it's now added
        toast.addToast('Tilføjet til favoritter ❤️', 'success', 3000);
    }
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
