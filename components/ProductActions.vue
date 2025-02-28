<template>
    <div class="mt-6">
        <button
            class="w-full bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105"
            :disabled="product.stock === 0">
            {{ product.stock > 0 ? "🛒 Læg i kurv" : "❌ Ikke på lager" }}
        </button>
    </div>
</template>

<script setup>
defineProps({ product: Object });
</script>
