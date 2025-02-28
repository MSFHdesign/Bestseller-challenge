<template>
    <nav class="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 pl-80">
        <div class="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
            <!-- Logo -->
            <NuxtLink to="/" class="flex-shrink-0" @click="refreshData">
                <img src="https://bestseller.com/media/jvnn3xxh/bestseller_logo_black_2021-1.png" 
                     alt="Bestseller" 
                     class="h-8 w-auto"
                />
            </NuxtLink>

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
                            class="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white shadow-lg border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
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
            <div class="flex items-center space-x-6">
                <!-- Sidebar Toggle Button -->
                <button @click="toggleSidebar"
                    class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                    <svg class="w-6 h-6 text-gray-700" 
                         fill="none" 
                         viewBox="0 0 24 24" 
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <!-- Cart -->
                <button @click="toggleCart"
                    class="relative group">
                    <svg class="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" 
                         fill="none" 
                         viewBox="0 0 24 24" 
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span v-if="cartItems.length > 0"
                        class="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {{ cartItems.length }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Cart Dropdown -->
        <div v-if="isCartOpen"
            class="absolute right-8 top-full mt-1 w-80 bg-white shadow-xl rounded-lg border border-gray-100 p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-medium">Shopping Bag</h2>
                <button @click="toggleCart" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <!-- Cart Content -->
            <div v-if="cartItems.length === 0" class="text-gray-500 text-sm">Your shopping bag is empty</div>
            <ul v-else class="space-y-3">
                <li v-for="item in cartItems" :key="item.id"
                    class="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span class="text-sm">{{ item.name?.dk || item.name?.en }}</span>
                    <span class="text-sm font-medium">{{ item.price * item.quantity }} kr</span>
                </li>
            </ul>
            <NuxtLink to="/cart"
                class="mt-4 block w-full bg-black text-white text-center py-2 px-4 rounded-md hover:bg-gray-900 transition-colors">
                View Shopping Bag
            </NuxtLink>
        </div>

        <!-- Mobile Menu -->
        <div v-if="isMobileMenuOpen"
            class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div class="flex justify-between items-center p-4 border-b">
                    <h2 class="font-medium">Menu</h2>
                    <button @click="toggleMobileMenu" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav class="p-4">
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

    <!-- Add overlay and move SidebarMenu here -->
    <SidebarMenu 
        :is-open="true"
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
