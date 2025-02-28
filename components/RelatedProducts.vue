<template>
    <div class="mt-12 px-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">✨ Du vil måske også kunne lide</h2>

        <div class="relative">
            <!-- ⏪ Scroll knap venstre -->
            <button @click="scrollLeft"
                class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hidden md:block z-10">
                ◀
            </button>

            <!-- 🛍 Produkt-slider -->
            <div ref="slider" class="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide flex space-x-6 px-4">
                <div v-for="product in relatedProducts" :key="product.id"
                    class="inline-block w-64 bg-white shadow-lg rounded-lg p-4 transition-transform hover:scale-105 border border-gray-200 h-[420px] flex flex-col justify-between">

                    <NuxtLink :to="`/produkt/${product.id}`">
                        <img v-if="product.images && product.images.length > 0"
                            :src="product.images[0]"
                            :alt="product.name.dk"
                            class="w-full h-[260px] object-cover rounded-lg">
                    </NuxtLink>

                    <div class="mt-3 flex-1 text-center">
                        <h3 class="text-md font-semibold text-gray-800 truncate max-w-[90%] mx-auto">
                            {{ product.name.dk || product.name.en || "Mangler navn" }}
                        </h3>
                        <p class="text-gray-500 text-sm">{{ product.brand }}</p>
                        <p class="text-lg font-bold text-blue-600 mt-1">{{ product.price.toFixed(2) }} kr</p>
                    </div>

                    <button @click="addToCart(product)"
                        class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        🛒 Læg i kurv
                    </button>
                </div>
            </div>

            <!-- ⏩ Scroll knap højre -->
            <button @click="scrollRight"
                class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hidden md:block z-10">
                ▶
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCart } from "@/composables/useCart";

// PROPS - Får aktuel kategori & produktliste
const props = defineProps({
    currentCategories: Array, // Opdateret til at tage en liste af kategorier
    allProducts: Array
});

const cart = useCart();
const slider = ref(null);

// 📌 Forbedret kategori-matching
const relatedProducts = computed(() => {
    if (!props.currentCategories || !Array.isArray(props.currentCategories)) return [];

    return props.allProducts
        .filter(p => p.categories.some(cat => props.currentCategories.includes(cat))) // Matcher mindst én kategori
        .slice(0, 6); // Max 6 produkter
});

// 🛒 Tilføj produkt til kurv
const addToCart = (product) => {
    const existingProduct = cart.value.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.value.push({ ...product, quantity: 1 });
    }
};

// ⏪ Scroll venstre
const scrollLeft = () => {
    if (slider.value) {
        slider.value.scrollBy({ left: -300, behavior: "smooth" });
    }
};

// ⏩ Scroll højre
const scrollRight = () => {
    if (slider.value) {
        slider.value.scrollBy({ left: 300, behavior: "smooth" });
    }
};
</script>

<style scoped>
/* 🔥 Fjerner scrollbar styling */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* 💎 Ens margin & spacing */
h3 {
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
