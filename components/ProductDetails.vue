<template>
    <div>
        <p class="text-lg text-gray-500"><strong>Brand:</strong> {{ product.brand }}</p>
        <p class="text-xl text-gray-900"><strong>Pris:</strong> {{ product.price }} DKK</p>

        <!-- Lagerstatus -->
        <p class="text-lg font-semibold mt-2" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
            {{ product.stock > 0 ? "✅ På lager" : "❌ Udsolgt" }}
        </p>

        <!-- Beskrivelse -->
        <p class="mt-4 text-gray-700">{{ product.description }}</p>

        <!-- Varianter -->
        <div v-if="product.variant && product.variant.length" class="mt-6">
            <h2 class="text-lg font-semibold">Tilgængelige varianter:</h2>
            <div v-for="(variant, index) in product.variant" :key="index" class="border p-4 rounded-lg mt-2">
                <p><strong>Farve:</strong> {{ variant.color }}</p>
                <p><strong>Størrelser:</strong> {{ variant.size.join(", ") }}</p>
                <p class="text-sm text-gray-500">Lager: {{ variant.stock }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ product: Object });
</script>
