import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { CreateEventFormState, ApiError } from '~/types'

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
    location: z.string().min(1, 'Localização é obrigatória'),
    description: z.string().optional()
})

export type CreateEventSchema = z.output<typeof schema>

export function useCreateEvent() {
    const toast = useToast()


    const state = reactive<CreateEventFormState>({
        title: undefined,
        date: undefined,
        location: undefined,
        description: undefined
    })

    const loading = ref(false)

    async function onSubmit(event: FormSubmitEvent<CreateEventSchema>) {
        loading.value = true
        try {
            const { slug } = await $fetch('/api/events/create', {
                method: 'POST',
                body: event.data
            })

            toast.add({ title: 'Evento criado com sucesso!', color: 'success' })
            await navigateTo(`/event/${slug}`)
        } catch (err: unknown) {
            const apiError = err as ApiError
            const msg = apiError.data?.message || apiError.statusMessage || "Ocorreu um erro ao criar o evento."

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

    return {
        schema,
        state,
        loading,
        onSubmit,
    }
}
