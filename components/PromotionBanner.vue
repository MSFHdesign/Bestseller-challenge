<template>
    <div class="col-span-2">
        <img :src="promo.image.imageUrl" :alt="promo.image.alt" class="w-full h-full object-cover rounded-lg" />
    </div>
</template>

<script setup>
defineProps({ promo: Object });
</script>
