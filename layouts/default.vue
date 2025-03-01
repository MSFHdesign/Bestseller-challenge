<template>
  <div class="min-h-screen pl-0 ">
    <NavBar />
    <main class="pt-16">
      <slot />
    </main>
    <Toast />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue';
import Toast from '~/components/Toast.vue';
</script> 