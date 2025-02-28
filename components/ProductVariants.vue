<template>
    <div v-if="product.variant && product.variant.length" class="mt-6">
        <h2 class="text-lg font-semibold">Tilgængelige varianter:</h2>
        <div v-for="(variant, index) in product.variant" :key="index" class="border p-4 rounded-lg mt-2">
            <p><strong>Farve:</strong> {{ variant.color }}</p>
            <p><strong>Størrelser:</strong> {{ variant.size.join(", ") }}</p>
            <p class="text-sm text-gray-500">Lager: {{ variant.stock }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({ product: Object });
</script>
