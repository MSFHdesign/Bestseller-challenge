<template>
  <div class="container mx-auto p-6 pt-32">
    <div class="max-w-md mx-auto text-center space-y-4">
      <div class="text-4xl">😢</div>
      <h2 class="text-2xl font-bold text-red-500">{{ error }}</h2>
      <p class="text-gray-600">
        Prøv at genindlæse siden eller gå tilbage til produktoversigten
      </p>
      <div class="flex justify-center gap-4 pt-4">
        <button 
          @click="() => window.location.reload()"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          🔄 Genindlæs
        </button>
        <NuxtLink 
          to="/products"
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          👈 Tilbage til produkter
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: { type: String, required: true }
});
</script> 