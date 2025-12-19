import * as Sentry from '@sentry/node'

// Initialize Sentry for server-side error capture (without OpenTelemetry)
Sentry.init({
    dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Disable tracing to avoid OpenTelemetry dependencies
    tracesSampleRate: 0
})

export default defineNitroPlugin((nitroApp) => {
    // Capture all unhandled errors in API routes
    nitroApp.hooks.hook('error', (error) => {
        Sentry.captureException(error)
    })

    // Capture errors from request handlers
    nitroApp.hooks.hook('request', (event) => {
        event.context.sentry = Sentry
    })
})
