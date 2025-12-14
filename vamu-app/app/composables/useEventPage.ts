import type { RsvpStatus, ApiError } from '~/types'
import { formatPhone, isValidPhone } from '~/utils/phone'
import { useEventQuery } from '~/composables/queries/useEventQuery'
import { useRsvpMutation } from '~/composables/mutations/useRsvpMutation'

export function useEventPage(slug: string) {
    const toast = useToast()

    // Query for fetching event data
    const { data: event, error: fetchError, isPending, isError, refetch } = useEventQuery(slug)

    // Mutation for RSVP
    const rsvpMutation = useRsvpMutation(slug)

    const rsvpName = ref('')
    const rsvpPhone = ref('')
    const rsvpSuccess = ref(false)
    const rsvpStatus = ref<RsvpStatus | null>(null)

    const isLoading = computed(() => isPending.value)
    const errorMessage = computed(() => {
        if (!fetchError.value) return null
        const err = fetchError.value as ApiError
        return err.data?.message || err.statusMessage || 'Evento não encontrado'
    })

    watch(rsvpPhone, (val) => {
        if (!val) return
        const formatted = formatPhone(val)
        if (formatted !== val) {
            rsvpPhone.value = formatted
        }
    })

    const submitRsvp = async (status: RsvpStatus) => {
        if (!rsvpName.value) {
            toast.add({ title: 'Por favor, digite seu nome', color: 'error' })
            return
        }

        if (!rsvpPhone.value) {
            toast.add({ title: 'Por favor, digite seu telefone', color: 'error' })
            return
        }

        if (!isValidPhone(rsvpPhone.value)) {
            toast.add({ title: 'Por favor, digite um telefone válido', color: 'error' })
            return
        }

        if (!event.value?.id) {
            toast.add({ title: 'Evento não encontrado', color: 'error' })
            return
        }

        rsvpMutation.mutate(
            {
                eventId: event.value.id,
                name: rsvpName.value,
                phoneNumber: rsvpPhone.value || undefined,
                status,
            },
            {
                onSuccess: () => {
                    rsvpStatus.value = status
                    rsvpSuccess.value = true
                    rsvpName.value = ''
                    rsvpPhone.value = ''
                },
            }
        )
    }

    const rsvpLoading = computed(() => rsvpMutation.isPending.value)

    const resetRsvp = () => {
        rsvpSuccess.value = false
    }

    const retry = () => {
        refetch()
    }

    const mapUrl = computed(() =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.value?.location || '')}`
    )

    const formattedDate = computed(() => {
        if (!event.value?.date) return ''
        return new Date(event.value.date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    })

    const formattedTime = computed(() => {
        if (!event.value?.date) return ''
        return new Date(event.value.date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    })

    return {
        event,
        isLoading,
        isError,
        errorMessage,
        retry,
        rsvpName,
        rsvpPhone,
        rsvpLoading,
        rsvpSuccess,
        rsvpStatus,
        submitRsvp,
        resetRsvp,
        mapUrl,
        formattedDate,
        formattedTime,
        // Expose mutation for additional control
        rsvpMutation,
    }
}
