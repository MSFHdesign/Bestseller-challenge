<template>
    <div class="mt-4">
        <h2 class="text-lg font-semibold">Kategorier:</h2>
        <ul class="list-disc list-inside text-gray-600">
            <li v-for="(category, index) in product.categories" :key="index">{{ category }}</li>
        </ul>
    </div>
</template>

<script setup>
defineProps({ product: Object });
</script>
