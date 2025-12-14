import { useQuery } from '@tanstack/vue-query'
import type { EventListItem } from '~/types'
import { userKeys } from '~/utils/queryKeys'

/**
 * Query hook for fetching user's event list (dashboard)
 */
export function useUserEventsQuery() {
    return useQuery({
        queryKey: userKeys.events(),
        queryFn: () => $fetch<EventListItem[]>('/api/user/events'),
    })
}
