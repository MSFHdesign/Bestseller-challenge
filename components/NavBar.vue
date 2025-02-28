<template>
    <nav class="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-40">
        <div class="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
            <!-- Left Section with Logo and Sidebar Toggle -->
            <div class="flex items-center gap-4">
                <!-- Sidebar Toggle Button -->
                <button 
                    @click="toggleSidebar"
                    class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Toggle sidebar navigation"
                >
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <!-- Logo -->
                <NuxtLink to="/" class="flex-shrink-0" @click="refreshData">
                    <img src="https://bestseller.com/media/jvnn3xxh/bestseller_logo_black_2021-1.png" 
                         alt="Bestseller" 
                         class="h-8 w-auto"
                    />
                </NuxtLink>
            </div>

            <!-- Main Navigation (Center) -->
            <div class="hidden lg:block flex-grow max-w-3xl mx-12">
                <ul class="flex justify-center space-x-8 text-sm font-medium tracking-wide uppercase">
                    <li v-for="category in mainCategories" 
                        :key="category.id" 
                        class="relative group">
                        <NuxtLink 
                            :to="`/products?category=${category.id}`" 
                            class="nav-link flex items-center py-6">
                            {{ category.name.dk }}
                            <svg v-if="category.categories" 
                                class="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </NuxtLink>
                        
                        <!-- Mega Menu -->
                        <div v-if="category.categories" 
                            class="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white shadow-lg border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-30">
                            <div class="grid grid-cols-4 gap-8 p-8">
                                <div v-for="subCategory in category.categories" 
                                     :key="subCategory.id" 
                                     class="space-y-4">
                                    <NuxtLink 
                                        :to="`/products?category=${subCategory.id}`"
                                        class="block font-semibold text-gray-900 hover:text-black">
                                        {{ subCategory.name.dk }}
                                    </NuxtLink>
                                    
                                    <ul v-if="subCategory.categories" class="space-y-2">
                                        <li v-for="thirdLevel in subCategory.categories" 
                                            :key="thirdLevel.id">
                                            <NuxtLink 
                                                :to="`/products?category=${thirdLevel.id}`"
                                                class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                                {{ thirdLevel.name.dk }}
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Right Side Actions -->
            <div class="flex items-center space-x-4">
                <!-- Search Button (Desktop) -->
                <button 
                    @click="toggleSidebar"
                    class="hidden md:block p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Search"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                
                <!-- Wishlist -->
                <NuxtLink to="/wishlist" class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </NuxtLink>
                
                <!-- Cart -->
                <button 
                    @click="toggleCart"
                    class="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
                    aria-label="Shopping cart"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span v-if="cartItems.length" 
                          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {{ cartItems.length }}
                    </span>
                </button>
                
                <!-- Mobile Menu Toggle -->
                <button 
                    @click="toggleMobileMenu"
                    class="lg:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Toggle mobile menu"
                >
                    <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="isMobileMenuOpen" 
             class="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div class="container mx-auto px-4 py-6">
                <nav class="space-y-6">
                    <ul class="space-y-4">
                        <li v-for="category in mainCategories" :key="category.id">
                            <NuxtLink 
                                :to="`/products?category=${category.id}`"
                                class="block font-medium py-2"
                                @click="toggleMobileMenu">
                                {{ category.name.dk }}
                            </NuxtLink>
                            <ul v-if="category.categories" class="pl-4 mt-2 space-y-2">
                                <li v-for="subCategory in category.categories" :key="subCategory.id">
                                    <NuxtLink 
                                        :to="`/products?category=${subCategory.id}`"
                                        class="block text-sm text-gray-600 py-1"
                                        @click="toggleMobileMenu">
                                        {{ subCategory.name.dk }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </nav>

    <!-- Add SidebarMenu here -->
    <SidebarMenu 
        :is-open="isSidebarOpen"
        :all-products="allProducts"
        @close="closeSidebar"
        class="z-50"
    />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { useCart } from "@/composables/useCart";
import data from '@/server/data/data.json';
import SidebarMenu from '@/components/SidebarMenu.vue';
import { useProducts } from '~/composables/useProducts';

const route = useRoute();
const { cart } = useCart();
const { products, refresh, loading, hasInitialized } = useProducts();
const cartItems = computed(() => cart.value);
const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isSidebarOpen = ref(false);
const allProducts = computed(() => products.value || []);

// Get main categories (excluding root)
const mainCategories = computed(() => {
    return data.categories.categories.filter(cat => cat.id !== 'root');
});

const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
    isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    isCartOpen.value = false;
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
    isCartOpen.value = false;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};

// Update the refresh function
const refreshData = async () => {
    if (!loading.value && !hasInitialized.value) {
        await refresh();
    }
};

// Watch for route changes but only refresh if necessary
watch(
    () => route.path,
    async (newPath, oldPath) => {
        if (newPath !== oldPath && !hasInitialized.value && !loading.value) {
            await refreshData();
        }
    }
);

// Initial data fetch only if needed
onMounted(async () => {
    if (!hasInitialized.value && !loading.value) {
        await refreshData();
    }
});
</script>

<style scoped>
.nav-link {
    @apply text-gray-900 relative;
}

.nav-link::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200;
}

.nav-link:hover::after {
    @apply w-full;
}

.group:hover .nav-link {
    @apply text-black;
}
</style>
