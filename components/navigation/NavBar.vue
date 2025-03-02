<template>
  <nav class="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-40">
    <div class="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
      <!-- Left Section with Logo and Sidebar Toggle -->
      <NavLogo 
        @toggle-sidebar="toggleSidebar" 
        @refresh-data="refreshData" 
      />

      <!-- Main Navigation (Center) -->
      <NavDesktopMenu :categories="mainCategories" />

      <!-- Right Side Actions -->
      <NavActions 
        :cart-items="cartItems"
        :wishlist-count="wishlistCount"
        :is-mobile-menu-open="isMobileMenuOpen"
        @toggle-cart="toggleCart"
        @toggle-sidebar="toggleSidebar"
        @toggle-mobile-menu="toggleMobileMenu"
      />
    </div>
    
    <!-- Mobile Menu -->
    <NavMobileMenu 
      v-if="isMobileMenuOpen" 
      :categories="mainCategories"
      @toggle-mobile-menu="toggleMobileMenu"
    />
  </nav>

  <!-- Add SidebarMenu here -->
  <SidebarMenu 
    :is-open="isSidebarOpen"
    :all-products="allProducts"
    @close="closeSidebar"
    class="z-50"
  />

  <!-- Add Cart Drawer -->
  <NavCartDrawer
    :is-open="isCartOpen"
    :cart-items="cartItems"
    :cart-total="cartTotal"
    @close="closeCart"
    @increase-quantity="increaseQuantity"
    @decrease-quantity="decreaseQuantity"
    @remove-from-cart="removeFromCart"
    @navigate-to-cart="navigateToCart"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useCart } from "@/composables/useCart";
import { useWishlist } from '~/composables/useWishlist';
import { useEventBus } from '~/composables/useEventBus';
import data from '@/server/data/data.json';
import SidebarMenu from '@/components/SidebarMenu.vue';
import { useProducts } from '~/composables/useProducts';
import NavLogo from './NavLogo.vue';
import NavDesktopMenu from './NavDesktopMenu.vue';
import NavActions from './NavActions.vue';
import NavMobileMenu from './NavMobileMenu.vue';
import NavCartDrawer from './NavCartDrawer.vue';

const route = useRoute();
const router = useRouter();
const { cart, removeItem, updateQuantity } = useCart();
const { products, refresh, loading, hasInitialized } = useProducts();
const { wishlist } = useWishlist();
const { on } = useEventBus();

const cartItems = computed(() => cart.value);
const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isSidebarOpen = ref(false);
const allProducts = computed(() => products.value || []);

// Calculate cart total
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
});

// Format price
const formatPrice = (price) => {
  return `${price.toFixed(2)} kr`;
};

// Get main categories (excluding root)
const mainCategories = computed(() => {
  return data.categories.categories.filter(cat => cat.id !== 'root');
});

// Wishlist count with local state for immediate updates
const wishlistCount = ref(wishlist.value.length);

// Listen for wishlist updates
onMounted(() => {
  on('wishlist:updated', (newWishlist) => {
    console.log('NavBar received wishlist update:', newWishlist);
    wishlistCount.value = newWishlist.length;
  });
});

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
  isMobileMenuOpen.value = false;
  isSidebarOpen.value = false;
};

const closeCart = () => {
  isCartOpen.value = false;
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

// Cart item quantity management
const increaseQuantity = (index) => {
  const item = cartItems.value[index];
  const newQuantity = (item.quantity || 1) + 1;
  updateQuantity(index, newQuantity);
};

const decreaseQuantity = (index) => {
  const item = cartItems.value[index];
  const currentQuantity = item.quantity || 1;
  if (currentQuantity > 1) {
    updateQuantity(index, currentQuantity - 1);
  }
};

const removeFromCart = (index) => {
  removeItem(index);
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

// Add navigation function
const navigateToCart = () => {
  closeCart();
  router.push('/cart');
};
</script> 