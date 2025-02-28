<template>
    <nav class="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md shadow-lg z-50">
        <div class="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

            <!-- 🛒 Kurv -->
            <div class="relative">
                <button @click="toggleCart"
                    class="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-md">
                    🛒
                    <span v-if="cartItems.length > 0"
                        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        {{ cartItems.length }}
                    </span>
                </button>
                <div v-if="isCartOpen"
                    class="absolute left-0 mt-3 w-72 bg-white shadow-2xl rounded-lg p-4 animate-fade-in border border-gray-200">
                    <h2 class="font-bold text-lg mb-2 text-gray-800">🛍 Din Kurv</h2>
                    <div v-if="cartItems.length === 0" class="text-gray-500">Kurven er tom</div>
                    <ul v-else>
                        <li v-for="item in cartItems" :key="item.id"
                            class="flex justify-between items-center border-b py-2 text-gray-700">
                            <span>{{ item.name?.dk || item.name?.en }} (x{{ item.quantity }})</span>
                            <span class="font-bold">{{ item.price * item.quantity }} kr</span>
                        </li>
                    </ul>
                    <NuxtLink to="/cart"
                        class="mt-3 block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition">
                        Gå til kurven
                    </NuxtLink>
                </div>
            </div>

            <!-- 🌍 Navigation Links -->
            <ul class="hidden md:flex space-x-8 text-lg font-semibold">
                <li>
                    <NuxtLink to="/" class="nav-link">🏠 Hjem</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/products" class="nav-link">🛒 Produkter</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/kontakt" class="nav-link">📞 Kontakt</NuxtLink>
                </li>
            </ul>

            <!-- 🍔 Mobile Menu -->
            <button @click="toggleMobileMenu"
                class="md:hidden text-2xl text-gray-800 hover:scale-110 transition-transform">
                🍔
            </button>
        </div>

        <!-- 📱 Mobilmenu -->
        <div v-if="isMobileMenuOpen"
            class="md:hidden bg-white shadow-xl p-4 fixed w-full left-0 top-16 animate-slide-in">
            <ul class="flex flex-col items-center space-y-4">
                <li>
                    <NuxtLink to="/" @click="toggleMobileMenu" class="nav-link">🏠 Hjem</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/produkter" @click="toggleMobileMenu" class="nav-link">🛒 Produkter</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/kontakt" @click="toggleMobileMenu" class="nav-link">📞 Kontakt</NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCart } from "@/composables/useCart";

const { cart } = useCart();
const cartItems = computed(() => cart.value);
const isCartOpen = ref(false);
const isMobileMenuOpen = ref(false);

const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
    isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    isCartOpen.value = false;
};
</script>

<style scoped>
/* ✨ Fancy hover-effekt på links */
.nav-link {
    color: #333;
    position: relative;
    transition: color 0.3s ease-in-out;
}

.nav-link:hover {
    color: #007bff;
}

.nav-link::after {
    content: "";
    width: 0%;
    height: 2px;
    background: #007bff;
    position: absolute;
    left: 50%;
    bottom: -4px;
    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
}

.nav-link:hover::after {
    width: 100%;
    left: 0;
}

/* 🔥 Animationer */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

.animate-slide-in {
    animation: slide-in 0.4s ease-out;
}
</style>
