<template>
  <div class="min-h-screen">
    <NavBar />
    <main>
      <slot />
    </main>
    <Toast />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue';
import Toast from '~/components/Toast.vue';
</script> 