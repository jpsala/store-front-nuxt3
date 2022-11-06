export default defineNuxtConfig({
  preflight: false,
  modules: [
    'nuxt-windicss',
    '@pinia/nuxt',
  ],
  publicRuntimeConfig: {
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
