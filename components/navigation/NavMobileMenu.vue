<template>
  <div class="lg:hidden bg-white border-t border-gray-100 shadow-lg">
    <div class="container mx-auto px-4 py-6">
      <nav class="space-y-6">
        <ul class="space-y-4">
          <!-- Add All Products link to mobile menu -->
          <li>
            <NuxtLink 
              to="/products"
              class="block font-medium py-2"
              @click="$emit('toggle-mobile-menu')">
              Alle produkter
            </NuxtLink>
          </li>
          
          <li v-for="category in categories" :key="category.id">
            <NuxtLink 
              :to="`/products?category=${category.id}`"
              class="block font-medium py-2"
              @click="$emit('toggle-mobile-menu')">
              {{ category.name.dk }}
            </NuxtLink>
            <ul v-if="category.categories" class="pl-4 mt-2 space-y-2">
              <li v-for="subCategory in category.categories" :key="subCategory.id">
                <NuxtLink 
                  :to="`/products?category=${subCategory.id}`"
                  class="block text-sm text-gray-600 py-1"
                  @click="$emit('toggle-mobile-menu')">
                  {{ subCategory.name.dk }}
                </NuxtLink>
                
                <!-- Add third level categories -->
                <ul v-if="subCategory.categories" class="pl-4 mt-1 space-y-1">
                  <li v-for="thirdLevel in subCategory.categories" :key="thirdLevel.id">
                    <NuxtLink 
                      :to="`/products?category=${thirdLevel.id}`"
                      class="block text-xs text-gray-500 py-1"
                      @click="$emit('toggle-mobile-menu')">
                      {{ thirdLevel.name.dk }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  }
});

defineEmits(['toggle-mobile-menu']);
</script> 