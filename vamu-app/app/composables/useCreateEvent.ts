import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { CreateEventFormState } from '~/types'
import { useCreateEventMutation } from '~/composables/mutations/useCreateEventMutation'

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
    location: z.string().min(1, 'Localização é obrigatória'),
    description: z.string().optional()
})

export type CreateEventSchema = z.output<typeof schema>

export function useCreateEvent() {
    const mutation = useCreateEventMutation()

    const state = reactive<CreateEventFormState>({
        title: undefined,
        date: undefined,
        location: undefined,
        description: undefined
    })

    const loading = computed(() => mutation.isPending.value)

    async function onSubmit(event: FormSubmitEvent<CreateEventSchema>) {
        mutation.mutate(event.data)
    }

    return {
        schema,
        state,
        loading,
        onSubmit,
        // Expose mutation state for additional control
        mutation,
    }
}
