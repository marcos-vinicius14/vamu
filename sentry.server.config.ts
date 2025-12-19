// Server-side Sentry is disabled for Netlify compatibility.
// The @sentry/nuxt module with OpenTelemetry instrumentation has bundling
// issues with Netlify's serverless functions.
// Client-side error tracking remains fully functional via sentry.client.config.ts

// If you need server-side error tracking on Netlify, consider:
// 1. Using @sentry/node directly in API routes with try/catch
// 2. Using Netlify's native Sentry integration
// 3. Deploying to a platform with better OpenTelemetry support (Vercel, Railway)

export default {};
