/**
 * Query Key Factory for TanStack Query
 * Provides type-safe, hierarchical query keys for cache management
 */

export const eventKeys = {
    all: ['events'] as const,
    lists: () => [...eventKeys.all, 'list'] as const,
    detail: (slug: string) => [...eventKeys.all, 'detail', slug] as const,
    dashboard: (slug: string) => [...eventKeys.all, 'dashboard', slug] as const,
}

export const userKeys = {
    all: ['user'] as const,
    events: () => [...userKeys.all, 'events'] as const,
}

// Type exports for consumers
export type EventKeys = typeof eventKeys
export type UserKeys = typeof userKeys
