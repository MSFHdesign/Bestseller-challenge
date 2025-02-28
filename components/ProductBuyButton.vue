<template>
    <button v-if="!isInCartPage" @click="addToCart"
        class="mt-6 bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105"
        :disabled="product.stock === 0">
        {{ product.stock > 0 ? "🛒 Læg i kurv" : "❌ Ikke på lager" }}
    </button>

    <NuxtLink v-else to="/checkout"
        class="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 block text-center">
        ✅ Gå til checkout
    </NuxtLink>
</template>

<script setup>
import { useCart } from '@/composables/useCart';
import { useRoute } from 'vue-router'; // Hent ruten

const props = defineProps({ product: Object });
const cart = useCart();
const route = useRoute();

const isInCartPage = route.path === "/cart"; // ✅ Tjek om brugeren er på kurv-siden

const addToCart = () => {
    const existingProduct = cart.value.find((item) => item.id === props.product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.value.push({ ...props.product, quantity: 1 });
    }

    console.log("Kurvens indhold:", cart.value); // ✅ Debugging
};

</script>
