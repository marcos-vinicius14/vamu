import { useQuery } from '@tanstack/vue-query'
import type { DashboardResponse } from '~/types'
import { eventKeys } from '~/utils/queryKeys'

/**
 * Query hook for fetching admin dashboard data
 */
export function useEventDashboardQuery(slug: string) {
    return useQuery({
        queryKey: eventKeys.dashboard(slug),
        queryFn: () => $fetch<DashboardResponse>(`/api/events/${slug}/dashboard`),
        enabled: !!slug,
    });
}
