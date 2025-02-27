export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  modules: ["@nuxt/content", "@nuxt/image"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: true,
  routeRules: {
    '/product/**': { ssr: true }, // 🔥 Force Nuxt to treat `/product/[id]` as a dynamic route
  },
});
