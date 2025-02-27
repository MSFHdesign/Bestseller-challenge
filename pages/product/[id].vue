<template>
    <div v-if="product" class="container mx-auto p-6">
        <h1 class="text-3xl font-bold">{{ product.name.dk || product.name.en }}</h1>

    
        <ProductImage :product="product" />

        <p class="text-lg text-gray-500"><strong>Brand:</strong> {{ product.brand }}</p>
        <p class="text-xl text-gray-900"><strong>Pris:</strong> {{ product.price }} DKK</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import ProductImage from '~/components/ProductImage.vue'; // IMPORTÉR KOMPONENTEN

const route = useRoute();
const product = ref(null);

const fetchProducts = async () => {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data && data.products) {
            product.value = data.products.find(p => String(p.id) === String(route.params.id));
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }
};

// Hent produkt ved page load
onMounted(() => {
    fetchProducts();
});
</script>
