import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/CSS/tailwind.css"],
  modules: ["@nuxt/content", "@nuxt/image"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: true,
  routeRules: {
    '/product/**': { prerender: true }, // Force Nuxt to treat `/product/[id]` as a dynamic route
  },
  components: {
    dirs: [
      '~/components',
      '~/components/product'
    ]
  },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://bestseller-challenge-6dd9.vercel.app'
    }
  }
});
