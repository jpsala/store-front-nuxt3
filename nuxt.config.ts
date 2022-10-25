export default defineNuxtConfig({
  preflight: false,
  modules: [
    'nuxt-windicss',
    '@pinia/nuxt'
  ],
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL
  },
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  css: [
    'assets/styles/main.css',
    'assets/styles/popover.css'
  ],
})
