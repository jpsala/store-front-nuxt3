export default defineNuxtConfig({
  preflight: false,
  modules: [
    'nuxt-windicss',
    '@pinia/nuxt'
  ],
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL
},
})
