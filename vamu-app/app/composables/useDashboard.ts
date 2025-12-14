import { useUserEventsQuery } from '~/composables/queries/useUserEventsQuery'

export function useDashboard() {
    const { data: myEvents, isPending, isError, error } = useUserEventsQuery()

    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const hasEvents = computed(() => myEvents.value && myEvents.value.length > 0)
    const isEmpty = computed(() => !myEvents.value || myEvents.value.length === 0)

    const status = computed(() => {
        if (isPending.value) return 'pending'
        if (isError.value) return 'error'
        return 'success'
    })

    return {
        myEvents,
        status,
        hasEvents,
        isEmpty,
        formatDate,
        isPending,
        isError,
        error,
    }
}
