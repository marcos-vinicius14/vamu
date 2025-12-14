import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateEventSchema } from '~/composables/useCreateEvent'
import { userKeys } from '~/utils/queryKeys'

interface CreateEventResponse {
    slug: string
}

/**
 * Mutation hook for creating a new event
 * Invalidates user events list on success
 */
export function useCreateEventMutation() {
    const queryClient = useQueryClient()
    const toast = useToast()

    return useMutation({
        mutationFn: (data: CreateEventSchema) =>
            $fetch<CreateEventResponse>('/api/events/create', {
                method: 'POST',
                body: data,
            }),
        onSuccess: async (response) => {
            // Invalidate user events list to refresh dashboard
            await queryClient.invalidateQueries({ queryKey: userKeys.events() })

            toast.add({ title: 'Evento criado com sucesso!', color: 'success' })
            await navigateTo(`/event/${response.slug}`)
        },
        onError: (error: unknown) => {
            const apiError = error as { data?: { message?: string }; statusMessage?: string }
            const msg = apiError.data?.message || apiError.statusMessage || "Ocorreu um erro ao criar o evento."

            toast.add({
                title: 'Ops! Algo deu errado 😕',
                description: msg,
                color: 'error',
                icon: 'i-heroicons-exclamation-triangle',
            })
        },
    })
}
