import { z } from 'zod'
import { useAuthClient } from '~/lib/auth-client'
import type { AuthFormState, AuthMode, ApiError } from '~/types'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    name: z.string().min(2, 'Nome muito curto')
})

export type LoginSchema = z.output<typeof loginSchema>
export type RegisterSchema = z.output<typeof registerSchema>

export function useAuth() {
    const toast = useToast()
    const { signIn, signUp } = useAuthClient()

    const items = [
        { label: 'Login', key: 'login', slot: 'form' },
        { label: 'Cadastro', key: 'register', slot: 'form' }
    ]

    const state = reactive<AuthFormState>({
        name: '',
        email: '',
        password: ''
    })

    const loading = ref(false)

    const getSchema = (mode: AuthMode) => {
        return mode === 'register' ? registerSchema : loginSchema
    }

    async function onSubmit(mode: AuthMode) {
        loading.value = true
        try {
            if (mode === 'register') {
                const { error } = await signUp.email({
                    email: state.email,
                    password: state.password,
                    name: state.name,
                })
                if (error) throw error
                toast.add({ title: 'Conta criada com sucesso!', color: 'success' })
                await navigateTo('/dashboard')
                return
            }

            const { error } = await signIn.email({
                email: state.email,
                password: state.password,
            })
            if (error) throw error
            toast.add({ title: 'Login realizado com sucesso!', color: 'success' })
            await navigateTo('/dashboard')
        } catch (err: unknown) {
            const apiError = err as ApiError
            const msg = apiError.data?.message || apiError.statusMessage || apiError.message || "Ocorreu um erro inesperado."

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
        items,
        state,
        loading,
        getSchema,
        onSubmit,
    }
}
