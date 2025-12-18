// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    public: {
      betterAuthUrl: process.env.NUXT_PUBLIC_BETTER_AUTH_URL || process.env.VITE_API_BASE_URL || 'http://localhost:3000',
      sentry: {
        dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
        release: process.env.COMMIT_REF || 'development',
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      }
    }
  },

  modules: ['@nuxt/ui', '@vite-pwa/nuxt', '@sentry/nuxt/module'],

  pwa: {
    registerType: 'prompt',
    manifest: {
      name: 'Vamu - Gerenciador de Eventos',
      short_name: 'Vamu',
      description: 'Crie e gerencie seus eventos com facilidade',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  nitro: {
    preset: 'netlify',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public'
    }
  },

  css: ['~/assets/css/main.css'],

  sourcemap: {
    client: true,
    server: true
  }
})