import type { EventResponse, RsvpStatus, ApiError } from '~/types'
import { formatPhone, isValidPhone } from '~/utils/phone'

export function useEventPage(slug: string) {
    const toast = useToast()

    const { data: event, error } = useFetch<EventResponse>(`/api/events/${slug}`)

    const rsvpName = ref('')
    const rsvpPhone = ref('')
    const loading = ref(false)
    const rsvpSuccess = ref(false)
    const rsvpStatus = ref<RsvpStatus | null>(null)

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

        loading.value = true
        try {
            await $fetch('/api/rsvp', {
                method: 'POST',
                body: {
                    eventId: event.value?.id,
                    name: rsvpName.value,
                    phoneNumber: rsvpPhone.value || undefined,
                    status
                }
            })

            rsvpStatus.value = status
            rsvpSuccess.value = true
            rsvpName.value = ''
            rsvpPhone.value = ''

            if (status === 'CONFIRMED') {
                toast.add({ title: 'Presença confirmada!', color: 'success' })
                return
            }

            toast.add({ title: 'Resposta registrada com sucesso', color: 'neutral' })

        } catch (err: unknown) {
            const apiError = err as ApiError
            const msg = apiError.data?.message || apiError.statusMessage || "Ocorreu um erro inesperado."

            toast.add({
                title: 'Ops! Algo deu errado 😕',
                description: msg,
                color: 'error',
                icon: 'i-heroicons-exclamation-triangle'
            })
        } finally {
            loading.value = false
        }
    }

    const resetRsvp = () => {
        rsvpSuccess.value = false
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
        error,
        rsvpName,
        rsvpPhone,
        loading,
        rsvpSuccess,
        rsvpStatus,
        submitRsvp,
        resetRsvp,
        mapUrl,
        formattedDate,
        formattedTime,
    }
}
