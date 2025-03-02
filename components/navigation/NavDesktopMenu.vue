<template>
  <div class="hidden lg:block flex-grow max-w-3xl mx-12">
    <ul class="flex justify-center space-x-8 text-sm font-medium tracking-wide uppercase">
      <!-- Add All Products link -->
      <li class="relative group">
        <NuxtLink 
          to="/products" 
          class="nav-link flex items-center py-6">
          Produkter
        </NuxtLink>
      </li>
      
      <li v-for="category in categories" 
          :key="category.id" 
          class="relative group">
        <NuxtLink 
          :to="`/products?category=${category.id}`" 
          class="nav-link flex items-center py-6">
          {{ category.name.dk }}
          <svg v-if="category.categories" 
              class="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </NuxtLink>
        
        <!-- Mega Menu -->
        <div v-if="category.categories" 
            class="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl bg-white shadow-lg border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-30">
          <div class="grid grid-cols-4 gap-8 p-8">
            <div v-for="subCategory in category.categories" 
                 :key="subCategory.id" 
                 class="space-y-4">
              <NuxtLink 
                :to="`/products?category=${subCategory.id}`"
                class="block font-semibold text-gray-900 hover:text-black">
                {{ subCategory.name.dk }}
              </NuxtLink>
              
              <ul v-if="subCategory.categories" class="space-y-2">
                <li v-for="thirdLevel in subCategory.categories" 
                    :key="thirdLevel.id">
                  <NuxtLink 
                    :to="`/products?category=${thirdLevel.id}`"
                    class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {{ thirdLevel.name.dk }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.nav-link {
  @apply text-gray-900 relative;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200;
}

.nav-link:hover::after {
  @apply w-full;
}

.group:hover .nav-link {
  @apply text-black;
}
</style> 