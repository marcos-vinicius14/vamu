import { useQuery } from '@tanstack/vue-query'
import type { EventResponse } from '~/types'
import { eventKeys } from '~/utils/queryKeys'

/**
 * Query hook for fetching a public event by slug
 */
export function useEventQuery(slug: string) {
    return useQuery({
        queryKey: eventKeys.detail(slug),
        queryFn: () => $fetch<EventResponse>(`/api/events/${slug}`),
        enabled: !!slug,
    })
}
