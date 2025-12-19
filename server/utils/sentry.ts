import * as Sentry from '@sentry/node'
import type { H3Event } from 'h3'

/**
 * Sets user context from session for Sentry error tracking
 */
export function setSentryUser(userId: string, email?: string, name?: string) {
    Sentry.setUser({
        id: userId,
        email: email || undefined,
        username: name || undefined
    })
}

/**
 * Clears user context (call on logout or anonymous requests)
 */
export function clearSentryUser() {
    Sentry.setUser(null)
}

/**
 * Adds a breadcrumb for tracking user actions
 */
export function addSentryBreadcrumb(
    message: string,
    category: 'api' | 'auth' | 'event' | 'rsvp' | 'user',
    data?: Record<string, unknown>
) {
    Sentry.addBreadcrumb({
        message,
        category,
        level: 'info',
        data
    })
}

/**
 * Captures an error with additional context
 */
export function captureError(
    error: unknown,
    context: {
        operation: string
        userId?: string
        eventSlug?: string
        extra?: Record<string, unknown>
    }
) {
    Sentry.withScope((scope) => {
        scope.setTag('operation', context.operation)

        if (context.userId) {
            scope.setTag('userId', context.userId)
        }

        if (context.eventSlug) {
            scope.setTag('eventSlug', context.eventSlug)
        }

        if (context.extra) {
            scope.setExtras(context.extra)
        }

        Sentry.captureException(error)
    })
}
