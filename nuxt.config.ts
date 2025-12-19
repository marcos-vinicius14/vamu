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
    },
    externals: {
      // Force Nitro to bundle these dependencies instead of expecting them in node_modules
      inline: [
        // OpenTelemetry - complete dependency tree
        '@opentelemetry/api',
        '@opentelemetry/core',
        '@opentelemetry/semantic-conventions',
        '@opentelemetry/resources',
        '@opentelemetry/sdk-trace-base',
        '@opentelemetry/sdk-trace-node',
        '@opentelemetry/sdk-node',
        '@opentelemetry/instrumentation',
        '@opentelemetry/context-async-hooks',
        '@opentelemetry/propagator-b3',
        '@opentelemetry/propagator-jaeger',
        '@opentelemetry/exporter-trace-otlp-http',
        '@opentelemetry/exporter-trace-otlp-grpc',
        '@opentelemetry/exporter-trace-otlp-proto',
        '@opentelemetry/sampler-jaeger-remote',
        // Sentry packages
        '@sentry/core',
        '@sentry/node',
        '@sentry/nuxt',
        '@sentry/opentelemetry',
        '@sentry/utils',
        '@sentry-internal/browser-utils',
        '@sentry-internal/feedback',
        '@sentry-internal/replay',
        '@sentry-internal/replay-canvas'
      ]
    },
    // Configure Rollup to handle ESM properly
    rollupConfig: {
      output: {
        // Use ESM format to avoid import.meta warnings
        format: 'esm'
      },
      onwarn(warning, warn) {
        // Suppress import.meta warnings from OpenTelemetry internals
        if (warning.code === 'INVALID_IMPORT_META') return
        warn(warning)
      }
    }
  },

  css: ['~/assets/css/main.css'],

  sourcemap: {
    client: true,
    server: true
  }
})