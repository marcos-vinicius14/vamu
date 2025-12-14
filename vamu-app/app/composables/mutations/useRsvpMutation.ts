import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { RsvpStatus } from '~/types'
import { eventKeys } from '~/utils/queryKeys'

interface RsvpInput {
    eventId: string
    name: string
    phoneNumber?: string
    status: RsvpStatus
}

interface RsvpResponse {
    id: string
    status: RsvpStatus
}

/**
 * Mutation hook for submitting RSVP
 * Invalidates dashboard data on success to refresh guest list
 */
export function useRsvpMutation(eventSlug: string) {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: (data: RsvpInput) =>
            $fetch<RsvpResponse>('/api/rsvp', {
                method: 'POST',
                body: data,
            }),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: eventKeys.dashboard(eventSlug) })

            if (variables.status === 'CONFIRMED') {
                return toast.add({ title: 'Presença confirmada!', color: 'success' })
            }

            toast.add({ title: 'Resposta registrada com sucesso', color: 'neutral' })
        },
        onError: (error: unknown) => {
            const apiError = error as { data?: { message?: string }; statusMessage?: string }
            const msg = apiError.data?.message || apiError.statusMessage || "Ocorreu um erro inesperado."

            toast.add({
                title: 'Ops! Algo deu errado 😕',
                description: msg,
                color: 'error',
                icon: 'i-heroicons-exclamation-triangle',
            })
        },
    })
}
