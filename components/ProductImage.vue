<template>
    <div class="relative max-w-2xl mx-auto">
        <!-- Hovedbillede med hover-zoom -->
        <div class="relative overflow-hidden rounded-lg cursor-pointer" @mousemove="handleZoom" @mouseleave="resetZoom"
            ref="imageContainer" @click="openLightbox">
            <img :src="selectedImage" class="w-full h-auto object-cover transition-transform duration-300 ease-out"
                :class="{ 'scale-110': isZoomed }" />
        </div>

        <!-- Thumbnail navigation -->
        <div class="flex mt-4 space-x-2">
            <img v-for="(img, index) in product.images" :key="index" :src="img"
                class="w-16 h-16 object-cover rounded cursor-pointer transition-transform duration-200 hover:scale-110"
                :class="{ 'border-4 border-black': selectedImage === img }" @click="selectedImage = img" />
        </div>

        <!-- Lightbox (fullscreen visning) -->
        <div v-if="lightboxOpen" class="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
            @click="lightboxOpen = false">
            <img :src="selectedImage" class="max-w-full max-h-full object-contain" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const selectedImage = ref(props.product.images[0]);
const lightboxOpen = ref(false);
const isZoomed = ref(false);

const handleZoom = () => {
    isZoomed.value = true;
};

const resetZoom = () => {
    isZoomed.value = false;
};

const openLightbox = () => {
    lightboxOpen.value = true;
};
</script>

<style scoped>
/* Lightbox animation */
.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity 0.3s ease;
}

.lightbox-enter,
.lightbox-leave-to {
    opacity: 0;
}
</style>
