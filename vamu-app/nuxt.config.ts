// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      authBaseUrl: process.env.NUXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3000'
    }
  },

  modules: [
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css']
})
