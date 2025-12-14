import type { EventListItem } from '~/types'

export function useDashboard() {

    const { data: myEvents, status } = useFetch<EventListItem[]>('/api/user/events')

    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const hasEvents = computed(() => myEvents.value && myEvents.value.length > 0)
    const isEmpty = computed(() => !myEvents.value || myEvents.value.length === 0)

    return {
        myEvents,
        status,
        hasEvents,
        isEmpty,
        formatDate,
    }
}
