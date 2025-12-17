import type { Guest } from '~/types'
import { useEventDashboardQuery } from '~/composables/queries/useEventDashboardQuery'

type StatusColor = 'success' | 'error' | 'neutral'

export function useAdminDashboard(slug: string) {
    const toast = useToast()

    const { data: dashboard, error, isPending, isError, refetch } = useEventDashboardQuery(slug)

    // Map TanStack Query status to previous useFetch status for compatibility
    const status = computed(() => {
        if (isPending.value) return 'pending'
        if (isError.value) return 'error'
        return 'success'
    })

    const search = ref('')

    const filteredGuests = computed<Guest[]>(() => {
        if (!search.value) return dashboard.value?.guests || []

        return dashboard.value?.guests.filter(guest => {
            return guest.name.toLowerCase().includes(search.value.toLowerCase()) ||
                guest.phoneNumber?.includes(search.value)
        }) || []
    })

    const columns = [
        { accessorKey: 'name', header: 'Nome' },
        { accessorKey: 'phoneNumber', header: 'Celular' },
        { accessorKey: 'status', header: 'Status' }
    ]

    const shareOnWhatsApp = () => {
        if (typeof window === 'undefined') return

        const text = `Olá! Estou te convidando para o meu evento "${dashboard.value?.event.title}". Confirme sua presença aqui: ${window.location.origin}/${slug}`
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    const copyLink = () => {
        if (typeof window === 'undefined') return

        const url = `${window.location.origin}/${slug}`
        navigator.clipboard.writeText(url)
        toast.add({ title: 'Link copiado!', color: 'success' })
    }

    const clearSearch = () => {
        search.value = ''
    }

    const formatDate = (date: string | Date | null): string => {
        if (!date) return '-'

        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string): StatusColor => {
        switch (status) {
            case 'CONFIRMED': return 'success'
            case 'DECLINED': return 'error'
            default: return 'neutral'
        }
    }

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'CONFIRMED': return 'Eu vou!'
            case 'DECLINED': return 'Eu não vou'
            case 'PENDING': return 'Pendente'
            default: return status
        }
    }

    return {
        dashboard,
        error,
        status,
        search,
        filteredGuests,
        clearSearch,
        columns,
        shareOnWhatsApp,
        copyLink,
        formatDate,
        getStatusColor,
        getStatusLabel,
        isPending,
        isError,
        refetch,
    }
}