<template>
    <div v-motion-fade class="border p-4 shadow-md rounded-lg hover:shadow-lg transition">
        <NuxtLink :to="`/product/${product.id}`">
            <img :src="product.images[0]"
                class="w-full h-40 object-cover rounded-lg hover:scale-110 transition-transform" />
            <h2 class="mt-2 text-lg font-semibold">{{ product.name.dk || product.name.en }}</h2>
            <p class="text-sm text-gray-500">{{ product.price }} DKK</p>
            
        </NuxtLink>
    </div>
</template>

<script setup>
defineProps({ product: Object });
</script>
