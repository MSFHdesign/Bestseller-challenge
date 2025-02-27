<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold">Product Listing</h1>

  

        <div class="grid grid-cols-4 gap-6 mt-6">
            <template v-for="(item, index) in mixedItems" :key="index">
                <PromotionBanner v-if="item.isPromo" :promo="item" />
                <ProductCard v-else :product="item" />
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '~/components/ProductCard.vue';
import PromotionBanner from '~/components/PromotionBanner.vue';

const products = ref([]);
const promotions = ref([]);

// Hent produkter
const fetchProducts = async () => {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data && data.products) {
            products.value = data.products;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Hent promotions
const fetchPromotions = async () => {
    try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        console.log("Fetched promotions:", data); // Debug log
        if (data && data.promotionalSpots) {
            promotions.value = data.promotionalSpots;
        }
    } catch (error) {
        console.error('Error fetching promotions:', error);
    }
};

// Hent data når komponenten loades
onMounted(async () => {
    await fetchProducts();
    await fetchPromotions();
    console.log("Final promotions:", promotions.value); // Debug log
});

// Kombiner produkter og promotions
const mixedItems = computed(() => {
    let items = [...products.value];

    promotions.value.forEach((promo) => {
        items.splice(promo.position, 0, { ...promo, isPromo: true });
    });

    return items;
});
</script>
