<script setup lang="ts">
import { z } from 'zod'
import { signUp, signIn } from '~/lib/auth-client'

const loading = ref(false)
const toast = useToast()

const items = [
  { label: 'Login', key: 'login', slot: 'form' },
  { label: 'Cadastro', key: 'register', slot: 'form' }
]

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  name: z.string().min(2, 'Nome muito curto')
})

const state = reactive({
  name: '',
  email: '',
  password: ''
})

async function onSubmit(key: string) {
  loading.value = true
  try {
    if (key === 'register') {
      await signUp.email({
        email: state.email,
        password: state.password,
        name: state.name,
        callbackURL: '/dashboard'
      })
      toast.add({ title: 'Conta criada com sucesso!', color: 'success' })
    } else {
      await signIn.email({
        email: state.email,
        password: state.password,
        callbackURL: '/dashboard'
      })
      toast.add({ title: 'Login realizado com sucesso!', color: 'success' })
    }
  } catch (error: any) {
    console.error(error)
    toast.add({
      title: 'Erro na autenticação',
      description: error.message || 'Ocorreu um erro inesperado.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Acesse o Vamu! 🚀</h1>
      </template>

      <UTabs :items="items" class="w-full">
        <template #form="{ item }">
          <UForm
            :schema="item.key === 'register' ? registerSchema : loginSchema"
            :state="state"
            class="space-y-4 mt-4"
            @submit="onSubmit(item.key)"
          >
            <UFormField label="Nome" name="name" v-if="item.key === 'register'">
              <UInput v-model="state.name" icon="i-heroicons-user" placeholder="Seu nome" />
            </UFormField>

            <UFormField label="Email" name="email">
              <UInput v-model="state.email" type="email" icon="i-heroicons-envelope" placeholder="email@exemplo.com" />
            </UFormField>

            <UFormField label="Senha" name="password">
              <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" placeholder="********" />
            </UFormField>

            <UButton type="submit" block :loading="loading">
              {{ item.key === 'login' ? 'Entrar' : 'Criar Conta' }}
            </UButton>
          </UForm>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>